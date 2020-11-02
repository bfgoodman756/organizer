const toDoListWrapper = document.querySelector('.todo-list-wrapper');
const tasksContainer = document.querySelector('.tasks-container');
const taskInput = document.querySelector('.tasks__input-field');

let currentListName = appManager.options.lastUsedMenuSubCategory;

            let btnsWrapper = document.querySelector(".tasks__control-buttons-wrapper");
            let logBtn = document.createElement("button");
            logBtn.className = "tasks__manual-backup-save-button";
            logBtn.innerText = "Console log current list";
            btnsWrapper.append(logBtn);

console.log(createConsoleLogMessage("toDoList.js initialized"));


let taskManager = {
    toDoLists: {},

    loadList: function(listName) {
        let listHeader = document.querySelector('.todo__list-name');
        listHeader.innerText = listName;
        
        clearDOMList();
        
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
    
    
    createNewTask: function(list, taskStr, isDone = false, isSubtree = false, priority = "unset") {
        if (!this.toDoLists[list].tasks) {
            this.toDoLists[list].tasks = {};
        }
        let taskIndex = Object.keys(this.toDoLists[list].tasks).length + 1;

        let taskObj = {};
        taskObj.taskName = taskStr;
        taskObj.isDone = isDone;
        taskObj.priority = priority;
//      taskObj.order = taskIndex;

        if (isSubtree) {
            return taskObj;
        }

        if (!this.toDoLists) {
            this.toDoLists = {};
        }

        if (!this.toDoLists[list]) {
             this.toDoLists[list] = {};
        }

        if (!this.toDoLists[list].tasks) {
            this.toDoLists[list].tasks = {};
        }

        this.toDoLists[list].tasks[taskIndex] = taskObj;

        let taskNode = renderTask(taskStr, isDone, taskIndex, isSubtree);

        tasksContainer.append(taskNode);

        console.log(createConsoleLogMessage(`new task "${taskStr}" for "${currentListName}" was succesfully created`));

        saveCurrentListToLocalStorage();
    },


    createSubTask: function(list, taskIndex,taskStr, node, isNewSubList = false) {
        let subtree = this.toDoLists[list].tasks[taskIndex].subtree;
        
        if (!subtree) {
            this.toDoLists[list].tasks[taskIndex].subtree = {};
            isNewSubList = true;
        }
        
        let subTaskIndex = Object.keys(this.toDoLists[list].tasks[taskIndex].subtree).length + 1;
        
        let taskObj = this.createNewTask(list, taskStr, false, "subtree");
        this.toDoLists[list].tasks[taskIndex].subtree[subTaskIndex] = taskObj;

        //sets subtree div if sublist already exists
        let subList = node.children[1];

        //if new sublist for selected task
        if (isNewSubList) {
            subList = document.createElement("div");
            subList.className = "task-container__subtree";
            node.append(subList);
        }

        let taskNode = renderTask(taskStr, false, taskIndex, subTaskIndex, "subtask");

        subList.append(taskNode);

//         console.log(createConsoleLogMessage(`sub task "${taskStr}" for "${currentListName}" was succesfully created`));

        saveCurrentListToLocalStorage();
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

        clearDOMList();
        
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
        if (Object.keys(this.toDoLists).length === 0) {
            createFirstListIfThereIsNoAnyList();
        } else {
          saveCurrentListToLocalStorage();  
        }
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



tasksContainer.addEventListener('mouseover', function(event){
    let target = event.target;

    if (target.tagName === "P") {
        target = target.parentNode.parentNode;
    }

    if (!target.className.includes("task-container")) return;

    let doneStatus = "notDone";

    if (target.classList.contains('task-is-done')) {
        doneStatus = "done";
    }

    if (target.nextSibling &&
        target.nextSibling.classList.contains("task__create-subtree--wrapper")) {
        return;
    }

    createOptionButtonsOnHover(target, "tasks__mark-as-done--button", doneStatus);    
    createOptionButtonsOnHover(target, "tasks__remove-task--button", "remove task");


    if (event.target.dataset.taskType === "origin") {
        createOptionButtonsOnHover(target, "task__create-subtree--wrapper", "create subtask");
    } else {
        createOptionButtonsOnHover(target.closest(`.task-container__origin`), "task__create-subtree--wrapper", "create subtask");
    }
});

tasksContainer.addEventListener('mouseleave', function(event) {
    removeTaskControlButtons();
});



// Listens click and delegates it to next functions: "Add task", "Clear task" or "Restore list".
toDoListWrapper.addEventListener('click', function(event) {
    clickListener(event);
});

toDoListWrapper.addEventListener('mousedown', function(event) {
    mousedownListener(event);
});




// Adds posiblity to submit new task by "enter" key from the input
taskInput.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") return;
    let taskStr = taskInput.value;
    taskManager.createNewTask(currentListName, taskStr);
    resetInputFieldAfterSubmit();
});



loadDataFromLocalStorage(localStorage.getItem("toDoLists"));
currentListName = appManager.options.lastUsedMenuSubCategory;

if (!currentListName) {
    createFirstListIfThereIsNoAnyList();
}

function createFirstListIfThereIsNoAnyList() {
    currentListName = "Your first list";
    taskManager.createNewList(currentListName);
    highlightMenuSubItem(currentListName);
    appManager.rememberLastUsedSubCategory(currentListName);
}




let listHeader = document.querySelector(".todo__list-name");
listHeader.innerText = currentListName;

listHeader.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        this.blur();
    }
});

