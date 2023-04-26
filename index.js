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
    const text = msg.text;
    const chatId = msg.chat.id;


    if (text === '/start') {
        await bot.sendMessage(chatId, `Я предназначен для отображения статистики с платформы WildBerries.
        Используйте команды для получения информации:
        /orders - о заказах; 
        /incomes - о поставках;
        /stocks - о складах;
        /sales - о продажах.`)
    };
    if (text === "/orders") {
        getOrders(chatId, date);
    };
    if (text === "/incomes") {
        getIncomes(chatId, date);
    };
    if (text === "/stocks") {
        getStocks(chatId, date);
    };
    if (text === "/sales") {
        getSales(chatId, date);
    };
    if (text === "/test") {
        test(chatId);
    };
});