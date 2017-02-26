window.addEventListener('load', () => {
    const myApp = wd.createRoot('app')
    .routes([
        { url: '/', templateUrl: 'main.html' },
        { url: '/sign-in', templateUrl: 'sign-in.html' }
    ]);
    
    const interceptInternalLink = (event) => {
        if (event.target && event.target.matches('a.internal-link')) {
            myApp.navigate(event.target.getAttribute('href'));
            event.preventDefault();
        }
    }

    myApp.navigate('/');

    window.addEventListener('popstate', event => myApp.root().innerHTML = event.state);
    document.getElementsByClassName('main-nav-hamburger')[0].addEventListener('click', interceptInternalLink);
    document.getElementsByClassName('page-header')[0].addEventListener('click', interceptInternalLink);
});
