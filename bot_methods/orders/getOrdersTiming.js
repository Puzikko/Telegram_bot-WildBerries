const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { axiosInstance } = require("../../api/axios_instance");
const { translateOrders } = require('./commons');
const { saveAndSendOrders } = require('./commons')

const bot = new TelegramApi(token);
let arrayOfID = [];
let t = 0

const getOrdersTiming = async (chatId, date) => { //! Обработчик заказов

    const response = await axiosInstance.get('orders?flag=1&dateFrom=' + date)//? запрос от WB

    arrayOfID = await saveAndSendOrders(await response?.data, arrayOfID, chatId, translateOrders)

    bot.sendMessage(chatId, ++t)
    setTimeout(() => {
        getOrdersTiming(chatId, date)
    }, 300000);
};

module.exports.getOrdersTiming = getOrdersTiming;