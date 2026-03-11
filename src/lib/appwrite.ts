import { Client, Databases, Query } from 'appwrite';
import type { Article } from '../types';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('rush');

const databases = new Databases(client);

const DB_ID = 'rush-db';
const COLLECTION_ID = 'articles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDoc(doc: any): Article {
  return {
    id: doc.$id,
    title: doc.title,
    source: doc.source,
    category: doc.category,
    publishedAt: doc.publishedAt,
    summary: doc.summary,
    tags: doc.tags ?? [],
    url: doc.url,
    isHot: doc.isHot ?? false,
    thumbnailUrl: doc.thumbnailUrl ?? undefined,
  };
}

export async function fetchXArticles(limit = 30): Promise<Article[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.equal('source', 'X'),
    Query.orderDesc('publishedAt'),
    Query.limit(limit),
  ]);
  return res.documents.map(mapDoc);
}

/** TOPページ用: X除く最新N件 */
export async function fetchTopArticles(limit = 100): Promise<Article[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.notEqual('source', 'X'),
    Query.orderDesc('publishedAt'),
    Query.limit(limit),
  ]);
  return res.documents.map(mapDoc);
}

/** サービス列用: 特定ソースの最新N件 */
export async function fetchSourceLatest(source: string, limit = 5): Promise<Article[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.equal('source', source),
    Query.orderDesc('publishedAt'),
    Query.limit(limit),
  ]);
  return res.documents.map(mapDoc);
}

/** Zenn週間人気: likeCount降順 */
export async function fetchZennPopular(limit = 5): Promise<Article[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.equal('source', 'Zenn'),
    Query.greaterThan('likeCount', 0),
    Query.orderDesc('likeCount'),
    Query.limit(limit),
  ]);
  return res.documents.map(mapDoc);
}

/** 記事一覧ページ用: ソース・カテゴリフィルター + ページネーション */
export async function fetchArticleList(opts: {
  source?: string;
  category?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ articles: Article[]; total: number }> {
  const { source, category, page = 0, limit = 20 } = opts;
  const queries = [
    Query.notEqual('source', 'X'),
    Query.orderDesc('publishedAt'),
    Query.limit(limit),
    Query.offset(page * limit),
  ];
  if (source) queries.push(Query.equal('source', source));
  if (category) queries.push(Query.equal('category', category));
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);
  return { articles: res.documents.map(mapDoc), total: res.total };
}
