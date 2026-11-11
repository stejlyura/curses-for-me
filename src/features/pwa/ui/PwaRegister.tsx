'use client';

import { useEffect } from 'react';

export const PwaRegister = (): null => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((error: unknown) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
};

