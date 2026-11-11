'use client';

import Link from 'next/link';
import { PwaInstallButton } from '@/features/pwa/ui/PwaInstallButton';
import { SearchFilterModal } from '@/features/search/ui/SearchFilterModal';
import { InterviewSimulatorModal } from '@/features/interview-simulator/ui/InterviewSimulatorModal';
import { TrendingUp, Award, BookOpen, Layers } from 'lucide-react';

export const Header = (): React.JSX.Element => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Marketolog <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">Academy</span>
              </span>
              <span className="text-[11px] text-zinc-400">Multi-Course Executive Hub</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs text-zinc-400">
            <Link
              href="/"
              className="px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              Каталог курсов
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchFilterModal />
          <InterviewSimulatorModal />
          <div className="hidden md:flex items-center gap-3.5 text-xs font-medium text-zinc-400 mr-2">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <BookOpen className="w-3.5 h-3.5 text-brand-400" />
              4 Курса • 21 Модуль
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              79 Практических тем
            </span>
          </div>
          <PwaInstallButton />
        </div>
      </div>
    </header>
  );
};
