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


document.addEventListener("DOMContentLoaded", loadLastAppState);

// initializeApp();

lightDarkModeToggle();

function initializeApp() {
    let contentWrapper = document.querySelector(".content-wrapper");
    let lastUsedApp = appManager.options.lastUsedApp;

    switch(lastUsedApp) {
        case("ToDoList"):
            let toDoListTemplate = `
                <div class="todo-list-wrapper" data-app-name="ToDoList">
                    
                    <div class="tasks-section">
                        <p class="tasks-header">
                            <span class="todo__list-name" contenteditable="true" spellcheck="false"></span>:
                        </p>
                        <ol class="tasks-list"></ol>
                    </div>
                    
                    <div class="tasks-input-wrapper">
                        <input class="tasks__input-field" placeholder="add any task"/>
                        <button class="tasks__submit-button">Add task</button>
                    </div>
                    
                    <div class="tasks__control-buttons-wrapper">
                        <button class="tasks__clear-button">Clear tasks</button>
                        <button class="tasks__manual-backup-save-button">Save backup</button>
                        <button class="tasks__manual-backup-restore-button">Load backup</button>
                    </div>
                </div>
            `;
            contentWrapper.innerHTML = toDoListTemplate;
            break;
        case("Timer"):
            break;
        case("Calendar"):
            break;
    }
}


function loadLastAppState() {
    let lastUsedAppName = appManager.options.lastUsedApp;
    activateAppsContent(lastUsedAppName);
    showActiveAppOnMenu(lastUsedAppName);
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