// Initial default tasks
const todoList = [
  { name: 'wash Dishes', dueDate: '2022-12-02' },
  { name: 'make dinner', dueDate: '2022-12-03' }
];

const completedTasks = [];
const deletedTasks = [];

// Load saved tasks when the page loads
loadFromLocalStorage();

// Renders all pending tasks from todoList (skips first 2 default entries)
function renderTodoList() {
  let todoListHTML = '';
  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    const name = todoObject.name;
    const dueDate = todoObject.dueDate;

    const html = `
      <p>
        <input type='checkbox' onchange='markTaskCompleted(${i})'>
        ${name} ${dueDate}
        <button onclick='deleteTask(${i})'>Delete</button>
      </p>`;
    todoListHTML += html;
  }
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}

// Adds a new task to the todoList
function addtoDo() {
  const inputElement = document.querySelector('.js-name-input');
  const dateInputElement = document.querySelector('.js-due-date-element');
  const dueDate = dateInputElement.value;
  const name = inputElement.value;

  if (!name || !dueDate) {
    alert('You should enter both task name and due date.');
    return;
  }

  todoList.push({
    name: name,
    dueDate: dueDate
  });

  inputElement.value = ''; // Reset input after adding
  dateInputElement.value = '';

  renderTodoList();
  saveToLocalStorage();
}

// Converts due date string to an integer (e.g. "2024-06-25" → 20240625)
function dueDatesToIntegers(input) {
  let newStr = '';
  for (let j = 0; j < input.length; j++) {
    if (!isNaN(input[j]) && input[j] !== '-') {
      newStr += input[j];
    }
  }
  return Number(newStr);
}

// Adds hyphens to date strings (e.g., "20240625" → "2024-06-25")
function minusAdder(input) {
  let my_string = String(input);
  my_string = my_string.slice(0, 4) + '-' + my_string.slice(4);
  my_string = my_string.slice(0, 7) + '-' + my_string.slice(7);
  return my_string;
}

// Sorts tasks based on their due date
function sortingTasks() {
  let todoListDictionary = {};
  for (let i = 0; i < todoList.length; i++) {
    const item = todoList[i];
    todoListDictionary[item.name] = dueDatesToIntegers(item.dueDate);
  }

  const sortedEntries = Object.entries(todoListDictionary).sort(
    (a, b) => a[1] - b[1]
  );

  const sortedTodoListDictionary = {};
  for (const [key, value] of sortedEntries) {
    sortedTodoListDictionary[key] = value;
  }

  const answer = [];
  for (const key in sortedTodoListDictionary) {
    answer.push(`${key}   //DUE :  ${minusAdder(sortedTodoListDictionary[key])}`);
  }

  return answer;
}

// Displays sorted tasks in the web page
function sortedTasksIntoWebPage() {
  let todoListHtml = '';
  const sortedTasks = sortingTasks();
  for (let i = 0; i < sortedTasks.length; i++) {
    const inputElement = sortedTasks[i];
    const html = `<p>${inputElement}</p>`;
    todoListHtml += html;
  }
  document.querySelector('.js-sorted-tasks-in-web-pages').innerHTML = todoListHtml;
}

// Marks a task as completed and removes it from the pending list
function markTaskCompleted(index) {
  completedTasks.push(todoList[index]);
  todoList.splice(index, 1);
  renderTodoList();
  renderCompletedTasks();
  saveToLocalStorage();
}

// Deletes a task and moves it to the deleted list
function deleteTask(index) {
  deletedTasks.push(todoList[index]);
  todoList.splice(index, 1);
  renderTodoList();
  renderDeletedTasks();
  saveToLocalStorage();
}

// Renders completed tasks on the page
function renderCompletedTasks() {
  let html = '';
  for (const task of completedTasks) {
    html += `<p>${task.name} ${task.dueDate}</p>`;
  }
  document.querySelector('.js-completed-tasks').innerHTML = html;
}

// Renders deleted tasks on the page
function renderDeletedTasks() {
  let html = '';
  for (const task of deletedTasks) {
    html += `<p>${task.name} ${task.dueDate}</p>`;
  }
  document.querySelector('.js-deleted-tasks').innerHTML = html;
}

// Resets the entire task system including localStorage
function resetTaskButton() {
  todoList.length = 0;
  completedTasks.length = 0;
  deletedTasks.length = 0;

  renderTodoList();
  renderCompletedTasks();
  renderDeletedTasks();
  document.querySelector('.js-sorted-tasks-in-web-pages').innerHTML = '';

  saveToLocalStorage();
}

// Saves current task lists to localStorage
function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Loads tasks from localStorage when page is reloaded
function loadFromLocalStorage() {
  const savedTodo = localStorage.getItem('todoList');
  const savedCompleted = localStorage.getItem('completedTasks');
  const savedDeleted = localStorage.getItem('deletedTasks');

  if (savedTodo) {
    todoList.splice(0, todoList.length, ...JSON.parse(savedTodo));
  }
  if (savedCompleted) {
    completedTasks.splice(0, completedTasks.length, ...JSON.parse(savedCompleted));
  }
  if (savedDeleted) {
    deletedTasks.splice(0, deletedTasks.length, ...JSON.parse(savedDeleted));
  }

  renderTodoList();
  renderCompletedTasks();
  renderDeletedTasks();
}
