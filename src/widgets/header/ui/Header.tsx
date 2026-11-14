'use client';

import Link from 'next/link';
import { PwaInstallButton } from '@/features/pwa/ui/PwaInstallButton';
import { SearchFilterModal } from '@/features/search/ui/SearchFilterModal';
import { InterviewSimulatorModal } from '@/features/interview-simulator/ui/InterviewSimulatorModal';
import { useActiveCourse } from '@/features/progress-tracker';

const NAV_COURSES = [
  { slug: 'senior-marketing', label: 'Senior Growth' },
  { slug: 'media-buying', label: 'Media Buying' },
  { slug: 'affiliate-manager', label: 'Affiliate' },
  { slug: 'lead-generation', label: 'Lead Gen' },
];

export const Header = (): React.JSX.Element => {
  const { activeCourse, isLoaded } = useActiveCourse();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/70 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 sm:gap-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-zinc-200 transition-colors"
        >
          Marketolog Academy
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          {NAV_COURSES.map((item) => {
            const isActive = isLoaded && activeCourse?.courseSlug === item.slug;
            return (
              <Link
                key={item.slug}
                href={`/courses/${item.slug}/`}
                className={`transition-colors whitespace-nowrap shrink-0 ${
                  isActive ? 'text-white font-medium' : 'hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <SearchFilterModal />
          <InterviewSimulatorModal />
          <PwaInstallButton />
        </div>
      </div>
    </header>
  );
};
