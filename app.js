const express = require("express");
const stocks = require("./routes/api/stocks");
const bodyParser = require('body-parser');
const app = express();

app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/stocks", stocks);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('frontend'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