listHeader.addEventListener("blur", editCurrentListName);


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
    if (!taskManager.toDoLists[currentListName] || !taskManager.toDoLists[currentListName].tasks || Object.keys(taskManager.toDoLists[currentListName].tasks).length === 0) {
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
        
        let taskNode = renderTask(tasksData[startIndex].taskName, tasksData[startIndex].isDone, startIndex);
        
        if (tasksData[startIndex].subtree) {
            let subtree = document.createElement("div");
            subtree.classList.add("task-container__subtree");
            subtree.dataset.parentTaskIndex = startIndex;

            let subtreeStartIndex = 1;
            let totalSubtreeTasks = Object.keys(tasksData[startIndex].subtree).length;

            while(subtreeStartIndex <= totalSubtreeTasks) {
                let taskName = tasksData[startIndex].subtree[subtreeStartIndex].taskName;
                let isDone = tasksData[startIndex].subtree[subtreeStartIndex].isDone;
                
                if (taskName === undefined) {
                    continue;
                }

                let subTask = renderTask(taskName, isDone, startIndex, subtreeStartIndex, "sub");
                subtree.append(subTask);
                subtreeStartIndex++;
            }

            taskNode.append(subtree);
        }

        tasksContainer.append(taskNode);
        startIndex++;
    }
    
    bottomControlsAppearance();
}




// Renders task by input, submits or from localStorage
function renderTask(string, isDone = false, originTaskIndex, subTaskIndex = 0, isSubTask = false) {
    if (!string && string !== "")
        return;

    let taskPlaceholder = document.querySelector(".tasks-placeholder");

    if (taskPlaceholder) {
        taskPlaceholder.remove();
        bottomControlsAppearance();
    }


    isDone ? isDone = `task-is-done` : isDone = "";

    let taskWrapper = document.createElement("div");

    let taskTypeDataset = `data-task-type="origin"`;

    if (isSubTask){
        taskTypeDataset = `data-task-type="subtask"`;
        taskWrapper.classList.add("task-container__subtask");
    } else {
        taskWrapper.classList.add("task-container__origin");
    }
    string = string.replace(/\n/g, "<br />");
    taskWrapper.innerHTML = `<div class="task-wrapper ${isDone}">
                                <p class="task-index">${isSubTask ? subTaskIndex : originTaskIndex}.</p>
                                <p ${taskTypeDataset} data-task-index="${originTaskIndex},${subTaskIndex}" contenteditable="true" spellcheck="false">${string}</p>
                             </div>`;

    return taskWrapper;
}



function clickListener(event) {
    let elem = event.target;

    let isButton = elem.tagName === "BUTTON";
    let isPlaceholder = elem.className === "tasks-placeholder";

    
    if (!isButton && !isPlaceholder)
        return;
    
    if (elem.className === "tasks-placeholder")
        return;

    let actionType = elem.innerHTML;
    let taskString = taskInput.value;
    
    switch (actionType) {
        case ("+"):            
            if (taskString) {
                removeRestoreButton();
            }

            taskManager.createNewTask(currentListName, taskString);
            resetInputFieldAfterSubmit();
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
//             controls.removeAttribute("style");
            break;


        case ("Save backup"):
            backupManager("saveBackup");
            bottomControlsAppearance()
            break;


        case ("Load backup"):
            backupManager("loadBackup");
            break;

        case ("Console log current list"):
            console.log(taskManager.toDoLists[currentListName]);
            break;
    }
}

