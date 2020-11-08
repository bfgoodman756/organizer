let menu = document.querySelector('.menu');
let menuCloseButton = document.querySelector(".menu__controls");

// let toDoListApp = document.querySelector('.menu__todo-list');
// let timerApp = document.querySelector('.menu__timer');
// let calendarApp = document.querySelector('.menu__calendar');
// let converterApp = document.querySelector('.menu__converter');

menuCloseButton.addEventListener("click", function(event) {
    let menuState = menuCloseButton.dataset.menuState;
    menuState === "opened" ? menuState = "close" : menuState = "open";
    menuSwitcher(menuState);
})
// setTimeout(()=> {document.querySelector("body").removeAttribute("class")}, 280)

menu.addEventListener("click", function(event) {
    let node = getNode(event);
    let start = Date.now();
    if (!node || event.target.className === "menu__list-settings--controls remove-list") {
        return;
    }

    if (node.dataset.type === "menu_list-create") {
        menuCreateNewTaskList(node);
        return;
    }
    
    if (node.tagName === "BUTTON" && node.dataset.status === "changingName") {
       console.log("waiting for input");
       return;
    }

    let menuAppName = node.closest(".menu__tab").dataset.menuAppName;

    if (node.classList.contains("menu__sub-item") && menuAppName === "ToDoList") {
        renderTaskList(node.firstChild.innerText);
        
        let end = Date.now();
        console.log(`[click: ${end-start}ms]`)
        return;

    } else if (node.classList.contains("menu__sub-item") && menuAppName === "Drift") {
        let existTable = document.querySelector("[data-season-year]");
        let currentYear = existTable ? +existTable.dataset.seasonYear : 2020;
        let selectedYear = +node.firstChild.innerText;
        
        if (currentYear === selectedYear) {
            return
        } else {
            renderResultsTable( null , selectedYear)

            let end = Date.now();
            let div = document.createElement("div");
            div.style.position = "fixed";
            div.style.fontSize = "50px";
            div.style.color = "blue";
            div.style.zIndex = "100";
            div.style.top = "0";
            div.innerText = `${end-start}ms`;
            setTimeout(()=> div.remove(), 800)
            document.body.append(div);
            
            console.log(`[click: ${end-start}ms]`);
        }
    }
    
    let selectedAppName = node.dataset.menuAppName;

    if (!selectedAppName) {
        selectedAppName = node.closest(".menu__tab").dataset.menuAppName
    }    
 
    appManager.rememberLastUsedApp(selectedAppName);

    if (event.target.classList.contains("menu__tab") ||
        event.target.classList.contains("menu__tab-header")) {
        showActiveAppOnMenu(selectedAppName);
    }

    function getNode(event) {
        let path = event.composedPath();
        for (let item of path) {
            if (item === document || item === window) {
                continue;
            } else if (item.tagName === "INPUT") {
                return;
            
            } else if (item.dataset.type === "menu_list-settings") {
                return;
            
            } else if (item.dataset.type === "menu_list-create"){
                return item;
            
            } else if (item.dataset.type === "menu_sub-item") {
                return item;
            
            } else if (item.classList.contains("menu__tab")) {
                return item;
            }
        }
    }
});



function menuSwitcher(menuOperation = "loadLastMenuState") {
    let menu = document.querySelector(".menu");
    let menuSpacer = document.querySelector("[class^=menu__space-holder]");
    let button = document.querySelector(".menu__controls");

    let openButton = document.querySelector(".menu__controls--open-button");
    let closeButton = document.querySelector(".menu__controls--close-button");

    let menuRect = menu.getBoundingClientRect();

    if (menuOperation === "loadLastMenuState") {
        appManager.options.lastMenuState === "opened" ? menuOperation = "open" : menuOperation = "close";
    }

    switch(menuOperation) {
        //close if opened
        case("close"):
            button.dataset.menuState = "closed";
            closeButton.style.display = "none";
            openButton.style.display = "block";
            menu.style.left = `-${menuRect.width}px`;
            button.style.left = "0px";
            menuSpacer.className = "menu__space-holder--closed";

            appManager.options.lastMenuState = "closed";
            appManager.saveToLocalStorage();
            break;

        //open if closed
        case("open"):
            if (button.dataset.menuState !== "open") {
                appManager.saveToLocalStorage();
            }
            button.dataset.menuState = "opened";
            closeButton.style.display = "block";
            openButton.style.display = "none";
            menu.style.left = "0px";
            button.removeAttribute("style");
            menuSpacer.className = "menu__space-holder";

            appManager.options.lastMenuState = "opened";
            appManager.saveToLocalStorage();
            break;
    }
}




