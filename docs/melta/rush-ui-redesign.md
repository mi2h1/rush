# Rush UI 再設計指示書

## このドキュメントの目的

RushのUI（フロントエンド）をmelta UIのデザインシステムに基づいて一から書き直す。
機能・ロジック・Appwrite連携はそのまま維持し、**見た目のレイヤーのみを再設計する**。

---

## 前提情報

### プロジェクト概要

- **アプリ:** 日本語AI情報に特化したニュースアグリゲーター（個人用ダッシュボード）
- **本番URL:** https://mi2h1.github.io/rush/
- **リポジトリ:** https://github.com/mi2h1/rush
- **スタック:** React + TypeScript + Vite / Appwrite Cloud / GitHub Pages

### 環境制約

- VPS（CUIのみ、ブラウザなし）
- 動作確認は `git push → GitHub Actions → ブラウザで確認` が唯一の手段
- `pnpm dev` / `pnpm preview` は実行不可。ビルドエラー確認時のみ `pnpm build` を使う

### 現在の主要ファイル

| ファイル | 役割 |
|---|---|
| `src/App.tsx` | メインレイアウト・状態管理 |
| `src/lib/appwrite.ts` | Appwrite SDK、fetchArticles() |
| `src/components/Thumbnail.tsx` | サムネイル or サービスロゴフォールバック |

---

## デザインシステム: melta UI

### 導入方法

まず以下を実行してmelta UIをクローンする:

```bash
git clone https://github.com/tsubotax/melta-ui.git /tmp/melta-ui
```

次に以下のファイルをRushプロジェクトにコピーする:

```bash
# デザインシステムファイルをdocs/配下に配置
mkdir -p docs/melta
cp /tmp/melta-ui/melta/CLAUDE.md docs/melta/CLAUDE.md
cp -r /tmp/melta-ui/melta/foundations docs/melta/foundations
cp -r /tmp/melta-ui/melta/components docs/melta/components
cp -r /tmp/melta-ui/melta/patterns docs/melta/patterns
cp /tmp/melta-ui/melta/tokens/tokens.json docs/melta/tokens.json
cp /tmp/melta-ui/melta/metadata/components.json docs/melta/components.json
cp /tmp/melta-ui/melta/prohibited.md docs/melta/prohibited.md
```

### MCPサーバーの設定

`.mcp.json` をプロジェクトルートに作成（または既存に追記）:

```json
{
  "mcpServers": {
    "melta-ui": {
      "command": "node",
      "args": ["/tmp/melta-ui/melta/src/index.js"]
    }
  }
}
```

MCPが使えると `get_component("card")` や `check_rule("shadow-lg")` などのツールが使えるようになる。

### 読み込みモード

| モード | 読むファイル | 用途 |
|---|---|---|
| クイック | `docs/melta/CLAUDE.md` のみ | 単体UIの生成 |
| 標準 | + `theme.md` + 関連 `component md` | ページ単位の生成 |
| フル | 全ファイル | 今回はこれ（新規UI構築） |

**今回は「フル」モードで作業開始すること。**
`docs/melta/CLAUDE.md` を最初に読み、必要に応じて各 foundation・component md を参照しながら進める。

---

## デザイン方針

### 全体トーン

- **シンプル・ツール系ダッシュボード**。情報が主役、UIは黒子
- ダークモード対応（`html[data-theme="dark"]` で切替）
- melta UIのセマンティックカラーシステムを使う（`text-body`、`--bg-surface` 等）

### カラー

melta UIのトークンをそのまま使用:

```
背景: bg-gray-50 (light) / bg-slate-900 (dark)
Surface (カード等): bg-white (light) / bg-slate-800 (dark)
見出し: text-slate-900 / text-slate-100
本文: text-body (#3d4b5f) / text-slate-300
補助テキスト: text-slate-500 / text-slate-400
ボーダー: border-slate-200 / border-slate-700
アクセント: primary-500 (#2b70ef)
```

### タイポグラフィ

```
フォント: Inter, Hiragino Sans, Noto Sans JP, sans-serif
本文: 18px / 行間200% / letter-spacing 2%
見出し: text-xl (20px) semibold / letter-spacing 1%
補助: text-sm (15px)
```

### スペーシング

4pxベースグリッド。8の倍数を基本とする（p-4=16px, p-6=24px, p-8=32px）

---

## 画面構成と実装指示

### 1. 全体レイアウト

```
┌─────────────────────────────┐
│  Header (h-14)              │
├──────┬──────────────────────┤
│Side  │  Main Content        │
│bar   │  max-w-7xl           │
│w-64  │                      │
└──────┴──────────────────────┘
```

- サイドバー: `bg-white border-r border-slate-200`（light）
- ヘッダー: `bg-white border-b border-slate-200 h-14`
- メインコンテンツ: `bg-gray-50 flex-1 overflow-y-auto px-8 py-6`

### 2. ヘッダー

```
[Rush ロゴ]                    [ダークモード切替] [最終更新時刻]
```

- ロゴ: `text-xl font-bold text-slate-900`
- 最終更新: `text-sm text-slate-500`
- ダークモード切替: アイコンボタン（w-10 h-10）

