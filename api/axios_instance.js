const axios = require("axios");
const { API_KEY_WB } = require("../env");

const axiosInstance = axios.create({
    baseURL: 'https://statistics-api.wildberries.ru/api/v1/supplier/',
    headers: {
        "Authorization": API_KEY_WB
    }
})

module.exports.axiosInstance = axiosInstance;