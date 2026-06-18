const fs = require("fs");
const path = require("path");

// Формирование абсолютного пути к файлу хранения задач
const DATA_PATH = path.join(__dirname, "..", "data", "tasks.json");


/*
 * Загрузка задач из файла tasks.json
 * Возвращает массив задач или пустой массив при ошибках или отсутствии файла
 */
function loadTasks() {
    try {
        // Проверка существования файла хранения
        if (!fs.existsSync(DATA_PATH)) {
            return [];
        }

        // Чтение содержимого файла
        const data = fs.readFileSync(DATA_PATH, "utf-8");

        // Если файл пустой — возвращается пустой массив
        if (!data) {
            return [];
        }

        // Преобразование JSON-строки в массив объектов
        return JSON.parse(data);
    } catch (error) {
        console.error("Ошибка загрузки задач:", error.message);
        return [];
    }
}

// Сохранение массива задач в файл tasks.json
function saveTasks(tasks) {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2), "utf-8");
    } catch (error) {
        console.error("Ошибка сохранения задач:", error.message);
    }
}

module.exports = {
    loadTasks,
    saveTasks
};