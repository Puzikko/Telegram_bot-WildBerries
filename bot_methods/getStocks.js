const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getStocks = async (chatId, date) => { //! Обработчик складов

    const response = await axiosInstance.get('stocks?dateFrom=' + date)//? запрос от WB

    const arrayOfStocks = response.data.map(obj => {
        delete obj.lastChangeDate; //?vvv
        delete obj.isSupply;
        delete obj.isRealization;
        delete obj.SCCode; //? ^^^^^^ удаление указанных ключей со свойствами
        return obj; //? возврат объекта
    });

    if (arrayOfStocks.length > 0) {
        awaitResolve(chatId, arrayOfStocks, translateStocks)//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня информации о складах нет.') };
};

module.exports.getStocks = getStocks;

const translateStocks = {
    supplierArticle: 'Артикул поставщика',
    techSize: 'Размер товара',
    barcode: 'Бар-код',
    quantity: 'Количество, доступное для продажи (сколько можно добавить в корзину)',
    isSupply: 'Договор поставки',
    isRealization: 'Договор реализации',
    quantityFull: 'Полное (непроданное) количество, которое числится за складом',
    warehouseName: 'Название склада',
    nmId: 'Артикул WB',
    subject: 'Предмет',
    category: 'Категория',
    daysOnSite: 'Количество дней на сайте',
    brand: 'Бренд',
    SCCode: 'Код контракта',
    Price: 'Цена',
    Discount: 'Скидка'
}