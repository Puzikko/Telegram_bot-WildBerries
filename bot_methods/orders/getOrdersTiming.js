const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { ordersAPI } = require("../../api/axios_instance");
const { translateOrders } = require('./commons');
const { saveAndSendOrders } = require('./commons');

const bot = new TelegramApi(token);
let arrayOfOrders = [];

const getOrdersTiming = async (chatId, stopInterval, startInterval, isWorking) => { //! Обработчик заказов
    if (!isWorking) return;
    const parse = Date.parse(new Date); //? переводим дату в мс
    const today = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    console.log(hours, minutes)
    if (hours === 0 && minutes >= 0 && minutes <= 5) { //? проверка времени 00:00 - 00:05, в этом интервале обновим массив
        arrayOfOrders = []; //? обновление массива при смене дня
        bot.sendMessage(chatId, 'Массив с ID обновлён.')
    };
    try {
        const response = await ordersAPI(date)//? запрос от WB

        arrayOfOrders = await saveAndSendOrders(await response, arrayOfOrders, chatId, translateOrders) //? Присваиваем массиву полученные заказы
    } catch (error) {
        stopInterval(); //? Остановка интервала при появлении ошибки
        if (!!error?.response?.status) {
            switch (error.response.status) { //? по номеру ошибки отправляем текст боту
                case 408:
                    setTimeout(() => {
                        startInterval(chatId, stopInterval, startInterval);
                        bot.sendMessage(chatId, 'Interval снова в работе.');
                    }, 600000);
                    bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.statusText + '\nИнтервальная функция запуститься автоматически через 10 минут!')
                    break;
                default:
                    bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.data.errors.join('\n'))
                    bot.sendMessage(chatId, 'Интервальная функция была автоматически остановлена.\nЧтобы запустить её снова отправьте команду:\n/start')
                    break;
            }
        } else { bot.sendMessage(chatId, 'Что-то пошло не так в Интервале') } //? в случае ошибки отправляет сообщение
    }
};


const getArrayOfOrders = () => {
    return [...arrayOfOrders];
}

module.exports.getOrdersTiming = getOrdersTiming;
module.exports.getArrayOfOrders = getArrayOfOrders;