const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/test", (req, res) => res.json({ msg: "This is the stocks route" }));

router.get("/:ticker", (req, res) => {
    console.log(req);

    let ticker = req.params.ticker;

    const getMarketCap = (ticker) => {
        let url = `https://sandbox.iexapis.com/stable/stock/${ticker}/quote?token=Tsk_78aa1543668d4b2a94d63cf512714326`;
        return axios.get(url)
            .then(response => response.data)
            .catch(err => console.log(err));
    };

    getMarketCap(ticker).then(data => {    
        res.json({
            message: "Request received!",
            data
        });
    }).catch(err => console.log(err));

});

module.exports = router;

// let token = keys.twitterToken;
// return axios.get(url, { headers: { "Authorization": `Bearer ${token}` } })