export function formatRelativeTime(publishedAt: string): string {
  const diffMs = Date.now() - new Date(publishedAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

export function isToday(publishedAt: string): boolean {
  const pub = new Date(publishedAt);
  const now = new Date();
  return (
    pub.getFullYear() === now.getFullYear() &&
    pub.getMonth() === now.getMonth() &&
    pub.getDate() === now.getDate()
  );
}
