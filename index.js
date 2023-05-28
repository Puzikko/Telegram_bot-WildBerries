const TelegramApi = require("node-telegram-bot-api");
const { token, textFromServer } = require("./env")
const { getOrders } = require("./bot_methods/orders/getOrders");
const { getIncomes } = require("./bot_methods/getIncomes");
const { getStocks } = require("./bot_methods/getStocks");
const { getSales } = require("./bot_methods/getSales");
const { test } = require("./bot_methods/test");
const { startInterval, stopInterval } = require("./general/automaticRequest");

const bot = new TelegramApi(token, { polling: true });

//!----------------------------------------------------------------------------------
bot.on('message', async msg => { //! Всё что приходит от бота
    const parse = Date.parse(new Date); //? переводим дату в мс
    const today = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    const text = msg.text; //? принятое сообщение
    const chatId = msg.chat.id; //? ID чата откуда его вызвали
    const botName = "@TesterOfTestsBot"; //? уникальное имя бота (опционально)


    if (text === "/info" || text === "/info" + botName) {
        await bot.sendMessage(chatId, `Я предназначен для отображения статистики с платформы WildBerries.
        Используйте команды для получения информации:
        /orders - о заказах; 
        /incomes - о поставках;
        /stocks - о складах;
        /sales - о продажах;
        /info - информация о боте.

	${textFromServer}`)
    };
    try {
        if (text === "/start" || text === "/start" + botName) {
            startInterval(chatId, stopInterval);
            bot.sendMessage(chatId, 'Interval is working.');
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    if (text === "/stop" || text === "/stop" + botName) {
        stopInterval();
        bot.sendMessage(chatId, 'Interval stoped.')
    };

    try {
        if (text === "/orders" || text === "/orders" + botName) {
            getOrders(chatId, date);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/incomes" || text === "/incomes" + botName) {
            getIncomes(chatId, date);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/stocks" || text === "/stocks" + botName) {
            getStocks(chatId, date);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/sales" || text === "/sales" + botName) {
            getSales(chatId, date);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    if (text === "/test" || text === "/test" + botName) { //! блок с кнопками inlineButton в сообщении (в разработке)
        test(chatId, text);
    };
});

bot.on('callback_query', msg => { //! обработка команд с кнопок inlineButton
    const textCBQ = msg.data;
    const chatId = msg.chat.id; //? ID чата откуда его вызвали

    try {
        if (textCBQ === "/test") {
            test(chatId, text);
        };
    } catch (error) {
        console.log(error)
    }
})