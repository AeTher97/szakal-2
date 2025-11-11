self.addEventListener('push', function (event) {
    console.debug('Received a push message', event);

    const title = 'Nowe wydarzenie w Szakalu';
    const body = event.data.json().message;
    const icon = '/favicon.ico';
    const tag = 'update';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );

});

