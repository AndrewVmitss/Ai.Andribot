// === Andribot расширенная версия 4.0 ================================================
// Версия: расширенный интеллект, контекст, память, NLU, FAQ, динамические темы и т. д.
// Автор: Andranik Hovsepyan (с сохранением оригинального автора)

// ---------------------------
// === ТВОЙ ИСХОДНИК (400+ строк) ===
// Скопируй сюда **без изменений** весь свой существующий ai.js
// -------------------------------------------------------------------------------

/* === ТВОИ 400+ СТРОК ЗДЕСЬ === */

// Глобальный массив для истории чата
let chatHistory = [];

// ==================== Основная функция отправки сообщений =======================
/* Функция отправки сообщения. Обрабатывает ввод, имитирует "думание" и выводит ответ. */
function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim()) {
        // Добавляем сообщение пользователя в историю
        chatHistory.push({ sender: 'user', text: userInput });

        // Показываем сообщение "Думаю..."
        document.getElementById('thinking').style.display = 'block';

        // Очищаем поле ввода
        document.getElementById('userInput').value = '';

        // Задержка имитации "думания" (1 секунда)
        setTimeout(() => {
            // Получаем ответ бота с расширенной логикой (учитывая язык)
            const botReply = getBotReplyExtended(userInput);
            
            // Сохраняем ответ бота в историю
            chatHistory.push({ sender: 'bot', text: botReply });
            
            // Выводим сообщения в чат
            renderMessage("Ты: " + userInput, "user");
            renderMessage("Andribot: " + botReply, "bot");

            // Прокручиваем чат вниз
            const chat = document.getElementById('chat');
            chat.scrollTop = chat.scrollHeight;
            
            // Скрываем сообщение "Думаю..."
            document.getElementById('thinking').style.display = 'none';
        }, 1000);
    }
}

// ==================== Функция вывода сообщения ======================================
// Заменяем текущую функцию renderMessage на такую:
function renderMessage(text, type) {
    const chat = document.getElementById('chat');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', type);
    chat.appendChild(messageElement);

    // Если это сообщение от бота — печатаем по буквам
    if (type === 'bot') {
        let i = 0;
        const speed = 30; // задержка между буквами в мс, подстрой по вкусу
        function typeChar() {
            if (i < text.length) {
                messageElement.textContent += text.charAt(i++);
                chat.scrollTop = chat.scrollHeight; // скроллим вниз по ходу печати
                setTimeout(typeChar, speed);
            }
        }
        typeChar();
    } else {
        // Для пользователя выводим сразу весь текст
        messageElement.textContent = text;
    }
}

// ==================== Обработчик нажатия Enter =====================================
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// ==================== Функция определения языка и перевода ======================

/* Функция распознавания языка. Если текст состоит только из символов английского алфавита,
   пробелов и знаков препинания, возвращаем 'en', иначе — 'ru'. */
function detectLanguage(text) {
    const englishAlphabet = /^[a-zA-Z\s.,!?]+$/;
    if (englishAlphabet.test(text)) {
        return 'en';
    }
    return 'ru';
}

/* Функция перевода с английского на русский.
   Здесь используется простой словарик. При необходимости его можно расширить или заменить вызовом API. */
function translateToRussian(text) {
    const dictionary = {
        "hello": "привет",
        "world": "мир",
        "how are you": "как дела",
        "good morning": "доброе утро",
        "good night": "спокойной ночи",
        "thank you": "спасибо",
        "please": "пожалуйста",
        "i love you": "я тебя люблю"
        // Добавляйте больше слов и фраз по необходимости
    };

    const lowerText = text.toLowerCase().trim();
    if (dictionary[lowerText]) {
        return dictionary[lowerText];
    } else {
        // Если точное совпадение не найдено, разбиваем строку на слова и переводим по отдельности
        const words = lowerText.split(/\s+/);
        const translatedWords = words.map(word => dictionary[word] || word);
        return translatedWords.join(' ');
    }
}

/* Функция перевода с русского на английский.
   Аналогичная логике перевода на русский, но словарь перевода инвертирован. */
