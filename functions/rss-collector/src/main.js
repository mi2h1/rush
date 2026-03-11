import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { XMLParser } from 'fast-xml-parser';

const RSS_FEEDS = [
  { url: 'https://zenn.dev/topics/%E7%94%9F%E6%88%90ai/feed', source: 'Zenn' },
  { url: 'https://qiita.com/tags/ai/feed', source: 'Qiita' },
];

const CATEGORY_KEYWORDS = {
  openai: ['openai', 'gpt', 'chatgpt', 'dall-e', 'whisper', 'sora'],
  anthropic: ['anthropic', 'claude'],
  google: ['google', 'gemini', 'deepmind', 'bard', 'vertex'],
  meta: ['meta', 'llama', 'faiss'],
};

// HTMLエスケープされた文字列を処理してテキストと画像URLを抽出
function processHtml(raw) {
  const decoded = raw
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const imgMatch = decoded.match(/<img[^>]+src=["']([^"']+)["']/i);
  const thumbnailUrl = imgMatch?.[1] ?? null;
  const text = decoded
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
  return { text, thumbnailUrl };
}

function toText(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return val['#text'] ?? val['#cdata-section'] ?? val['#cdata'] ?? '';
  }
  return '';
}

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'other';
}

function extractThumbnail(item) {
  const mc = item['media:content'];
  if (mc) {
    const url = Array.isArray(mc) ? mc[0]?.['@_url'] : mc['@_url'];
    if (url) return url;
  }
  const mt = item['media:thumbnail'];
  if (mt?.['@_url']) return mt['@_url'];
  const enc = item.enclosure;
  if (enc?.['@_url']) return enc['@_url'];
  const html = toText(item.description ?? item['content:encoded'] ?? item.content ?? '');
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

async function fetchRss(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Rush RSS Collector/1.0' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`RSS fetch failed: ${url} (${res.status})`);
  return res.text();
}

function parseRss(xml) {
  const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '#cdata' });
  const result = parser.parse(xml);
  const channel = result?.rss?.channel ?? result?.feed;
  if (!channel) return [];
  const items = channel.item ?? channel.entry ?? [];
  return (Array.isArray(items) ? items : [items]).map((item) => ({
    title: toText(item.title),
    url: toText(item.link?.['@_href'] ?? item.link ?? item.guid),
    publishedAt: toText(item.pubDate ?? item.published ?? item.updated) || new Date().toISOString(),
    description: toText(item.description ?? item.summary ?? item.content ?? item['content:encoded']),
    thumbnailUrl: extractThumbnail(item),
  }));
}

