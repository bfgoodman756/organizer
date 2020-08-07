let mainWrapper = document.querySelector(".main-wrapper");

let appManager = {
    options: {},

    rememberLastUsedList: function(listName) {
        if (!this.options.lastUsedList) {
            this.options.lastUsedList = {};
        }
        
        this.options.lastUsedList = listName;
        localStorage.setItem("appManager", JSON.stringify(this));
        console.log(`[${listName}] is last used list now`);
    },

    rememberLastUsedApp: function(appName) {
        if (!this.options.lastUsedApp) {
            this.options.lastUsedApp = {};
        }

        this.options.lastUsedApp = appName;
        localStorage.setItem("appManager", JSON.stringify(this));
        console.log(`[${appName}] is last used app now`);
    },

    rememberLastUsedTheme: function(themeName) {
        if (!this.options.lastUsedTheme) {
            this.options.lastUsedTheme = {};
        }

        this.options.lastUsedTheme = themeName;
        localStorage.setItem("appManager", JSON.stringify(this));
        console.log(`[${themeName}] is last used app now`);
    }  
};

if (!localStorage.getItem("appManager")) {
    localStorage.setItem("appManager", JSON.stringify(appManager));
}


let appData = JSON.parse(localStorage.appManager);
appManager.options = Object.assign(appData.options);
console.log("app options data was loaded from {localStorage.appManager}");

menuCloseOpenToggle();
lightDarkModeToggle();


function menuCloseOpenToggle() {
    let menu = document.querySelector(".menu");
    let menuSpacer = document.querySelector(".menu__space-holder");
    let button = document.querySelector(".menu__controls");

    let menuStatus = button.dataset.menuStatus;

    let openButton = document.querySelector(".menu__controls--open-button");
    let closeButton = document.querySelector(".menu__controls--close-button");

    button.addEventListener("click", function(event) {
        let menuStatus = button.dataset.menuStatus;
        let menuRect = menu.getBoundingClientRect();
        switch(menuStatus) {
            case("opened"):
                button.dataset.menuStatus = "closed";
                closeButton.style.display = "none";
                openButton.style.display = "block";
                menu.style.left = `-${menuRect.width}px`;
                button.style.left = "0px";
                menuSpacer.style.minWidth = "0px";
                break;

            case("closed"):
                button.dataset.menuStatus = "opened";
                closeButton.style.display = "block";
                openButton.style.display = "none";
                menu.style.left = `0px`;
                button.style.left = "";
                menuSpacer.style.minWidth = "300px";
                break;
        }
    })
}



function lightDarkModeToggle() {
    let theme = appManager.options.lastUsedTheme || "light-mode";

    let lightIcon = document.querySelector(".light-theme-icon");
    let darkIcon = document.querySelector(".dark-theme-icon");
    
    let html = document.querySelector("html");
    html.setAttribute("data-theme", theme);

    let themeSelector = document.querySelector(".theme-selector");
    themeSelector.setAttribute("theme", theme);

    switch(theme) {
        case("dark-mode"):
            darkIcon.style.display = "none";
            lightIcon.style.display = "block";
            break;
        case("light-mode"):
            lightIcon.style.display = "none";
            darkIcon.style.display = "block";
            break;
    }

    themeSelector.addEventListener("click", function(event) {
        let themeName = "";
        
        if (themeSelector.getAttribute("theme") === "light-mode") {
            themeName = "dark-mode";
        } else {
            themeName = "light-mode"
        }

        switch(themeName) {
            case("dark-mode"):
                darkIcon.style.display = "none";
                lightIcon.style.display = "block";
                break;

            case("light-mode"):
                lightIcon.style.display = "none";
                darkIcon.style.display = "block";
                break;
        }

        let listNamesWrapper = document.querySelector(".menu__todo-list");
        listNamesWrapper.classList.add("no-transition");

        listNamesWrapper.offsetHeight;

        html.dataset.theme = themeName;
        themeSelector.setAttribute("theme", themeName);
        appManager.rememberLastUsedTheme(themeName);


        listNamesWrapper.classList.remove("no-transition");
    })
}