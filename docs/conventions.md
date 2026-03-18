# 開発規約

## コミットメッセージ

```
type: 変更概要（日本語）

詳細（必要な場合のみ）

Co-Authored-By: Claude <noreply@anthropic.com>
```

**type 一覧:** `feat` / `fix` / `refactor` / `docs` / `style` / `test` / `chore`

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| ファイル名 | kebab-case | `news-card.tsx` |
| CSS クラス | kebab-case | `.news-card` |
| 関数・変数 | camelCase | `fetchArticles` |
| コンポーネント | PascalCase | `NewsCard` |
| 定数 | UPPER_SNAKE | `MAX_ARTICLES` |
| コード内の名前 | 英語 | — |
| コメント | 日本語 | — |

## 開発プラクティス

- APIキー・DB認証情報は環境変数（GitHub Secrets）で管理し、コードに直書きしない
- RSS取得・Groq API呼び出しは GitHub Actions 側で行い、フロントに秘密情報を持たせない
- パフォーマンス優先のため、不要な再レンダリングを避ける（useMemo / useCallback を適切に使う）
- 動作確認は git push → GitHub Actions デプロイ後にブラウザで行う（VPS環境のため）

## インフラ構成

| 役割 | 採用技術 |
|---|---|
| フロントエンド | React 19 + Vite、GitHub Pages ホスト |
| スタイリング | Tailwind CSS v3 + melta UI デザインシステム |
| データベース | Supabase（PostgreSQL + RLS） |
| 認証 | Supabase Auth |
| RSS収集・AI処理 | GitHub Actions（毎時cron）+ Groq API |
| X(Twitter)収集 | RSSHub（自前VPS: http://210.131.219.93:1200） |

## melta UI デザイン規約

仕様詳細は `docs/melta/CLAUDE.md` および `docs/melta/rush-ui-redesign.md` を参照。

### 基本原則
- カード: `bg-white rounded-xl border border-slate-200 shadow-sm`
- ホバー: `hover:shadow-md transition-shadow duration-200`
- **禁止:** `border-l-4` / `border-t-4` によるカテゴリカラーバー
- ボディテキスト: `text-body`（#3d4b5f）、見出し: `text-slate-900`
- ナビアクティブ: `text-primary-500 bg-primary-50`、`aria-current="page"`

### カラートークン（Tailwind拡張）
- `primary-500` = #2b70ef（アクセント）
- `text-body` = #3d4b5f（カスタムユーティリティ）

### ダークモード
- `html[data-theme="dark"]` 属性で切り替え
- index.css の CSS変数 + Tailwindクラス上書きで対応
- Tailwind の `dark:` バリアントは現在未使用

## Supabase テーブル構成

### articles
- `id`, `title`, `url`（unique）, `source`, `category`, `summary`, `tags`, `is_hot`, `thumbnail_url`, `author_username`, `published_at`
- RLS: anon・authenticated 両方に SELECT 許可

### x_users
- `id`, `username`（unique）, `display_name`, `profile_image_url`, `enabled`, `created_at`
- RLS: anon・authenticated 両方に SELECT 許可 / authenticated に INSERT・UPDATE・DELETE 許可

### bookmarks
- `id`, `user_id`, `article_id`, `created_at`
- RLS: authenticated ユーザーが自分のレコードのみ操作可
