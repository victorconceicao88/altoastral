export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registrado com sucesso: ', registration);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // ⚠️ Atualização automática ao detectar nova versão
                  console.log('Nova versão detectada. Atualizando automaticamente...');
                  window.location.reload();
                } else {
                  console.log('Conteúdo armazenado em cache para uso offline.');

                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Erro durante o registro do Service Worker:', error);
        });
    });
  }
}
