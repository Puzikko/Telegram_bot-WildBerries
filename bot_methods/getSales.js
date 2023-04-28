const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getSales = async (chatId, date) => { //! Обработчик продаж

    const response = await axiosInstance.get('sales?flag=1&dateFrom=' + date)//? запрос от WB

    const arrayOfSales = response.data;

    if (arrayOfSales.length > 0) {
        awaitResolve(chatId, arrayOfSales, translateSales)//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня информации о продажах нет.') };

};

module.exports.getSales = getSales;

const translateSales = {
    gNumber: 'Номер заказа',
    date: 'Дата и время продажи',
    supplierArticle: 'Артикул поставщика',
    techSize: 'Размер товара',
    barcode: 'Бар-код',
    totalPrice: 'Цена до согласованной скидки',
    priceWithDiscount: 'Цена с дисконтом',
    discountPercent: 'Согласованный итоговый дисконт',
    isSupply: 'Договор поставки',
    isRealization: 'Договор реализации',
    promoCodeDiscount: 'Скидка по промокоду',
    warehouseName: 'Название склада отгрузки',
    countryName: 'Страна',
    oblastOkrugName: 'Округ',
    regionName: 'Регион',
    incomeID: 'Номер поставки (от продавца на склад)',
    saleID: 'Уникальный идентификатор продажи/возврата.',
    odid: 'Уникальный идентификатор позиции заказа',
    spp: 'Согласованная скидка постоянного покупателя',
    forPay: 'К перечислению поставщику',
    finishedPrice: 'Фактическая цена заказа с учетом всех скидок',
    priceWithDisc: 'Цена, от которой считается вознаграждение поставщика forpay',
    nmId: 'Артикул WB',
    subject: 'Предмет',
    category: 'Категория',
    brand: 'Бренд',
    isStorno: 'Для сторно-операций 1, для остальных 0',
    sticker: 'Цифровое значение стикера',
    srid: 'Уникальный идентификатор заказа'
};