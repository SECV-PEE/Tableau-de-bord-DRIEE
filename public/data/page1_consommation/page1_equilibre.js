// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 150},
width_eq = 950 - margin.left - margin.right,
height_eq = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#equilibre-regional")
  .append("svg")
  .attr("width", width_eq + margin.left + margin.right)
  .attr("height", height_eq + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

console.log(svg)

// Parse the Data
d3.csv("data/page1_consommation/equilibre-regional-TDB.csv").then((data)=>{
  subgroups = data.columns;
  console.log(data)
  // List of subgroups = header of the csv files = soil condition here
  // var subgroups = data.columns.slice(1)


  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.Region)}).keys();

  // Add X axis
  var y = d3.scaleBand()
    .domain(groups)
    .range([0, height_eq])
    .padding([0.2])
  svg.append("g")
  .call(d3.axisLeft(y).tickSizeOuter(0));

  // Add Y axis
  var x = d3.scaleLinear()
  .domain([0, 120000000])
  .range([ 0, width_eq]);
  svg.append("g")
  .call(d3.axisBottom(x))
  .attr("transform", "translate(0," + height_eq + ")");

// Add X axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width_eq/2)
    .attr("y", height_eq + margin.top + 40)
    .text("Flux énergétique (MWh)");


  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#52B8D9','#FF8900','#529A99'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
  .keys(subgroups)
  (data)




  // ----------------
  // Create a tooltip
  // ----------------

  var tooltip = d3.select("#tooltip_equilibre")
  .append("div")
  .style("position","absolute")
  .style("font-size", "10px")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "rgba(255, 255, 255, 0.8)")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("Source: " + subgroupName + "<br>" + "Flux: " + subgroupValue + "MWh")
        .style("opacity", 1)
  }
  var mousemove = function(d) {
  tooltip
    .style("left", (d3.event.pageX+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", (d3.event.pageY) + "px")
  }
  var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  }

  // Show the bars
  svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.Region); })
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("height",y.bandwidth())
      .attr("stroke", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  })
