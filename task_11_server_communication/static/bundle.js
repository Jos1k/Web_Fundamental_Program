(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                        fetch('http://127.0.0.1:8082/api/search?query=' + event.target.value, {
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

},{"./superFramework":3}],2:[function(require,module,exports){
const privateProperties = new WeakMap();
const getContent = (templateUri) => {
    return fetch(templateUri).then(response => {
        return response.text().then(text => {
            return text;
        })
    }).catch(ex => console.error(ex));
};

class AppInstanse {
    constructor(appName) {
        privateProperties.set(this, {});

        privateProperties.get(this).applicationName = appName;
        privateProperties.get(this).content_area = document.querySelector('[wd-root]', appName);
    }

    root() { return privateProperties.get(this).content_area }

    routes(routeList) {
        privateProperties.get(this).appRoutes = routeList;
        return this;
    };

    navigate(templateUrl) {
        const route = privateProperties.get(this).appRoutes.find(element => {
            return element.url === templateUrl;
        });

        return getContent(route.templateUrl).then(content => {
            privateProperties.get(this).content_area.innerHTML = content
            history.pushState(content, null, route.url);
        }).catch(ex => console.error(ex));
    };

    component(name, description) {
        const componentProto = Object.create(HTMLElement.prototype);
        const that = this;

        const getComponentData = (element) => {
            const componentData = {};
            componentData.innerHTML = element.innerHTML;
            Array.prototype.slice.call(element.attributes)
                .forEach((attr) => componentData[attr.name] = attr.value);
            return componentData;
        };

        componentProto.createdCallback = function () {
            const newComponent = new DOMParser()
                .parseFromString(description.template, 'text/html')
                .body.firstChild;

            const oldComponentData = getComponentData(this);

            description.beforeMount(that, newComponent, oldComponentData);
            this.parentNode.replaceChild(newComponent, this);
        };

        const componentObj = document.registerElement(name, {
            prototype: componentProto
        });

        return this;
    }
}

module.exports = AppInstanse;
},{}],3:[function(require,module,exports){
const AppInstanse = require('./appInstanse');

class SuperFramework{
    static createRoot(appName) {
        return new AppInstanse(appName);
    }
};

module.exports = SuperFramework;
},{"./appInstanse":2}]},{},[1]);