function showActiveAppOnMenu(appName) {
    let menuTabs = document.querySelectorAll('[data-menu-app-name]');

    activateTab(menuTabs, appName);

    switch(appName) {
        case("Mainpage"):
            appPlaceholder.classList.add("active-app");
            break;
        
        case("ToDoList"):
            createMenuSubItems(".menu__todo-list", getListNamesFromTaskManager());
            break;
        
        case("Drift"):
            let lastUsedMenuItem = appManager.options.lastUsedDriftYear || 2020;
            
            createMenuSubItems(".menu__drift", [2017, 2018, 2019, 2020]);
            
            highlightMenuSubItem(lastUsedMenuItem)
            
            renderResultsTable( null , lastUsedMenuItem)
            break;
        
        default:
            removeMenuSubItems();
            break;

    }
    
    
//     loadListNamesToMenu(); 

    function activateTab(tabs, appName) {
        tabs.forEach(tab => {
             //show main page active if we click on currently active tab
            if (tab.dataset.menuAppName === appName && tab.classList.contains('active-tab')) {
                tab.classList.remove('active-tab');
                tabs[0].classList.add('active-tab');
                appManager.rememberLastUsedApp("MainPage");
                activateAppsContent("MainPage");
                return;
            }

            //show tab as active if it was not active before
            if (tab.dataset.menuAppName === appName && !tab.classList.contains('active-tab')) {
                tab.classList.add('active-tab');
                activateAppsContent(appName);
                console.log(`tab ${tab.innerText} is active now`);
            } else {
                tab.classList.remove('active-tab');
            }  
        });
    }
}

function removeMenuSubItems() {
    let menuSubItems = document.querySelectorAll(".menu__sub-items_container");
    Array.from(menuSubItems).forEach(item => item.remove());
}


function activateAppsContent(selectedAppName) {    
    let apps = document.querySelectorAll('[data-app-name]');

    apps.forEach(item => {
        if (item.dataset.appName === selectedAppName) {
            item.classList.add('active-app');
            item.classList.remove('inactive-app');

        } else {
            item.classList.add('inactive-app');
            item.classList.remove('active-app');
        }
    });

    let app = document.querySelector('.active-tab');
    
    let appName = "";
    if (!app) {
        appName = "MainPage";
    } else {
        appName = app.dataset.menuAppName;
    }
    
//     switch(appName) {
//         case("Mainpage"):
//             appPlaceholder.classList.add("active-app");
//             break;
//         case("ToDoList"):
//             let lastUsedMenuItem = appManager.options.lastUsedMenuSubCategory;
//             createTable(lastUsedMenuItem,"rdsGp");
//             break;
//         case("Timer"):
//             break;
//     }
}


function createMenuSubItems(parentSelector, subItemsArr) {
    let menuItemWrapper = document.querySelector(`${parentSelector}`);
    let subItemsContainer = document.querySelector('.menu__sub-items_container'); //.menu__todo-list-names
    
    if (!menuItemWrapper.classList.contains('active-tab')) {
        if (!subItemsContainer) return;
        
        removeMenuSubItems();
        return;
    }
    
    if (subItemsContainer) {
        removeMenuSubItems();
    }

    subItemsContainer = document.createElement('div');
    subItemsContainer.classList.add('menu__sub-items_container'); //.menu__todo-list-names

    menuItemWrapper.append(subItemsContainer);

    subItemsArr.forEach(list => {
        let listNode = createSubCatergory(list);
        subItemsContainer.append(listNode);
    })
    
    if (parentSelector === ".menu__todo-list") {
        let listNode = createSubCatergory("+", true);
        subItemsContainer.append(listNode);
    }
}

