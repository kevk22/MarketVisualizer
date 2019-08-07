import { getStock, getRating, getValue } from './util/stock_api_util';
import { floatingTooltip } from './tooltip.js';
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

var width = 1200 - margin.left - margin.right,
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
    .domain([0, 600]);
    
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 600]);


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
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .text("Most Recent Closing Price");

// Y Label
g.append("text")
    .attr("class", "axis-label")
    .attr("x", - (height / 2))
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("52 Week High in ($USD)");


var legend = g.append("g")
    .attr("transform", "translate(" + (width - 20) +
        "," + (height - 250) + ")");
    

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


// Array to hold each individual stock object 
var stockObjs = [];

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

    // // Add enterpise value and EBITDA metrics to set axis
    // getValue(curTicker)
    // .then(stock => {
    //     if (stock.data.data !== undefined) {
    //         stockObjs[stockObjs.length - 1].ebitda = stock.data.data["EBITDA"];
    //         stockObjs[stockObjs.length - 1].ev = stock.data.data.enterpriseValue;
    //     }
    // });

}

//Init tooltip 
var tooltip = floatingTooltip('gates_tooltip', 240);
    

//Function called on mouseover to display the
//details of a bubble in the tooltip.
function showDetail(d) {
    // change outline to indicate hover state.
    // d3.select(this).attr('stroke', 'black');

    let buy = d.ratingBuy !== undefined ? d.ratingBuy : 0;
    let hold = d.ratingHold !== undefined ? d.ratingHold : 0;
    let sell = d.ratingSell !== undefined ? d.ratingSell : 0;

    let content = '<span class="name">Company: </span><span class="value">' +
    d.companyName + '</span><br/>' +
    '<span class="name">Buy Rating: </span><span class="value">' +
    buy + '</span><br/>' + 
    '<span class="name">Hold Rating: </span><span class="value">' +
    hold + '</span><br/>' + 
    '<span class="name">Sell Rating: </span><span class="value">' +
    sell + '</span>';

    tooltip.showTooltip(content, d3.event);
}

// Hides tooltip
function hideDetail(d) {
    // reset outline
    d3.select(this);
    // .attr('stroke', d3.rgb(fillColor(d.sector)).darker());
    tooltip.hideTooltip();
}

var myInterval = d3.interval(function(){
    update(stockObjs);
    },200);

    
function update(data) {
    
    var circles = g.selectAll("circle")
    .data(data)
    .on('mouseover', showDetail)
    .on('mouseout', hideDetail);
    
    
    var t = d3.transition()
        .duration(2000)
        .attr("cy", 300);
    
    circles.enter()
    .append("circle")
    // .attr("cy", function (d) { return y(d.marketCap / 100000000); })
    .transition(t)
    .attr("cy", function (d) { return y(d.week52High); })
    .attr("cx", function (d) { return x(d.previousClose); })
    .attr("r", function (d) { return 5; })
    .attr("fill", function(d) { return sectorColor(d.sector); });
      
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


