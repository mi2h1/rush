interface Props {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = '記事がありません',
  description = 'このカテゴリにはまだ記事がありません',
}: Props) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-base font-medium text-slate-900">{message}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
