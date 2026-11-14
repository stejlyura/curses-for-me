'use client';

import { LogIn, LogOut } from 'lucide-react';
import { useAuthSync } from '../model/useAuthSync';

export const AuthHeaderControl = (): React.JSX.Element | null => {
  const { authStatus, isAuthenticated, username, openAuthModal, logout } = useAuthSync();

  if (authStatus === 'checking') {
    return (
      <span
        aria-hidden="true"
        className="inline-block h-8 w-16 rounded-lg bg-zinc-900/60 border border-zinc-800/70"
      />
    );
  }

  if (isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => void logout()}
        aria-label={`Выйти (${username ?? 'аккаунт'})`}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap shrink-0"
      >
        <LogOut className="w-3.5 h-3.5 text-zinc-400" />
        <span>Выйти</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openAuthModal}
      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-200 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap shrink-0"
    >
      <LogIn className="w-3.5 h-3.5 text-brand-400" />
      <span>Войти</span>
    </button>
  );
};
