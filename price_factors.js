var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "income";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.9,
      d3.max(stateData, d => d[chosenXAxis]) * 1.1])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "Median Household Income") {
    var label = "Median Household Income:";
  } else if (chosenXAxis === "Population") {
    var label = "Population:";
  } else if (chosenXAxis === "Median Age") {
    var label = "Median Age:";
  } else if (chosenXAxis === "Poverty Rate") {
    var label = "Poverty Rate:";
  } else {
    var label = "Crime Rate:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>Housing Prices: $${d.price_2016dec}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function renderText(TextGroup, newXScale, chosenXAxis) {

 TextGroup.transition()
   .duration(1000)
   .attr("x", d => newXScale(d[chosenXAxis]));

 return TextGroup;
 }

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(stateData) {

  stateData.forEach(function(data) {
    data.income = +data.income;
    data.population = +data.population;
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.crime = +data.crime;
    data.price_2016dec = +data.price_2016dec;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.price_2016dec)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.price_2016dec))
    .attr("r", 15)
    .attr("fill", "lightcoral")
    .attr("opacity", ".75");

  // append state on circle
  var TextGroup = chartGroup.selectAll("tspan")
    .data(stateData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .append("tspan")
      .attr("x",d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d.price_2016dec - 5000))
      .text(d => d.abbr);

  // Create group for 5 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "income") // value to grab for event listener
    .classed("active axis-text", true)
    .text("Median Household Income");

  var populationLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "population") // value to grab for event listener
    .classed("inactive axis-text", true)
    .text("Population");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive axis-text", true)
    .text("Median Age");

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive axis-text", true)
    .text("Poverty Rate");

  var crimeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 100)
    .attr("value", "crime") // value to grab for event listener
    .classed("inactive axis-text", true)
    .text("Crime Rate");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Median Home Value");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        TextGroup = renderText(TextGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          crimeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "population") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          populationLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          crimeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "age") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          crimeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "poverty") {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          crimeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          populationLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          crimeLabel
            .classed("active", true)
            .classed("inactive", false);
          }
      }
    });
})