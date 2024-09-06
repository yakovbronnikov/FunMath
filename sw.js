const cacheName = 'funmath-v1';
const timeout = 400;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll([
                'style.css',
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





const CACHE = 'cache-and-update-v1';

// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) =>
            cache.addAll(['audio']))
    );
});

// при событии fetch, мы используем кэш, и только потом обновляем его данным с сервера
self.addEventListener('fetch', function(event) {
    // Мы используем `respondWith()`, чтобы мгновенно ответить без ожидания ответа с сервера.
    event.respondWith(fromCache(event.request));
    // `waitUntil()` нужен, чтобы предотвратить прекращение работы worker'a до того как кэш обновиться.
    event.waitUntil(update(event.request));
});

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(CACHE).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response)
        )
    );
}
