// Функция для обработки математических запросов с использованием math.js
function processMathQuery(message) {
    try {
        // Проверка на наличие чисел и математических символов в запросе
        if (/[0-9+\-*/().^=]/.test(message)) {
            // Использование math.js для вычислений
            const result = math.evaluate(message); // Используем math.js для вычислений
            return `Результат: ${result}`;
        } else if (message.toLowerCase().includes("help")) {
            return "Я могу помочь с решением математических задач. Введите математическое выражение, например: 2+2 или 3*(5-2).";
        } else if (message.toLowerCase().includes("what's")) {
            return "Я готов помочь вам с математическими вычислениями! Просто введите выражение.";
        }
    } catch (e) {
        return "Извините, я не смог обработать это выражение. Пожалуйста, убедитесь, что оно правильное.";
    }
    return null;
}

// Пример использования:
function processMath(message) {
    const mathResponse = processMathQuery(message);
    if (mathResponse) return mathResponse;
    return null;
}

// Основная функция для получения ответа
function getBotReplyExtended(message) {
    const lang = detectLanguage(message);

    // Проверка на математику и обработка математических запросов
    const mathResponse = processMath(message);
    if (mathResponse) return mathResponse;

    // Логика для обработки других типов сообщений
    let reply;
    if (lang === 'en') {
        reply = getAdditionalReply(message, 'en');
        if (reply) return reply;
    } else {
        const lowerMsg = message.toLowerCase();
        reply = getAdditionalReply(lowerMsg, 'ru');
        if (reply) return reply;
    }

    // Если ничего не найдено, возвращаем fallback
    const fallback = [
        "Не совсем понял. Можешь переформулировать?",
        "Извини, я не понимаю. Можешь уточнить?"
    ];
    return randomFromArray(fallback);
}
