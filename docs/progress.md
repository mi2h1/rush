# 進捗・作業ログ

最終更新: 2026-03-18

## リポジトリ情報

- **URL:** https://github.com/mi2h1/rush.git
- **本番URL:** https://mi2h1.github.io/rush/
- **ブランチ運用:** main 直接作業・GitHub Actions で自動デプロイ

## ディレクトリ構成

```
rush/
├── public/
│   └── 404.html              # GitHub Pages SPA ルーティング用リダイレクト
├── src/
│   ├── components/
│   │   ├── AdminPage.tsx      # 管理画面（Supabase Auth ログイン + x_users管理）
│   │   ├── ArticleListPage.tsx # 記事一覧（フィルター・ページネーション付き）
│   │   ├── BookmarkButton.tsx  # ブックマーク追加/削除ボタン（ログイン時のみ表示）
│   │   ├── BookmarksPage.tsx   # ブックマーク一覧ページ
│   │   ├── EmptyState.tsx      # 空状態表示（melta UI）
│   │   ├── GridCard.tsx        # 記事一覧・ブックマーク用カード（melta UI）
│   │   ├── Header.tsx          # トップバー（h-14、ダークモードトグル）
│   │   ├── HeroSection.tsx     # 新着5件（大カード左＋サイド4枚右）
│   │   ├── HotSection.tsx      # isHot記事グリッド（最大6件）
│   │   ├── Layout.tsx          # 3ペインレイアウト（header / nav / main）
│   │   ├── ServiceColumns.tsx  # Zenn・Qiita 最新5件カラム
│   │   ├── Sidebar.tsx         # ヘッダー直下の横ナビバー
│   │   ├── SkeletonCard.tsx    # ローディングスケルトン（melta UI）
│   │   ├── Thumbnail.tsx       # 画像 or サービスロゴフォールバック
│   │   └── XTimeline.tsx       # Xポスト一覧（表示名・@username表示）
│   ├── context/
│   │   └── AuthContext.tsx    # ログイン状態・ブックマークID管理
│   ├── lib/
│   │   ├── supabase.ts        # Supabase クライアント・全クエリ・Auth・Bookmark・x_users CRUD
│   │   ├── time.ts
│   │   └── trending.ts
│   ├── types/index.ts
│   ├── App.tsx
│   └── index.css              # Tailwind + melta CSS変数 + ダークモード上書き
├── functions/
│   └── rss-collector/         # GitHub Actions から実行（Node.js 22）
│       ├── src/main.js        # RSS収集・Groq AI処理・Supabase保存
│       ├── run.js             # GitHub Actions エントリポイント
│       └── package.json
├── .github/workflows/
│   ├── deploy.yml             # GitHub Pages デプロイ（push時）
│   └── rss-collector.yml      # RSS収集（毎時cron + 手動起動）
├── docs/
│   ├── conventions.md
│   ├── progress.md
│   ├── tech-stack.md
│   └── melta/                 # melta UI デザインシステム仕様
│       ├── CLAUDE.md
│       └── rush-ui-redesign.md
├── tailwind.config.ts         # Tailwind v3 + primary-* カラートークン
├── postcss.config.ts
└── CLAUDE.md
```

## 完了済み機能

### Phase 0: 設計（2026-03-11）
- [x] コンセプト・技術スタック決定
- [x] CLAUDE.md・docs/ 初期ドキュメント作成

### Phase 1: フロントエンド基盤（2026-03-11）
- [x] Vite + React 19 + TypeScript 初期化
- [x] GitHub Pages デプロイ（Actions、base: '/rush/'）
- [x] HeroSection（大カード左＋サイド4枚右）
- [x] HotSection（isHot記事グリッド）
- [x] ServiceColumns（Zenn・Qiita 最新5件カラム）
- [x] XTimeline（表示名＋@username表示）
- [x] ArticleListPage（ページネーション付き記事一覧）

### Phase 2: バックエンド移行（2026-03-11〜12）
- [x] Appwrite → Supabase 移行（フレッシュスタート）
- [x] Supabase テーブル作成（articles / x_users / bookmarks）
- [x] GitHub Actions RSS収集ワークフロー（毎時cron）
- [x] ZennとQiita RSSフィード取得・パース
- [x] Groq API（Llama 3.3 70B）で要約・タグ・isHot生成
- [x] RSSHub 経由でXポスト取得（28アカウント）
- [x] x_users テーブルでアカウント管理
- [x] articles に author_username 保存

### Phase 3: 認証・管理機能（2026-03-12）
- [x] Supabase Auth によるログイン機能
- [x] 管理画面（/rush/admin）— x_users の追加・削除・有効/無効・表示名編集
- [x] ブックマーク機能（ログイン時のみ）
- [x] ブックマーク一覧ページ（/rush/bookmarks）
- [x] GitHub Pages SPA ルーティング（/admin・/bookmarks 対応）
- [x] RLS ポリシー設定（anon・authenticated 両ロール）
- [x] x_users 表示名を XTimeline に反映

### Phase 4: melta UI デザイン刷新（2026-03-18）
- [x] Tailwind CSS v3 導入（primary-* カラートークン、text-body ユーティリティ）
- [x] melta UI デザインシステム仕様書作成（docs/melta/）
- [x] Layout / Header / Sidebar を melta スタイルに全面書き換え
  - ヘッダー直下の横ナビバー（トップ・記事一覧・ブックマーク・管理）
  - NO `border-l-4` / `border-t-4` カラーバー（melta 禁止パターン）
- [x] 全コンポーネントを melta UI に書き換え
  - HeroSection / HotSection / ServiceColumns / XTimeline
  - GridCard / BookmarkButton / ArticleListPage / BookmarksPage / AdminPage
  - EmptyState / SkeletonCard 新規追加
- [x] ダークモード切り替え（ヘッダー右上ボタン）
  - `data-theme="dark"` + CSS変数 + Tailwindクラス上書き対応

## 現在の状態

- 毎時0分に rss-collector が自動実行（Groq AI処理付き）
- 28アカウントの X ポストを RSSHub 経由で取得
- 管理画面からアカウントの有効/無効・表示名を管理可能
- ログインユーザーはブックマーク機能を利用可能
- melta UI デザインシステムに全面移行済み

## 判断ログ

| 日付 | 判断内容 |
|---|---|
| 2026-03-11 | note.com RSSは不正URL、対象から除外 |
| 2026-03-11 | Gemini → Groq に切り替え（GCP請求リスク回避） |
| 2026-03-11 | Appwrite → Supabase に移行（デプロイの容易さ・GitHub Actions親和性） |
| 2026-03-11 | Appwrite Functions → GitHub Actions に移行 |
| 2026-03-12 | X収集をキーワード検索→ユーザー別取得に変更（RSSHub twitter/user/:username） |
| 2026-03-12 | articles に author_username カラム追加、表示名は x_users から取得してフロントで結合 |
| 2026-03-18 | 旧カスタムCSS → melta UI（Tailwind v3）に全面移行 |
| 2026-03-18 | サイドバーをヘッダー直下の横ナビバーに変更 |
| 2026-03-18 | ダークモードはCSSクラス上書き方式で実装（Tailwindのdark:バリアントは未使用） |
| 2026-03-31 | RSSHubをsystemdサービス（rsshub.service）として登録、VPS再起動時の自動起動を保証 |

## 今後の改善候補

- Qiita 記事のサムネ取得（OGP scraping等）
- note.com 対応（RSS問題の解決策検討）
- 検索機能
- ソース追加（他メディア）
- ダークモードの完全対応（Tailwind dark: バリアントへの移行）
