let menu = document.querySelector('.menu');
let toDoListApp = document.querySelector('.menu__todo-list');
let timerApp = document.querySelector('.menu__timer');
let calendarApp = document.querySelector('.menu__calendar');
let converterApp = document.querySelector('.menu__converter');

document.addEventListener("DOMContentLoaded", loadLastAppState);


function loadLastAppState() {
    let lastUsedAppName = appManager.options.lastUsedApp;
    activateAppsContent(lastUsedAppName);
    showActiveAppOnMenu(lastUsedAppName);
}



menu.addEventListener('click', function(event) {
    let node = getNode(event);

    if (!node) {
        return;
    }
    
    if (event.target.classList.contains("menu__list-settings__button")) {
        return;
    }

//     if (node.tagName === "INPUT") {
//         return;
//     }

    if (node.dataset.type === "menu_list-create") {
        menuCreateNewTaskList(node);
        return;
    }
    
    if (node.tagName === "BUTTON" && node.dataset.status === "changingName") {
       console.log('waiting for input');
       return;
    }

//     if (node.dataset.type === "menu_list-settings") {
//         return;
//     }

    if (node.dataset.type === "menu_list-name") {
        loadTaskListOnClick(node.firstChild.innerText);
        return;
    }


    
    let selectedAppName = node.dataset.appName;    
    
    showActiveAppOnMenu(selectedAppName);
    
    activateAppsContent(selectedAppName);
    
    appManager.rememberLastUsedApp(selectedAppName);


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
            
            } else if (item.dataset.type === "menu_list-name") {
                return item;
            
            } else if (item.classList.contains("menu__tab")) {
                return item;
            }
        }
    }
});



function showActiveAppOnMenu(appName) {    
    let toDoList = document.querySelector('.menu__todo-list');
    let timer = document.querySelector('.menu__timer');
    let calendar = document.querySelector('.menu__calendar');
    let converter = document.querySelector('.menu__converter');
    
    let menuTabs = [toDoList, timer, calendar, converter];
    activateTab(menuTabs, appName);
    
    loadListNamesToMenu();

    function activateTab(arr, appName) {
        arr.forEach(tab => {
            if (tab.dataset.appName === appName && !tab.classList.contains('active-tab')) {
                tab.classList.add('active-tab');
                console.log(`tab ${tab.innerText} is active now`);
            } else {
                tab.classList.remove('active-tab');
            }  
        });
    }
}


function loadListNamesToMenu() {
    let listNamesWrapper = document.querySelector(".menu__todo-list");

    if (!listNamesWrapper.classList.contains('active-tab')) {
        let listNames = document.querySelector('.menu__todo-list-names');
        if (!listNames) return;
        
        document.querySelector('.menu__todo-list-names').remove();
        updateDropDownPosition();
        return;
    }
    

    if (document.querySelector('.menu__todo-list-names')) {
        document.querySelector('.menu__todo-list-names').remove();
        listNamesWrapper.style.removeProperty("height");
    }

    let listNamesData = getListNamesFromTaskManager();
    let listNamesNode = document.createElement('div');
    listNamesNode.classList.add('menu__todo-list-names');

    listNamesData.forEach(list => createTaskLinkInMenu(list));

    createTaskLinkInMenu("+", true);

    listNamesNode.style.top = 100 + "px";
    listNamesWrapper.append(listNamesNode);

    updateDropDownPosition(listNamesNode.clientHeight + 5);
    updateMenuToDoListsHeight();


    function createTaskLinkInMenu(listName, isPlusSign = false) {
        let div = document.createElement("div");
        let dataType = "menu_list-name";
        let pClass = "menu__todo-list-name--header";

        if (isPlusSign) {
            dataType = "menu_list-create";
            pClass = "menu__todo-list-name--list-create";
        }
        
        div.dataset.type = dataType;
        
        let p = document.createElement("p");
        p.innerText = listName;
        p.classList.add(pClass);

        if (listNamesData.length === 1 && !isPlusSign) {
           div.classList.add("menu__todo-list-name--active"); 
        } else {
            div.classList.add("menu__todo-list-name");
        }
        
        div.append(p);
        
        listNamesNode.append(div);
        

//         highlightCurrentList(appManager.options.lastUsedList)

        if (appManager.options.lastUsedList === listName) {
            div.className = "menu__todo-list-name--active";
        }
    }
}



