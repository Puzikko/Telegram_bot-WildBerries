const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const { salesAPI } = require("../../api/axios_instance");

const bot = new TelegramApi(token);

const getSales = async (chatId, date) => { //! Обработчик продаж
    try {
        const response = await salesAPI(date, 1)//? запрос на WB

        const arrayOfSales = await response.map(obj => {
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
        if (arrayOfSales.length > 0) {
            awaitResolve(chatId, arrayOfSales, 0, translateSales, 5)//? кастомная функция для отправки сообщений последовательно
        } else { bot.sendMessage(chatId, 'На сегодня информации о продажах нет.') };
    } catch (error) {
        bot.sendMessage(chatId, 'Error:  ' + error.response.data.errors.join('\n'))
    }
};

const getSalesABCanalysis = async (chatId, date) => { //! Обрабочтик продаж -> ABC анализ
    const newObj = {};
    let newArrayOfArticles = [] //? массив для артикулов+
    const regEx = /\d\d\d\d-\d\d/g; //? для сортировки даты в виде ГГГГ-ММ

    try {
        const response = await salesAPI(date)//? запрос на WB
            .then(response => response.filter(x => x.lastChangeDate.match(regEx).join('') === date.match(regEx).join(''))); //? фильтруем в response только для подходящей даты
        newArrayOfArticles = response.map(x => x.nmId); //? записываем только артикулы

        for (let i = 0; i < newArrayOfArticles.length; i++) {
            const title = newArrayOfArticles[i];
            newObj[title] = response.filter(x => x.nmId === title); //? записываем в новый массив каждый заказ по своему артикулу
        };

        const arrayOfSalesABC = Object.keys(newObj).map(x => {
            const arrayOfSalesById = newObj[x];
            return { //? в другой объект для каждого артикула считаем общее кол-во продаж и выплат
                nmId: x,
                supplierArticle: arrayOfSalesById[0].supplierArticle,
                category: arrayOfSalesById[0].category,
                subject: arrayOfSalesById[0].subject,
                brand: arrayOfSalesById[0].brand,
                totalSales: arrayOfSalesById.length,
                forPay: arrayOfSalesById.map(x => x.forPay).reduce((acc, cur) => acc + cur, 0)
            }
        });

        if (arrayOfSalesABC.length > 0) {
            awaitResolve(chatId, arrayOfSalesABC, 0, translateSales, 20)//? кастомная функция для отправки сообщений последовательно
        };
    } catch (error) {
        bot.sendMessage(chatId, 'Error:  ' + error.response.data.errors.join('\n'))
    };
};

module.exports.getSales = getSales;
module.exports.getSalesABCanalysis = getSalesABCanalysis;

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
    nmId: '🗒 Артикул WB',
    subject: 'Предмет',
    category: 'Категория',
    brand: 'Бренд',
    IsStorno: 'Для сторно-операций 1, для остальных 0',
    sticker: 'Цифровое значение стикера',
    srid: 'Уникальный идентификатор заказа',
    totalSales: '🛒 Продано',
    forPay: '💵 К выплате',
};