function mousedownListener(event) {
    let elem = event.target;

    let isContentEditable = elem.contentEditable === "true";
    let isP = elem.tagName === "P";

    if (!isP || !isContentEditable) {
        return;
    }

    editElementsInnerHTML(elem);
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

    clearDOMList();

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
    if (element.dataset.isFocused) {
        return;
    }
        
    let prevValue = element.innerText;

    element.setAttribute("spellcheck", true);
    element.dataset.isFocused = "true";
    
    element.addEventListener('keydown', keydownListener);
    document.addEventListener('click', simulateBlur);
//     element.addEventListener("blur", submitOnBlur);

    function simulateBlur(event) {
        if (event.target === element) {
            return
        }
        submitOnBlur();
    }

    

    function keydownListener(event) {
        if (event.key === "Enter" && event.ctrlKey) {
            submitOnBlur()
        }
        
        if (event.key === "Escape") {
            element.innerText = prevValue;
            submitOnBlur()
        }
    }



    function submitOnBlur() {
        element.removeEventListener('keydown', keydownListener);
        document.removeEventListener('click', simulateBlur);
        delete element.dataset.isFocused;

        if (element.innerText === prevValue) {
            element.setAttribute("spellcheck", false);
            element.innerText = prevValue; //to reset spellchecked task after blur
            console.log(createConsoleLogMessage("task value has not changed"));
            return;
        }        

//         element.dataset.status = "procesing";

        let [newTaskValue, originTaskIndex, subTaskIndex] = getElementIndexAndValueFromObject(element);

        if (element.dataset.taskType === "origin") {
            taskManager.toDoLists[currentListName].tasks[originTaskIndex].taskName = newTaskValue;
            console.log(createConsoleLogMessage(`Task #${originTaskIndex} was edited`));
        
        } else if (element.dataset.taskType === "subtask") {
            taskManager.toDoLists[currentListName].tasks[originTaskIndex].subtree[subTaskIndex].taskName = newTaskValue;
            console.log(createConsoleLogMessage(`Subtask #${subTaskIndex} of task #${originTaskIndex} was edited`));
        }

        saveCurrentListToLocalStorage();

        element.setAttribute("spellcheck", false);
        element.innerText = newTaskValue; //to reset spellchecked task after blur
    }
}



// Remove restore button from the DOM.
function removeRestoreButton() {
    let restoreButton = document.querySelector('.tasks__restore-button');

    if (!restoreButton) return;
    
    restoreButton.remove();
}






