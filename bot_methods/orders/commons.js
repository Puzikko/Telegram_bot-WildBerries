const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(token);

const buttonsWithDate = (chatId, arrayOfDates = []) => { //! блок с inline_buttons для запроса заказов на сегодня или вчера
	const button = {
		reply_markup: JSON.stringify({ //? преобразуем в JSON-формат 
			inline_keyboard: [
				[{ text: 'Сегодня: ' + arrayOfDates[0], callback_data: arrayOfDates[0] }, //? 1-ая кнопка
				{ text: 'Вчера: ' + arrayOfDates[1], callback_data: arrayOfDates[1] }], //? 2-ая кнопка
				[{ text: 'Информация из интервальной функции', callback_data: 'ordersAtInterval' }] //? 3-я кнопка
			]
		})
	}

	bot.sendMessage(chatId, 'Выберете дату:', button)
};

const saveAndSendOrders = (orders = [], arrID = [], chatId, translateOrders) => {
	if (orders.length === 0) return arrID;
	let copyOfOrdersID = [...arrID.map(x => x.odid)]; //? копирует массив ID с имеющимися заказами

	const filteringOrders = orders.filter(x => { //? отфильтровывается в новый массив объекты заказа
		if (copyOfOrdersID.includes(x.odid) === false) {
			return x; //? если такого ID не было записано
		}
	})

	filteringOrders.sort((a, b) => { //? Сортировка массива по возрастанию
		return Date.parse(a.date) - Date.parse(b.date); //? переводим даты и время в мс и сравниваем
	});

	const transformedOrders = transformArray(filteringOrders.map(x => { //? трансформируем объект в нужный формат
		return JSON.parse(JSON.stringify(x)) //! передаём копию объекта (иначе изменит объект заказа в filteringOrders)
	}));
	awaitResolve(chatId, transformedOrders, arrID.length, translateOrders)//? кастомная функция для отправки сообщений последовательно
	return [...arrID, ...filteringOrders]; //? возврат нового массива с ID
}



const transformArray = (response = []) => {
	return response.map(obj => {
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
}

const translateOrders = {
	date: '📅 🕔',
	supplierArticle: '🎁',
	techSize: 'Размер',
	barcode: 'Бар-код',
	totalPrice: '💲',
	priceWithDiscount: '💰',
	discountPercent: '📉, %',
	warehouseName: '🚚',
	oblast: '🏛',
	incomeID: 'Номер поставки (от продавца на склад)',
	odid: 'Уникальный идентификатор позиции заказа',
	nmId: 'Артикул WB',
	subject: 'Предмет',
	category: 'Категория',
	brand: 'Бренд',
	isCancel: 'Отмена заказа ❌',
	cancel_dt: '📅 🕔 отмены заказа',
	gNumber: 'Номер заказа',
	sticker: 'Цифровое значение стикера',
	srid: 'Уникальный идентификатор заказа',
};

module.exports.translateOrders = translateOrders;
module.exports.transformArray = transformArray;
module.exports.saveAndSendOrders = saveAndSendOrders;
module.exports.buttonsWithDate = buttonsWithDate;