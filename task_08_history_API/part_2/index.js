window.addEventListener('load', () => {
    const nav_links = document.querySelectorAll('a.nav-link');
    const content_area = document.getElementById('app');
    const routes = [
        { url: '/', templateUrl: 'home.html' },
        { url: '/sign-in', templateUrl: 'sign-in.html' },
        { url: '/sign-up', templateUrl: 'sign-up.html' }
    ];
    const get_content = (templateUri) => {
        return fetch(templateUri).then(response => {
            return response.text().then(text => {
                return text;
            })
        }).catch(ex => console.log(ex));
    }

    get_content(routes[0].templateUrl).then(content => {
        content_area.innerHTML = content
        history.replaceState(content, null, null);
    });

    window.addEventListener('popstate', event => {
        content_area.innerHTML = event.state
    });

    document.getElementById('main-nav').addEventListener('click', event => {
        if (event.target && event.target.className === 'nav-link') {
            route = routes.find(element => {
                return element.url === event.target.getAttribute('href');
            });
            get_content(route.templateUrl).then(content => {
                content_area.innerHTML = content
                history.pushState(content, null, route.url);
            }).catch(ex => console.log(ex));
            event.preventDefault();
        }
    })
});

