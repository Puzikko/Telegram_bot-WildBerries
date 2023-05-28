const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);
const { axiosInstance } = require("../api/axios_instance");


const test = (chatId, arrayOfDates = []) => { //! Тестовый алгоритм
    const button = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Today', callback_data: arrayOfDates[0] }, { text: 'Yesterday', callback_data: arrayOfDates[1] }]
            ]
        })
    }

    bot.sendMessage(chatId, 'yo!', button)
};



module.exports.test = test;