function createOptionButtonsOnHover(target, buttonSelector, buttonName) {    
    let existButton = document.querySelector(`.${buttonSelector}`);
    let subTreeInputNode = document.querySelector(".task__create-subtree--input");
    let button = null;
    
    if (document.querySelector('.tasks-edit') || target.className === "tasks-placeholder") return;
    
    if (!target.classList[0].includes("task-container")) return;

    if (subTreeInputNode && subTreeInputNode.dataset.focus === "focused") return;
    
    if (existButton) {
        if (existButton.previousSibling === target) {
            return;
        } else {
            existButton.remove();
        }
    }

    if (buttonSelector === "tasks__mark-as-done--button") {
        button = createButton(buttonSelector, buttonName, "input");
    
    } else if (buttonSelector === "task__create-subtree--wrapper") {
        button = createSubTaskInput();
    
    } else {
        button = createButton(buttonSelector, buttonName);
    }
        

    target.after(button);

    let targetCoords = target.getBoundingClientRect();
    let taskSection = document.querySelector(".tasks-section");
    
    if (buttonName === "remove task") {
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
        
        let left = 0;
        let top = target.offsetTop + 2;
        
        if (target.className.includes("subtask")) {
            left = left + 30;
        }

        button.dataset.taskStatus = buttonName;
        button.style.top = `${top}px`;
        button.style.left = `${left}px`;       
    }

    if (buttonName === "create subtask") {
        let addButton = document.querySelector(".task__create-subtree--button");
        let input = document.querySelector(".task__create-subtree--input");

        button.style.top = target.offsetTop + target.clientHeight - 18 + "px";
        button.style.left = taskSection.clientWidth - button.clientWidth + "px";

        input.addEventListener("click", function() {
            input.dataset.focus = "focused";
        });


        input.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                input.value = "";
                delete input.dataset.focus;
                input.blur();
                return;
            }
            if (event.key === "Enter") {
                addValue();
                button.style.top = target.offsetTop + target.clientHeight - 15 + "px";
                button.style.left = taskSection.clientWidth - button.clientWidth + "px";  
            }
        });

        input.addEventListener("blur", function() {
            delete input.dataset.focus;
            removeTaskControlButtons();
        })


        addButton.addEventListener("click", function() {
            addValue();
        });

        function addValue() {
            let [newTaskValue, originTaskIndex, subTaskIndex] = getElementIndexAndValueFromObject(target);
            taskManager.createSubTask(currentListName, originTaskIndex, input.value, target);
            input.value = "";
        }
    }
    


    button.addEventListener("click", function() {
        
        if (button.dataset.taskStatus === "done" || button.dataset.taskStatus === "notDone") {
//             target.dataset.status = "processing";
            target.nextElementSibling.dataset.status = "processing";
            buttonName = "done/notDone";
        }

        switch(buttonName) {
            case("remove task"):
                let [taskIndex, subIndex] = target.children[0].children[1].dataset.taskIndex.split(",");
                updateSubIndexes(taskIndex, subIndex);
                removeOnClick(target);
//                 clearDOMList();
//                 renderList(taskManager.toDoLists[currentListName].tasks); 
                break;

            case("done/notDone"):
                markAsDoneOnClick(target);
                break;
            
            case("+"):
                break;
        }
    });



    function markAsDoneOnClick(taskContainer) {
        taskContainer.children[0].classList.toggle("task-is-done");
        storeNewDataToList(taskContainer);   
    }


    function createSubTaskInput() {
        let div = document.createElement("div");
        div.className = "task__create-subtree--wrapper";

        div.innerHTML = `<input type="text" placeholder="add subtask" class="task__create-subtree--input"></input><button class="task__create-subtree--button">+</button>`;
        return div;
    }



    function removeOnClick(element) {
        element.dataset.status = "processing";
        storeNewDataToList(element, "remove");

        if (element.parentNode.className === "task-container__origin") {
            element = element.parentNode;
        }
        element.remove();
        console.log(createConsoleLogMessage(`Task "${element.innerHTML}" was removed`));

        let removeButton = document.querySelector('.tasks__remove-task--button');
        let markButton = document.querySelector('.tasks__mark-as-done--button');
        let subtreeButton = document.querySelector('.task__create-subtree--button');
        let subtreeinput = document.querySelector('.task__create-subtree--input');

        if (removeButton) {
            removeButton.remove();
        }

        if (markButton) {
            markButton.remove();
        }

        if (element.classList[0] === "task-container__origin" || element.classList[0] === "task-container__subtask") {
            subtreeButton.remove();
        }
        if (subtreeinput) {
            subtreeinput.remove();
        }

        let currentTasks = Array.from(document.querySelectorAll(`[data-task-type]`));
        
        if (currentTasks.length === 0) {
            createTasksPlaceholder();
        }

        saveCurrentListToLocalStorage();
    }
}


function updateSubIndexes(taskIndex, subTaskIndex) {
    taskIndex = parseInt(taskIndex);
    subTaskIndex = parseInt(subTaskIndex);
    
    //pushes origin or subtask nodes to an array
    let nodes = Array.from(document.querySelectorAll(`[data-task-index]`))
               .filter(node => {
                   if (subTaskIndex === 0){
                       return node.dataset.taskIndex.endsWith(`,0`);
                   } else {
                       return node.dataset.taskIndex.startsWith(`${taskIndex},`)
                   }

               });

    //reindexates origin tasks on DOM
    if (subTaskIndex === 0) {
        nodes.forEach((node, index) => {
            if (index > taskIndex-1) {
               node.dataset.taskIndex = `${index},${subTaskIndex}`;
               node.previousElementSibling.innerText = `${index}.`;

            }
        });
        
        return;
    
    //reindexate sub tasks on DOM
    } else {
        nodes.forEach((node, index) => {
            if (index > subTaskIndex) {
               node.dataset.taskIndex = `${taskIndex},${index-1}`;
               node.previousElementSibling.innerText = `${index-1}.`;

            }
        });
    }
}



