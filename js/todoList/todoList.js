const toDoListWrapper = document.querySelector('.todo-list-wrapper');
const tasksList = document.querySelector('.tasks-list');
const taskInput = document.querySelector('.tasks__input-field');

let currentListName = appManager.options.lastUsedList;

console.log(createConsoleLogMessage("toDoList.js initialized"));

let taskManager = {
    toDoLists: {},

    loadList: function(listName) {
        let listHeader = document.querySelector('.todo__list-name');
        listHeader.innerText = listName;
        
        clearOnlyDOMList();
        
        currentListName = listName;
        
        if (!this.toDoLists[listName].tasks) {
            this.toDoLists[listName].tasks = {};
        }
        renderList(this.toDoLists[listName].tasks);
        bottomControlsAppearance();
    },

    createNewList: function(listName) {
        this.toDoLists[listName] = {};
        this.toDoLists[listName].tasks = {};
        this.setListOptions(listName);

        saveCurrentListToLocalStorage();
        this.loadList(listName);

        console.log(createConsoleLogMessage(`[${listName}] list was created`));
    },

    setListOptions: function(list) {
        if (!this.toDoLists[list].options) {
            this.toDoLists[list].options = {};
        }
        let options = {};
        options.dateCreated = Date.now();
        options.order = Object.keys(this.toDoLists).length + 1;
        this.toDoLists[list].options = options;
    },
    
    
    createNewTask: function(list, taskStr, isDone = false, priority = "unset") {
        if (!this.toDoLists) {
            this.toDoLists = {};
        }

        if (!this.toDoLists[list]) {
             this.toDoLists[list] = {};
        }

        if (!this.toDoLists[list].tasks) {
            this.toDoLists[list].tasks = {};
        }
        let taskIndex = Object.keys(this.toDoLists[list].tasks).length + 1;

        let taskObj = {};
        taskObj.taskName = taskStr;
        taskObj.isDone = isDone;
        taskObj.priority = priority;
//      taskObj.order = taskIndex;

        this.toDoLists[list].tasks[taskIndex] = taskObj;
    },


    clearListTasks: function(list) {
        if(!this.toDoLists[list].tasks) {
            return;
        }
        delete this.toDoLists[list].tasks;
        console.log(createConsoleLogMessage(`toDoLists[${[list]}].tasks was deleted`));
    },


    saveBackup: function(list, backupType = "autoBackup") {
        if (backupType !== "autoBackup") {
            backupType = "manualBackup";
        }
        
        if (!this.toDoLists[list][backupType]) {
            this.toDoLists[list][backupType] = {};
        }

        if (JSON.stringify(this.toDoLists[list][backupType]) === JSON.stringify(this.toDoLists[list].tasks)) {
            console.log(createConsoleLogMessage(`${backupType} is already equal to current [${list}]`));
            return;
        }
        
        this.toDoLists[list][backupType] = Object.assign({}, this.toDoLists[list].tasks);

        console.log(createConsoleLogMessage(`${backupType} was updated for [${list}]`));
        saveCurrentListToLocalStorage();
    },


    loadBackup: function(list, backupType = "autoBackup") {
        if (backupType !== "autoBackup") {
            backupType = "manualBackup";
        }

        if (!this.toDoLists[list].autoBackup) {
            backupType = "manualBackup";
        }

        if (!this.toDoLists[list].manualBackup) {
            backupType = "autoBackup";
        }
        
        //do nothing if currrent list state is equal to backup
        if (JSON.stringify(this.toDoLists[list].tasks) === JSON.stringify(this.toDoLists[list][backupType])) {
            console.log(createConsoleLogMessage(`${backupType} is already equal to current state to [${list}]`));
            return;
        }
        
        if (!this.toDoLists[list].autoBackup && !this.toDoLists[list].manualBackup) {
            console.log(createConsoleLogMessage(`there are no backups for [${list}]`));
            return;
        }

        let currentTasks = getCurrentTasksFromDOM();
        currentTasks.forEach(li => li.remove());
        
        this.toDoLists[list].tasks = Object.assign({}, this.toDoLists[list][backupType]);
        
        renderList(this.toDoLists[list].tasks);
        
        removeRestoreButton();


        saveCurrentListToLocalStorage();
        console.log(createConsoleLogMessage(`${backupType} was loaded for [${list}]`));
    },


    changeListName: function(prevName, newName) {
        if (prevName === newName) {
            console.log(createConsoleLogMessage("Changing list name was aborted, new name is already equal to current"));
            return;
        }
        let obj = Object.assign({}, this.toDoLists[prevName]);

        if (obj === {}) {
            console.log("wtf");
        }

        let listHeader = document.querySelector('.todo__list-name');
        listHeader.innerText = newName;

        let menuListName = document.querySelector(".menu__todo-list-name--active").firstChild;
        menuListName.innerText = newName;

        delete this.toDoLists[prevName];
        this.toDoLists[newName] = Object.assign({}, obj);
        appManager.rememberLastUsedList(newName);
        saveCurrentListToLocalStorage();
    },

    deleteList: function(listName) {
        delete this.toDoLists[listName];
        saveCurrentListToLocalStorage();
    },

    countListTasks: function(listName) {
        if (!this.toDoLists[listName].tasks) {
            this.toDoLists[listName].tasks = {};
        }
        let tasks = Object.assign(this.toDoLists[listName].tasks);
        let tasksArr = Object.keys(this.toDoLists[listName].tasks);
        let totalTasks = tasksArr.length;
        let tasksDone =  0;

        for (let task in tasks) {
            if (tasks[task].isDone === true) {
                tasksDone++;
            }
        }

        return [totalTasks, tasksDone];
    }
};