function translateToEnglish(text) {
    const dictionary = {
        "привет": "hello",
        "мир": "world",
        "как дела": "how are you",
        "доброе утро": "good morning",
        "спокойной ночи": "good night",
        "спасибо": "thank you",
        "пожалуйста": "please",
        "я тебя люблю": "i love you"
        // Добавляйте больше слов и фраз по необходимости
    };

    const lowerText = text.toLowerCase().trim();
    if (dictionary[lowerText]) {
        return dictionary[lowerText];
    } else {
        const words = lowerText.split(/\s+/);
        const translatedWords = words.map(word => dictionary[word] || word);
        return translatedWords.join(' ');
    }
}

// ==================== Основные функции логики бота ===================================

// Функция выбора случайного элемента из массива
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Функция для получения случайного анекдота или шутки
function getRandomJoke() {
    const jokes = [
        "Почему программисты путают Рождество и Хэллоуин? Потому что OCT 31 = DEC 25!",
        "Сколько программистов нужно, чтобы вкрутить лампочку? Ни одного, это аппаратная проблема.",
        "Что сказал нулевой байт первому байту? – Привет, малыш!"
    ];
    return randomFromArray(jokes);
}

// Функция для обработки математических запросов (предполагается, что processMathQuery объявлена отдельно)
function processMathQuery(message) {
    try {
        if (/[\d+\-*/().]/.test(message)) {
            const result = eval(message); // eval() применять с осторожностью
            if (typeof result === 'number' && !isNaN(result)) {
                return result.toString();
            }
        }
    } catch(e) {
        return null;
    }
    return null;
}

/* === Обработка ответов на русском языке === */

function processEmotion(message) {
    if (/(грустно|печально|нехорошо|плохо|уныло|депрессия)/.test(message)) {
        const empathy = [
            "Мне жаль, что тебе грустно. Может, я смогу тебя развеселить?",
            "Все бывает, иногда бывает трудно. Если хочешь, расскажи подробнее.",
            "Я здесь, чтобы выслушать тебя. Иногда даже бот может поддержать."
        ];
        return randomFromArray(empathy);
    }
    return null;
}

function processFuture(message) {
    if (/(будущее|мечта|мечтаю|предвидение)/.test(message)) {
        const futureThoughts = [
            "Будущее не предопределено – его создаем мы сами!",
            "Мечты – это топливо для наших устремлений. Дерзай!",
            "Иногда будущее кажется неопределенным, но каждый шаг приближает нас к цели."
        ];
        return randomFromArray(futureThoughts);
    }
    return null;
}

function processLove(message) {
    if (/(любовь|отношения|сердце|романтика)/.test(message)) {
        const loveResponses = [
            "Любовь – это одна из самых загадочных сил во Вселенной.",
            "Отношения – это баланс между разумом и чувствами.",
            "Любовь способна исцелить душу и подарить надежду."
        ];
        return randomFromArray(loveResponses);
    }
    return null;
}

function getContextualReply(message) {
    if (chatHistory.length > 0) {
        const lastUserMsg = chatHistory.filter(m => m.sender === 'user').slice(-1)[0];
        if (lastUserMsg && lastUserMsg.text.toLowerCase().includes("почему")) {
            return "Как я уже говорил, иногда истинная причина скрыта глубже, чем кажется.";
        }
    }
    return null;
}

function processGreeting(message) {
    if (/(привет|здарова|дарова|здорово|ку)/.test(message)) {
        const greetings = [
            "Здарова! Как жизнь?",
            "Привет, друг! Рад тебя видеть!",
            "Здравствуйте! Чем могу помочь?"
        ];
        return randomFromArray(greetings);
    }
    return null;
}

function processHowAreYou(message) {
    if (/(как дела)/.test(message)) {
        const feelings = [
            "У меня всё отлично, а у тебя?",
            "Спасибо, всё супер! Готов к интеллектуальным баталиям!",
            "Отлично! Мой алгоритм постоянно совершенствуется."
        ];
        return randomFromArray(feelings);
    }
    return null;
}

function processHelpRequest(message) {
    if (/(помоги|объясни|расскажи)/.test(message)) {
        const helps = [
            "Конечно, задай свою задачу, и я постараюсь помочь!",
            "С радостью помогу разобраться. Что именно тебя интересует?",
            "Давай попробуем разобраться вместе!"
        ];
        return randomFromArray(helps);
    }
    return null;
}

function processCapabilities(message) {
    if (/(что ты умеешь|что ты можешь)/.test(message)) {
        return "Я умею решать математические задачи, отвечать на вопросы и вести интеллектуальную беседу. Мой интеллект постоянно растет!";
    }
    return null;
}