function storeNewDataToList(node, ifRemoving = false, priority = "unset") {
    let [taskValue, taskIndex, subTaskIndex] = getElementIndexAndValueFromObject(node);
    
    let currentTask = {};
    let isSubTaskEditing = false;

    if (subTaskIndex > 0) {
        isSubTaskEditing = true;
        currentTask = taskManager.toDoLists[currentListName].tasks[taskIndex].subtree[subTaskIndex];
    } else {
        currentTask = taskManager.toDoLists[currentListName].tasks[taskIndex];
    }

    if (ifRemoving) {
        //<VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV FIX HERE
        removeTaskFromDataAndUpdateIndexes(taskIndex, subTaskIndex);
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


    function removeTaskFromDataAndUpdateIndexes(taskIndex, subTaskIndex) {
        
        //if subtask
        if (subTaskIndex > 0) {
            let totalSubTasks = Object.keys(taskManager.toDoLists[currentListName].tasks[taskIndex].subtree).length; 

            delete taskManager.toDoLists[currentListName].tasks[taskIndex].subtree[subTaskIndex];
            
            //do not reindexate if last task
            if (subTaskIndex === totalSubTasks) {
                return;
            }

            for (let i = subTaskIndex; i <= totalSubTasks; i++) {
                taskManager.toDoLists[currentListName].tasks[taskIndex].subtree[i] = taskManager.toDoLists[currentListName].tasks[taskIndex].subtree[i+1];

                if (i === totalSubTasks) {
                    delete taskManager.toDoLists[currentListName].tasks[taskIndex].subtree[totalSubTasks]
                }
            }
        
        // if origin tasks
        } else {
            let totalTasks = Object.keys(taskManager.toDoLists[currentListName].tasks).length;

            delete taskManager.toDoLists[currentListName].tasks[taskIndex];
        
            //do not reindexate if last task
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
    }


    function checkIfIsDone(node) {
        let isTaskDone = false;

        if (node.children[0].classList.contains('task-is-done')) {
            isTaskDone = true;
        }
        return isTaskDone;
    } 
}




function getElementIndexAndValueFromObject(node) {
//     if (node.tagName === "P") {
//         node = node.children[1];
//     }
//     let j = "";
    if (node.className.includes("task-container")) {
        node = node.children[0].children[1];
    }
    let [originTaskIndex, subTaskIndex] = node.dataset.taskIndex.split(",").map(item => parseInt(item));
    let taskValue = node.innerText;

    return [taskValue, originTaskIndex, subTaskIndex];
}



function getCurrentTasksFromDOM() {
    return document.querySelectorAll(`[data-task-type]`);
}



function clearDOMList() {
    let placeholder = document.querySelector(".tasks-placeholder");
    
    if (placeholder) {
        placeholder.remove();
    }

    let currentTasks = Array.from(document.querySelector(`.tasks-container`).children);
    currentTasks.forEach(node => node.remove());
}



// Create placeholder for task list.
function createTasksPlaceholder() {
    let placeholder = document.createElement('div');
    placeholder.className = "tasks-placeholder";
    placeholder.innerHTML = "Your new tasks will appear here...";
    
    tasksContainer.append(placeholder);

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

//         if (!taskManager.toDoLists[currentListName].autoBackup) {

//         }
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
    
    if (!currList) {
        return;
    }

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
    } else  {
        button.type = "checkbox";
    }
   
    button.className = buttonClass;
    button.dataset.action = buttonName;

    return button;
}


//Remove task hover control buttons after leaving tasks section
function removeTaskControlButtons() {
    let subtreeInputNode = document.querySelector(".task__create-subtree--input");
    if (subtreeInputNode && subtreeInputNode.dataset.focus === "focused") {
        return;
    }
    let removeTaskButton = document.querySelector('.tasks__remove-task--button');
    let markAsDoneButton = document.querySelector('.tasks__mark-as-done--button');
    let createSubTaskButton = document.querySelector('.task__create-subtree--wrapper');
    
    if (removeTaskButton && markAsDoneButton && createSubTaskButton) {
        removeTaskButton.remove();
        markAsDoneButton.remove();
        createSubTaskButton.remove();
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