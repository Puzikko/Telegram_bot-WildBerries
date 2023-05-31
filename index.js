const TelegramApi = require("node-telegram-bot-api");
const { token, textFromServer } = require("./env")
const { getOrders } = require("./bot_methods/orders/getOrders");
const { getIncomes } = require("./bot_methods/getIncomes");
const { getStocks } = require("./bot_methods/getStocks");
const { getSales, getSalesABCanalysis } = require("./bot_methods/sales/getSales");
const { test } = require("./bot_methods/test");
const { startInterval, stopInterval, getIntervalStatus } = require("./general/automaticRequest");
const { buttonsWithDateOrders, buttonsWithDateSales } = require("./bot_methods/orders/commons");

const bot = new TelegramApi(token, { polling: true });

//!----------------------------------------------------------------------------------
bot.on('message', async msg => { //! Всё что приходит от бота
    const parse = Date.parse(new Date); //? переводим дату в мс
    const dateNow = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
    const today = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    const yesterday = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + (dateNow.getDate() - 1); //? определение вчерашней даты в формате ГГГГ-ММ-ДД
    const text = msg.text; //? принятое сообщение
    const chatId = msg.chat.id; //? ID чата откуда его вызвали
    const botName = "@WildBerriesBbot"; //? уникальное имя бота (опционально)

    if (text === "/info" || text === "/info" + botName) {
        await bot.sendMessage(chatId, `Я предназначен для отображения статистики с платформы WildBerries.
        Используйте команды для получения информации:
        /info - информация о боте;
        /start - запуск в автоматическом режиме;
        /stop - остановка автоматического режима;
        /orders - о заказах; 
        /incomes - о поставках;
        /stocks - о складах;
        /sales - о продажах;        

	${textFromServer}`)
    };
    try {
        if (text === "/start" || text === "/start" + botName) { //TODO Запуск интервальной функции
            if (!getIntervalStatus()) {
                startInterval(chatId, stopInterval, startInterval);
                bot.sendMessage(chatId, 'Interval запущен.');
            } else {
                bot.sendMessage(chatId, 'Interval всё ещё работает.');
            }

        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    if (text === "/stop" || text === "/stop" + botName) { //TODO Остановка интервальной функции

        if (getIntervalStatus()) {
            stopInterval();
            bot.sendMessage(chatId, 'Interval остановлен.')
        } else {
            bot.sendMessage(chatId, 'Interval уже не работает.');
        }
    };

    try {
        if (text === "/orders" || text === "/orders" + botName) { //TODO Выдать информацию о заказах
            buttonsWithDateOrders(chatId, [today, yesterday]);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в заказах index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/incomes" || text === "/incomes" + botName) { //TODO Выдать информацию о поставках
            getIncomes(chatId, today);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/stocks" || text === "/stocks" + botName) { //TODO Выдать информацию о складах
            getStocks(chatId, today);
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }

    try {
        if (text === "/sales" || text === "/sales" + botName) { //TODO Выдать информацию о продажах
            const thisMonth = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-01"; //? определение даты начала текущего месяца в формате ГГГГ-ММ-ДД
            let lastMonth = undefined;
            if (dateNow.getMonth() === 0) { //? для 1-го месяца (января)
                console.log('в if')
                lastMonth = (dateNow.getFullYear() - 1) + '-12-01'; //? определение даты начала прошлого месяца, после Нового года в формате ГГГГ-ММ-ДД
            } else {
                lastMonth = dateNow.getFullYear() + "-" + (dateNow.getMonth()) + "-01"; //? определение даты начала прошлого месяца в формате ГГГГ-ММ-ДД
            }
            buttonsWithDateSales(chatId, [today, thisMonth, lastMonth])
            // getSales(chatId, today);
        };
    } catch (error) {
        console.log(error)
        bot.sendMessage(chatId, 'Что-то пошло не так в продажах index.js') //? в случае ошибки отправляет сообщение
    }

    if (text === "/test" || text === "/test" + botName) { //TODO Команда для тестовых функций
        // test(chatId);
        getSalesABCanalysis(chatId, '2023-4-30')
    };
});

bot.on('callback_query', async msg => { //! обработка команд с кнопок inlineButton
    const parse = Date.parse(new Date); //? переводим дату в мс
    const dateNow = new Date(parse + 10800000); //? добавляем 3 часа в мс и возвращаем в виде даты
    const today = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate(); //? определение сегодняшней даты в формате ГГГГ-ММ-ДД
    const yesterday = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + (dateNow.getDate() - 1); //? определение вчерашней даты в формате ГГГГ-ММ-ДД

    const textCBQ = msg.data.split('|'); //? разбиваем массив по сепаратору
    const chatId = msg.message.chat.id; //? ID чата откуда его вызвали

    try {
        if (textCBQ[0] === 'orders') { //? при нажатии кнопки "Сегодня" или "Вчера"
            getOrders(chatId, textCBQ[1]);
        };
        if (textCBQ[0] === 'ordersAtInterval') { //? при нажатии 3-ей кнопки
            getOrders(chatId, today, true);
        };

        if (textCBQ[0] === 'sales') { //? при нажатии кнопки "Сегодня"
            getSales(chatId, textCBQ[1]);
        };
        if (textCBQ[0] === 'salesABCanalysis') { //? при нажатии кнопки ABC-анализ
            getSalesABCanalysis(chatId, textCBQ[1]);
        };
    } catch (error) {
        console.log(error)
        bot.sendMessage(chatId, 'Что-то пошло не так в index.js') //? в случае ошибки отправляет сообщение
    }
})