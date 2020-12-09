Promise.all([
  d3.csv("data/page4_bati/DPE_IDF.csv")
]).then((data)=>{
  data = data[0];
  data_region = getRegionData(data);
  drawBarDpe(data_region);
  // drawAreaDpe(data);
})

function getRegionData(data)
{
  return (data.filter(function (d) {return d.Zone == "Région"})[0])
}

function showBatiTooltip_Dpe(category, value, coords)
{
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_bati_dpe")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Catégorie : </b>" + category + "<br>"
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
    // .tickValues(["0%", "5%", "10%", "15%", "20%", "25%", "30%", "35%", "40%", ])

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
  var margin = {top: 10, right: 30, bottom: 30, left: 50},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
      
  var svg = d3.select("#dpe_area_chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  svg.append()
}