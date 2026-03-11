import { Client, Databases, Query, ID } from 'node-appwrite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { XMLParser } from 'fast-xml-parser';

const RSS_FEEDS = [
  { url: 'https://zenn.dev/topics/ai/feed', source: 'Zenn' },
  { url: 'https://qiita.com/tags/ai/feed', source: 'Qiita' },
  // note は公式RSSがないため除外（将来的にRSSHub等で対応）
];

const CATEGORY_KEYWORDS = {
  openai: ['openai', 'gpt', 'chatgpt', 'dall-e', 'whisper', 'sora'],
  anthropic: ['anthropic', 'claude'],
  google: ['google', 'gemini', 'deepmind', 'bard', 'vertex'],
  meta: ['meta', 'llama', 'faiss'],
};

// XMLパーサーが返す値（オブジェクト/文字列/数値）を文字列に統一する
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
  // media:content
  const mc = item['media:content'];
  if (mc) {
    const url = Array.isArray(mc) ? mc[0]?.['@_url'] : mc['@_url'];
    if (url) return url;
  }
  // media:thumbnail
  const mt = item['media:thumbnail'];
  if (mt?.['@_url']) return mt['@_url'];
  // enclosure (image type)
  const enc = item.enclosure;
  if (enc?.['@_url'] && String(enc?.['@_type'] ?? '').startsWith('image')) return enc['@_url'];
  // first <img> in HTML description
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

async function analyzeWithGemini(gemini, title, description) {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `以下の記事を分析して、JSONで返してください。

タイトル: ${title}
内容: ${description.slice(0, 500)}

返すJSONの形式:
{
  "summary": "日本語で2〜3文の要約",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "isHot": true/false（話題性・重要度が高い場合はtrue）
}

JSONのみを返してください。余分なテキスト不要。`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const json = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(json);
}

async function articleExists(db, url) {
  const res = await db.listDocuments('rush-db', 'articles', [
    Query.equal('url', url),
    Query.limit(1),
  ]);
  return res.total > 0;
}

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const db = new Databases(client);
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  let totalNew = 0;
  let totalSkipped = 0;

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

      if (await articleExists(db, item.url)) {
        totalSkipped++;
        continue;
      }

      const category = detectCategory(item.title + ' ' + item.description);

      // Gemini free tier: 15 RPM → 4秒待機で安全マージン確保
      await new Promise((r) => setTimeout(r, 4000));

      let analysis;
      try {
        analysis = await analyzeWithGemini(gemini, item.title, item.description);
      } catch (e) {
        error(`Gemini error for "${item.title}": ${e.message}`);
        analysis = {
          summary: item.description.slice(0, 200) || item.title,
          tags: [],
          isHot: false,
        };
      }

      try {
        await db.createDocument('rush-db', 'articles', ID.unique(), {
          title: item.title.slice(0, 500),
          source: feed.source,
          category,
          url: item.url,
          publishedAt: new Date(item.publishedAt).toISOString(),
          summary: analysis.summary.slice(0, 2000),
          tags: (analysis.tags ?? []).slice(0, 5).map((t) => String(t).slice(0, 50)),
          isHot: analysis.isHot ?? false,
          ...(item.thumbnailUrl ? { thumbnailUrl: item.thumbnailUrl } : {}),
        });
        totalNew++;
        log(`  Saved: ${item.title.slice(0, 60)}`);
      } catch (e) {
        error(`DB save error for "${item.title}": ${e.message}`);
      }
    }
  }

  log(`Done. New: ${totalNew}, Skipped: ${totalSkipped}`);
  return res.json({ ok: true, new: totalNew, skipped: totalSkipped });
};
