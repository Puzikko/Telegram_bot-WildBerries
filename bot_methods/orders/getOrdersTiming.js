const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { ordersAPI } = require("../../api/axios_instance");
const { translateOrders } = require('./commons');
const { saveAndSendOrders } = require('./commons');

const bot = new TelegramApi(token);

const ordersInfo = {
    arrayOfOrders: [],
    total: 0
} //? инициализируем объект для хранения данных о заказах

const getOrdersTiming = async (chatId, stopInterval, startInterval, setIsWorking, isWorking) => { //! Обработчик заказов
    if (!isWorking) return;
    const parse = Date.parse(new Date); //? переводим дату в мс
    const today = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    console.log(hours, minutes)
    if (hours === 0 && minutes >= 0 && minutes <= 5) { //? проверка времени 00:00 - 00:05, в этом интервале обновим массив
        ordersInfo = {
            arrayOfOrders: [],
            total: 0
        }; //? обновление объекта с инфой при смене дня
    };
    try {
        // const promiseOrdersFlag0 = await ordersAPI(date)//? запрос на WB с flag = 0
        //     .then(response => response.filter(order => order.isCancel)); //? отфильтровываем заказы с отменой isCancel = true

        const promiseOrdersFlag1 = await ordersAPI(date, 1)//? запрос на WB с flag = 1

        // const response = promiseOrdersFlag1;

        // const response = await Promise.all([ //? выполняем оба запроса
        //     //promiseOrdersFlag0,
        //     promiseOrdersFlag1
        // ]).then(array => {
        //     return array[0]
        //     // .concat(array[1])
        // }) //? объединяем два полученных массива

        ordersInfo.arrayOfOrders = await saveAndSendOrders(await promiseOrdersFlag1, ordersInfo, chatId, translateOrders) //? Присваиваем массиву полученные заказы
    } catch (error) {
        console.log(error)
        stopInterval(); //? Остановка интервала при появлении ошибки
        if (!!error?.response?.status) {
            switch (error.response.status) { //? по номеру ошибки отправляем текст боту
                case 408:
                    setIsWorking(true);
                    setTimeout(() => {
                        setIsWorking(false);
                        startInterval(chatId, stopInterval, startInterval);
                        // bot.sendMessage(chatId, 'Interval снова в работе.');
                    }, 60000);
                    // bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.statusText + '\nИнтервальная функция запуститься автоматически через 20 минут!')
                    break;
                case 429:
                    setTimeout(() => {
                        startInterval(chatId, stopInterval, startInterval);
                    }, 60000);
                    break;
                default:
                    // bot.sendMessage(chatId, 'Error ' + error.response.status + ':  ' + error.response.data.errors.join('\n'))
                    // bot.sendMessage(chatId, 'Интервальная функция была автоматически остановлена.\nЧтобы запустить её снова отправьте команду:\n/start')
                    break;
            }
        } else { bot.sendMessage(chatId, 'Что-то пошло не так в Интервале') } //? в случае ошибки отправляет сообщение
    }
};


const getArrayOfOrders = () => {
    return [...ordersInfo.arrayOfOrders];
}

module.exports.getOrdersTiming = getOrdersTiming;
module.exports.getArrayOfOrders = getArrayOfOrders;