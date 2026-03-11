# HANDOVER.md — Rush プロジェクト引き継ぎ

## このセッションの概要

Claude.ai チャット上で「Rush」プロジェクトのコンセプトを固めた。
コードはまだ書いていない。次のセッション（Claude Code）から実装を開始する。

---

## プロジェクト概要

**名前:** Rush  
**リポジトリ:** ※まだ作成中。セッション開始時にユーザーにURLを確認すること  
**一言説明:** 日本語AI情報に特化したニュースアグリゲーター（フィーダー）

### コンセプト
- Zenn / note / Qiita などの日本語技術メディアからRSSでAI関連記事を収集
- Claude APIで自動分類・要約・タグ付け
- AI企業別（OpenAI / Anthropic / Google / Meta など）にカテゴリ分け
- AI関連BaaS・SaaSの新サービス情報も収集対象
- 「最新記事」「今日の話題」「ホットニュース」などの表示枠を持つダッシュボード
- 将来的にXのRSSHub連携も視野（現時点では後回し）

### ターゲット
自分用（Kenさん個人利用）。公開サービスではなくパーソナルダッシュボード。

---

## 技術スタック（仮）

| レイヤー | 技術 |
|---|---|
| フロントエンド | React + Vite（GitHub Pages でホスト） |
| バックエンド | Appwrite Cloud（Functions + Database） |
| AI処理 | Claude API（分類・要約・タグ付け） |
| データソース | RSS（Zenn / note / Qiita）、将来的にRSSHub |
| コスト目標 | 無料〜ほぼ無料 |

---

## 決定事項

- プロジェクト名は **「Rush」**（単体、サフィックスなし）
- Xのクローリングは現時点では **対象外**（APIコスト・ToS問題）
- RSSHub は将来的な拡張として **視野に入れる**
- まずは日本語メディア（Zenn/note/Qiita）に絞ってMVPを作る
- UIモックを先に作り、そこからデータ設計を詰める方針

---

## 次のセッションでやること

1. **リポジトリURLを確認する**（ユーザーに聞く）
2. document-policy.md を読み込む
3. CLAUDE.md・プロジェクト初期ドキュメント群を作成
4. UIモック（ダミーデータで動くダッシュボード）を実装
5. RSSフェッチ + Appwrite Database の設計

---

## セッション開始時の確認事項

> 「document-policy.md とこの HANDOVER.md を読みました。  
> Rushリポジトリ のURLを教えてください。確認後、CLAUDE.md と初期ドキュメントの作成に入ります。」

---

## 参考リンク

- Appwrite Cloud: https://appwrite.io
- RSSHub: https://docs.rsshub.app
- Zenn RSS: `https://zenn.dev/topics/ai/feed`
- Qiita RSS: `https://qiita.com/tags/ai/feed`
