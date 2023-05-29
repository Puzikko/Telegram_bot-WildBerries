const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { axiosInstance } = require("../../api/axios_instance");
const { translateOrders } = require('./commons');
const { saveAndSendOrders } = require('./commons')

const bot = new TelegramApi(token);
let arrayOfID = [];

const getOrdersTiming = async (chatId, stopInterval) => { //! Обработчик заказов
    const parse = Date.parse(new Date);
    const today = new Date(parse + 10800000);
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    console.log(hours, minutes)
    if (arrayOfID.length > 0) { //? обновление массива при смене дня
        if (hours === 0 && minutes >= 0 && minutes <= 5) { //? проверка времени 00:00 - 00:05, в этом интервале обновим массив
            arrayOfID = [];
            bot.sendMessage(chatId, 'Массив с ID обновлён.')
        }
    };

    try {
        const response = await axiosInstance.get('orders?flag=0&dateFrom=' + date)//? запрос от WB

        arrayOfID = await saveAndSendOrders(await response.data, arrayOfID, chatId, translateOrders)
    } catch (error) {
        stopInterval(); //? Остановка интервала при появлении ошибки
        if (!!error.response.status) {
            switch (error.response.status) { //? по номеру ошибки отправляем текст боту
                case 401:
                    bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.statusText)
                    break;
                case 429:
                    bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.statusText)
                    break;
                default:
                    bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.data.errors.join('\n'))
                    break;
            }
        } else { bot.sendMessage(chatId, 'Что-то пошло не так в Интервале') } //? в случае ошибки отправляет сообщение
        bot.sendMessage(chatId, 'Интервальная функция была автоматически остановлена.\nЧтобы запустить её снова отправьте команду:\n/start')
    }
};

module.exports.getOrdersTiming = getOrdersTiming;