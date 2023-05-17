const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);
const { axiosInstance } = require("../api/axios_instance");


const test = (chatId, msg) => { //! Тестовый алгоритм
    bot.sendMessage(chatId, new Date())
};



module.exports.test = test;