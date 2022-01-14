const cacheName = 'funmath-v1';
// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll([
                'style.css',
                'audio/level_main.mp3',
                'audio/dialog_audio.mp3',
                'audio/clear_audio.mp3',
                'audio/error_audio.mp3',
                'audio/numpad_audio_1.mp3',
                'audio/numpad_audio_2.mp3',
                'audio/numpad_audio_3.mp3',
                'audio/numpad_audio_4.mp3'
            ])
        ));
});

// при событии fetch, мы используем кэш, и только потом обновляем его данным с сервера
self.addEventListener('fetch', function(event) {
    // Мы используем `respondWith()`, чтобы мгновенно ответить без ожидания ответа с сервера.
    event.respondWith(fromCache(event.request));
    // `waitUntil()` нужен, чтобы предотвратить прекращение работы worker'a до того как кэш обновиться.
    event.waitUntil(update(event.request));
});

function fromCache(request) {
    return caches.open(cacheName).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(cacheName).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response)
        )
    );
}
