# 技術スタック

## フロントエンド

| 項目 | 内容 |
|---|---|
| フレームワーク | React 19 + TypeScript |
| ビルドツール | Vite |
| ホスティング | GitHub Pages（base: `/rush/`） |
| デプロイ | GitHub Actions（main push → 自動） |
| スタイリング | CSS（CSS変数、クラスベース） |

## バックエンド

| 項目 | 内容 |
|---|---|
| BaaS | Appwrite Cloud（シンガポール: sgp.cloud.appwrite.io） |
| プロジェクトID | `rush` |
| データベース | `rush-db` / コレクション: `articles` |
| Functions | `rss-collector`（Node.js 22、毎時 `0 * * * *`） |

## 外部API

| サービス | 用途 |
|---|---|
| Zenn RSS | `https://zenn.dev/topics/ai/feed` |
| Zenn API | バックフィル用（`/api/articles?topic_slug=ai`） |
| Qiita RSS | `https://qiita.com/tags/ai/feed` |
| Qiita API | バックフィル用（`/api/v2/tags/ai/items`） |
| Groq API | 要約・タグ・isHot生成（Llama 3.3 70B: `llama-3.3-70b-versatile`） |
| Simple Icons CDN | サービスロゴ画像（`cdn.simpleicons.org`） |

## articlesコレクション スキーマ

| フィールド | 型 | 説明 |
|---|---|---|
| title | string | 記事タイトル（最大500文字） |
| source | string | `Zenn` / `Qiita` |
| category | string | `openai` / `anthropic` / `google` / `meta` / `other` |
| url | string | 記事URL（重複チェックキー） |
| publishedAt | string | ISO 8601 |
| summary | string | AI生成要約（最大2000文字）またはdescription |
| tags | string[] | AI生成タグ（最大5件） |
| isHot | boolean | AI判定の話題性フラグ |
| thumbnailUrl | string? | OGP画像URL（オプション） |

## rss-collector 動作モード

| モード | トリガー | 説明 |
|---|---|---|
| 通常 | スケジュール / body無し | RSSで最新取得 + Groq AI処理 |
| backfill | `{"backfill": true}` | API経由で過去記事を一括取得（AI処理なし） |
| fixThumbnails | `{"fixThumbnails": true}` | 既存記事のサムネ欠損をRSSで補完 |

## 環境変数（Appwrite Functions）

| 変数名 | 説明 |
|---|---|
| `APPWRITE_ENDPOINT` | `https://sgp.cloud.appwrite.io/v1` |
| `APPWRITE_FUNCTION_PROJECT_ID` | `rush` |
| `APPWRITE_API_KEY` | Appwrite APIキー |
| `GROQ_API_KEY` | Groq APIキー |