function activateAppsContent(selectedAppName) {    
    let appPlaceholder = document.querySelector('.app-placeholder');
    let toDoList = document.querySelector('.todo-list-wrapper');
    let timer = document.querySelector('.timer-wrapper');
    let calendar = document.querySelector('.calendar-wrapper');
    let converter = document.querySelector('.converter-wrapper');

    let apps = [appPlaceholder, toDoList, timer, calendar, converter];

    apps.forEach(item => {
        if (item.dataset.appName === selectedAppName) {
            item.classList.add('active-app');
            item.classList.remove('inactive-app');

        } else {
            item.classList.add('inactive-app');
            item.classList.remove('active-app');
        }
    });
}



function loadTaskListOnClick(listName) {
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

        currentListHeader.innerHTML = listName;
        appManager.rememberLastUsedList(listName);

        console.log(createConsoleLogMessage(`[${listName}] list was loaded`));
        highlightCurrentList(listName);
    }
}




toDoListApp.addEventListener('mouseover', toDoListMenuHoverSettings);


function toDoListMenuHoverSettings(event) {
    let node = event.target;

    if (event.path[2].dataset.type === "menu_list-name") {
        if (document.querySelector(".menu__list-settings__button")) {
            return;
        }
        node = event.path[2];
    }

    if (event.path[1].dataset.type === "menu_list-name") {
        if (document.querySelector(".menu__list-settings__button")) {
            return;
        }
        node = event.path[1];
    }

    if (document.querySelector(".menu__list-settings__button")) {
        return;
    }

    if (event.target.innerText === "+") {
        return;
    }

    if (!node || node.dataset.type !== "menu_list-name") {
       return;
    }

    node.addEventListener('mouseover', createListSettingsOnHover(node));
}



