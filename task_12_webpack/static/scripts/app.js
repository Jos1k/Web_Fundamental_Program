require('../styles/sass/style.scss');
const Awesomplete = require('../libs/awesomplete/awesomplete.js');
const SuperFramework = require('./superFramework');

window.addEventListener('load', () => {
    const myApp = SuperFramework.createRoot('app')
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
                        fetch('http://127.0.0.1:8082/api/search?query=' + event.target.value, {
                            method: 'post'
                        }).then((response) => {
                            if (!response.ok) {
                                throw response.statusText;
                            }
                            response.json().then((result) => {
                                awesomplete._list = result;
                                awesomplete.evaluate();
                            });
                        }).catch((error) => {
                            throw error;
                        });
                        event.stopPropagation();
                    }
                }, true);

                const awesomplete = new Awesomplete(searchInput,
                    { filter: () => { return true; } });
            }
        });

    myApp.navigate('/');
    window.addEventListener('popstate', event => myApp.root().innerHTML = event.state);
});
