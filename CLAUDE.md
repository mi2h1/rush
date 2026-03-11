# Commands
- `pnpm dev` : 開発サーバー起動
- `pnpm build` : ビルド（GitHub Pages 向け）
- `pnpm preview` : ビルド結果のプレビュー

# Project Goal
- **目的:** 日本語AI情報に特化したニュースアグリゲーター（個人用ダッシュボード）
- **成果物:** Webアプリ（React + Vite、GitHub Pages ホスト）
- **優先順位:** 動作速度 > 実装速度 > 可読性

# Non-Negotiables
- すべての出力を日本語で行う（会話・作業ログ・タスクリスト・進捗説明、すべて。カジュアル敬語）
- 質問と命令を区別する（質問=調査のみ / 命令=実作業）
- 破壊的変更は事前に影響範囲と代替案を提示
- 既存のテスト・設定・仕様は勝手に変えない
- 秘密情報（APIキー等）は出力しない
- 不確かな内容は断定しない
- `/handover` と言われたら HANDOVER.md を生成する

# Output Format
- 結論 → 根拠 → 手順の順で返答
- コード修正は変更箇所のみ提示（ファイル全体の再出力は避ける）

# Reference
- `docs/conventions.md` — 開発規約・命名規則
- `docs/progress.md` — 進捗・タスク・作業ログ
- `HANDOVER.md` — セッション引き継ぎ情報