function createListSettingsOnHover(target) {
    let settingsSelector = "menu__list-settings__button";

    if (target.classList.contains(settingsSelector)) {
        return;
    }

    let settings = document.querySelector(`.${settingsSelector}`);

    settings = document.createElement("svg");
    settings.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M497 103.9H322.6a37.8 37.8 0 00-8-11.9l-27.5-27.5a37.7 37.7 0 00-53.7 0L205.8 92a37.8 37.8 0 00-8 11.9H15a15 15 0 100 30h182.8c1.8 4.3 4.5 8.3 8 11.8l27.6 27.6a37.7 37.7 0 0053.7 0l27.5-27.6c3.5-3.5 6.2-7.5 8-11.8H497a15 15 0 000-30zm-203.6 20.6L265.8 152a7.9 7.9 0 01-11.2 0l-27.5-27.5a8 8 0 010-11.2l27.5-27.6a7.9 7.9 0 0111.2 0l27.6 27.6c3 3 3 8 0 11.2zM497 243H204a38 38 0 00-8-11.8l-27.6-27.6a37.7 37.7 0 00-53.7 0l-27.5 27.6a37.8 37.8 0 00-8 11.8H15a15 15 0 100 30h64.3c1.8 4.3 4.5 8.3 8 11.8l27.5 27.6a37.7 37.7 0 0053.7 0l27.6-27.6a38 38 0 008-11.8H497a15 15 0 100-30zm-322.2 20.6l-27.5 27.6a7.9 7.9 0 01-11.2 0l-27.6-27.6a8 8 0 010-11.2l27.6-27.6a7.9 7.9 0 0111.2 0l27.5 27.6a7.9 7.9 0 010 11.2zM497 378.1h-74.3a37.8 37.8 0 00-8-11.8l-27.5-27.6a37.7 37.7 0 00-53.7 0l-27.6 27.6a37.8 37.8 0 00-8 11.8H15a15 15 0 000 30H298c1.8 4.3 4.5 8.4 8 11.9l27.6 27.5a37.7 37.7 0 0053.7 0l27.5-27.5c3.5-3.5 6.2-7.6 8-11.9H497a15 15 0 100-30zm-103.5 20.6l-27.6 27.6a7.9 7.9 0 01-11.2 0l-27.5-27.6a8 8 0 010-11.2l27.5-27.5a7.9 7.9 0 0111.2 0l27.6 27.5c3 3.1 3 8.1 0 11.2z"/></svg>`;

    settings.classList.add(settingsSelector);
    settings.dataset.type = "menu_list-settings";

    if (target.classList.contains("menu__todo-list-name--active")) {
        settings.dataset.buttonParentStatus = "active";
    }
    
    let rect = calculateOffsets(target.childNodes[0]);
    target.append(settings);

    settings.style.left = target.clientWidth - 36 + "px";
    settings.style.top = rect.top - 250 + menu.scrollTop - 1 + "px";

    target.addEventListener('mouseleave', removeSettingsIcon);

    function removeSettingsIcon() {
        settings.remove();
        target.removeEventListener('mouseleave', removeSettingsIcon);
    }

    settings.addEventListener('click', () => openListSettings(target, settings));    


    function calculateOffsets(target) {
        let range = document.createRange();
        range.selectNode(target);

        return range.getBoundingClientRect();
    }

    

    function openListSettings(node, settingsButton) {
        let listName = node.firstChild.innerText;
        
        if (appManager.options.lastUsedList !== listName) {
            loadTaskListOnClick(listName)
        }
        
        if (node.dataset.settingsStatus === "opened") {
            let settingsNode = document.querySelector(".menu__list-settings--wrapper");
            settingsNode.remove();
            
            delete node.dataset.settingsStatus;
            
            updateMenuToDoListsHeight();
            return;
        }

        if (document.querySelector(".menu__list-settings--wrapper")) {
            document.querySelector(".menu__list-settings--wrapper").remove();
            return;
        }
        
        let [totalTasks, tasksDone] = taskManager.countListTasks(listName);
        
        let listCreated = taskManager.toDoLists[listName].options.dateCreated;
        listCreated = getDate(listCreated);
        

        let sWrapper = document.createElement("div");
        sWrapper.classList.add("menu__list-settings--wrapper");

        let settings = `
            <p>tasks count: ${totalTasks}</p>
            <p>tasks done: ${tasksDone}</p>
            <p>tasks undone: ${totalTasks - tasksDone}</p>
            <p>list created: ${listCreated}</p>
            <div class="menu__list-settings--controls edit-name" data-button-type="toDoControls">edit list name</div>
            <div class="menu__list-settings--controls save-backup" data-button-type="toDoControls">save lists backup</div>
            <div class="menu__list-settings--controls load-backup" data-button-type="toDoControls">load lists backup</div>
            <div class="menu__list-settings--controls remove-list data-button-type="toDoControls">remove list</div>
        `;

        sWrapper.innerHTML += settings;
        node.dataset.settingsStatus = "opened";

        node.append(sWrapper);

        updateMenuToDoListsHeight(sWrapper.clientHeight + 15);
        
        settingsButton.remove();
        createListSettingsOnHover(node);

//         sWrapper.addEventListener("blur", function() {
//             sWrapper.remove();
//         })

        sWrapper.addEventListener("click", function(event) {
            if (event.target.dataset.buttonType !== "toDoControls") {
                return;
            }

            let listNameHeader = this.previousSibling;
            
            menuListControlsHandler(listNameHeader, event.target.innerText);
            });
    }
}



