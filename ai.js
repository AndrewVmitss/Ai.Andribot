/*******************************************************
 *  Andribot - Chatbot with "Improved IQ", Offensive Filter,
 *           Special "ok" Response Handling,
 *           and "Thinking" Animation
 *  Creator: Ваше имя (Creator: Անդրանիկ Հովսեփյան)
 *******************************************************/

// --------------------------------------
// 1) DOM Elements
// --------------------------------------
const input = document.getElementById("userInput");
const chat = document.getElementById("chat");

// Глобальная переменная для хранения последнего запроса пользователя (для "ok")
let lastUserQuery = "";

// --------------------------------------
// 2) Event Listeners
// --------------------------------------
// Отправка по нажатию Enter
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// --------------------------------------
// 3) Главная функция отправки сообщений
// --------------------------------------
function sendMessage() {
  const userText = input.value.trim();
  if (userText === "") return;

  // Если пользователь пишет "ok" (или "ок")
  const normalized = userText.toLowerCase();
  if (normalized === "ok" || normalized === "ок") {
    // Определяем, был ли предыдущий запрос вопросом (знак вопроса в конце)
    let isFollowUpAnswer = false;
    if (lastUserQuery && lastUserQuery.trim().endsWith("?")) {
      isFollowUpAnswer = true;
    }
    const response = isFollowUpAnswer ? getPositiveOkResponse() : getUncertainOkResponse();
    renderMessage(`Ты: ${userText}`, "user");
    input.value = "";
    setTimeout(() => {
      renderMessage(`Andribot: ${response}`, "bot");
    }, 500);
    return;
  }

  // Если сообщение не "ok", сохраняем его как последний пользовательский запрос
  lastUserQuery = userText;

  // Проверяем на неприемлемую лексику
  const isOffensive = checkOffensiveLanguage(userText);
  if (isOffensive) {
    renderMessage(`Ты (нарушение правил): ${userText}`, "user-offensive");
  } else {
    renderMessage(`Ты: ${userText}`, "user");
  }
  input.value = "";

  // Генерируем ответ бота
  const botReply = getBotReply(userText, isOffensive);

  // Перед выводом ответа добавляем анимацию "думания"
  renderThinkingThenAnswer(botReply);
}

// Функция, которая отображает сообщение "думания", а затем выводит ответ бота
function renderThinkingThenAnswer(botReply) {
  // Создаём временный элемент "Thinking..."
  const thinkingMessage = document.createElement("div");
  thinkingMessage.classList.add("chat-message", "bot-thinking");
  chat.appendChild(thinkingMessage);

  let dotCount = 0;
  function animateThinking() {
    dotCount = (dotCount + 1) % 4; // меняется от 0 до 3 точек
    thinkingMessage.textContent = "Andribot is thinking" + ".".repeat(dotCount);
    chat.scrollTop = chat.scrollHeight;
  }
  // Обновляем каждые 500 мс
  const thinkingInterval = setInterval(animateThinking, 500);

  // По истечении 2 секунд прекращаем анимацию и выводим реальный ответ с эффектом печати
  setTimeout(() => {
    clearInterval(thinkingInterval);
    chat.removeChild(thinkingMessage);
    renderMessage(`Andribot: ${botReply}`, "bot");
  }, 2000);
}

// --------------------------------------
// 4) Функция формирования ответа бота
// --------------------------------------
function getBotReply(message, isOffensive) {
  // Если сообщение содержит неприемлемые слова, даём предупреждение
  if (isOffensive) {
    return "Ваше сообщение содержит неприемлемую лексику. Пожалуйста, придерживайтесь норм общения.";
  }
  // Определяем язык по наличию кириллицы
  const isRussian = /[а-яё]/i.test(message.toLowerCase());
  return getBotReplyEnhanced(message, isRussian);
}

