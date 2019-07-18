let data = require("./data/tickers.json")
console.log(data);


// var canvas = d3.select('body')
//     .append('svg')
//     .attr('width', 700)
//     .attr('height', 700);

// var circle = canvas.append('circle')
//     .attr('cx', 160)
//     .attr('cy', 160)
//     .attr('r', 50)
//     .attr('fill', "grey");

// var circle = canvas.append('circle')
//     .attr('cx', 260)
//     .attr('cy', 260)
//     .attr('r', 50)
//     .attr('fill', "grey");

// var line = canvas.append('line')
//     .attr('x1', 0)
//     .attr('x2', 200)
//     .attr('y1', 100)
//     .attr('y2', 300)
//     .attr('stroke', 'grey')
//     .attr('stroke-width', 3);



var circleData = [10, 30, 50, 100];

var canvas = d3.select("body")
    .append("svg")
    .attr("width", 768)
    .attr("height", 1024);

var oranges = canvas.selectAll("circle")
    .data(circleData)
    .enter()
    .append("circle")
    .attr("fill", "grey")
    .attr("cx", function (d, i) {
        return d + (i * 100);
    })
    .attr("cy", function (d) {
        return d;
    })
    .attr("r", function (d) {
        return d;
    });

// d3.json("/data/tickers.json", function (data) {
//     console.log(data);
// });

