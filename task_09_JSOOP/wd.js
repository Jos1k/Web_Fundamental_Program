var wd = {
    createRoot: function (appName) {
        const that = this;
        let appRoutes = [];
        const applicationName = appName;
        const content_area = document.querySelector('[wd-root]', applicationName);
        const getContent = (templateUri) => {
            return fetch(templateUri).then(response => {
                return response.text().then(text => {
                    return text;
                })
            }).catch(ex => console.log(ex));
        };

        this.root = () =>{ return content_area }
        this.routes = (routeList)  => {
            appRoutes = routeList;
            return that;
        };

        this.navigate = (templateUrl) => {
            const route = appRoutes.find(element => {
                return element.url === templateUrl;
            });
            return getContent(route.templateUrl).then(content => {
                content_area.innerHTML = content
                history.pushState(content, null, route.url);
            }).catch(ex => console.log(ex));
        };
        return that;
    }
};