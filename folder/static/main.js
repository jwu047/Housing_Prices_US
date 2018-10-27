// Instance the tour
var tour = new Tour({
  steps: [
  {
    element: "#navbar navbar-light bg-light static-top",
    title: "Navigation Bar",
    content: "Links to main content"
  },
  {
    element: "#masthead text-white text-center",
    title: "Scrape",
    content: "Recent data from MarketWatch."
  },
  {
    element: "#btn btn-outline-light custom1",
    title: "Data Exploration",
    content: "Full Zillow data available here."
  },
  {
    element: "#btn btn-outline-light custom2",
    title: "Timeseries",
    content: "See how the average home index has changed over the span of more than twenty years!"
  }

]});

// Initialize the tour
tour.init();

// Start the tour
tour.start();