tasksList.addEventListener('mouseover', function(event){
    let elem = event.target;

    if (elem.tagName !== "LI") return;

    let doneStatus = "notDone";

    if (elem.classList.contains('task-is-done')) {
        doneStatus = "done";
    }
    createOptionButtonsOnHover(elem, "tasks__remove-task-button", "remove");
    createOptionButtonsOnHover(elem, "tasks__mark-as-done-button", doneStatus);
    createOptionButtonsOnHover(elem, "tasks__create-subtree-button", "create subtree");
});

tasksList.addEventListener('mouseleave', removeTaskControlButtons);



// Listens click and delegates it to next functions: "Add task", "Clear task" or "Restore list".
toDoListWrapper.addEventListener('click', function(event) {
    clickListener(event);
});




// Adds posiblity to submit new task by "enter" key from the input
taskInput.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;
    renderTask(event.target.value, true);
});




currentListName = appManager.options.lastUsedList;

if (!currentListName) {
    currentListName = "Your first list";
    taskManager.createNewList(currentListName);
    highlightCurrentList(currentListName);
    appManager.rememberLastUsedList(currentListName);
}




let listHeader = document.querySelector(".todo__list-name");
listHeader.innerText = currentListName;

listHeader.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        this.blur();
    }
});

listHeader.addEventListener("blur", editCurrentListName);




loadDataFromLocalStorage(localStorage.getItem("toDoLists"));




// Loads saved localStorage data
function loadDataFromLocalStorage(JsonData) {
    if (JsonData === "{}") {
        JsonData = "";
    }
    
    if (!JsonData) {
        createRestoreButton(JsonData);
        return;
    }
    let obj = JSON.parse(JsonData);
    taskManager.toDoLists = Object.assign(obj.toDoLists);
    console.log(createConsoleLogMessage("taskManager data was loaded from {localStorage.toDoLists}"));

//     //create restore button if there is no tasks key for current list or if there are less tasks than 1
//     if (!obj.toDoLists[currentListName].tasks || Object.keys(obj.toDoLists[currentListName].tasks).length === 0) {
//         createRestoreButton();
//         return;
//     }

    //create restore button if there is no tasks key for current list or if there are less tasks than 1
    if (!taskManager.toDoLists[currentListName].tasks || Object.keys(taskManager.toDoLists[currentListName].tasks).length === 0) {
        createRestoreButton();
        return;
    }
    renderList(taskManager.toDoLists[currentListName].tasks); 
}


