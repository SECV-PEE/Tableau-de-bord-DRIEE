Promise.all([
  d3.csv("data/page4_bati/DPE_IDF.csv"),
  d3.csv("data/page4_bati/DPE_IDF_Conso.csv")
]).then((data)=>{
  data_conso = data[1];
  data = data[0];
  drawBarDpe(conversor(data));
  drawAreaDpe(conversor_conso(data_conso));
})

function conversor(data) {
  data = data.filter(function (d) {return d.Zone == "Région"})
  var letters = ["A", "B", "C", "D", "E", "F", "G"];
  letters.forEach(element => {
    data[0][element] = +data[0][element].replace(" %", "")
  })
  return (data[0])
}

function conversor_conso(data) {
  var letters = ["Z", "A", "B", "C", "D", "E", "F", "G"];
  letters.forEach(element => {
    data[0][element] = +data[0][element].replace(" %", "")
    data[1][element] = +data[1][element]
  })
  console.log(data)
  return (data)
}

function showBatiTooltip_Dpe(category, value, coords)
{
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_bati_dpe")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>DPE : </b>" + category + "<br>"
            + "<b>Pourcentage : </b>" + Math.round(value) + " %<br>")
}

function drawBarDpe(data) {
  var margin = {top: 30, right: 30, bottom: 70, left: 50},
    width = 460 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  var svg = d3.select("#dpe_bar_chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["A", "B", "C", "D", "E", "F", "G"])
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .style("text-anchor", "middle");

  var y = d3.scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

  const yAxis = d3.axisLeft(y).tickSize(-width);
  svg.append("g")
    .call(yAxis)
    .selectAll('.tick line')
      .attr('opacity', 0.2)

  var letters = ["A", "B", "C", "D", "E", "F", "G"];
  var colorzZz = d3.scaleOrdinal().domain(letters)
    .range(["#83BF74", "#22D55D", "#C9F970", "#FFFF3F", "#FFD72D", "#F3A24C", "#FF0100"])

  letters.forEach(element => {
    svg.append("rect")
        .attr("x", x(element))
        .attr("y", y(data[element]))
        .attr("width", x.bandwidth())
        .attr("height", height - y(data[element]))
        .attr("fill", colorzZz(element))
        .on("mousemove", (d)=>{
          showBatiTooltip_Dpe(element, data[element],[d3.event.pageX + 30, d3.event.pageY - 30]);
           })
        .on("mouseleave", d=>{
          d3.select("#tooltip_bati_dpe").style("display","none")
          });
    svg.append("text")
          .attr("x", x(element) + x.bandwidth()/2)
          .attr("y", y(data[element]) - 5)
          .text(data[element].toString() + "%")
          .attr("text-anchor", "middle")
          .style("fill", "rgba(0, 0, 0, 0.87)")
          .style("alignment-baseline", "middle")
          .style("font-family", "sans-serif")
          .style("font-size", "10")
  });

  space_betwEeEen = x.step() - x.bandwidth()

  svg.append("line")
    .attr("x1", x.bandwidth()*5/2 + space_betwEeEen/2)
    .attr("x2", x.bandwidth()*5/2 + space_betwEeEen/2)
    .attr("y1", 0)
    .attr("y2", height)
    .style("stroke-width", 2)
    .style("stroke", "blue")

  svg.append("text")
    .attr("x", -margin.top - 150)
    .attr("y", -margin.left + 20)
    .text("Pourcentage des logements")
    .attr("text-anchor", "left")
    .attr("transform", "rotate(-90)")
    .style("fill", "rgba(0, 0, 0, 0.87)")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10")

  svg.append("text")
    .attr("x", -120)
    .attr("y", 105)
    .text("Niveau BBC rénovation")
    .attr("text-anchor", "left")
    .attr("transform", "rotate(-90)")
    .style("fill", "blue")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10")
    
}

function drawAreaDpe(data) {
  var margin = {top: 30, right: 30, bottom: 70, left: 30},
    width = 460 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  var svg = d3.select("#dpe_area_chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([0, 500])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));


  var letters = ["Z", "A", "B", "C", "D", "E", "F", "G"];
  var colorzZz = d3.scaleOrdinal().domain(letters)
    .range(["#d3ee24", "#83BF74", "#22D55D", "#C9F970", "#FFFF3F", "#FFD72D", "#F3A24C", "#FF0100"])

  var area = d3.area()
  .x(function(d) { return x(d.x); })
  .y0(height)
  .y1(function(d) { return y(d.y); });
  console.log(data.filter(function(d) {return y(d.y)}))

  var last_x = x(0)
  var last_y = y(0)

  letters.forEach(element => {
    console.log(data[1][element])
    console.log("y pos = " + y(0))
    console.log("x pos = " + x(0))
    svg.append("path")
      .datum(data)
      .attr("fill", colorzZz(element))
      .attr("stroke", colorzZz(element))
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(x(data[0][element]))
        .y0(y(0))
        .y1(y(data[1][element]))
        )
    svg.append("line")
      .datum(data)
      .attr("stroke", colorzZz(element))
      .attr("stroke-width", 1.5)
      .attr("x1", last_x)
      .attr("x2", x(data[0][element]))
      .attr("y1", last_y)
      .attr("y2", y(data[1][element]))
    last_x = x(data[0][element])
    last_y = y(data[1][element])
  });
}