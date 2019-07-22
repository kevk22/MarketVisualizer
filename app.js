const express = require("express");
const stocks = require("./routes/api/stocks");
const bodyParser = require('body-parser');
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});
app.use("/api/stocks", stocks);
app.use(express.static('frontend'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
