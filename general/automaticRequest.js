const { getOrdersTiming } = require("../bot_methods/orders/getOrdersTiming");

let interval = undefined; //? переменная для инициализации setInterval для ф-ии getOrdersTiming
let isWorking = false; //? проверка на работу интервала

const startInterval = (chatId, stopInterval, startInterval) => {
    if (isWorking) return;
    isWorking = true;
    getOrdersTiming(chatId, stopInterval, startInterval, setIsWorkingTrue, true);
    interval = setInterval(() => { //? Установка интервала для переодичного вызова ф-ии
        if (!getIntervalStatus()) {
            clearInterval(interval);
            return;
        }
        const parse = Date.parse(new Date); //? переводим дату в мс
        const today = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
        console.log(today); //? для отслеживания в консоле сервера последние логи работы бота
        getOrdersTiming(chatId, stopInterval, startInterval, setIsWorkingTrue, getIntervalStatus());
    }, 300000);
};

const stopInterval = () => {
    if (!isWorking) return;
    clearInterval(interval);
    isWorking = false;
};

const setIsWorkingTrue = () => {
    isWorking = true;
};

const getIntervalStatus = () => {
    return isWorking;
};

module.exports.startInterval = startInterval;
module.exports.stopInterval = stopInterval;
module.exports.getIntervalStatus = getIntervalStatus;