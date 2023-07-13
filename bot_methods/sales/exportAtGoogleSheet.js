const { JWT } = require('google-auth-library');
const GoogleSpreadsheet = require('google-spreadsheet');
const googleData = require('./../../googleSheets_apiKey.json')

const exportAtGoogleSheet = async (arrayOfABC) => { //! экспорт ABC-анализа в гугл таблицы
    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const serviceAccountAuth = new JWT({ //? авторизация в google таблицах
        // env var values here are copied from service account credentials generated by google
        // see "Authentication" section in docs for more info
        email: googleData.client_email,
        key: googleData.private_key,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    });
    try {
        const doc = new GoogleSpreadsheet.GoogleSpreadsheet(googleData.spreadsheetId, serviceAccountAuth); //? подключаемся к таблицам

        // if creating a new sheet, you can set the header row
        const sheet = await doc.addSheet({ //? новый лист 
            headerValues: ['Артикул WB', 'Артикул продавца', 'Категория', 'Предмет', 'Бренд', 'Продано', 'К выплате', 'Доля выплат, %', 'Совокупный %', 'ABC'] //? формируем заголовки
        })
        const sheetID = await sheet.addRows(arrayOfABC) //? отправляем данные в соответствии с заголовками
            .then(response => response[0]._worksheet._rawProperties.sheetId)

        return sheetID //? возвращаем ID листа

    } catch (error) {
        console.log(error)
    }
}
module.exports.exportAtGoogleSheet = exportAtGoogleSheet;