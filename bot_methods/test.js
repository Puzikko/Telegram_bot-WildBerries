const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);
const { axiosInstance } = require("../api/axios_instance");


const test = (chatId, msg) => { //! Тестовый алгоритм
    const button = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Hello' }]
            ]
        })

    }

    bot.sendMessage(chatId, 'yo!', button)
};



module.exports.test = test;