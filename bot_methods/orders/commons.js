const { token } = require("../../env");
const { awaitResolve } = require("../../general/awaitResolve");
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(token);

const buttonsWithDateOrders = (chatId, arrayOfDates = []) => { //! блок с inline_buttons для запроса заказов на сегодня или вчера
	const button = {
		reply_markup: JSON.stringify({ //? преобразуем в JSON-формат 
			inline_keyboard: [
				[{ text: 'Сегодня: ' + arrayOfDates[0], callback_data: ['orders', arrayOfDates[0]].join('|') }, //? 1-ая кнопка
				{ text: 'Вчера: ' + arrayOfDates[1], callback_data: ['orders', arrayOfDates[1]].join('|') }], //? 2-ая кнопка
				// [{ text: 'Информация из интервальной функции', callback_data: ['ordersAtInterval'].join('|') }] //? 3-я кнопка
			]
		})
	}

	bot.sendMessage(chatId, 'Выберите дату:', button)
};

const buttonsWithDateSales = (chatId, arrayOfDates = []) => { //! блок с inline_buttons для запроса продаж или ABC-нализа
	const button = {
		reply_markup: JSON.stringify({ //? преобразуем в JSON-формат 
			inline_keyboard: [
				[{ text: 'Сегодня: ' + arrayOfDates[0], callback_data: ['sales', arrayOfDates[0]].join('|') }], //? 1-ая кнопка				
				[{ text: 'ABC-анализ за текущий месяц', callback_data: ['salesABCanalysis', arrayOfDates[1]].join('|') }], //? 2-ая кнопка
				[{ text: 'ABC-анализ за прошлый месяц', callback_data: ['salesABCanalysis', arrayOfDates[2]].join('|') }] //? 2-ая кнопка
			]
		})
	}

	bot.sendMessage(chatId, 'Выберите дату:', button)
};

const saveAndSendOrders = (orders = [], ordersInfo, chatId, translateOrders) => {
	const arrID = ordersInfo.arrayOfOrders;
	if (orders.length === arrID.length) return arrID; //? ничего не делаем если из нового респонса новых заказов не пришло
	let copyOfOrdersID = [...arrID]; //? копирует массив ID с имеющимися заказами

	const filteringOrders = orders.filter(x => { //? отфильтровывается в новый массив объекты заказа

		if (arrID.includes(x.srid) === false) {
			//? vvvvvvvvv это всё для нового объекта в котором хранится инфа по сегодняшним заказам
			if (!ordersInfo.hasOwnProperty(x.nmId)) { //? если нет такого артикуля, то...
				ordersInfo[x.nmId] = { //?  создадим его
					count: 1, //? инициализируем сколько заказов будет
					cost: x.priceWithDisc //? инициализируем цену по всем заказам с этим артикулем
				}
			} else { //? если был такой
				ordersInfo[x.nmId].count++; //? добавим 1 заказик
				ordersInfo[x.nmId].cost += x.priceWithDisc //? и прибавим к получившейся цене
			}
			ordersInfo.total += x.priceWithDisc //? общая стоимость по всем заказам за сегодня
			//? ^^^^^^^^^
			x.count = ordersInfo[x.nmId].count; //? запишем в отфильтрованный объект инфу: сколько купили по такому артикулу на данный момент
			x.cost = ordersInfo[x.nmId].cost; //? на какую сумму купили по такому артикулу на данный момент
			x.total = ordersInfo.total; //? и общая сумма денег на данный момент

			copyOfOrdersID.push(x.srid); //? пушим этот ID в копию массива
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
	return [...copyOfOrdersID]; //? возврат нового массива с ID
}



const transformArray = (response = []) => {
	return response.map(obj => {
		const newObjPattern = { //? vvvvvvv создаём объект с нужными ключами и в нужном порядке
			'date': obj.date,
			'supplierArticle': obj.supplierArticle,
			'barcode': obj.barcode,
			'totalPrice': obj.totalPrice,
			'discountPercent': obj.discountPercent,
			'priceWithDisc': obj.priceWithDisc,
			'finishedPrice': obj.finishedPrice,
			'warehouseName': obj.warehouseName,
			'nmId': obj.nmId,
			'subject': obj.subject,
			'category': obj.category,
			'brand': obj.brand,
			'orderType': obj.orderType,

			'🎖': `[${obj.count}] куплено сегодня таких за ${obj.cost}`,
			'🏆': `Сумма за сегодня ${obj.total}`
		}
		return newObjPattern; //? возврат объекта
	});
}

const translateOrders = {
	date: '📅',
	supplierArticle: '🎁',
	techSize: 'Размер',
	barcode: '📝',
	totalPrice: '💲',
	priceWithDisc: '💰',
	discountPercent: '📉, %',
	warehouseName: '🚚',
	oblast: '🏛',
	incomeID: 'Номер поставки (от продавца на склад)',
	odid: 'Уникальный идентификатор позиции заказа',
	nmId: '🏷',
	subject: '💎',
	category: '🗂',
	brand: '🪩',
	orderType: '🎫',
	finishedPrice: '💵',
	isCancel: 'Отмена заказа ❌',
	cancelDate: '📅 🕔 ❌',
	gNumber: 'Номер заказа',
	sticker: 'Цифровое значение стикера',
	srid: 'Уникальный идентификатор заказа',
};

module.exports.translateOrders = translateOrders;
module.exports.transformArray = transformArray;
module.exports.saveAndSendOrders = saveAndSendOrders;
module.exports.buttonsWithDateOrders = buttonsWithDateOrders;
module.exports.buttonsWithDateSales = buttonsWithDateSales;