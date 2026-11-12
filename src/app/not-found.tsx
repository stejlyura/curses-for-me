import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-3xl font-bold text-white mb-4">404 — Страница не найдена</h2>
      <p className="text-zinc-400 mb-6">Запрашиваемая страница или урок не существует.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