### 3. サイドバー

```
Rush
─────
📰 すべて（アクティブ）
🤖 LLM
🛠 ツール
📊 ビジネス
─────
設定
```

- アクティブ項目: `bg-primary-50 text-primary-500 font-medium`
- 非アクティブ: `text-body hover:bg-gray-50`
- カテゴリはRush既存のAI分類カテゴリに合わせる

### 4. 記事カード

melta UIの **カードコンポーネント**（`components/card.md`）をベースに:

```
┌────────────────────────────┐
│ [サムネイル 120x80]         │
│ ─────────────────────────  │
│ [カテゴリバッジ] [ソース]   │
│ タイトル（2行まで）         │
│ 要約テキスト（3行まで）     │
│ [時刻] [外部リンクアイコン] │
└────────────────────────────┘
```

```
bg-white rounded-xl border border-slate-200 shadow-sm
hover:shadow-md transition-shadow duration-200
```

- **カテゴリバッジ:** melta UIのバッジコンポーネント準拠
  - LLM: `bg-primary-50 text-primary-700`
  - ツール: `bg-emerald-50 text-emerald-700`
  - ビジネス: `bg-amber-50 text-amber-700`
- **タイトル:** `text-base font-semibold text-slate-900 line-clamp-2`
- **要約:** `text-sm text-body line-clamp-3`
- **時刻:** `text-xs text-slate-500`
- **ソース表示:** Zenn/Qiitaロゴ + サービス名 `text-xs text-slate-500`

### 5. 記事グリッド

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
```

### 6. ローディング状態

melta UIの **スケルトンコンポーネント**（`components/skeleton.md`）を使用:
- カード型スケルトンを3×2=6枚並べる
- `skeleton-pulse` アニメーション付き

### 7. 空状態

melta UIの **Empty State パターン**（`patterns/interaction-states.md`）:

```
[アイコン]
記事がありません
このカテゴリにはまだ記事がありません
```

---

## 禁止パターン（Rush固有）

`docs/melta/prohibited.md` の76項目に加え、Rush固有の禁止事項:

```markdown
## Rush 固有の禁止パターン

- カードにborder-l-4のカラーバーを付けない（melta UI共通禁止事項）
- カテゴリバッジに絵文字を使わない
- 記事タイトルにtext-blackを使わない（text-slate-900を使う）
- ローディング中にコンテンツが突然現れるちらつきを起こさない（スケルトン必須）
- shadow-lgをカードに使わない（shadow-smで十分）
- サイドバーを暗い背景（bg-slate-800等）にしない（bg-white + ボーダー）
```

---

## 実装ステップ

### Step 1: melta UIのセットアップ

1. melta UIをクローンしてdocs/meltaにファイルをコピー
2. `.mcp.json` にMCPサーバーを追加
3. `docs/melta/CLAUDE.md` を読んでデザインシステムを把握

### Step 2: Tailwind設定の更新

`tailwind.config.ts` または `vite.config.ts` にmeltaのカラートークンを追加:

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50:  '#f0f5ff',
    100: '#dde8ff',
    // ... tokens.jsonの値を参照
    500: '#2b70ef',
    700: '#1a40b5',
  },
  body: '#3d4b5f', // text-bodyクラス用
}
```

### Step 3: CSSグローバル変数の設定

`src/index.css` にmeltaのCSS変数を追加（`docs/melta/foundations/theme.md` を参照）:

```css
:root {
  --bg-page: theme('colors.gray.50');
  --bg-surface: theme('colors.white');
  --text-heading: theme('colors.slate.900');
  --text-default: #3d4b5f;
  --text-muted: theme('colors.slate.500');
  --border-default: theme('colors.slate.200');
}

html[data-theme="dark"] {
  --bg-page: theme('colors.slate.900');
  --bg-surface: theme('colors.slate.800');
  /* ... */
}
```

### Step 4: コンポーネントの実装

以下の順番で実装する:

1. `src/components/Layout.tsx` — 全体レイアウト（Header + Sidebar + Main）
2. `src/components/Header.tsx` — ヘッダー
3. `src/components/Sidebar.tsx` — サイドバー（カテゴリフィルター）
4. `src/components/ArticleCard.tsx` — 記事カード
5. `src/components/ArticleGrid.tsx` — グリッドレイアウト
6. `src/components/SkeletonCard.tsx` — ローディングスケルトン
7. `src/components/EmptyState.tsx` — 空状態
8. `src/App.tsx` — 上記を組み合わせてリファクタリング

### Step 5: 禁止パターンチェック

各コンポーネント実装後、MCPの `check_rule()` で禁止パターン違反がないか確認する。

---

## 注意事項

- **機能は壊さない**: `src/lib/appwrite.ts` の `fetchArticles()` はそのまま使う
- **Thumbnail.tsxは流用可**: フォールバックロジックはそのまま、スタイルのみ更新
- **段階的にcommit**: コンポーネント1つ完成するごとにcommitしてGitHub Actionsで確認
- **型安全を維持**: TypeScriptの型エラーをゼロに保つ
