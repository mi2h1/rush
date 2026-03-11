import { Client, Databases, Query } from 'appwrite';
import type { Article, CategoryId } from '../types';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('rush');

const databases = new Databases(client);

const DB_ID = 'rush-db';
const COLLECTION_ID = 'articles';

export async function fetchXArticles(limit = 30): Promise<Article[]> {
  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    Query.equal('source', 'X'),
    Query.orderDesc('publishedAt'),
    Query.limit(limit),
  ]);
  return res.documents.map((doc) => ({
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
  }));
}

export async function fetchArticles(category?: CategoryId): Promise<Article[]> {
  const queries = [
    Query.orderDesc('publishedAt'),
    Query.limit(100),
  ];

  if (category && category !== 'all') {
    queries.push(Query.equal('category', category));
  }

  const res = await databases.listDocuments(DB_ID, COLLECTION_ID, queries);

  return res.documents.map((doc) => ({
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
  }));
}