// Zenn API でページネーション取得（バックフィル用）
async function fetchZennArticles(pages = 5) {
  const items = [];
  for (let page = 1; page <= pages; page++) {
    const res = await fetch(
      `https://zenn.dev/api/articles?topic_slug=ai&order=latest&count=20&page=${page}`,
      { headers: { 'User-Agent': 'Rush RSS Collector/1.0' }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) break;
    const data = await res.json();
    const articles = data.articles ?? [];
    if (articles.length === 0) break;
    for (const a of articles) {
      items.push({
        title: a.title ?? '',
        url: `https://zenn.dev${a.path}`,
        publishedAt: a.published_at ?? new Date().toISOString(),
        description: a.title ?? '',
        thumbnailUrl: a.og_image_url ?? null,
        likeCount: a.liked_count ?? 0,
      });
    }
  }
  return items;
}

// Qiita API でページネーション取得
async function fetchQiitaArticles(pages = 5) {
  const items = [];
  for (let page = 1; page <= pages; page++) {
    const res = await fetch(
      `https://qiita.com/api/v2/tags/ai/items?page=${page}&per_page=20`,
      { headers: { 'User-Agent': 'Rush RSS Collector/1.0' }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) break;
    const articles = await res.json();
    if (articles.length === 0) break;
    for (const a of articles) {
      items.push({
        title: a.title ?? '',
        url: a.url ?? '',
        publishedAt: a.created_at ?? new Date().toISOString(),
        description: (a.body ?? '').slice(0, 500),
        thumbnailUrl: null,
      });
    }
  }
  return items;
}

async function analyzeWithGroq(groq, title, description) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `以下の記事を分析して、JSONで返してください。

タイトル: ${title}
内容: ${description.slice(0, 500)}

返すJSONの形式:
{
  "summary": "日本語で2〜3文の要約",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "isHot": true/false（話題性・重要度が高い場合はtrue）
}

JSONのみを返してください。余分なテキスト不要。`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  return JSON.parse(completion.choices[0].message.content);
}

function isJapanese(text) {
  return /[\u3040-\u9fff]/.test(text);
}

async function articleExists(db, url) {
  const { count } = await db
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('url', url);
  return (count ?? 0) > 0;
}

export default async ({ req, res, log, error }) => {
  const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  let bodyJson = {};
  try { bodyJson = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {}); } catch {}
  const backfill = bodyJson.backfill === true;
  let totalNew = 0;
  let totalSkipped = 0;

  if (backfill) {
    // バックフィルモード: APIで複数ページ取得、AI処理なし
    log('Backfill mode: fetching historical articles (no AI)');
    const sources = [
      { items: await fetchZennArticles(5), source: 'Zenn' },
      { items: await fetchQiitaArticles(5), source: 'Qiita' },
    ];
    for (const { items, source } of sources) {
      log(`${source}: ${items.length} items fetched`);
      for (const item of items) {
        if (!item.url || !item.title) continue;
        if (await articleExists(db, item.url)) { totalSkipped++; continue; }
        const category = detectCategory(item.title + ' ' + item.description);
        const { error: err } = await db.from('articles').insert({
          title: item.title.slice(0, 500),
          source,
          category,
          url: item.url,
          published_at: new Date(item.publishedAt).toISOString(),
          summary: item.description.slice(0, 200) || item.title,
          tags: [],
          is_hot: false,
          ...(item.thumbnailUrl ? { thumbnail_url: item.thumbnailUrl } : {}),
          ...(item.likeCount != null ? { like_count: item.likeCount } : {}),
        });
        if (err) error(`DB save error: ${err.message}`);
        else totalNew++;
      }
    }
  } else {
    // 通常モード: RSSで最新取得 + AI処理
    // X フィード収集（RSSHub経由、ユーザー別、AI処理なし）
    const X_USERS = [
      'OpenAI', 'ChatGPTApp', 'AnthropicAI', 'claudeai',
      'GoogleAI', 'GoogleDeepMind', 'GeminiApp', 'googleaidevs', 'googleaistudio',
      'xai', 'sama', 'gdb', 'embirico', 'willdepue',
      'DarioAmodei', 'alexalbert__', 'demishassabis', 'OriolVinyalsML', 'OfficialLoganK',
      'emollick', 'mattshumer_', 'joisino_',
      't_wada', 'laiso', 'azukiazusa9', 'mizchi',
      'ollama', 'Alibaba_Qwen',
    ];
    let xTotal = 0;
    for (const username of X_USERS) {
      try {
        const xml = await fetchRss(`http://210.131.219.93:1200/twitter/user/${username}`);
        const xItems = parseRss(xml);
        xTotal += xItems.length;
        for (const item of xItems) {
          if (!item.url || !item.title) continue;
          if (await articleExists(db, item.url)) { totalSkipped++; continue; }
          const { text: cleanText, thumbnailUrl: xThumb } = processHtml(item.description);
          const fullText = item.title + ' ' + cleanText;
          const category = detectCategory(fullText);
          const hashtags = (fullText.match(/#[\w\u3040-\u9fff\u30a0-\u30ff]+/g) ?? [])
            .map((t) => t.slice(1).slice(0, 50)).slice(0, 5);
          const { error: err } = await db.from('articles').insert({
            title: item.title.slice(0, 500),
            source: 'X',
            category,
            url: item.url,
            published_at: new Date(item.publishedAt).toISOString(),
            summary: cleanText.slice(0, 2000) || item.title,
            tags: hashtags,
            is_hot: false,
            ...(xThumb ? { thumbnail_url: xThumb } : {}),
          });
          if (err) error(`X save error (${username}): ${err.message}`);
          else totalNew++;
        }
      } catch (e) {
        error(`X fetch error (${username}): ${e.message}`);
      }
    }
    log(`X: ${X_USERS.length} accounts processed`);

    for (const feed of RSS_FEEDS) {
      log(`Fetching: ${feed.url}`);
      let items;
      try {
        const xml = await fetchRss(feed.url);
        items = parseRss(xml);
        log(`  ${items.length} items found`);
      } catch (e) {
        error(`Failed to fetch ${feed.url}: ${e.message}`);
        continue;
      }

      for (const item of items.slice(0, 20)) {
        if (!item.url || !item.title) continue;
        if (await articleExists(db, item.url)) { totalSkipped++; continue; }
        const category = detectCategory(item.title + ' ' + item.description);

        await new Promise((r) => setTimeout(r, 2000));

        let analysis;
        try {
          analysis = await analyzeWithGroq(groq, item.title, item.description);
        } catch (e) {
          error(`Groq error for "${item.title}": ${e.message}`);
          analysis = { summary: item.description.slice(0, 200) || item.title, tags: [], isHot: false };
        }

        const { error: err } = await db.from('articles').insert({
          title: item.title.slice(0, 500),
          source: feed.source,
          category,
          url: item.url,
          published_at: new Date(item.publishedAt).toISOString(),
          summary: analysis.summary.slice(0, 2000),
          tags: (analysis.tags ?? []).slice(0, 5).map((t) => String(t).slice(0, 50)),
          is_hot: analysis.isHot ?? false,
          ...(item.thumbnailUrl ? { thumbnail_url: item.thumbnailUrl } : {}),
        });
        if (err) error(`DB save error for "${item.title}": ${err.message}`);
        else { totalNew++; log(`  Saved: ${item.title.slice(0, 60)}`); }
      }
    }
  }

  log(`Done. New: ${totalNew}, Skipped: ${totalSkipped}`);
  return res.json({ ok: true, new: totalNew, skipped: totalSkipped });
};
