const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/test", (req, res) => res.json({ msg: "This is the stocks route" }));

router.get("/:ticker", (req, res) => {
    let ticker = req.params.ticker;

    const getStockInfo = (ticker) => {
        let url = `https://sandbox.iexapis.com/stable/stock/${ticker}/quote/recommendation-trends?token=Tsk_78aa1543668d4b2a94d63cf512714326`;
        return axios.get(url)
            .then(response => response.data)
            .catch(err => console.log(err));
    };

    getStockInfo(ticker).then(data => {    
        res.json({
            data
        });
    }).catch(err => console.log(err));


});

router.get("/rating/:ticker", (req, res) => {
    let ticker = req.params.ticker;

    const getRatingInfo = (ticker) => {
        let url2 = `https://sandbox.iexapis.com/stable/stock/${ticker}/recommendation-trends?token=Tsk_78aa1543668d4b2a94d63cf512714326`;
        return axios.get(url2)
            .then(response => response.data)
            .catch(err => console.log(err));
    };

    getRatingInfo(ticker).then(data => {    
        res.json({
            data
        });
    }).catch(err => console.log(err));


});

router.get("/value/:ticker", (req, res) => {
    let ticker = req.params.ticker;

    const getValue = (ticker) => {
        let url3 = `https://sandbox.iexapis.com/stable/stock/${ticker}/advanced-stats?token=Tsk_78aa1543668d4b2a94d63cf512714326`;
        return axios.get(url3)
            .then(response => response.data)
            .catch(err => console.log(err));
    };

    getValue(ticker).then(data => {    
        res.json({
            data
        });
    })
    .catch(err => console.log(err));


});

module.exports = router;
