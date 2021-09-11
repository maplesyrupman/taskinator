let taskIdCounter = 0;
const tasks = {};
const formEl = document.querySelector('#task-form');
const tasksToDoEl = document.querySelector('#tasks-to-do');
const tasksInProgressEl = document.querySelector('#tasks-in-progress');
const tasksCompletedEl = document.querySelector('#tasks-completed');
const pageContentEl = document.querySelector('#page-content');

const taskFormHandler = (event) => {
    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    let isEdit = formEl.hasAttribute('data-task-id');

    switch (isEdit) {
        case true:
            completeEditTask(taskNameInput, taskTypeInput, formEl.getAttribute('data-task-id'));
            break;
        case false:
            let taskDataObj = {
                name: taskNameInput, 
                type: taskTypeInput,
                status: 'to do'
            }
            createTaskEl(taskDataObj);
            break;
    }

};

const createTaskEl = (taskDataObj) => {
    let listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    listItemEl.setAttribute('data-task-id', taskIdCounter);

    let taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = `<h3 class='task-name'>${taskDataObj.name}</h3><span class='task-type'>${taskDataObj.type}</span>`;
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks[taskDataObj.id] = taskDataObj;
    saveTasks();

    let taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
}

let createTaskActions = (taskId) => {
    let actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    //create edit button
    let editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    let deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create task status dropdown
    let statusSelectEl = document.createElement('select');
    statusSelectEl.className = 'select-status';
    statusSelectEl.setAttribute('name', 'status-change');
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //create status options
    let statusChoices = ['To Do', 'In Progress', 'Completed'];

    for (let i=0; i < statusChoices.length; i++) {
        let statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

const taskButtonHandler = (event) => {
    let targetEl = event.target;

    switch (true) {
        case (targetEl.matches('.delete-btn')):
            deleteTask(targetEl.getAttribute('data-task-id'));
            break;
        case (targetEl.matches('.edit-btn')):
            editTask(targetEl.getAttribute('data-task-id'));
            break;
    }
}

const deleteTask = function(taskId) {
    let taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);
    taskSelected.remove();

    delete tasks[parseInt(taskId)];
    saveTasks();
}

const editTask = (taskId) => {
    let taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    let taskName = taskSelected.querySelector('h3.task-name').textContent;
    let taskType = taskSelected.querySelector('span.task-type').textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector('#save-task').textContent = 'Save Task';
    formEl.setAttribute('data-task-id', taskId);
}

const completeEditTask = (taskName, taskType, taskId) => {
    let taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    let taskToUpdate = tasks[parseInt(taskId)];
    taskToUpdate.name = taskName;
    taskToUpdate.type = taskType;
    saveTasks();

    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = 'Add Task';
}

const taskStatusChangeHandler = (event) => {
    let taskId = event.target.getAttribute('data-task-id');
    let statusValue = event.target.value.toLowerCase();
    let taskSelected = document.querySelector(`.task-item[data-task-id='${taskId}']`);

    switch (statusValue) {
        case 'to do':
            tasksToDoEl.appendChild(taskSelected);
            break;
        case 'in progress':
            tasksInProgressEl.appendChild(taskSelected);
            break;
        case 'completed':
            tasksCompletedEl.appendChild(taskSelected);
            break;
    }

    let taskToUpdate = tasks[parseInt(taskId)];
    taskToUpdate.status = statusValue;
    saveTasks();
}

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
