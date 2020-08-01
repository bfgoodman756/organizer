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
    
    let html = document.querySelector("html");
    html.setAttribute("data-theme", theme);

    let input = document.querySelector(".theme-changer");

    if (theme === "dark-mode") {
        input.checked = true;
    } else {
        input.checked = false;
    }

    input.addEventListener("click", function(event) {
        let themeName = "";
        
        if (this.checked) {
            themeName = "dark-mode";
        } else {
            themeName = "light-mode"
        }

        html.dataset.theme = themeName;
        input.dataset.daytimeStatus = themeName;
        appManager.rememberLastUsedTheme(themeName);
    })
}