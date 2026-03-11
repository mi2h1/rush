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

- Appwrite の認証情報・Claude APIキーは環境変数で管理し、コードに直書きしない
- RSS取得・Claude API呼び出しは Appwrite Functions 側で行い、フロントに秘密情報を持たせない
- パフォーマンス優先のため、不要な再レンダリングを避ける（useMemo / useCallback を適切に使う）