function createSubCatergory(subCatName, isPlusSign = false) {
    let div = document.createElement("div");
    let dataType = "menu_sub-item"; //menu_list-name
    let pClass = "menu__sub-item--header"; //menu__todo-list-name--list-create

    if (isPlusSign) {
        dataType = "menu_list-create";
        pClass = "menu__sub-item--list-create";
    }

    div.dataset.type = dataType;
    div.classList.add("menu__sub-item");
    
    let p = document.createElement("p");
    p.innerText = subCatName;
    p.classList.add(pClass);

    div.append(p);

//     subsContainer.append(div);

    if (subCatName === appManager.options.lastUsedMenuSubCategory) {
        div.classList.add("menu__sub-item--active");
        createMenuListSettings(div);
    }

    return div;
}

function loadListNamesToMenu() {
    let listNamesWrapper = document.querySelector(".menu__todo-list");

    if (!listNamesWrapper.classList.contains('active-tab')) {
        let listNames = document.querySelector('.menu__sub-items_container');
        if (!listNames) return;
        
        document.querySelector('.menu__sub-items_container').remove();
        return;
    }
    

    if (document.querySelector('.menu__sub-items_container')) {
        document.querySelector('.menu__sub-items_container').remove();
    }

    let listNamesData = getListNamesFromTaskManager();
    let listNamesNode = document.createElement('div');
    listNamesNode.classList.add('menu__sub-items_container');

    listNamesWrapper.append(listNamesNode);

    listNamesData.forEach(list => createTaskLinkInMenu(list));
    createTaskLinkInMenu("+", true);


    function createTaskLinkInMenu(listName, isPlusSign = false) {
        let div = document.createElement("div");
        let dataType = "menu_list-name";
        let pClass = "menu__sub-item--header";

        if (isPlusSign) {
            dataType = "menu_list-create";
            pClass = "menu__sub-item--list-create";
        }
        
        div.dataset.type = dataType;
        
        let p = document.createElement("p");
        p.innerText = listName;
        p.classList.add(pClass);

        if (listNamesData.length === 1 && !isPlusSign) {
           div.classList.add("menu__sub-item--active");
        } else {
            div.classList.add("menu__sub-item");
        }
        
        div.append(p);
        
        listNamesNode.append(div);

        if (listName === appManager.options.lastUsedMenuSubCategory) {
            div.classList.add("menu__sub-item--active");
            createMenuListSettings(div);
        }
    }
}




function renderTaskList(listName) {
    let currentListHeader = document.querySelector('.todo__list-name');

    if (listName === currentListHeader.innerText) {
        return;
    }

    if (!taskManager.toDoLists[listName]) {                       
//             alert('there is no any task list with this name ' + listName);
        return;

    }

    if (taskManager.toDoLists[listName]) {
        taskManager.loadList(listName);

        currentListHeader.innerText = listName;
        appManager.rememberLastUsedSubCategory(listName);

        console.log(createConsoleLogMessage(`[${listName}] list was loaded`));
        highlightMenuSubItem(listName);
    }
}



