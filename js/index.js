
// let scripts = ["menu", "todoList", "drift", "timer", "calendar", "converter"];
// let scripts = ["menu", "todoList", "drift"];
// insertScript(scripts);

// function insertScript(scripts) {
//     let body = document.querySelector("body");
//     scripts.forEach(scirpt => {
//         let node = document.createElement("script"); 
//         node.src  = `js/${scirpt}/${scirpt}.js`;
//         body.append(node);
//     });
//     //     node.type = 'text/javascript'; 
//     //     node.defer = true; 
// }


let mainWrapper = document.querySelector(".main-wrapper");

let appManager = {
    options: {},

    rememberLastUsedSubCategory: function(SubCategory) {
        if (!this.options.lastUsedMenuSubCategory) {
            this.options.lastUsedMenuSubCategory = {};
        }
        
        this.options.lastUsedMenuSubCategory = SubCategory;
        localStorage.setItem("appManager", JSON.stringify(this));
        console.log(`[${SubCategory}] is last used list now`);
    },

    rememberLastUsedDriftYear: function(year) {
        if (!this.options.lastUsedDriftYear) {
            this.options.lastUsedDriftYear = {};
        }
        
        this.options.lastUsedDriftYear = year;
        localStorage.setItem("appManager", JSON.stringify(this));
        console.log(`[${year}] is last used list now`);
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
    },

    saveToLocalStorage: function() {
        localStorage.setItem("appManager", JSON.stringify(appManager));
        console.log("appManager saved to localStorage");
    }
};

if (!localStorage.getItem("appManager")) {
    localStorage.setItem("appManager", JSON.stringify(appManager));
}

let appData = JSON.parse(localStorage.appManager);
appManager.options = Object.assign(appData.options);
console.log("app options data was loaded from {localStorage.appManager}");


document.addEventListener("DOMContentLoaded", loadLastAppState);


lightDarkModeToggle();

function loadLastAppState() {
    let lastUsedAppName = appManager.options.lastUsedApp;
    showActiveAppOnMenu(lastUsedAppName);
    activateAppsContent(lastUsedAppName);
    menuSwitcher();
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

    themeSelector.addEventListener("click", function() {
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

        html.dataset.theme = themeName;
        themeSelector.setAttribute("theme", themeName);
        appManager.rememberLastUsedTheme(themeName);
    })
}