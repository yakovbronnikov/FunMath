const cacheName = 'funmath-v1';
const timeout = 400;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll([
                'index.html',
                'about/index.html',
                'style.css',
                'main.js',
                'sw.js',
                'audio/dialog_audio.ogg',
                'audio/clear_audio.ogg',
                'audio/error_audio.ogg',
                'audio/numpad_audio_1.ogg',
                'audio/numpad_audio_2.ogg',
                'audio/numpad_audio_3.ogg',
                'audio/numpad_audio_4.ogg',
                'audio/success_audio.ogg',
                'audio/end_audio.ogg',
                'audio/level_main.ogg'
            ])
        ));
});


// при событии fetch, мы и делаем запрос, но используем кэш, только после истечения timeout.
self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
      .catch((err) => {
          return fromCache(event.request);
      }));
});

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(cacheName).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
