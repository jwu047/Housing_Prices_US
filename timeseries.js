function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var state = d3.select("#input").node().value;
  console.log(state);

  // clear the input value
  d3.select("#input").node().value = "";

  // Build the plot with the new state
  buildPlot(state);
}

function init(){

  var apiKey = "za-7uUfzKfhsCkHJSzQ-";
  var states = [13,6,21,47,7];
  var url;
  for (i in states){
    url = `https://www.quandl.com/api/v3/datasets/ZILLOW/S${states[i]}_ZHVIAH?api_key=${apiKey}`;
    d3.json(url).then(function(data) {

      // Grab values from the response json object to build the plots
      var name = data.dataset.name;
      var state_name = name.split("-")[2]
      console.log(state_name)
      var startDate = data.dataset.start_date;
      var endDate = data.dataset.end_date;
      var dates = unpack(data.dataset.data, 0);
      var homeValue = unpack(data.dataset.data, 1);
      var trace1 = {
        type: "scatter",
        mode: "lines",
        name: state_name,
        x: dates,
        y: homeValue,
        line: {
          color: states[i]
        }
      };
  
      var data = [trace1];
  
      var layout = {
        title: "Top 5 States Home Value Time Series",
        width: 1000,
        height: 600,
        xaxis: {
          range: [startDate, endDate],
          type: "date"
        },
        yaxis: {
          autorange: true,
          type: "linear"
        }
      };
  
      Plotly.plot("plot", data, layout);
  
    });

  }
}

function updatePlotly(dates, homeValue, state_name, name) {

  var CHART = document.getElementById("plot");

  var newLayout  = {
    title: `${state_name} Housing Prices Over Time`,
    width: 1000,
    height: 600
  };

  var newData = {
    x: [dates],
    y: [homeValue],
    name: [state_name]};

  Plotly.deleteTraces(CHART, 0);
  Plotly.deleteTraces(CHART, 0);
  Plotly.deleteTraces(CHART, 0);
  Plotly.deleteTraces(CHART, 0);
  Plotly.update(CHART, newData, newLayout)
};

function buildPlot(state) {

  var apiKey = "za-7uUfzKfhsCkHJSzQ-";
  var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/S${state}_ZHVIAH?api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var state_name = name.split("-")[2]
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var homeValue = unpack(data.dataset.data, 1);

    updatePlotly(dates, homeValue, state_name, name)

  });
}

init();

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