function editCurrentListName() {
    let newName = this.innerText;
    
    if (currentListName === newName) {
        return;
    }

    taskManager.changeListName(currentListName, newName);

    if (!taskManager.toDoLists[newName].options) {
        taskManager.setListOptions(newName);
    }

    appManager.rememberLastUsedList(newName);
    loadListNamesToMenu();

    currentListName = newName;
}




function renderList(tasksData) {
    let tasksDataLength = null;

    if (Object.keys(tasksData)) {
        tasksDataLength = Object.keys(tasksData).length;
    }
    
    if (!tasksDataLength) {
        createTasksPlaceholder();
        return;
    }

    let totalTasks = Object.keys(tasksData).length;

    if (totalTasks < 1) {
        createTasksPlaceholder();
        bottomControlsAppearance();
        return;
    }

    let startIndex = 1;
    while (startIndex <= totalTasks) {
        renderTask(tasksData[startIndex].taskName, false, tasksData[startIndex].isDone);
        startIndex++;
    }
    bottomControlsAppearance();
}




// Renders task by input, submits or from localStorage
function renderTask(string, isNew = false, isDone = false) {
    if (!string && string !== "")
        return;

    let taskPlaceholder = document.querySelector(".tasks-placeholder");

    if (taskPlaceholder) {
        taskPlaceholder.remove();
        bottomControlsAppearance();
    }


    let newTaskElem = document.createElement("li");
    newTaskElem.innerText = string;
    newTaskElem.setAttribute("contenteditable","true");
    newTaskElem.setAttribute("spellcheck", false);
    
    tasksList.append(newTaskElem);

    resetInputFieldAfterSubmit(string);
    
    if (isDone) newTaskElem.classList.add('task-is-done');
    
    if (isNew) {
        taskManager.createNewTask(currentListName, string, isDone);
        
        console.log(createConsoleLogMessage(`new task "${string}" for "${currentListName}" was succesfully created`));
        
        saveCurrentListToLocalStorage();
    }
}



function clickListener(event) {
    let elem = event.target;
    
    if (elem.tagName !== "BUTTON" && elem.tagName !== "LI" && elem.className !== "tasks-placeholder")
        return;
    
    if (elem.className === "tasks-placeholder")
        return;

    let actionType = elem.innerHTML;
    let taskString = taskInput.value;

    if (elem.tagName === "LI") {
        actionType = "Edit elements innerHTML";
    }
    
    switch (actionType) {
        case ("Add task"):
            renderTask(taskString, true);
            if (taskString) {
                removeRestoreButton();
            }
            break;

        case ("Clear tasks"):
            let ask = confirm("Are you really want to clear all your tasks?");
            if (!ask) return;

            bottomControlsAppearance();
            clearTaskList();
            break;


        case ("Restore autosaved list"):
            backupManager("loadBackup", "autoBackup");
            createConsoleLogMessage("Last task list was restored");
            controls.removeAttribute("style");
            break;


        case ("Save backup"):
            backupManager("saveBackup");
            bottomControlsAppearance()
            break;


        case ("Load backup"):
            backupManager("loadBackup");
            break;

        case ("Edit elements innerHTML"):
            editElementsInnerHTML(event.target);
            break;
    }
}


// Reset task list by clear button.
function clearTaskList() {
    let curListName = currentListName;
    if (document.querySelector('.tasks-placeholder')) {
        console.log(createConsoleLogMessage('list is already empty'));
        return;    
    }


    if (taskManager.toDoLists[curListName]) {
        taskManager.saveBackup(curListName, "autoBackup");
        taskManager.clearListTasks(curListName);

        saveCurrentListToLocalStorage();
    }

    let currentTasks = getCurrentTasksFromDOM();
    currentTasks.forEach(item => item.remove());

    createRestoreButton();
    bottomControlsAppearance();

    console.log(createConsoleLogMessage("task list was cleared"));
}




