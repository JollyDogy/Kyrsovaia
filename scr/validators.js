/*
 * Проверка корректности даты
 * Возвращает true, если строка является валидной датой
 */
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

/*
 * Проверка строки на пустоту и тип string
 */
function isNotEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

/*
 * Проверка корректности идентификатора задачи
 * ID должен быть числом больше 0
 */
function isValidId(id) {
    return typeof id === "number" && id > 0;
}

/*
 * Комплексная валидация задачи
 * Проверяет обязательные поля и возвращает список ошибок
 */
function validateTask(task) {
    const errors = [];

    // Проверка названия задачи
    if (!isNotEmptyString(task.title)) {
        errors.push("Название задачи не может быть пустым");
    }

    // Проверка корректности даты выполнения
    if (!isValidDate(task.dueDate)) {
        errors.push("Некорректная дата");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    isValidDate,
    isNotEmptyString,
    isValidId,
    validateTask
};