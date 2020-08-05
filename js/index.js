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

createLightDarkModeToggle();

function createLightDarkModeToggle() {
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
        let page = document.querySelector("*");
        html.classList.add("no-transition");
        html.dataset.theme = themeName;
        themeSelector.setAttribute("theme", themeName);
        appManager.rememberLastUsedTheme(themeName);
//         html.classList.remove("no-transition");
    })
}