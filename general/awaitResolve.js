const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);

const awaitResolve = async (chatId, array, translateObject) => { //! Отправка сообщений по порядку


    const newObject = (obj) => { //! Образование нового объекта
        const priceWithDiscount = (obj.totalPrice * (1 - obj.discountPercent / 100)) //? Образование цены с дисконтом
            .toFixed(2) //? Оставить два знака после запятой [5.00]
        let copyObj = Object.entries(obj); //? Преобразование в массив из массивов "ключ, значение" [['key', 'val']]
        const index = copyObj.findIndex((el) => el[0] === 'totalPrice'); //? Поиск нужного индекса
        copyObj.splice(index + 1, 0, ['priceWithDiscount', priceWithDiscount]) //? Добавление нового массива
        return Object.fromEntries(copyObj) //?  Преобразование обратно в объект
    }

    const messageConstructor = (object, translater) => {//? Маппинг по объекту
        return Object.keys(object)
            .map(key => {
                return !!translater[key]
                    ? `${translater[key]}: ${object[key]}`
                    : `${key}: ${object[key]}`
            })
            .join('\n')
    };

    let item = 1; //? порядковый номер сообщения
    for await (value of array) { //? обработка ассинхронных сообщений, для вывода value из массива array по порядку
        await bot.sendMessage(chatId, (item) + ') ' + messageConstructor(newObject(value), translateObject) + '\n\n')  //? Отправка сообщения боту
        item += 1;
    }
};

module.exports.awaitResolve = awaitResolve;