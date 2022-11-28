module.exports = (config, scriptUrl) => {
    const context = {
        availableModules: [],
        activatedModules: [],
        scriptUrl,
        themeUrl: scriptUrl.split('/javascripts/theme.js')[0],
        appName: $("#header h1").text(),
        userName: $("#loggedas a.user").text() || null,
        pageName: $("#content > h2").text() || null,
        pathName: window.location.pathname,
        helpUrl: $("#top-menu a.help").attr('href'),
        currentProject: $(".current-project").text() || null,
        projects: [],
        topmenu: null,
        menu: null,
        submenu: null,
        content: null,
        parts: {
            copyright: null,
        },
        t: {
            header: {
                home: $("#top-menu a.home").text(),
                myPage: $("#top-menu a.my-page").text(),
                projects: $("#top-menu a.projects").text(),
                administration: $("#top-menu a.administration").text() || null,
                help: $("#top-menu a.help").text(),
                myAccount: $("#top-menu a.my-account").text(),
                logout: $("#top-menu a.logout").text(),
                search: $("#header #quick-search label[for=q] a").text(),
                goToProject: $("#header #project-jump span.drdn-trigger").text(),
                recentProjects: $("#header #project-jump .drdn-items.projects strong").text(),
                allProjects: $("#header #project-jump .drdn-items.all-projects a").text(),
            }
        },
    };

    // Parse projects
    $("#header #project-jump .drdn-items.projects a")
        .each((i, el) => {
            context.projects.push({
                name: $(el).find("span").text(),
                url: el.href,
            });
        });

    // Parse top menu
    try {
        $("#top-menu > #account > ul > li").each((i, el) => {
            if (!context.topmenu) {
                context.topmenu = [];
            }
    
            const a = el.querySelector('a');
            const id = `${a.classList[0] ?? i}`;
            const item = {
                id,
                name: a.innerText.trim(),
                url: a.href,
            };

            if (item.name !== '+') {
                context.topmenu.push(item);
            }
        });
    } catch (error) {
        console.error(error);
    }

    // Parse main menu
    try {
        $("#main-menu > ul > li").each((i, el) => {
            if (!context.menu) {
                context.menu = [];
            }
    
            const a = el.querySelector('a');
            const id = `${a.classList[0] ?? i}`;
            const item = {
                id,
                name: a.innerText.trim(),
                url: a.href,
                icon: config.menuIcons[id] ?? null,
                selected: a.classList.contains('selected'),
            };

            if (item.name !== '+') {
                context.menu.push(item);
            }
        });
    } catch (error) {
        console.error(error);
    }

    // Parse sub menu
    try {
        $("#content > .tabs > ul > li, #admin-menu > ul > li").each((i, el) => {
            if (!context.submenu) {
                context.submenu = [];
            }
    
            const a = el.querySelector('a');
            const id = `${a.id ?? i}`;
            const item = {
                id,
                name: a.innerText.trim(),
                url: a.href,
                // onclick: a.getAttribute('onclick'),
                selected: a.classList.contains('selected'),
            };

            if (item.name !== '+') {
                context.submenu.push(item);
            }
        });
    } catch (error) {
        console.error(error);
    }

    context.content = $("#main").html();
    context.parts.copyright = $("#footer").html();

    return context;
};
