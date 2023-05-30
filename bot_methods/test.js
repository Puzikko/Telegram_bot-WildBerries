const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);


const test = (chatId) => { //! Тестовый алгоритм
    bot.sendMessage(chatId, 'Не трожь!!!')
};



module.exports.test = test;