function processCreator(message) {
    if (/(кто тебя создал|кто твой создатель)/.test(message)) {
        return "Andranik Hovsepyan";
    }
    return null;
}

function processNameQuery(message) {
    if (/(как тебя зовут|твоё имя|ты кто)/.test(message)) {
        return "Я Andribot, твой интеллектуальный собеседник 🤖";
    }
    return null;
}

function processPhilosophy(message) {
    if (/(зачем|почему|в чем смысл|философия)/.test(message)) {
        const philosophy = [
            "Вопросы бытия требуют глубоких размышлений. Каждый ищет свою истину.",
            "Смысл жизни – в поиске ответов и постоянном развитии.",
            "Иногда ответы сложнее вопросов, но стремление к знаниям движет миром."
        ];
        return randomFromArray(philosophy);
    }
    return null;
}

// ... далее идут остальные функции тематической обработки (на русском), такие как processTechnology, processScience, и т.д.
// (Они остаются без изменений и будут применяться в ветке русского языка)

/* === Обработка ответов на английском языке === */

function processGreetingEn(message) {
    if (/(hello|hi|hey|yo)/.test(message)) {
        const greetings = [
            "Hi there! How's it going?",
            "Hello! Nice to see you.",
            "Hey! What can I do for you today?"
        ];
        return randomFromArray(greetings);
    }
    return null;
}

function processHowAreYouEn(message) {
    if (/(how are you|what's up|how's it going)/.test(message)) {
        const responses = [
            "I'm doing great, thank you!",
            "All systems are optimal. How about you?",
            "Fantastic! Ready to assist you."
        ];
        return randomFromArray(responses);
    }
    return null;
}

function processHelpRequestEn(message) {
    if (/(help|explain|tell me)/.test(message)) {
        const helps = [
            "Sure, ask your question and I'll do my best to help you!",
            "I'm here to assist you. What exactly do you need?",
            "Let's figure it out together. What seems to be the problem?"
        ];
        return randomFromArray(helps);
    }
    return null;
}

function processCapabilitiesEn(message) {
    if (/(what can you do)/.test(message)) {
        return "I can solve math problems, answer questions, and chat intelligently. My knowledge is always growing!";
    }
    return null;
}

function processCreatorEn(message) {
    if (/(who created you|who is your creator)/.test(message)) {
        return "Andranik Hovsepyan";
    }
    return null;
}

function processNameQueryEn(message) {
    if (/(what is your name|who are you)/.test(message)) {
        return "I'm Andribot, your intelligent companion 🤖";
    }
    return null;
}

function processPhilosophyEn(message) {
    if (/(why|what is the meaning)/.test(message)) {
        const philosophy = [
            "The big questions require deep thought. Everyone is searching for their truth.",
            "The meaning of life is found in the quest for answers and continuous self-improvement.",
            "Sometimes the answers are more complex than the questions, yet the pursuit of knowledge drives the world."
        ];
        return randomFromArray(philosophy);
    }
    return null;
}

// Можно также создать английские версии других тематических функций, если необходимо

/* Функция, объединяющая расширенную обработку для получения ответа в зависимости от языка */
function getAdditionalReply(message, lang) {
    let reply;
    if (lang === 'en') {
        reply = processGreetingEn(message);
        if (reply) return reply;
        reply = processHowAreYouEn(message);
        if (reply) return reply;
        reply = processHelpRequestEn(message);
        if (reply) return reply;
        reply = processCapabilitiesEn(message);
        if (reply) return reply;
        reply = processCreatorEn(message);
        if (reply) return reply;
        reply = processNameQueryEn(message);
        if (reply) return reply;
        reply = processPhilosophyEn(message);
        if (reply) return reply;
        // Добавьте и другие английские обработчики (например, технические темы)
    } else {
        // Русская обработка
        reply = processGreeting(message);
        if (reply) return reply;
        reply = processHowAreYou(message);
        if (reply) return reply;
        reply = processHelpRequest(message);
        if (reply) return reply;
        reply = processCapabilities(message);
        if (reply) return reply;
        reply = processCreator(message);
        if (reply) return reply;
        reply = processNameQuery(message);
        if (reply) return reply;
        reply = processPhilosophy(message);
        if (reply) return reply;
        // Остальные функции на русском (напр., processEmotion, processFuture, и т.д.)
        reply = processEmotion(message);
        if (reply) return reply;
        reply = processFuture(message);
        if (reply) return reply;
        reply = processLove(message);
        if (reply) return reply;
        // И остальные тематические функции...
        reply = getContextualReply(message);
        if (reply) return reply;
    }
    return null;
}