function createMenuListSettings(target) {
    let settingsSelector = "menu__list-settings__button";

    if (target.classList.contains(settingsSelector)) {
        return;
    }

    if (document.querySelector(`.${settingsSelector}`)) {
        document.querySelector(`.${settingsSelector}`).remove();
    }

    let settings = document.querySelector(`.${settingsSelector}`);

    settings = document.createElement("svg");
    settings.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497 103.9H322.6a37.8 37.8 0 00-8-11.9l-27.5-27.5a37.7 37.7 0 00-53.7 0L205.8 92a37.8 37.8 0 00-8 11.9H15a15 15 0 100 30h182.8c1.8 4.3 4.5 8.3 8 11.8l27.6 27.6a37.7 37.7 0 0053.7 0l27.5-27.6c3.5-3.5 6.2-7.5 8-11.8H497a15 15 0 000-30zm-203.6 20.6L265.8 152a7.9 7.9 0 01-11.2 0l-27.5-27.5a8 8 0 010-11.2l27.5-27.6a7.9 7.9 0 0111.2 0l27.6 27.6c3 3 3 8 0 11.2zM497 243H204a38 38 0 00-8-11.8l-27.6-27.6a37.7 37.7 0 00-53.7 0l-27.5 27.6a37.8 37.8 0 00-8 11.8H15a15 15 0 100 30h64.3c1.8 4.3 4.5 8.3 8 11.8l27.5 27.6a37.7 37.7 0 0053.7 0l27.6-27.6a38 38 0 008-11.8H497a15 15 0 100-30zm-322.2 20.6l-27.5 27.6a7.9 7.9 0 01-11.2 0l-27.6-27.6a8 8 0 010-11.2l27.6-27.6a7.9 7.9 0 0111.2 0l27.5 27.6a7.9 7.9 0 010 11.2zM497 378.1h-74.3a37.8 37.8 0 00-8-11.8l-27.5-27.6a37.7 37.7 0 00-53.7 0l-27.6 27.6a37.8 37.8 0 00-8 11.8H15a15 15 0 000 30H298c1.8 4.3 4.5 8.4 8 11.9l27.6 27.5a37.7 37.7 0 0053.7 0l27.5-27.5c3.5-3.5 6.2-7.6 8-11.9H497a15 15 0 100-30zm-103.5 20.6l-27.6 27.6a7.9 7.9 0 01-11.2 0l-27.5-27.6a8 8 0 010-11.2l27.5-27.5a7.9 7.9 0 0111.2 0l27.6 27.5c3 3.1 3 8.1 0 11.2z"/></svg>`;

    settings.classList.add(settingsSelector);
    settings.dataset.type = "menu_list-settings";

    if (target.classList.contains("menu__sub-item--active")) {
        settings.dataset.buttonParentStatus = "active";
    }

    //setTimeout to give DOM extra time to load before calculate offsets
    setTimeout(() => {
        let rect = target.childNodes[0].getBoundingClientRect();
        target.append(settings);

        settings.style.left = target.clientWidth - 36 + "px";
        settings.style.top = rect.top - 150 + menu.scrollTop + (-9) + "px";
    }, 0)

    settings.addEventListener('click', () => openListSettings(target, settings));    


    function calculateOffsets(target) {
        let range = document.createRange();
        range.selectNode(target);

        return range.getBoundingClientRect();
    }

    

    function openListSettings(node, settingsButton) {
        let listName = node.firstChild.innerText;
        
        if (appManager.options.lastUsedMenuSubCategory !== listName) {
            renderTaskList(listName)
        }
        
        if (node.dataset.settingsStatus === "opened") {
            let settingsNode = document.querySelector(".menu__list-settings--wrapper");
            settingsNode.remove();
            
            delete node.dataset.settingsStatus;
            return;
        }

        if (document.querySelector(".menu__list-settings--wrapper")) {
            document.querySelector(".menu__list-settings--wrapper").remove();
            return;
        }
        let settingsNode = document.createElement("div");
        settingsNode.classList.add("menu__list-settings--wrapper");
        
        let settingsHTML = createSettingsHTML(listName);

        settingsNode.innerHTML = settingsHTML;
        
        node.append(settingsNode);
        node.dataset.settingsStatus = "opened";
        
        settingsButton.remove();
        createMenuListSettings(node);

        settingsNode.addEventListener("click", function(event) {
            if (event.target.dataset.buttonType !== "toDoControls") {
                return;
            }

            let listNameHeader = this.previousSibling;
            
            menuListControlsHandler(listNameHeader, event.target.innerText);
         });
    }
}

