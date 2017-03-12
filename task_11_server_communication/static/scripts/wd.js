var wd = {
    createRoot: function (appName) {
        function AppInstanse(name) {
            let appRoutes = [];
            const applicationName = appName;
            const content_area = document.querySelector('[wd-root]', applicationName);
            const getContent = (templateUri) => {
                return fetch(templateUri).then(response => {
                    return response.text().then(text => {
                        return text;
                    })
                }).catch(ex => console.error(ex));
            };

            this.root = () => { return content_area }
            this.routes = (routeList) => {
                appRoutes = routeList;
                return this;
            };

            this.navigate = (templateUrl) => {
                const route = appRoutes.find(element => {
                    return element.url === templateUrl;
                });
                return getContent(route.templateUrl).then(content => {
                    content_area.innerHTML = content
                    history.pushState(content, null, route.url);
                }).catch(ex => console.error(ex));
            };

            this.component = (name, description) => {
                const componentProto = Object.create(HTMLElement.prototype);
                const that = this;
                
                const getComponentData = (element) => {
                    const componentData = {};
                    componentData.innerHTML = element.innerHTML;
                    Array.prototype.slice.call(element.attributes)
                        .forEach(function(attr) {
                            componentData[attr.name] = attr.value
                        });
                    return componentData;
                };

                componentProto.createdCallback = function() {
                    const newComponent = new DOMParser()
                        .parseFromString(description.template,'text/html')
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
            return this;
        }
        return new AppInstanse(appName);
    }
};