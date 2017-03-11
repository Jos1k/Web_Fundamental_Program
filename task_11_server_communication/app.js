window.addEventListener('load', () => {
    const myApp = wd.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'main.html' },
            { url: '/sign-in', templateUrl: 'sign-in.html' }
        ])
        .component(
            'in-link',
            {
                template: '<a href=""></a>',
                beforeMount: function (app, element, componentData){
                    element.innerHTML = componentData.innerHTML;
                    element.setAttribute('href',componentData.href);
                    element.setAttribute('class',componentData.class);
                    element.addEventListener('click', (event)=> {
                        app.navigate(element.getAttribute('href'));
                        event.preventDefault();
                    });
                }
            }
        )
        .component(
            'in-search',
            {
                template: '<span><input/></span>',
                beforeMount: function (app, element, componentData){
                    const searchInput = element.children[0];
                    searchInput.setAttribute('placeholder',componentData.placeholder);
                    searchInput.setAttribute('class',componentData.class);
                    
                    new Awesomplete(searchInput,{
                        list: ["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"]
                    });
                }
            }
        );
    myApp.navigate('/');
    window.addEventListener('popstate', event => myApp.root().innerHTML = event.state);
});
