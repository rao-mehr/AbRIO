if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch((err) => {
      console.log('Service Worker Registrierung fehlgeschlagen:', err);
    });
  });
}
