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

function buildPlot(state) {
  var apiKey = "za-7uUfzKfhsCkHJSzQ-";

  var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/S${state}_ZHVIAH?api_key=${apiKey}`;

  d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var homeValue = unpack(data.dataset.data, 1);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      x: dates,
      y: homeValue,
      line: {
        color: "#17BECF"
      }
    };

    var data = [trace1];

    var layout = {
      title: name,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("plot", data, layout);

  });
}

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
