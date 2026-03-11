# 進捗・作業ログ

最終更新: 2026-03-11

## リポジトリ情報

- **URL:** https://github.com/mi2h1/rush.git
- **本番URL:** https://mi2h1.github.io/rush/
- **ブランチ運用:** main 直接作業・GitHub Actions で自動デプロイ

## ディレクトリ構成

```
rush/
├── public/
├── src/
│   ├── components/
│   │   ├── ArticleCard.tsx   # カテゴリ絞り込みビュー用カード（サムネ付き）
│   │   ├── CategoryColumns.tsx  # ALL表示のカテゴリ4列
│   │   ├── CategoryTabs.tsx     # カテゴリ切り替えタブ
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx      # 新着5件ヒーロー表示
│   │   ├── HotSection.tsx       # isHot記事グリッド
│   │   └── Thumbnail.tsx        # 画像 or サービスロゴフォールバック
│   ├── lib/
│   │   ├── appwrite.ts   # Appwrite SDK、fetchArticles()
│   │   └── time.ts       # formatRelativeTime(), isToday()
│   ├── types/index.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── functions/
│   └── rss-collector/    # Appwrite Functions（Node.js 22）
│       └── src/main.js
├── docs/
│   ├── conventions.md
│   ├── progress.md
│   └── tech-stack.md
├── .github/workflows/deploy.yml
├── appwrite.json
└── CLAUDE.md
```

## 完了済み機能

### Phase 0: 設計（2026-03-11）
- [x] コンセプト・技術スタック決定
- [x] CLAUDE.md・docs/ 初期ドキュメント作成

### Phase 1: フロントエンド基盤（2026-03-11）
- [x] Vite + React 19 + TypeScript 初期化
- [x] GitHub Pages デプロイ（Actions、base: '/rush/'）
- [x] ダークテーマCSS（CSS変数、カテゴリ色）
- [x] カテゴリタブ切り替え
- [x] モックデータで表示確認

### Phase 2: バックエンド（Appwrite）連携（2026-03-11）
- [x] Appwrite Cloud セットアップ（シンガポール: sgp.cloud.appwrite.io）
- [x] `rush-db` / `articles` コレクション作成
- [x] Appwrite Functions（rss-collector、毎時スケジュール）
- [x] ZennとQiita RSSフィード取得・パース
- [x] Groq API（Llama 3.3 70B）で要約・タグ・isHot生成
- [x] 重複チェック（URL一致で除外）
- [x] フロントエンドをAppwrite実データに切り替え
- [x] GitHub Pages を Appwrite プロジェクトのプラットフォームに登録（CORS解消）

### Phase 3: ダッシュボードレイアウト刷新（2026-03-11）
- [x] HeroSection（新着5件：メイン大カード＋サイド4枚）
- [x] CategoryColumns（OpenAI / Anthropic / Google / Meta の4列）
- [x] HotSection（isHot記事グリッド）
- [x] カテゴリ絞り込み時：今日の話題 + 最新記事リスト

### Phase 4: サムネイル・アイコン対応（2026-03-11）
- [x] Thumbnail コンポーネント（画像 or サービスロゴフォールバック）
- [x] Zenn RSS の `<enclosure type="false">` 問題修正（typeチェック除去）
- [x] バックフィルモード（過去記事を API で一括取得、AI処理なし）
- [x] fixThumbnails モード（既存記事のサムネ欠損を補完）
- [x] ArticleCard にサムネイル追加（カテゴリ絞り込みビュー）

## 現在の状態

- DBに約27件以上の記事、うち大半はZennサムネ付き
- 毎時0分にrss-collectorが自動実行（Groq AI処理付き）
- Qiita記事はサムネなし（APIレスポンスに画像なし）

## 判断ログ

| 日付 | 判断内容 |
|---|---|
| 2026-03-11 | Xクローリングは対象外（APIコスト・ToS） |
| 2026-03-11 | note.com RSSは不正URL、対象から除外 |
| 2026-03-11 | Gemini → Groq に切り替え（GCP請求リスク回避） |
| 2026-03-11 | URL unique index 不使用（Appwrite制限）、アプリ側で重複チェック |
| 2026-03-11 | Groq レート制限対策でAPI呼び出しに2秒delay |

## 今後の改善候補

- Qiita 記事のサムネ取得（OGP scraping等）
- 記事数が増えたときのページネーション
- 検索機能
- RSSHub 経由でソース追加
