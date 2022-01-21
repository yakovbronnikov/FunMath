const cacheName = 'funmath-ru-v1';
const timeout = 400;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll([
                'index.html',
                '../about/ru/index.html',
                '../style.css',
                '../main.js',
                '../sw.js',
                '../audio/dialog_audio.mp3',
                '../audio/clear_audio.mp3',
                '../audio/error_audio.mp3',
                'audio/numpad_audio_1.mp3',
                'audio/numpad_audio_2.mp3',
                'audio/numpad_audio_3.mp3',
                'audio/numpad_audio_4.mp3',
                '../audio/success_audio.mp3',
                '../audio/end_audio.mp3',
                '../audio/level_main.mp3'
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
