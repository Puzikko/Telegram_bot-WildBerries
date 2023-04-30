const TelegramApi = require("node-telegram-bot-api");
const { token } = require("../env")

const bot = new TelegramApi(token);

const awaitResolve = async (chatId, array, translateObject) => { //! Отправка сообщений по порядку


    const newObject = (obj) => { //? Образование нового объекта
        if (!obj.hasOwnProperty('totalPrice') && !obj.hasOwnProperty('discountPercent')) return obj; //? проверка на эти две позиции 
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

    let text = new String;
    for (let i = 1; i <= array.length; i++) {
        text += i + ') ' + messageConstructor(newObject(array[i - 1]), translateObject) + '\n\n';
        if (i % 10 === 0) {
            await bot.sendMessage(chatId, text);
            text = '';
        } else if (i === array.length) {
            await bot.sendMessage(chatId, text);
        }
    }
};

module.exports.awaitResolve = awaitResolve;