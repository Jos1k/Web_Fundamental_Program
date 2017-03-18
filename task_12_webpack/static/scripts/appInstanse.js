const privateProperties = new WeakMap();
const getContent = (templateUri) => {
    return fetch(templateUri).then(response => {
        return response.text().then(text => {
            return text;
        });
    }).catch(ex => {throw ex;});
};

class AppInstanse {
    constructor(appName) {
        privateProperties.set(this, {});

        privateProperties.get(this).applicationName = appName;
        privateProperties.get(this).content_area = document.querySelector('[wd-root]', appName);
    }

    root() { return privateProperties.get(this).content_area; }

    routes(routeList) {
        privateProperties.get(this).appRoutes = routeList;
        return this;
    }

    navigate(templateUrl) {
        const route = privateProperties.get(this).appRoutes.find(element => {
            return element.url === templateUrl;
        });

        return getContent(route.templateUrl).then(content => {
            privateProperties.get(this).content_area.innerHTML = content;
            history.pushState(content, null, route.url);
        }).catch(ex => {throw ex;});
    }

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

        document.registerElement(name, { prototype: componentProto});
        return this;
    }
}

module.exports = AppInstanse;