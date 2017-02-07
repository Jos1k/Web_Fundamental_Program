window.addEventListener('load', function () {
    const nav_links = document.querySelectorAll('a.nav-link');
    const content_area = document.getElementById('app');
    const routes = [
        { url: '/', template: '<h1>Home</h1>' },
        { url: '/sign-in', template: '<h1>Sign-In</h1>' },
        { url: '/sign-up', template: '<h1>Sign-Up</h1>' }
    ];

    content_area.innerHTML = routes[0].template;
    history.replaceState(routes[0], null, null);

    Array.from(nav_links).forEach(link => {
        link.addEventListener('click', function (event) {
            route = routes.find(element => {
                return element.url === event.currentTarget.getAttribute('href');
            });
            content_area.innerHTML = route.template;
            history.pushState(route, null, route.url);
            event.preventDefault();
        });
    });
    window.addEventListener('popstate', function (event) {
        content_area.innerHTML = event.state.template;
    });
});