function createSettingsHTML(listName) {
    let [totalTasks, tasksDone, totalSubTasks, subTasksDone] = taskManager.countListTasks(listName);

    let listCreated = taskManager.toDoLists[listName].options.dateCreated;
    listCreated = getDate(listCreated);

    let settings = `
        <p>tasks total: ${totalTasks}</p>
        <p>tasks done: ${tasksDone}</p>
        <p>tasks undone: ${totalTasks - tasksDone}</p>
        <p>subtasks total: ${totalSubTasks}</p>
        <p>subtasks done: ${subTasksDone}</p>
        <p>subtasks undone: ${totalSubTasks - subTasksDone}</p>
        <p>list created: ${listCreated}</p>
        <div class="menu__list-settings--controls edit-name" data-button-type="toDoControls">edit list name</div>
        <div class="menu__list-settings--controls save-backup" data-button-type="toDoControls">save lists backup</div>
        <div class="menu__list-settings--controls load-backup" data-button-type="toDoControls">load lists backup</div>
        <div class="menu__list-settings--controls remove-list" data-button-type="toDoControls">remove list</div>
    `;

    return settings;
}



function menuListControlsHandler(target, buttonPressed) {
    switch(buttonPressed) {
        
        case("edit list name"):
            let prevListName = target.innerText;
            
            target.setAttribute("contenteditable", "true");
            
            delete target.dataset.status;

            let range = document.createRange();
            let sel = window.getSelection();
            range.setStart(target.childNodes[0], target.childNodes[0].length);
            sel.removeAllRanges();
            sel.addRange(range);
            
            target.focus();

            target.addEventListener("blur", blurListener);

            target.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    target.blur();
                    target.removeAttribute("contenteditable");
                }
            });

            console.log("task is ready to be renamed");
            break;


        case("remove list"):
            taskManager.deleteList(target.innerText);
            
            let closestList = target.closest(".menu__sub-item--active").previousSibling.childNodes[0].innerText;
//                                    closestList.closest(`.menu__sub-item--header`).innerText;
//             let closestList = document.querySelector(`.menu__sub-item--header`).innerText;
            let listContentHeader = document.querySelector(".tasks-header");

            target.parentNode.remove();
            
            listContentHeader = closestList;
            taskManager.loadList(closestList);
            appManager.rememberLastUsedSubCategory(closestList);
            highlightMenuSubItem(closestList);

            console.log(`${target.innerText} was deleted from TaskManager.toDoLists`);
            break;


        case("save lists backup"):
            localStorage.setItem("toDoListsBackup", JSON.stringify(taskManager));
            console.log(createConsoleLogMessage("toDoListsBackup saved to localStorage"));
            break;


        case("load lists backup"):
            loadDataFromLocalStorage(localStorage.getItem("toDoListsBackup"));
            saveCurrentListToLocalStorage();
            console.log(createConsoleLogMessage("toDoListsBackup loaded from localStorage"));
            break;
    }

    function blurListener() {
        let newListName = target.innerText;

        if (newListName === prevListName) {
            target.removeEventListener("blur", blurListener);
            target.removeAttribute("contenteditable");
            return;
        }

        target.removeAttribute("contenteditable");
        target.dataset.status === "changingName";

        taskManager.changeListName(prevListName, newListName);
        appManager.rememberLastUsedSubCategory(newListName);
        target.removeEventListener("blur", blurListener);
    }
}


