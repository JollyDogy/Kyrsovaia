const { showMenu } = require("./cli");

// Заголовок приложения в консоли
console.log("================================");
console.log(" Терминальный планировщик задач ");
console.log("================================");

const { getOverdueTasks } = require("./taskManager");

const overdue = getOverdueTasks();


// Проверка наличия просроченных задач и вывод уведомления
if (overdue.length > 0) {
    console.log("\nПросроченные задачи:", overdue.length);
}

showMenu();