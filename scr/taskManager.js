const { loadTasks, saveTasks } = require("./storage");
const { validateTask } = require("./validators");

/**
 * Генерация уникального ID задачи
 * Используется максимальный существующий id + 1
 */
function generateId(tasks) {
    return tasks.length > 0
        ? Math.max(...tasks.map(t => t.id)) + 1
        : 1;
}

// Добавление новой задачи
function addTask(data) {
    const tasks = loadTasks();

    const newTask = {
        id: generateId(tasks),
        title: data.title,
        description: data.description || "",
        category: data.category || "Общее",
        dueDate: data.dueDate,
        isUrgent: data.isUrgent || false,
        completed: false
    };

    // Валидация создаваемой задачи
    const check = validateTask(newTask);

    if (!check.valid) {
        console.log("Ошибка создания задачи:");
        console.log(check.errors);
        return null;
    }

    tasks.push(newTask);
    saveTasks(tasks);

    return newTask;
}

// Получение всех задач с дополнительными вычисляемыми полями
function getAllTasks() {
    return enrichTasks(loadTasks());
}

// Удаление задачи по ID
function deleteTask(id) {
    let tasks = loadTasks();

    const filtered = tasks.filter(t => t.id !== id);

    if (filtered.length === tasks.length) {
        return false;
    }

    saveTasks(filtered);
    return true;
}

// Обновление задачи по ID
function updateTask(id, newData) {
    const tasks = loadTasks();

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return false;
    }

    tasks[index] = {
        ...tasks[index],
        ...newData,
        id: tasks[index].id
    };

    saveTasks(tasks);
    return true;
}

// Фильтрация задач по параметрам
function filterTasks(options = {}) {
    let tasks = loadTasks();

    if (options.category) {
        tasks = tasks.filter(t => t.category === options.category);
    }

    if (options.completed !== undefined) {
        tasks = tasks.filter(t => t.completed === options.completed);
    }

    if (options.urgent !== undefined) {
        tasks = tasks.filter(t => t.isUrgent === options.urgent);
    }

    return tasks;
}

// Сортировка задач по дате
function sortByDate(tasks) {
    return tasks.sort((a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    );
}

// Получение просроченных задач, завершённые задачи не учитываются
function getOverdueTasks() {
    const tasks = loadTasks();
    const now = new Date();

    return tasks.filter(task => {
        if (task.completed) return false;
        return new Date(task.dueDate) < now;
    });
}

function enrichTasks(tasks) {
    const now = new Date();

    return tasks.map(task => {
        return {
            ...task,
            overdue: !task.completed && new Date(task.dueDate) < now
        };
    });
}

module.exports = {
    addTask,
    getAllTasks,
    deleteTask,
    updateTask,
    filterTasks,
    sortByDate,
    getOverdueTasks,
    enrichTasks
};