'use client';

import { useEffect, useState } from 'react';
import { Download, Check, Share, PlusSquare, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallButton = (): React.JSX.Element | null => {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        Boolean((window.navigator as unknown as { standalone?: boolean }).standalone));

    if (isStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIos(isAppleDevice);

    const handleBeforeInstall = (e: Event): void => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = (): void => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIos) {
      setShowIosModal(true);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-zinc-800 bg-zinc-900/60 rounded-lg">
        <Check className="w-3.5 h-3.5" />
        PWA
      </span>
    );
  }

  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors shrink-0"
        type="button"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Установить PWA</span>
        <span className="sm:hidden">PWA</span>
      </button>

      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-white">Установка на iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
                type="button"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Чтобы установить приложение на экран «Домой» и открывать все курсы без интернета:
            </p>

            <ol className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-[10px] text-zinc-200">
                  1
                </span>
                <div>
                  Нажмите кнопку <strong className="text-white">«Поделиться»</strong> в меню Safari:
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                    <Share className="w-3 h-3" />
                    Поделиться
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-[10px] text-zinc-200">
                  2
                </span>
                <div>
                  Выберите пункт:
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                    <PlusSquare className="w-3 h-3" />
                    «На экран «Домой»»
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-semibold text-[10px] text-zinc-200">
                  3
                </span>
                <div>
                  Нажмите <strong className="text-white">«Добавить»</strong> в правом верхнем углу.
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosModal(false)}
              type="button"
              className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};