function highlightMenuSubItem(menuSubItem) {
    let menuLists = document.querySelectorAll("[data-type='menu_sub-item']");

    menuLists.forEach(list => {
        if (list.firstChild.innerText == menuSubItem) {
            list.className = "menu__sub-item--active";
            createMenuListSettings(list);//////////////////////

            let settingsSelector = "menu__list-settings__button";
            if (document.querySelector(`.${settingsSelector}`)) {
                let settings = document.querySelector(`.${settingsSelector}`);
                settings.dataset.buttonParentStatus = "active";
            }
        
        } else {
            list.className = "menu__sub-item";
            
            if (list.dataset.settingsStatus === "opened") {
                delete list.dataset.settingsStatus;
            }
            
            if (document.querySelector(".menu__list-settings--wrapper")) {
                document.querySelector(".menu__list-settings--wrapper").remove();
//                 updateMenuToDoListsHeight();
            }
        }
    })
}



function menuCreateNewTaskList(node) {
    let input = document.createElement('input');
    input.className = "menu__todo-list__create-new-task--input";
    node.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && event.target.value.length > 0) {
            event.target.blur();
        }

        if (event.key === "Enter" && event.target.value.length === 0) {
            alert("list name can't be empty");
        }
    });

    input.addEventListener("blur", function(event) {
        let listName = event.target.value;

        if (!listName) {
            input.replaceWith(node);
            return;
        }

        if (taskManager.toDoLists[listName]) {            
            console.log(createConsoleLogMessage(`[${listName}] name already used. try another one.`));

            let contentZone = document.querySelector(".content-wrapper");

            let inputPlacement = input.getBoundingClientRect();
            let menuLists = document.querySelector('.menu__sub-items_container');

            let popup = document.createElement('div');
            popup.classList.add('task-name__already-used');
            popup.innerHTML = "Task name is already used";

            popup.style.top = inputPlacement.top + 5 + "px";
            popup.style.left = 300 + 10 + "px";
            contentZone.after(popup);
            
            setTimeout(() => {popup.remove()}, 1500);

            return;
        } 

        taskManager.createNewList(listName);
        input.replaceWith(node);

        // сделать так, чтобы див с новым листом возвращался из функции и его можно было засунуть куда угодно
        // вместо того, что оно само вставляет в указанное место внутри функции (677) (283 - функция)
        let createTaskNode = document.querySelector("[data-type='menu_list-create']");
        let newListName = createSubCatergory(listName);
        createTaskNode.before(newListName)
//         createSubCatergory(subItemsContainer, listName);
//         loadListNamesToMenu();
//         updateMenuToDoListsHeight();
        highlightMenuSubItem(listName);
        appManager.rememberLastUsedSubCategory(listName);
    })
}



function getListNamesFromTaskManager(forMenu = false) {
    listsCount = Object.keys(taskManager.toDoLists).length;
    let toDoLists = Object.keys(taskManager.toDoLists);
    toDoLists.sort((a, b) => taskManager.toDoLists[a].options.dateCreated - taskManager.toDoLists[b].options.dateCreated);    
    return toDoLists;
}



function updateMenuToDoListsHeight(extraHeight = 0) {
    let toDoTabWrapper = document.querySelector(".menu__todo-list");
    let listNamesNode = document.querySelector(".menu__sub-items_container");

    let wrapperBasicHeight = 150;

    toDoTabWrapper.style.height = wrapperBasicHeight + listNamesNode.clientHeight + "px";
    updateDropDownPosition();
}



function updateDropDownPosition(extraHeight = 0) {
    let listsTab = document.querySelector(".menu__todo-list");
    let dropdown = document.querySelector(".menu__todo-list-dropdown");
    let namesSection = document.querySelector(".menu__sub-items_container");

    if (listsTab.classList.contains('active-tab')) {
        dropdown.style.top = namesSection.clientHeight + 107 + extraHeight + "px";
        dropdown.classList.add('rotate180');
    
    } else if (!listsTab.classList.contains('active-tab')) {
        dropdown.style.top = "";
        dropdown.classList.remove('rotate180');
        listsTab.style.height = "150px";
    }

    if (dropdown.style.display = "none") {
        dropdown.style.display = "block";
    }   
}