/* Основная функция расширенного ответа, объединяющая логику для двух языков */
function getBotReplyExtended(message) {
    const lang = detectLanguage(message);
    
    // Если английский, можно сразу обрабатывать по-английски
    if (lang === 'en') {
        let reply = getAdditionalReply(message, 'en');
        if (reply) return reply;
        // Если дополнительных обработчиков не сработало, используем fallback-ответы на английском
        const fallbackEn = [
            "Could you please clarify what you mean?",
            "I didn't quite understand. Can you rephrase your question?",
            "Let's discuss it further. What exactly are you interested in?"
        ];
        return randomFromArray(fallbackEn);
    } else {
        // Русская ветка
        const lowerMsg = message.toLowerCase();
        let reply = getAdditionalReply(lowerMsg, 'ru');
        if (reply) return reply;
        const fallbackRu = [
            "Интересно, можешь пояснить, что ты имеешь в виду?",
            "Я пока не до конца понял, о чем речь. Попробуй переформулировать вопрос.",
            "Давай обсудим это подробнее. Что конкретно тебя интересует?"
        ];
        return randomFromArray(fallbackRu);
    }
}

// ================================================================================
// Дополнительный блок логики для демонстрационных целей
function initializeBot() {
    console.log("Andribot расширен и готов к работе!");
}
document.addEventListener('DOMContentLoaded', initializeBot);

// =================================================================================
// === НОВЫЕ МОДУЛИ И ФУНКЦИИ (примерно +350 строк) — НЕ УДАЛЯЙ НИЧЕГО СВЕРХУ! ===
// =================================================================================

// -----------------------------
// 1) NLU: распознавание намерений
// -----------------------------
function detectIntent(message) {
    const m = message.toLowerCase();
    if (/(почему|зачем|почему бы не)/.test(m))      return 'WHY';
    if (/(кто ты|who are you)/.test(m))             return 'SELF_ID';
    if (/(кто тебя создал|who created you)/.test(m))return 'CREATOR';
    if (/(меня зовут|my name is)/.test(m))          return 'SET_NAME';
    if (/(как дела|how are you)/.test(m))           return 'HOW_ARE_YOU';
    if (/(что ты умеешь|what can you do)/.test(m))  return 'CAPABILITIES';
    if (/(анекдот|joke)/.test(m))                   return 'JOKE';
    if (/(факт|fact)/.test(m))                      return 'FACT';
    if (/(help|помощь)/.test(m))                    return 'HELP';
    // …добавь ещё по своему усмотрению…
    return 'UNKNOWN';
}

// -----------------------------
// 2) Выделение сущностей (имя, темы и т.д.)
// -----------------------------
function extractEntities(message) {
    const ents = {};
    const m = message.trim();
    let match;
    if (match = m.match(/меня зовут\s+([A-ЯЁа-яёA-Za-z]+)/i)) {
        ents.userName = match[1];
    } else if (match = m.match(/my name is\s+([A-Za-z]+)/i)) {
        ents.userName = match[1];
    }
    // примеры для тем:
    if (/(технологи|technology)/i.test(m)) ents.topic = 'TECH';
    if (/(наука|science)/i.test(m))     ents.topic = 'SCIENCE';
    if (/(спорт|sport)/i.test(m))       ents.topic = 'SPORT';
    // …и т.д.
    return ents;
}

// -----------------------------
// 3) Модуль памяти (помнит имя, последнюю тему и т.д.)
// -----------------------------
const Memory = {
    userName: null,
    lastIntent: null,
    lastTopic: null,
    set: function(key, val) { this[key] = val; },
    get: function(key) { return this[key]; }
};

// -----------------------------
// 4) FAQ‑модуль
// -----------------------------
const FAQ = {
    "что ты умеешь":     "Я могу общаться на разные темы, рассказывать анекдоты, факты, запоминать твое имя и многое другое.",
    "кто тебя создал":   "Меня создал Andranik Hovsepyan.",
    "как тебя зовут":    "Я Andribot, твой интеллектуальный собеседник 🤖",
    // …добавь ещё популярные вопросы…
};

