const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getIncomes = async (chatId, date) => { //! Обработчик поставок

    const response = await axiosInstance.get('incomes?dateFrom=' + date)//? запрос от WB

    const arrayOfIncomes = await response.data; //? Обработка респонса

    if (arrayOfIncomes.length > 0) {
        awaitResolve(chatId, arrayOfIncomes, translateIncomes)//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня никаких поставок нет.') }
};

module.exports.getIncomes = getIncomes;

const translateIncomes = {
    incomeId: 'Номер поставки',
    number: 'Номер УПД',
    date: 'Дата поступления',
    supplierArticle: 'Артикул поставщика',
    techSize: 'Размер товара',
    barcode: 'Бар - код',
    quantity: 'Количество',
    totalPrice: 'Цена из УПД',
    dateClose: 'Дата принятия(закрытия) в WB',
    warehouseName: 'Название склада',
    nmId: 'Артикул WB',
    status: 'Текущий статус поставки',
};