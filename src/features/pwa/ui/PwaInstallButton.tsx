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

    // Detect if already installed / running in standalone window
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && Boolean((window.navigator as unknown as { standalone?: boolean }).standalone));

    if (isStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS devices (iPhone, iPad, iPod)
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
    // If native prompt is available (Chrome, Edge, Android)
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    // If iOS Safari
    if (isIos) {
      setShowIosModal(true);
      return;
    }
  };

  if (!mounted) {
    return null;
  }

  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
        <Check className="w-3.5 h-3.5" />
        PWA установлена
      </span>
    );
  }

  // Show button if deferredPrompt is ready OR if on iOS device
  if (!deferredPrompt && !isIos) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        type="button"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Установить PWA</span>
      </button>

      {/* iOS Safari Installation Instruction Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Установка на iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Чтобы установить приложение на iOS без App Store и пользоваться всеми симуляторами оффлайн:
            </p>

            <ol className="space-y-3 text-xs text-zinc-200">
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-bold text-[10px] text-brand-400">
                  1
                </span>
                <div>
                  Нажмите кнопку <strong className="text-white">«Поделиться»</strong> в нижнем меню Safari:
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-300 bg-zinc-800/70 px-2 py-0.5 rounded">
                    <Share className="w-3 h-3" />
                    Квадрат со стрелкой вверх
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-bold text-[10px] text-brand-400">
                  2
                </span>
                <div>
                  Прокрутите вниз и выберите пункт:
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-zinc-800/70 px-2 py-0.5 rounded">
                    <PlusSquare className="w-3 h-3" />
                    «На экран «Домой»» (Add to Home Screen)
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-bold text-[10px] text-brand-400">
                  3
                </span>
                <div>
                  В правом верхнем углу нажмите <strong className="text-white">«Добавить»</strong>. Иконка появится на рабочем столе!
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIosModal(false)}
              type="button"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-semibold transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
};
