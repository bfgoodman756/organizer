const toDoListWrapper = document.querySelector('.todo-list-wrapper');
const tasksList = document.querySelector('.tasks-list');
const taskInput = document.querySelector('.tasks__input-field');

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
            console.log(createConsoleLogMessage("Changing list name was aborted, new name is already equal to current"))
            return;
        }
        let obj = Object.assign({}, this.toDoLists[prevName]);

        if (obj === {}) {
            console.log("wtf");
        }

        if (!document.querySelector(".menu__todo-list-name--active")) {
            highlightCurrentList(prevName.toString());
        }
        
        let listHeader = document.querySelector('.todo__list-name');
        listHeader.innerText = newName;

        highlightCurrentList(prevName);

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

    let doneStatus = "mark as done";

    if (elem.classList.contains('task-is-done')) {
        doneStatus = "undone";
    }
    createOptionButtonsOnHover(elem, "tasks__remove-task-button", "remove");
    createOptionButtonsOnHover(elem, "tasks__mark-as-done-button", doneStatus);
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



// initialize loading saved data
let currentListName = appManager.options.lastUsedList;
let listHeader = document.querySelector(".todo__list-name");
listHeader.innerText = currentListName;

listHeader.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        this.blur();
    }
})

listHeader.addEventListener("blur", editCurrentListName);

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

    //create restore button if there is no tasks key for current list or if there are less tasks than 1
    if (!obj.toDoLists[currentListName].tasks || Object.keys(obj.toDoLists[currentListName].tasks).length === 0) {
        createRestoreButton();
        return;
    }
    renderList(obj.toDoLists[currentListName].tasks);
}




function renderList(tasksData) {
    let tasksDataLength = null;

    if (Object.keys(tasksData)) {
        tasksDataLength = Object.keys(tasksData).length;
    }
    
    if ( tasksDataLength === 0) {
        createTasksPlaceholder();
        return;
    }

    let totalTasks = Object.keys(tasksData).length;

    if (totalTasks < 1) {
        createTasksPlaceholder();
        return;
    }

    let startIndex = 1;
    while (startIndex <= totalTasks) {
        renderTask(tasksData[startIndex].taskName, false, tasksData[startIndex].isDone);
        startIndex++;
    }
}




// Renders task by input, submits or from localStorage
function renderTask(string, isNew = false, isDone = false) {
    if (!string && string !== "")
        return;

    let taskPlaceholder = document.querySelector(".tasks-placeholder");

    if (taskPlaceholder) {
        taskPlaceholder.remove();

        resetInputFieldAfterSubmit(string);
    }
//     let neww = document.createElement("div");
//     neww.innerHTML = `<li contenteditable="true">${string}</li>`;
//     tasksList.append(neww);

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
            clearTaskList();
            break;


        case ("Restore autosaved list"):
            backupManager("loadBackup", "autoBackup");
            createConsoleLogMessage("Last task list was restored");
            break;


        case ("Save backup"):
            backupManager("saveBackup");
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

    console.log(createConsoleLogMessage("task list was cleared"));
}




function saveCurrentListToLocalStorage() {    
    localStorage.setItem("toDoLists", JSON.stringify(taskManager));
    
    console.log(createConsoleLogMessage(`{localStorage.toDoLists} was succesfully updated`));
}




function backupManager(saveOrLoad = false, backupType = "manualBackup") {
    if (!saveOrLoad) return;
    
    if (backupType !== "manualBackup") {
        backupType = "autoBackup";
    }

    if (saveOrLoad === "saveBackup") {
        taskManager.saveBackup(currentListName, backupType);
    
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
        

        element.dataset.status = "changing";

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



function createOptionButtonsOnHover(target, buttonSelector, buttonName, buttonDataset) {    
    let existButton = document.querySelector(`.${buttonSelector}`);
    
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
    
    let button = createButton(buttonSelector, buttonName, buttonDataset);
    target.after(button);

    let targetCoords = target.getBoundingClientRect();
    
    if (buttonName === "remove") {
        button.innerText ="X";
        button.style.left = targetCoords.left + targetCoords.width - button.clientWidth + "px";
        button.style.top = targetCoords.top + window.scrollY + "px";

        button.addEventListener("mouseover", function() {
            target.classList.add("tasks-list--removing");
        });
        
        button.addEventListener("mouseleave", function() {
            target.classList.remove("tasks-list--removing");
        });
    
    } else {
        button.style.top = targetCoords.top + targetCoords.height + window.scrollY + "px";        
    }
    


    button.addEventListener("click", function() {
        
        if ( button.innerHTML === "mark as done" || button.innerHTML === "undone") {
            target.dataset.status = "changing";
            buttonName = "done/undone";
        }

        switch(buttonName) {
            case("remove"): 
                removeOnClick(target);
                break;

            case("done/undone"):
                markAsDoneOnClick(target, button);
                break;
        }
    });



    function markAsDoneOnClick(element, button) {
        element.classList.toggle("task-is-done");

        if (element.classList.contains("task-is-done")) {
            button.innerHTML = "undone";
        } else {
            button.innerHTML = "mark as done";
        }

        storeNewDataToList(element);   
    }



    function removeOnClick(element) {
        element.dataset.status = "changing";
        storeNewDataToList(element, "remove");
        element.remove();
        console.log(createConsoleLogMessage(`Task "${element.innerHTML}" was removed`));

        document.querySelector('.tasks__remove-task-button').remove();
        document.querySelector('.tasks__mark-as-done-button').remove();

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
    
    console.log(createConsoleLogMessage("Placeholder was created"));
}



//Reset input value after submitting a task.
function resetInputFieldAfterSubmit() {
    taskInput.value = "";
    taskInput.placeholder = "add task";
}



// Restore deleted list and remove restore button from the DOM.
// function backupRestore(deletedListJSON) {
//     clearTaskList();
//     loadDataFromLocalStorage(deletedListJSON);
//     removeRestoreButton();
// }



function createRestoreButton() {
    let currList = taskManager.toDoLists[currentListName];

    if (currList.autoBackup || currList.manualBackup) {
        let restoreButton = createButton("tasks__restore-button", "Restore autosaved list");
        toDoListWrapper.append(restoreButton);
    }

    createTasksPlaceholder();
}


//Creating a button with parameters
function createButton(buttonClass, buttonName, buttonDataset) {
    if(document.querySelector(`.${buttonClass}`)) return;

    let button = document.createElement('button');
    button.innerHTML = buttonName;
    button.className = buttonClass;
    button.dataset.action = buttonName;

    return button;
}


//Remove task hover control buttons after leaving tasks section
function removeTaskControlButtons() {
    let removeTaskButton = document.querySelector('.tasks__remove-task-button');
    let markAsDoneButton = document.querySelector('.tasks__mark-as-done-button');
    
    if (removeTaskButton && markAsDoneButton) {
        removeTaskButton.remove();
        markAsDoneButton.remove();
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
    let month = ("0" + date.getMonth()).slice(-2);;
    let day = ("0" + date.getDate()).slice(-2);;
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);

    return `${day}.${month}.${year}`;
}
