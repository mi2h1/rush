# HANDOVER — Rush セッション引き継ぎ

最終更新: 2026-03-11

## プロジェクト概要

日本語AI情報に特化したニュースアグリゲーター（個人用ダッシュボード）。
Zenn・QiitaからAI関連記事を収集し、Groqで要約・分類してダッシュボード表示。

- **本番URL:** https://mi2h1.github.io/rush/
- **リポジトリ:** https://github.com/mi2h1/rush.git
- **ユーザー:** Ken（個人利用）

## 現在の状態（2026-03-11 完成済み）

- フロントエンド・バックエンド・自動収集がすべて動いている
- DBに記事が蓄積中、毎時0分に自動更新
- サムネイル表示済み（ZennのみOGP画像あり、Qiitaはロゴフォールバック）

## 重要ファイル

| ファイル | 役割 |
|---|---|
| `src/App.tsx` | メインレイアウト・状態管理 |
| `src/lib/appwrite.ts` | Appwrite SDK、fetchArticles() |
| `src/components/Thumbnail.tsx` | 画像 or サービスロゴフォールバック |
| `functions/rss-collector/src/main.js` | RSS収集・AI処理のメインロジック |
| `docs/tech-stack.md` | 技術スタック・スキーマ詳細 |
| `docs/progress.md` | 完了済み機能・判断ログ |

## Appwrite 構成

- エンドポイント: `https://sgp.cloud.appwrite.io/v1`
- プロジェクトID: `rush`
- DB: `rush-db` / コレクション: `articles`
- Function: `rss-collector`（スケジュール: `0 * * * *`）

## デプロイ方法

### フロントエンド
main ブランチへのpushで GitHub Actions が自動ビルド・デプロイ。

### Appwrite Functions
```bash
cd functions/rss-collector
# tarball作成（node_modules除外）
tar -czf /tmp/rss-collector.tar.gz package.json pnpm-lock.yaml src/main.js

# デプロイ
curl -X POST "https://sgp.cloud.appwrite.io/v1/functions/rss-collector/deployments" \
  -H "x-appwrite-project: rush" \
  -H "x-appwrite-key: <API_KEY>" \
  -F "entrypoint=src/main.js" \
  -F "commands=npm install" \
  -F "activate=true" \
  -F "code=@/tmp/rss-collector.tar.gz;type=application/gzip"
```

## 手動実行コマンド

```bash
# バックフィル（過去記事一括取得）
curl -X POST "https://sgp.cloud.appwrite.io/v1/functions/rss-collector/executions" \
  -H "x-appwrite-project: rush" \
  -H "x-appwrite-key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"body": "{\"backfill\": true}", "async": false}'

# サムネイル補完
curl -X POST "https://sgp.cloud.appwrite.io/v1/functions/rss-collector/executions" \
  -H "x-appwrite-project: rush" \
  -H "x-appwrite-key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"body": "{\"fixThumbnails\": true}", "async": false}'
```

## 既知の制限・注意点

- Qiitaの記事にサムネイルなし（APIに画像情報がない）
- Groqのレート制限対策で通常モードは記事間2秒delay
- Appwrite URLのユニークインデックスは設定しておらず、アプリ側で重複チェック
- ZennのRSS enclosureは `type="false"` という不正値のため、typeチェックなしでURL使用

## 今後の改善候補

- Qiita記事のサムネ取得（OGP scraping等）
- 記事数増加時のページネーション
- 検索機能
- RSSHub経由でソース追加