function menuListControlsHandler(target, buttonPressed) {
    switch(buttonPressed) {
        
        case("edit list name"):
            let prevListName = target.innerText;
            
            target.setAttribute("contenteditable", "true");
            
            delete target.dataset.status;
            
            target.focus();
            target.selectionEnd = target.innerText.length;

            target.addEventListener("blur", blurListener);

            target.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    target.blur();
                    target.removeAttribute("contenteditable");
                }
            });

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
                appManager.rememberLastUsedList(newListName);
                target.removeEventListener("blur", blurListener);
            }

            console.log("task is ready to be renamed");
            break;

        case("remove list"):
            taskManager.deleteList(target.innerText);

            loadListNamesToMenu();
            updateMenuToDoListsHeight();

            let firstList = document.querySelector(".menu__todo-list-name").innerText;

            taskManager.loadList(firstList);
            appManager.rememberLastUsedList(firstList);
            highlightCurrentList(firstList);

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
}


function highlightCurrentList(listName) {
    let menuLists = document.querySelectorAll("[data-type='menu_list-name']");

    menuLists.forEach(list => {
        if (list.firstChild.innerText === listName) {
            list.className = "menu__todo-list-name--active";

            let settingsSelector = "menu__list-settings__button";
            if (document.querySelector(`.${settingsSelector}`)) {
                let settings = document.querySelector(`.${settingsSelector}`);
                settings.dataset.buttonParentStatus = "active";
            }
        
        } else {
            list.className = "menu__todo-list-name";
            
            if (list.dataset.settingsStatus === "opened") {
                delete list.dataset.settingsStatus;
            }
            
            if (document.querySelector(".menu__list-settings--wrapper")) {
                document.querySelector(".menu__list-settings--wrapper").remove();
                updateMenuToDoListsHeight();
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

            let inputPlacement = input.getBoundingClientRect();
            let menuLists = document.querySelector('.menu__todo-list-names');

            let popup = document.createElement('div');
            popup.classList.add('task-name__already-used');
            popup.innerHTML = "! Task name is already used !";

            popup.style.top = menuLists.clientHeight - inputPlacement.height - 2 + "px";
            popup.style.left = inputPlacement.left + inputPlacement.width + 25 + "px";
            input.after(popup);
            return;
        } 

        taskManager.createNewList(listName);
        input.replaceWith(node);
        loadListNamesToMenu();
        updateMenuToDoListsHeight();
        highlightCurrentList(listName);
        appManager.rememberLastUsedList(listName);
    })
}



function getListNamesFromTaskManager() {
    listsCount = Object.keys(taskManager.toDoLists).length;
    let toDoLists = Object.keys(taskManager.toDoLists);
    toDoLists.sort((a, b) => taskManager.toDoLists[a].options.dateCreated - taskManager.toDoLists[b].options.dateCreated);
//     let listsArray = [];

//     for (let list in taskManager.toDoLists) {
//         listsArray.push(list);
//     }
    return toDoLists;
}



function updateMenuToDoListsHeight(extraHeight = 0) {
    let toDoTabWrapper = document.querySelector(".menu__todo-list");
    let listNamesNode = document.querySelector(".menu__todo-list-names");

    let wrapperBasicHeight = 150;

    toDoTabWrapper.style.height = wrapperBasicHeight + listNamesNode.clientHeight + "px";
    updateDropDownPosition();
}



function updateDropDownPosition(extraHeight = 0) {
    let listsTab = document.querySelector(".menu__todo-list");
    let dropdown = document.querySelector(".menu__todo-list-dropdown");
    let namesSection = document.querySelector(".menu__todo-list-names");

    if (listsTab.classList.contains('active-tab')) {
        dropdown.style.top = namesSection.clientHeight + 107 + extraHeight + "px";
        dropdown.classList.add('rotate180');
    
    } else if (!listsTab.classList.contains('active-tab')) {
        dropdown.style.top = "";
        dropdown.classList.remove('rotate180');
        listsTab.style.height = "150px";
    }    
}