function saveCurrentListToLocalStorage() {    
    localStorage.setItem("toDoLists", JSON.stringify(taskManager));
    
    console.log(createConsoleLogMessage(`{localStorage.toDoLists} was succesfully updated`));
}




function backupManager(saveOrLoad = null, backupType = "manualBackup") {
    if (!saveOrLoad) return;
    
    if (backupType !== "manualBackup") {
        backupType = "autoBackup";
    }

    if (saveOrLoad === "saveBackup") {
        taskManager.saveBackup(currentListName, backupType);
        bottomControlsAppearance()
    
    } else if (saveOrLoad === "loadBackup") {
        taskManager.loadBackup(currentListName, backupType);

        let restoreButton = document.querySelector('.tasks__restore-button');

        if (restoreButton) {
            restoreButton.remove();
        }
    }
}




// Edit li task-element on click
function editElementsInnerHTML(element) {
    let prevValue = element.innerHTML;

    element.setAttribute("spellcheck", true);

    element.addEventListener('keydown', keydownListener);

    element.addEventListener("blur", submitOnBlur);


    function keydownListener(event) {
        if (event.key === "Enter") {
            event.target.blur();
        }
        
        if (event.key === "Escape") {
            event.target.blur();
        }
    }


    function submitOnBlur() {
        element.removeEventListener('keydown', keydownListener);
        element.removeEventListener("blur", submitOnBlur);

        if (element.innerHTML === prevValue) {
            element.setAttribute("spellcheck", false);
            element.innerHTML = prevValue; //to reset done spellcheck after blur
            console.log(createConsoleLogMessage("task value has not changed"));
            return;
        }
        

        element.dataset.status = "processing";

        let taskData = getElementIndexAndValueFromObject(element);
        let [taskIndex, taskValue] = taskData;

        taskManager.toDoLists[currentListName].tasks[taskIndex].taskName = taskValue;
        console.log(createConsoleLogMessage(`Task #${taskIndex} was edited`));
        
        saveCurrentListToLocalStorage();

        element.setAttribute("spellcheck", false);
        element.innerHTML = taskValue;
    }
}



// Remove restore button from the DOM.
function removeRestoreButton() {
    let restoreButton = document.querySelector('.tasks__restore-button');

    if (!restoreButton) return;
    
    restoreButton.remove();
}


function createSubTree() {

}

function createSubTreeButton() {
    createButton("tasks__subtree-button", "Create subtree");
}



