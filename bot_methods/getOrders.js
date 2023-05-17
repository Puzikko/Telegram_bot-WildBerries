const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env");
const { awaitResolve } = require("../general/awaitResolve");
const { axiosInstance } = require("../api/axios_instance");

const bot = new TelegramApi(token);

const getOrders = async (chatId, date) => { //! Обработчик заказов

    const response = await axiosInstance.get('orders?flag=1&dateFrom=' + date)//? запрос от WB

    const arrayOfOrders = response.data.map(obj => {
        delete obj.lastChangeDate; //?vvv
        delete obj.incomeID;
        delete obj.odid;
        delete obj.gNumber;
        delete obj.sticker;
        delete obj.srid;
        if (obj.isCancel === false) {
            delete obj.isCancel;
            delete obj.cancel_dt;
        } //? ^^^^^^ удаление указанных ключей со свойствами
        return obj; //? возврат объекта
    });

    if (arrayOfOrders.length > 0) {
        awaitResolve(chatId, arrayOfOrders, translateOrders)//? кастомная функция для отправки сообщений последовательно
        // await bot.sendMessage(chatId, 'Это был последний заказ на текущий запрос.')
    } else { bot.sendMessage(chatId, 'На сегодня никаких заказов нет.') }
};

module.exports.getOrders = getOrders;

const translateOrders = {
    date: '📅 🕔',
    supplierArticle: '🎁',
    techSize: 'Размер',
    barcode: 'Бар-код',
    totalPrice: '💲',
    priceWithDiscount: '💰',
    discountPercent: '📉, %',
    warehouseName: '🚚',
    oblast: '🏛 Область',
    incomeID: 'Номер поставки (от продавца на склад)',
    odid: 'Уникальный идентификатор позиции заказа',
    nmId: 'Артикул WB',
    subject: 'Предмет',
    category: 'Категория',
    brand: 'Бренд',
    isCancel: 'Отмена заказа',
    cancel_dt: 'Дата и время отмены заказа',
    gNumber: 'Номер заказа',
    sticker: 'Цифровое значение стикера',
    srid: 'Уникальный идентификатор заказа',
};