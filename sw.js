const CACHE = 'offline-fallback-v1';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll([
                'index.html',
                'style.css',
                'main.js',
                'about/index.html',
                'about/ru/index.html',
                'audio/clear_audio.ogg',
                'audio/dialog_audio.ogg',
                'audio/end_audio.ogg',
                'audio/error_audio.ogg',
                'audio/numpad_audio_1.ogg',
                'audio/numpad_audio_2.ogg',
                'audio/numpad_audio_3.ogg',
                'audio/numpad_audio_4.ogg',
                'audio/success_audio.ogg',
                'img/about_banner.png',
                'img/about_logo.png',
                'img/icon_db.png',
                'img/icon_gh.png',
                'img/icon_inst.png',
                'ru/index.html',
            ]))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fromCache(event.request));
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