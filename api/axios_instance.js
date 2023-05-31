const axios = require("axios");
const { API_KEY_WB } = require("../env");

const axiosInstance = axios.create({
    baseURL: 'https://statistics-api.wildberries.ru/api/v1/supplier/',
    headers: {
        "Authorization": API_KEY_WB
    }
})

const ordersAPI = (date, flag = 0) => {
    return axiosInstance.get(`orders?flag=${flag}&dateFrom=${date}`)
        .then(response => {
            return response.data
        })
}

const salesAPI = (date, flag = 0) => {
    return axiosInstance.get(`sales?flag=${flag}&dateFrom=${date}`)
        .then(response => {
            return response.data
        })
}

module.exports.axiosInstance = axiosInstance;
module.exports.ordersAPI = ordersAPI;
module.exports.salesAPI = salesAPI;