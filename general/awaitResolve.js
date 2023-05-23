const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")
const { newObject } = require("./newObject")
const { messageConstructor } = require("./messageConstructor")

const bot = new TelegramApi(token);

const awaitResolve = async (chatId, array, translateObject, messageСontent = 10) => { //! Отправка сообщений по порядку

    let text = new String;
    for (let i = 1; i <= array?.length; i++) {
        text += i + ') ' + messageConstructor(newObject(array[i - 1]), translateObject) + '\n----------------------------------------\n';
        if (i % messageСontent === 0) {
            await bot.sendMessage(chatId, text);
            text = '';
        } else if (i === array.length) {
            await bot.sendMessage(chatId, text);
        }
    }
};

module.exports.awaitResolve = awaitResolve;