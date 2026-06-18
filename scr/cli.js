const { default: inquirer } = require("inquirer");

const {
    addTask,
    getAllTasks,
    deleteTask,
    updateTask,
    filterTasks,
    sortByDate
} = require("./taskManager");

async function showMenu() {
    let exit = false;

    while (!exit) {
        
        // Главное меню действий пользователя
        const { action } = await inquirer.prompt([
            {
                type: "select",
                name: "action",
                message: "Выберите действие:",
                choices: [
                    {
                        name: "Добавить задачу",
                        value: "Добавить задачу"
                    },
                    {
                        name: "Просмотреть задачи",
                        value: "Просмотреть задачи"
                    },
                    {
                        name: "Редактировать задачу",
                        value: "Редактировать задачу"
                    },
                    {
                        name: "Удалить задачу",
                        value: "Удалить задачу"
                    },
                    {
                        name: "Выход",
                        value: "Выход"
                    }
                ]
            }
        ]);

        // Маршрутизация действий пользователя
        switch (action) {
            case "Добавить задачу":
                await createTask();
                break;

            case "Просмотреть задачи":
                showTasks();
                break;

            case "Редактировать задачу":
                await editTask();
                break;

            case "Удалить задачу":
                await removeTask();
                break;

            case "Выход":
                exit = true;
                console.log("Работа завершена.");
                break;
        }
    }
}

// Создание новой задачи
async function createTask() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Название задачи:"
        },
        {
            type: "input",
            name: "description",
            message: "Описание:"
        },
        {
            type: "input",
            name: "category",
            message: "Категория:"
        },
        {
            type: "input",
            name: "dueDate",
            message: "Срок выполнения (YYYY-MM-DD):"
        },
        {
            type: "confirm",
            name: "isUrgent",
            message: "Срочная задача?"
        }
    ]);

    const task = addTask(answers);

    console.log("Задача успешно добавлена:");
    console.table([task]);
}

// Вывод списка задач
function showTasks() {
    const tasks = sortByDate(getAllTasks());

    if (tasks.length === 0) {
        console.log("Список задач пуст.");
        return;
    }

    // Формирование таблицы для удобного отображения данных
    console.table(
        tasks.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category,
            dueDate: t.dueDate,
            urgent: t.isUrgent,
            completed: t.completed,
            overdue: t.overdue ? "⚠ YES" : ""
        }))
    );
}


// Удаление задач по ID
async function removeTask() {
    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Введите ID задачи:"
        }
    ]);

    const success = deleteTask(id);

    if (success) {
        console.log("Задача удалена.");
    } else {
        console.log("Задача не найдена.");
    }
}


// Редактирование задач
async function editTask() {
    const { id } = await inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Введите ID задачи:"
        }
    ]);

    const tasks = getAllTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
        console.log("Задача не найдена.");
        return;
    }

    // Форма редактирования
    const updated = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Новое название:",
            default: task.title
        },
        {
            type: "input",
            name: "description",
            message: "Новое описание:",
            default: task.description
        },
        {
            type: "input",
            name: "category",
            message: "Новая категория:",
            default: task.category
        },
        {
            type: "input",
            name: "dueDate",
            message: "Новая дата:",
            default: task.dueDate
        },
        {
            type: "confirm",
            name: "isUrgent",
            message: "Срочная?",
            default: task.isUrgent
        },
        {
            type: "confirm",
            name: "completed",
            message: "Выполнена?",
            default: task.completed
        }
    ]);

    updateTask(id, updated);

    console.log("Задача обновлена.");
}

module.exports = {
    showMenu
};