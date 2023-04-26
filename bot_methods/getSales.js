const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getSales = async (chatId, date) => { //! Обработчик продаж

    const response = await axiosInstance.get('sales?flag=1&dateFrom=' + date)//? запрос от WB

    const arrayOfSales = response.data;

    if (arrayOfSales.length > 0) {
        awaitResolve(chatId, arrayOfSales, {})//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня информации о продажах нет.') };

};

module.exports.getSales = getSales;