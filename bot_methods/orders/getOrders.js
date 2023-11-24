const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const { ordersAPI } = require("../../api/axios_instance");
const { transformArray, translateOrders } = require('./commons');
const { getArrayOfOrders } = require('./getOrdersTiming');

const bot = new TelegramApi(token);

const getOrders = async (chatId, date, infoFromInterval = false, isCancel = false) => { //! Обработчик заказов
    let response = undefined;
    try {
        if (infoFromInterval) {
            response = getArrayOfOrders();
        } else {
            response = await ordersAPI(date, 1)//? запрос от WB
        }

        const arrayOfOrders = await transformArray(response);

        if (arrayOfOrders.length > 0) {
            awaitResolve(chatId, arrayOfOrders, 0, translateOrders)//? кастомная функция для отправки сообщений последовательно
        } else { bot.sendMessage(chatId, 'За выбранную дату никаких заказов нет.') }
    } catch (error) {
        console.log(error.response.data)
        // bot.sendMessage(chatId, 'Error:  ' + error?.response?.data?.errors.join('\n'))
    }
};


module.exports.getOrders = getOrders;