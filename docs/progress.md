# 進捗・作業ログ

最終更新: 2026-03-11

## リポジトリ情報

- **URL:** https://github.com/mi2h1/rush.git
- **ブランチ運用:** main 直接作業

## ディレクトリ構成（予定）

```
rush/
├── public/
├── src/
│   ├── components/   # UIコンポーネント
│   ├── pages/        # ページ単位のコンポーネント
│   ├── hooks/        # カスタムフック
│   └── lib/          # ユーティリティ・定数
├── docs/
│   ├── conventions.md
│   ├── progress.md
│   └── tech-stack.md（作成予定）
├── CLAUDE.md
└── HANDOVER.md
```

## 完了したタスク

### Phase 0: プロジェクト設計（2026-03-11）
- [x] コンセプト・技術スタックの決定（Claude.ai チャット上）
- [x] CLAUDE.md・docs/ 初期ドキュメントの作成

## 次のタスク

1. **Vite + React プロジェクトの初期化** — `pnpm create vite`、GitHub Pages 向け設定
2. **UIモック実装** — ダミーデータで動くダッシュボードを先に作る
   - ヘッダー / カテゴリタブ（OpenAI / Anthropic / Google / Meta 等）
   - 「最新記事」「今日の話題」「ホットニュース」の表示枠
3. **Appwrite Cloud セットアップ** — プロジェクト作成・Database 設計
4. **RSS フェッチ機能** — Appwrite Functions で Zenn / Qiita / note を取得
5. **Claude API 連携** — 分類・要約・タグ付け処理
6. **GitHub Pages デプロイ設定** — GitHub Actions ワークフロー

## メモ・判断ログ

- Xのクローリングは対象外（APIコスト・ToS問題）
- RSSHub は将来的な拡張として視野に入れる
- コスト目標: 無料〜ほぼ無料
