'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'marketolog_completed_lessons';

export const useProgress = () => {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedSlugs(JSON.parse(stored) as string[]);
      }
    } catch (e) {
      console.error('Failed to load course progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleLesson = useCallback((slug: string) => {
    setCompletedSlugs((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist course progress', e);
      }
      return updated;
    });
  }, []);

  const isCompleted = useCallback(
    (slug: string): boolean => completedSlugs.includes(slug),
    [completedSlugs]
  );

  return {
    completedSlugs,
    isLoaded,
    toggleLesson,
    isCompleted,
  };
};

