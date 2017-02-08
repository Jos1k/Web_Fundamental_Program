window.addEventListener('load', () => {
    const content_area = document.getElementsByClassName('content__main-content')[0];
    const routes = [
        { url: '/', templateUrl: 'main.html' },
        { url: '/sign-in', templateUrl: 'sign-in.html' }
    ];
    const getContent = (templateUri) => {
        return fetch(templateUri).then(response => {
            return response.text().then(text => {
                return text;
            })
        }).catch(ex => console.log(ex));
    }
    const interceptInternalLink = (event) => {
        if (event.target && event.target.matches('a.internal-link')) {
            route = routes.find(element => {
                return element.url === event.target.getAttribute('href');
            });
            getContent(route.templateUrl).then(content => {
                content_area.innerHTML = content
                history.pushState(content, null, route.url);
            }).catch(ex => console.log(ex));
            event.preventDefault();
        }
    }

    getContent(routes[0].templateUrl).then(content => {
        content_area.innerHTML = content
        history.replaceState(content, null, null);
    });

    window.addEventListener('popstate', event => content_area.innerHTML = event.state);
    document.getElementsByClassName('main-nav-hamburger')[0].addEventListener('click', interceptInternalLink);
    document.getElementsByClassName('page-header')[0].addEventListener('click', interceptInternalLink);
});
