import { getStock, getRating, getValue } from './util/stock_api_util';
let tickerData = require("./data/tickers.json");
let industries = require("./data/industries.json");

const sectors = [
    "Energy",
    "Utilities",
    "Materials",
    "Financials",
    "Industrials",
    "Real Estate",
    "Health Care",
    "Consumer Staples",
    "Information Technology",
    "Consumer Discretionary",
    "Telecommunication Services"
];

var sectorColor = d3.scaleOrdinal(d3.schemeBrBG[11]);

var margin = { left: 100, right: 20, top: 50, bottom: 150 };

var width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var g = d3.select("#svg-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left
        + ", " + margin.top + ")");

var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 750]);
    
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 800]);


var xAxisCall = d3.axisBottom(x);
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisCall);


var yAxisCall = d3.axisLeft(y);
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

// X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("52 Week Low");

// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("52 Week High");


var legend = g.append("g")
    .attr("transform", "translate(" + (width - 10) +
        "," + (height - 125) + ")");

// d3.schemePuBuGn[9]
    // .range()
    // .range(["#55efc4", "#81ecec", "#74b9ff", "#a29bfe", "#00b894", "#00cec9", "#b2bec3", "#fab1a0", "#ff7675",
    //     "#ffeaa7", "#2d3436"]);

sectors.forEach(function (sector, i) {
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

    legendRow.append("rect")
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", sectorColor(sector));

    legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(sector);
});



var t = d3.transition().duration(200);

// Array to hold each individual stock object 
let stockObjs = [];

// Loop through JSON tickers to make an API call to each constituent in the s&p500
for (let i = 0; i < tickerData.length; i++) {
    let curTicker = tickerData[i]["Symbol"];

    // Get initial stock info and add industry key-value pair to each stock object
    getStock(curTicker)
    .then(stock => {
        if (stock.data.data !== undefined) {
            stockObjs.push(stock.data.data);
            stockObjs[stockObjs.length - 1].sector = industries[stock.data.data.symbol];
        }
    });
    
    // Add buy, hold, sell ratings based on recent analyst recommendations
    getRating(curTicker)
    .then(stock => {
        if (stock.data.data !== undefined && stock.data.data[0].ratingBuy !== undefined) {
            stockObjs[stockObjs.length - 1].ratingBuy = stock.data.data[0].ratingBuy;
            stockObjs[stockObjs.length - 1].ratingHold = stock.data.data[0].ratingHold;
            stockObjs[stockObjs.length - 1].ratingSell = stock.data.data[0].ratingSell;
        }
    });

    // Add enterpise value and EBITDA metrics to set axis
    getValue(curTicker)
    .then(stock => {
        if (stock.data.data !== undefined) {
            stockObjs[stockObjs.length - 1].ebitda = stock.data.data["EBITDA"];
            stockObjs[stockObjs.length - 1].ev = stock.data.data.enterpriseValue;
        }
    });

    
}


var tooltip = d3.select('body').append('div')
    .style({
        'position': 'absolute',
        'padding': '4px',
        'background': '#fff',
        'border': '1px solid #000',
        'color': '#000'
    });

    
    var myInterval = d3.interval(function(){
        update(stockObjs);
    },200);
    
    
    function update(data) {
        console.log(data);

        $("#sector-select")
            .on("change", function () {
                update(data[time]);
            })

        
        
        var stocksBySector = d3.nest()
        .key(function(d) { return d.sector; })
        .entries(data);

        var sector = $("#sector-select").val();

        var data = data.filter(function(d) {
            if (sector == "all") { return true; }
            else {
                return d.sector == sector;
            }
        })

    
    var circles = g.selectAll("circle")
        .data(data);
    
    circles.enter()
        .append("circle")
        .transition(t)
        // .attr("cy", function (d) { return y(d.marketCap / 100000000); })
        .attr("cy", function (d) { return y(d.week52High); })
        .attr("cx", function (d) { return x(d.week52Low); })
        .attr("r", function (d) { return 5; })
        .attr("fill", function(d) { return sectorColor(d.sector); })
       

    
}








// (async () => {
//     let stocks = await getAllData();
//       var circles = svg.selectAll("circle")
//             .data(stocks);

//         circles.enter()
//             .append("circle")
//             .attr('cx', function (d, i) {
//                 return (i * 50) + 25;
//             })
//             .attr('cy', 150)
//             .attr('r', function(d){
//                 return d.marketCap * .0000000001;
//             })
//             .attr('fill', 'green');
// })();


//d3.scale.category20()