function createOptionButtonsOnHover(target, buttonSelector, buttonName, buttonDataset) {    
    let existButton = document.querySelector(`.${buttonSelector}`);
    let button = null;
    
    if (document.querySelector('.tasks-edit') || target.className === "tasks-placeholder") {
        return;
    }
    
    if (existButton) {
        if (existButton.previousSibling === target) {
            return;
        } else {
            existButton.remove();
        }
    }

    if (buttonSelector === "tasks__mark-as-done-button") {
        button = createButton(buttonSelector, buttonName, "input");
    } else {
        button = createButton(buttonSelector, buttonName);
    }
    

    target.after(button);

    let targetCoords = target.getBoundingClientRect();
    let taskSection = document.querySelector(".tasks-section");
    
    if (buttonName === "remove") {
        button.innerText ="X";
        button.style.top = target.offsetTop + "px";
        button.style.left = taskSection.clientWidth - button.clientWidth + "px";

        button.addEventListener("mouseover", function() {
            target.classList.add("tasks-list--removing");
        });
        
        button.addEventListener("mouseleave", function() {
            target.classList.remove("tasks-list--removing");
        });
    
    
    } else if (buttonName === "done" || buttonName === "notDone"){
        
        if (buttonName === "done") {
            button.checked = true;
        } else {
            button.checked = false;
        }

        if (target) {

        }

        button.dataset.taskStatus = buttonName;
        button.style.top = target.offsetTop + 5 + "px";
        button.style.left = "-10px";       
    
    } else {

    }
    


    button.addEventListener("click", function() {
        
        if (button.dataset.taskStatus === "done" || button.dataset.taskStatus === "notDone") {
            target.dataset.status = "processing";
            buttonName = "done/notDone";
        }

        switch(buttonName) {
            case("remove"):
                removeOnClick(target);
                break;

            case("done/notDone"):
                markAsDoneOnClick(target);
                break;
            
            case("create subtree"):
                
                break;
        }
    });



    function markAsDoneOnClick(element, button) {
        element.classList.toggle("task-is-done");
        storeNewDataToList(element);   
    }



    function removeOnClick(element) {
        element.dataset.status = "processing";
        storeNewDataToList(element, "remove");
        element.remove();
        console.log(createConsoleLogMessage(`Task "${element.innerHTML}" was removed`));

        document.querySelector('.tasks__remove-task-button').remove();
        document.querySelector('.tasks__mark-as-done-button').remove();
        document.querySelector('.tasks__create-subtree-button').remove();

        let currentTasks = getCurrentTasksFromDOM();
        
        if (currentTasks.length === 0) {
            createTasksPlaceholder();
        }

        saveCurrentListToLocalStorage();
    }
}



function storeNewDataToList(node, ifRemoving = false, priority = "unset") {
    let taskData = getElementIndexAndValueFromObject(node);
    let taskIndex = taskData[0];
    let taskValue = taskData[1];

    let currentTask = taskManager.toDoLists[currentListName].tasks[taskIndex];

    if (ifRemoving) {
        removeTaskFromDataAndUpdateIndexes(taskIndex);
        return;
    }

    let isTaskDone = checkIfIsDone(node);

    if (currentTask.taskName === taskValue && currentTask.isDone !== isTaskDone) {
        currentTask.isDone = isTaskDone;

        if (isTaskDone === true) {
            isTaskDone = "done";
        } else {
            isTaskDone = "undone";
        }
        console.log(createConsoleLogMessage(`Task "${taskValue}" was marked as ${isTaskDone}`));
    }

    if (currentTask.taskName !== taskValue) {
        currentTask.taskName = taskValue;
    }

    saveCurrentListToLocalStorage();


    function removeTaskFromDataAndUpdateIndexes(taskIndex) {
        let totalTasks = Object.keys(taskManager.toDoLists[currentListName].tasks).length;

        delete taskManager.toDoLists[currentListName].tasks[taskIndex];

        if (taskIndex === totalTasks) {
            return;
        }

        for (let i = taskIndex; i <= totalTasks; i++) {
            taskManager.toDoLists[currentListName].tasks[i] = taskManager.toDoLists[currentListName].tasks[i+1];

            if (i === totalTasks) {
                delete taskManager.toDoLists[currentListName].tasks[totalTasks]
            }
        }
    }


    function checkIfIsDone(node) {
        let isTaskDone = false;

        if (node.classList.contains('task-is-done')) {
            isTaskDone = true;
        }
        return isTaskDone;
    } 
}




function getElementIndexAndValueFromObject(node) {
    let currentTasks = getCurrentTasksFromDOM();
    
    let liIndex = 0;
    let liValue = node.innerHTML;
    
    let itemCounter = 0;
    
    currentTasks.forEach(item => {
        if (item.tagName === "LI") {
            
            if (item.dataset.status === node.dataset.status) {
                liIndex = itemCounter;
            }
            
            itemCounter++; 
        }
    });
    delete node.dataset.status;
    return [liIndex + 1, liValue];
}



