const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { axiosInstance } = require("../../api/axios_instance");
const { translateOrders } = require('./commons');
const { saveAndSendOrders } = require('./commons')

const bot = new TelegramApi(token);
let arrayOfID = [];

const getOrdersTiming = async (chatId, date, stopInterval) => { //! Обработчик заказов
    try {
        const response = await axiosInstance.get('orders?flag=1&dateFrom=' + date)//? запрос от WB

        arrayOfID = await saveAndSendOrders(await response.data, arrayOfID, chatId, translateOrders)
    } catch (error) {
        // console.log(error)
        stopInterval();
        if (!!error.response.status) {
            switch (error.response.status) { //? по номеру ошибки отправляем текст боту
                case 401:
                    bot.sendMessage(chatId, 'Error:  ' + error.response.statusText)
                    break;
                case 429:
                    bot.sendMessage(chatId, 'Error:  ' + error.response.statusText)
                    break;
                default:
                    bot.sendMessage(chatId, 'Error:  ' + error.response.data.errors.join('\n'))
                    break;
            }
        } else {bot.sendMessage(chatId, 'Что-то пошло не так в Интервале')} //? в случае ошибки отправляет сообщение
        bot.sendMessage(chatId, 'Интервальная функция была автоматически остановлена.\nЧтобы запустить её снова отправьте команду:\n/start')
    }
};

module.exports.getOrdersTiming = getOrdersTiming;