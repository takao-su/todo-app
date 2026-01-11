// DOM要素の取得
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');

// Todoデータを保存する配列
let todos = [];

// ローカルストレージからデータを読み込む
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// ローカルストレージにデータを保存する
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todoの数を更新する
function updateCount() {
    const remaining = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${remaining} task`;
}

// Todoをレンダリングする
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input
                type="checkbox"
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                data-index="${index}"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="todo-delete" data-index="${index}">削除</button>
        `;

        todoList.appendChild(li);
    });

    updateCount();
}

// HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Todoを追加する
function addTodo(text) {
    if (text.trim() === '') return;

    todos.push({
        text: text.trim(),
        completed: false
    });

    saveTodos();
    renderTodos();
}

// Todoの完了状態を切り替える
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Todoを削除する
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// 完了したTodoを全て削除する
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// イベントリスナー: フォーム送信
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(todoInput.value);
    todoInput.value = '';
    todoInput.focus();
});

// イベントリスナー: チェックボックスと削除ボタン
todoList.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);

    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodo(index);
    }

    if (e.target.classList.contains('todo-delete')) {
        deleteTodo(index);
    }
});

// イベントリスナー: 完了を削除ボタン
clearCompletedBtn.addEventListener('click', clearCompleted);

// 初期化
loadTodos();
renderTodos();
