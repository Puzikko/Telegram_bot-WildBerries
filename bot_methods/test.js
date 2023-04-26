const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);
const { axiosInstance } = require("../api/axios_instance");

const translateObject = {
    date: 'Дата и время заказа',
    supplierArticle: 'Артикул поставщика',
    techSize: 'Размер',
    barcode: 'Бар-код',
    totalPrice: 'Полная цена',
    priceWithDiscount: 'Цена с дисконтом',
    discountPercent: 'Согласованный итоговый дисконт',
    warehouseName: 'Склад отгрузки',
    oblast: 'Область',
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
    srid: 'Уникальный идентификатор заказа'
};

const exampleObject = {
    date: '2023-04-25T21:50:10',
    lastChangeDate: '2023-04-26T13:57:26',
    supplierArticle: 'карамель',
    techSize: '0',
    barcode: '2033036948624',
    totalPrice: 1103.45,
    discountPercent: 71,
    warehouseName: 'Коледино',
    oblast: 'Коми',
    incomeID: 10955082,
    odid: 9002594685298,
    nmId: 84951938,
    subject: 'Гели',
    category: 'Красота',
    brand: 'Витэкс',
    isCancel: false,
    cancel_dt: '0001-01-01T00:00:00',
    gNumber: '4975392358765617865',
    sticker: '',
    srid: '22577918076201904.0.0'
};


const test = (chatId) => { //! Тестовый алгоритм
    const priceWithDiscount = (exampleObject.totalPrice * (1 - exampleObject.discountPercent / 100)) //? Образование цены с дисконтом
        .toFixed(2) //? Оставить два знака после запятой [5.00]

    const newObject = (obj) => { //! Образование нового объекта
        let copyObj = Object.entries(obj); //? Преобразование в массив из массивов "ключ, значение" [['key', 'val']]
        const index = copyObj.findIndex((el) => el[0] === 'totalPrice'); //? Поиск нужного индекса
        copyObj.splice(index + 1, 0, ['priceWithDiscount', priceWithDiscount]) //? Добавление нового массива
        return Object.fromEntries(copyObj) //?  Преобразование обратно в объект
    }

    const messageConstructor = (object, transl) => {//? Маппинг по объекту
        return Object.keys(object)
            .map(key => {
                return !!transl[key]
                    ? `${transl[key]}: ${object[key]}`
                    : `${key}: ${object[key]}`
            })
            .join('\n')
    };
    return messageConstructor(newObject(exampleObject), translateObject)
};
// console.log(test())



module.exports.test = test;