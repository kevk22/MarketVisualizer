import axios from 'axios';
let data = require("../data/tickers.json");

//Backend call
export const getStock = ticker => {
    return axios.get(`api/stocks/${ticker}`);
};

export const getRating = ticker => {
    return axios.get(`api/stocks/rating/${ticker}`);
};

export const getValue = ticker => {
    return axios.get(`api/stocks/value/${ticker}`);
};




