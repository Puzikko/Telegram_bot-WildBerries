const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getSales = async (chatId, date) => { //! Обработчик продаж

    const response = await axiosInstance.get('sales?flag=1&dateFrom=' + date)//? запрос от WB

    const arrayOfSales = await response.data.map(obj => {
        delete obj.lastChangeDate;//?vvv
        delete obj.gNumber;
        delete obj.isSupply;
        delete obj.isRealization;
        delete obj.oblastOkrugName;
        delete obj.odid;
        delete obj.sticker;
        delete obj.srid;//? ^^^^^^ удаление указанных ключей со свойствами
        return obj; //? возврат объекта
    });
    // console.log(arrayOfSales)
    if (arrayOfSales.length > 0) {
        awaitResolve(chatId, arrayOfSales, translateSales, 5)//? кастомная функция для отправки сообщений последовательно
    } else { bot.sendMessage(chatId, 'На сегодня информации о продажах нет.') };

};

module.exports.getSales = getSales;

const translateSales = {
    gNumber: 'Номер заказа',
    date: '📅 🕔',
    supplierArticle: '🎁',
    techSize: 'Размер товара',
    barcode: 'Бар-код',
    totalPrice: '💲',
    priceWithDiscount: '💰',
    discountPercent: '📉, %',
    isSupply: 'Договор поставки',
    isRealization: 'Договор реализации',
    promoCodeDiscount: 'Скидка по промокоду',
    warehouseName: '🚚',
    countryName: 'Страна',
    oblastOkrugName: 'Округ',
    regionName: 'Регион',
    incomeID: 'Номер поставки (от продавца на склад)',
    saleID: 'Уникальный идентификатор продажи/возврата.',
    odid: 'Уникальный идентификатор позиции заказа',
    spp: 'Согласованная скидка постоянного покупателя',
    forPay: '♻️',
    finishedPrice: 'Фактическая цена заказа с учетом всех скидок',
    priceWithDisc: 'Цена, от которой считается вознаграждение поставщика forpay',
    nmId: 'Артикул WB',
    subject: 'Предмет',
    category: 'Категория',
    brand: 'Бренд',
    IsStorno: 'Для сторно-операций 1, для остальных 0',
    sticker: 'Цифровое значение стикера',
    srid: 'Уникальный идентификатор заказа'
};