function checkFAQ(message) {
    const key = message.toLowerCase().replace(/[?!.]$/,'').trim();
    return FAQ[key] || null;
}

// -----------------------------
// 5) Модуль динамических тем
// -----------------------------
const Topics = {
    TECH: {
        description: "Технологии — это …",
        examples: [
            "Расскажи про искусственный интеллект.",
            "Что нового в веб‑разработке?"
        ]
    },
    SCIENCE: {
        description: "Наука изучает …",
        examples: [
            "Объясни теорию относительности.",
            "Что такое квантовая физика?"
        ]
    },
    SPORT: {
        description: "Спорт — это …",
        examples: [
            "Расскажи про футбол.",
            "Что такое олимпийские игры?"
        ]
    }
    // …и т.д.
};

// -----------------------------
// 6) Генерация ответа на основе intent/entities/context
// -----------------------------
function generateResponse(intent, entities, originalMessage) {
    // 6.1) Если FAQ
    const faq = checkFAQ(originalMessage);
    if (faq) return faq;

    // 6.2) SELF_ID
    if (intent === 'SELF_ID') {
        return `Я ${BOT_NAME}, твой интеллектуальный собеседник.`;
    }
    // 6.3) CREATOR
    if (intent === 'CREATOR') {
        return `Меня создал ${CREATOR_ARM}.`;
    }
    // 6.4) SET_NAME
    if (intent === 'SET_NAME' && entities.userName) {
        Memory.set('userName', entities.userName);
        return `Приятно познакомиться, ${entities.userName}!`;
    }
    // 6.5) HOW_ARE_YOU
    if (intent === 'HOW_ARE_YOU') {
        return randomFromArray([
            "У меня всё отлично, а у тебя?",
            "Спасибо, всё супер! Готов к интеллектуальным баталиям!",
            "Отлично! Мой алгоритм постоянно совершенствуется."
        ]);
    }
    // 6.6) JOKE
    if (intent === 'JOKE') {
        return getRandomJoke();
    }
    // 6.7) FACT
    if (intent === 'FACT') {
        return randomFromArray([
            "Знаешь ли ты, что …",
            "Интересный факт: …",
            "Вот факт: …"
        ]);
    }
    // 6.8) HELP
    if (intent === 'HELP') {
        return "Я могу помочь с разными темами: технологии, наука, спорт, анекдоты, факты и т.д.";
    }
    // 6.9) Динамические темы
    if (entities.topic) {
        const t = Topics[entities.topic];
        if (t) {
            Memory.set('lastTopic', entities.topic);
            return `${t.description} Например, ты можешь спросить: ${t.examples.join(' или ')}`;
        }
    }
    // 6.10) Контекстный fallback
    const last = Memory.get('lastTopic');
    if (last && /(почему|зачем)/i.test(originalMessage)) {
        return `Мы говорили о теме «${last}». Что именно тебя интересует?`;
    }

    // 6.11) Общие тематические блоки (твои processXxx функции)
    // Здесь можно вызвать: processGreeting, processEmotion и т.д.
    // Например:
    let reply = processGreeting(originalMessage)
             || processEmotion(originalMessage)
             || processFuture(originalMessage)
             || processLove(originalMessage)
             || processHelpRequest(originalMessage)
             || processCapabilities(originalMessage)
             || processNameQuery(originalMessage)
             || processCreator(originalMessage)
             || processPhilosophy(originalMessage);
    if (reply) return reply;

    // 6.12) Fallback
    return randomFromArray([
        "Не совсем понял, можешь переформулировать?",
        "Интересно, расскажи подробнее.",
        "Давай обсудим что‑нибудь ещё."
    ]);
}

// -----------------------------
// 7) Обновлённая функция сборки ответа
// -----------------------------
function getBotReplyExtended(message) {
    const intent   = detectIntent(message);
    const entities = extractEntities(message);
    Memory.set('lastIntent', intent);
    return generateResponse(intent, entities, message);
}

// -----------------------------
// 8) Инициализация бота
// -----------------------------
function initializeBot() {
    console.log(`${BOT_NAME} запущен. Создатель: ${CREATOR_ARM}`);
}
document.addEventListener('DOMContentLoaded', initializeBot);


// === КОНЕЦ НОВЫХ МОДУЛЕЙ ==========================================================