// --------------------------------------
// 5) Расширенная обработка сообщения и генерация ответа
// --------------------------------------
function getBotReplyEnhanced(message, isRussian) {
  const messageLower = message.toLowerCase();
  const tokens = tokenize(messageLower);
  const keywords = extractKeywords(tokens);
  const intent = determineIntent(tokens, keywords);
  const sentiment = analyzeSentiment(tokens);
  const creatorNameArm = "Անդրանիկ Հովսեփյան";

  // Если вопрос про создателя
  if (intent === "ask_creator") {
    return isRussian
      ? `Меня создал ${creatorNameArm}.`
      : `I was created by ${creatorNameArm}.`;
  }

  // Приветствия
  if (intent === "greeting") {
    return isRussian
      ? getRandomResponse(rusGreetings)
      : getRandomResponse(engGreetings);
  }

  // Вопрос о делах
  if (intent === "ask_status") {
    return isRussian
      ? getRandomResponse(rusStatuses)
      : getRandomResponse(engStatuses);
  }

  // Вопрос о возможностях
  if (intent === "ask_capabilities") {
    return isRussian
      ? `Я умею анализировать сообщения, переключаться на английский и фильтровать неприемлемые слова. Меня зовут Andribot, мой создатель — ${creatorNameArm}.`
      : `I can analyze messages, switch languages, and filter offensive words. My name is Andribot, created by ${creatorNameArm}.`;
  }

  // "Кто ты" / "Who are you"
  if (intent === "ask_identity") {
    return isRussian
      ? "Я — Andribot, умный бот, готовый общаться на любые темы!"
      : "I'm Andribot, a smart bot ready to chat about anything!";
  }

  // Если намерение не определено – расширяем диалог
  if (intent === "unknown") {
    return expandDialogue(messageLower, isRussian);
  }

  // Fallback
  return isRussian
    ? "Я пока не всё понимаю, но стараюсь развиваться каждый день!"
    : "I'm not sure I understand, but I'm learning every day!";
}

// --------------------------------------
// 6) "Интеллектуальные" функции (NLP-подобное)
// --------------------------------------

// 6.1) Примеры фраз для ответов
const rusGreetings = [
  "Привет, как жизнь?",
  "Здарова, рад тебя видеть!",
  "Хай, чем занимаешься?",
  "О, приветствую! Как настроение?"
];

const engGreetings = [
  "Hey there, what's up?",
  "Hello! How's your day going?",
  "Hi! Nice to see you here.",
  "Hey, how are you today?"
];

const rusStatuses = [
  "Всё отлично, а у тебя?",
  "Супер, как у тебя дела?",
  "Отлично! Что нового?",
  "У меня всё хорошо, а у тебя как?"
];

const engStatuses = [
  "I'm doing great, and you?",
  "All good here! What's new?",
  "Everything is fine! How about you?",
  "Doing well! How are you feeling?"
];

