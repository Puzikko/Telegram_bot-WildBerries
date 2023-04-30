const TelegramApi = require("node-telegram-bot-api");
const { token } = require("./env")
const { getOrders } = require("./bot_methods/getOrders");
const { getIncomes } = require("./bot_methods/getIncomes");
const { getStocks } = require("./bot_methods/getStocks");
const { getSales } = require("./bot_methods/getSales");
const { test } = require("./bot_methods/test");

const bot = new TelegramApi(token, { polling: true });

const today = new Date;
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
//!----------------------------------------------------------------------------------
bot.on('message', async msg => { //! Всё что приходит от бота
    const text = msg.text; //? принятое сообщение
    const chatId = msg.chat.id; //? ID чата откуда его вызвали
    const botName = "@TesterOfTestsBot"; //? уникальное имя бота (опционально)

    if (text === "/start" || text === "/start" + botName) {
        await bot.sendMessage(chatId, `Я предназначен для отображения статистики с платформы WildBerries.
        Используйте команды для получения информации:
        /orders - о заказах; 
        /incomes - о поставках;
        /stocks - о складах;
        /sales - о продажах.`)
    };
    if (text === "/orders" || text === "/orders" + botName) {
        getOrders(chatId, date);
    };
    if (text === "/incomes" || text === "/incomes" + botName) {
        getIncomes(chatId, date);
    };
    if (text === "/stocks" || text === "/stocks" + botName) {
        getStocks(chatId, date);
    };
    if (text === "/sales" || text === "/sales" + botName) {
        getSales(chatId, date);
    };
    if (text === "/test" || text === "/test" + botName) {
        test(chatId);
    };
});