'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useAuthSync } from '../model/useAuthSync';

export const AuthModal = (): React.JSX.Element | null => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuthSync();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Введите логин и пароль.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || 'Неверный логин или пароль.');
    } else {
      setPassword('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Вход в аккаунт"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-brand-400">
              <Lock className="w-4 h-4" />
              <span>Личный кабинет</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Вход в обучение
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Войдите, чтобы загружать и сохранять прогресс между ПК и телефоном.
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Закрыть окно входа"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="auth-username" className="block text-sm font-medium text-zinc-300">
              Логин
            </label>
            <input
              id="auth-username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Логин"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-base text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="auth-password" className="block text-sm font-medium text-zinc-300">
              Пароль
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-base text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-rose-500/40 bg-rose-950/30 px-3.5 py-2.5 text-sm text-rose-200"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold py-2.5 px-4 text-sm sm:text-base transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};
