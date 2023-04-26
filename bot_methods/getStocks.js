const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getStocks = async (chatId, date) => { //! Обработчик складов

    const response = await axiosInstance.get('stocks?dateFrom=' + date)//? запрос от WB

    const arrayOfStocks = response.data;

    if (arrayOfStocks.length > 0) {
        awaitResolve(chatId, arrayOfStocks, {})//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня информации о складах нет.') };
};

module.exports.getStocks = getStocks;