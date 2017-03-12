const superFramework = require('./superFramework');

window.addEventListener('load', () => {
    const myApp = superFramework.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'views/main.html' },
            { url: '/sign-in', templateUrl: 'views/sign-in.html' }
        ])
        .component('in-link', {
            template: '<a href=""></a>',
            beforeMount: function (app, element, componentData) {
                element.innerHTML = componentData.innerHTML;
                element.setAttribute('href', componentData.href);
                element.setAttribute('class', componentData.class);
                element.addEventListener('click', (event) => {
                    app.navigate(element.getAttribute('href'));
                    event.preventDefault();
                });
            }
        })
        .component('in-search', {
            template: '<span><input data-list=""/></span>',
            beforeMount: function (app, element, componentData) {
                const searchInput = element.children[0];
                searchInput.setAttribute('placeholder', componentData.placeholder);
                searchInput.setAttribute('class', componentData.class);

                element.addEventListener('input', (event) => {
                    if (event.target && event.target.nodeName == 'INPUT') {
                        awesomplete._list = [];
                        if (!event.target.value) {
                            return;
                        }
                        fetch('/api/search?query=' + event.target.value, {
                            method: 'post'
                        }).then((response) => {
                            if (!response.ok) {
                                console.log(response.statusText);
                                return;
                            }
                            response.json().then((result) => {
                                awesomplete._list = result;
                                awesomplete.evaluate();
                            })
                        }).catch((error) => {
                            console.error(error);
                        });
                        event.stopPropagation();
                    }
                }, true);

                const awesomplete = new Awesomplete(searchInput,
                    { filter: (text, input) => { return true; } });
            }
        });

    myApp.navigate('/');
    window.addEventListener('popstate', event => myApp.root().innerHTML = event.state);
});
