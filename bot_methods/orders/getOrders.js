const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const { axiosInstance } = require("../../api/axios_instance");
const { transformArray, translateOrders } = require('./commons');

const bot = new TelegramApi(token);

const getOrders = async (chatId, date) => { //! Обработчик заказов

    const response = await axiosInstance.get('orders?flag=1&dateFrom=' + date)//? запрос от WB

    const arrayOfOrders = await transformArray(response.data);

    if (arrayOfOrders?.length > 0) {
        awaitResolve(chatId, arrayOfOrders, translateOrders)//? кастомная функция для отправки сообщений последовательно
        // await bot.sendMessage(chatId, 'Это был последний заказ на текущий запрос.')
    } else { bot.sendMessage(chatId, 'На сегодня никаких заказов нет.') }
};

module.exports.getOrders = getOrders;