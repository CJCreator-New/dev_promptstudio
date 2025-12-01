let deferredPrompt: any = null;

export function initPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });
}

export function showInstallPrompt() {
  if (!deferredPrompt) return false;

  const shouldShow = !localStorage.getItem('pwa-install-dismissed');
  if (shouldShow) {
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
    banner.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">📱</span>
        <div class="flex-1">
          <div class="font-semibold mb-1">Install DevPrompt Studio</div>
          <div class="text-sm opacity-90 mb-3">Get quick access and work offline</div>
          <div class="flex gap-2">
            <button id="pwa-install" class="px-4 py-2 bg-white text-blue-600 rounded font-medium text-sm">
              Install
            </button>
            <button id="pwa-dismiss" class="px-4 py-2 bg-blue-700 rounded font-medium text-sm">
              Not now
            </button>
          </div>
        </div>
        <button id="pwa-close" class="text-white opacity-75 hover:opacity-100">✕</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install')?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install outcome:', outcome);
        deferredPrompt = null;
      }
      banner.remove();
    });

    document.getElementById('pwa-dismiss')?.addEventListener('click', () => {
      localStorage.setItem('pwa-install-dismissed', 'true');
      banner.remove();
    });

    document.getElementById('pwa-close')?.addEventListener('click', () => {
      banner.remove();
    });
  }

  return shouldShow;
}

export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