function getCurrentTasksFromDOM() {
    let liList = [];

    let tasksList = document.querySelector('.tasks-list');
    
    let taskListElements = Array.prototype.slice.call(tasksList.children);
    taskListElements.map(item => item.tagName === "LI" ?  liList.push(item) : false);

    return liList;
}



function clearOnlyDOMList() {
    let currentTasks = getCurrentTasksFromDOM();
    currentTasks.forEach(li => li.remove());
}



// Create placeholder for task list.
function createTasksPlaceholder() {
    let placeholder = document.createElement('li');
    placeholder.className = "tasks-placeholder";
    placeholder.innerHTML = "Your new tasks will appear here...";
    
    tasksList.append(placeholder);

    bottomControlsAppearance()
    
    console.log(createConsoleLogMessage("Placeholder was created"));
}

function bottomControlsAppearance() {
    let saveBackupButton = document.querySelector(".tasks__manual-backup-save-button");
    let clearTasksButton = document.querySelector(".tasks__clear-button");
    let loadManualBackupButton = document.querySelector(".tasks__manual-backup-restore-button");
    let loadAutoBackupButton = document.querySelector(".tasks__restore-button");
    let placeholder = document.querySelector(".tasks-placeholder");

    if (!placeholder) {
        saveBackupButton.removeAttribute("style");
        clearTasksButton.removeAttribute("style");

        if (loadAutoBackupButton) {
            loadAutoBackupButton.remove();
        } 
    } else {
        saveBackupButton.style.display = "none";
        clearTasksButton.style.display = "none";

        if (!taskManager.toDoLists[currentListName].autoBackup) {

        }
    }

    if (!taskManager.toDoLists[currentListName].manualBackup) {
        loadManualBackupButton.style.display = "none";
    } else {
        loadManualBackupButton.removeAttribute("style"); 
    }
}



//Reset input value after submitting a task.
function resetInputFieldAfterSubmit() {
    taskInput.value = "";
    taskInput.placeholder = "add task";
}



function createRestoreButton() {
    let currList = taskManager.toDoLists[currentListName];

    if (currList.autoBackup || currList.manualBackup) {
        let restoreButton = createButton("tasks__restore-button", "Restore autosaved list");
        toDoListWrapper.append(restoreButton);
    }

    if (document.querySelector(".tasks-placeholder")) {
        return;
    }

    createTasksPlaceholder();
}


//Creating a button with parameters
function createButton(buttonClass, buttonName, buttonType = "button") {
    let button = document.createElement(buttonType);

    if (buttonType === "button") {
        button.innerHTML = buttonName;
    } else {
        button.type = "checkbox";
    }
   
    button.className = buttonClass;
    button.dataset.action = buttonName;

    return button;
}


//Remove task hover control buttons after leaving tasks section
function removeTaskControlButtons() {
    let removeTaskButton = document.querySelector('.tasks__remove-task-button');
    let markAsDoneButton = document.querySelector('.tasks__mark-as-done-button');
    let createSubTreeButton = document.querySelector('.tasks__create-subtree-button');
    
    if (removeTaskButton && markAsDoneButton && createSubTreeButton) {
        removeTaskButton.remove();
        markAsDoneButton.remove();
        createSubTreeButton.remove();
    }
}



function createConsoleLogMessage(string) {
    let time = getCurrentTimeFormatted("secondsNeeded", "msNeeded");
    return `[${time}] ${string}`;
}

function getCurrentTimeFormatted(isSecondsNeeded = false, isMsNeeded = false) {
    let date = new Date();
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);

    let time = `${hours}:${minutes}:${seconds}`;

    if (isMsNeeded) {
        let ms = ("0" + date.getMilliseconds()).slice(-3);
        time += `.${ms}`;
    }
    return time;
}

function getDate(timeStamp, format = "dd.mm.yyyy") {
    if (timeStamp === "bugged") {
        timeStamp = new Date();
    }

    let date = new Date(timeStamp);

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);

    return `${day}.${month}.${year}`;
}