// 6.2) Токенизация текста
function tokenize(text) {
  return text
    .replace(/[\.,!?;:()"']/g, "")
    .split(/\s+/)
    .filter(token => token.length > 0);
}

// 6.3) Удаление стоп-слов (упрощённо)
function removeStopWords(tokens) {
  const stopWordsRu = [
    "и", "в", "на", "с", "как", "а", "но", "что", "тот", "это", "то", "быть",
    "для", "к", "о", "по", "у", "же", "не", "из", "за", "ну", "там", "меня", "тебя"
  ];
  const stopWordsEn = [
    "and", "or", "but", "the", "what", "this", "that", "to", "for", "is", "are",
    "a", "an", "of", "be", "in", "it", "i", "you", "me", "we"
  ];
  const isRussian = tokens.some(token => /[а-яё]/i.test(token));
  const stopWords = isRussian ? stopWordsRu : stopWordsEn;
  return tokens.filter(t => !stopWords.includes(t));
}

// 6.4) Извлечение ключевых слов
function extractKeywords(tokens) {
  let filtered = removeStopWords(tokens);
  filtered = filtered.filter(token => token.length > 2);
  return filtered;
}

// 6.5) Определение намерения (intent)
function determineIntent(tokens, keywords) {
  const greetingWords = ["привет", "хай", "hello", "hey", "yo", "здарова", "дарова", "wassap", "qq"];
  const askStatusWords = ["дела", "как", "чё", "че", "настроение", "how", "what's", "going"];
  const askCapabilitiesWords = ["умеешь", "можешь", "функции", "способности", "capabilities", "can", "do"];
  const askIdentityWords = ["кто", "ты", "who", "are", "identity"];
  const askCreatorWords = ["создал", "creator", "создатель"];
  
  let greetingScore = 0,
      statusScore = 0,
      capabilitiesScore = 0,
      identityScore = 0,
      creatorScore = 0;
  
  keywords.forEach(word => {
    if (greetingWords.includes(word)) greetingScore++;
    if (askStatusWords.includes(word)) statusScore++;
    if (askCapabilitiesWords.includes(word)) capabilitiesScore++;
    if (askIdentityWords.includes(word)) identityScore++;
    if (askCreatorWords.includes(word)) creatorScore++;
  });
  
  const text = tokens.join(" ");
  if (text.includes("кто создал") || text.includes("who created") || text.includes("твой создатель")) {
    creatorScore += 2;
  }
  if (text.includes("как дела") || text.includes("how are you") || text.includes("what's up")) {
    statusScore += 2;
  }
  if (text.includes("что ты умеешь") || text.includes("what can you do")) {
    capabilitiesScore += 2;
  }
  if (text.includes("привет") || text.includes("hello") || text.includes("hi")) {
    greetingScore += 2;
  }
  if (text.includes("кто ты") || text.includes("who are you")) {
    identityScore += 2;
  }
  
  const scores = {
    greeting: greetingScore,
    ask_status: statusScore,
    ask_capabilities: capabilitiesScore,
    ask_identity: identityScore,
    ask_creator: creatorScore
  };
  
  let maxScore = 0, finalIntent = "unknown";
  for (let key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      finalIntent = key;
    }
  }
  return finalIntent;
}

// 6.6) Анализ тональности (упрощённо)
function analyzeSentiment(tokens) {
  const posWords = ["хорошо", "отлично", "супер", "норм", "great", "amazing"];
  const negWords = ["плохо", "ужасно", "bad", "terrible", "awful", "hate"];
  let score = 0;
  tokens.forEach(token => {
    if (posWords.includes(token)) score++;
    if (negWords.includes(token)) score--;
  });
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

// 6.7) Расширение диалога, если намерение не определено
function expandDialogue(message, isRussian) {
  return isRussian
    ? "Интересно, расскажи подробнее!"
    : "Interesting, tell me more!";
}

// --------------------------------------
// 7) Фильтр неприемлемой лексики
// --------------------------------------
function checkOffensiveLanguage(text) {
  const sexualWords = ["sex", "порно", "порн", "трах", "porn", "horny"];
  const rudeWords = ["блять", "сука", "fuck", "f*ck", "shit", "bitch", "ебать", "хуй"];
  const allOffensiveWords = [...sexualWords, ...rudeWords];
  return allOffensiveWords.some(word => text.toLowerCase().includes(word));
}

// --------------------------------------
// 8) Помощники: случайный выбор ответа
// --------------------------------------
function getRandomResponse(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Функции для обработки "ok"
function getPositiveOkResponse() {
  const isRussian = /[а-яё]/i.test(lastUserQuery);
  return isRussian
    ? getRandomResponse(["Окей!", "Ладно!", "Окей!!"])
    : getRandomResponse(["Alright!", "Ok!", "Okay!!"]);
}

function getUncertainOkResponse() {
  const isRussian = /[а-яё]/i.test(lastUserQuery);
  return isRussian
    ? getRandomResponse(["Окей?", "Ладно?", "Окей...?"])
    : getRandomResponse(["Alright?", "Ok?", "Okay...?"]);
}

// --------------------------------------
// 9) Отображение сообщений (с эффектом печати для бота)
// --------------------------------------
function renderMessage(text, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", type);
  chat.appendChild(messageElement);
  
  if (type === "bot") {
    let i = 0;
    const speed = 30; // скорость печати в мс
    function typeChar() {
      if (i < text.length) {
        messageElement.textContent += text.charAt(i++);
        chat.scrollTop = chat.scrollHeight;
        setTimeout(typeChar, speed);
      }
    }
    typeChar();
  } else {
    messageElement.textContent = text;
  }
  chat.scrollTop = chat.scrollHeight;
}
