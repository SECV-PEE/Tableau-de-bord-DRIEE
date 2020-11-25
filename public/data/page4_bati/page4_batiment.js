
d3.csv("data/page4_bati/page4_chiffres_cles.csv").then((data)=>{
  chiffre_01 = data.filter(function(d){return d.id === "chiffre_1";});
  chiffre_02 = data.filter(function(d){return d.id === "chiffre_2";});
  chiffre_03 = data.filter(function(d){return d.id === "chiffre_3";});
  set_html("page4_chiffre1", chiffre_01[0].chiffre_cles);
  set_html("page4_chiffre2", chiffre_02[0].chiffre_cles);
  set_html("page4_chiffre3", chiffre_03[0].chiffre_cles);
  set_html("page4_mot1", chiffre_01[0].mots_cles);
  set_html("page4_mot2", chiffre_02[0].mots_cles);
  set_html("page4_mot3", chiffre_03[0].mots_cles);
  set_html("page4_des1", chiffre_01[0].description);
  set_html("page4_des2", chiffre_02[0].description);
  set_html("page4_des3", chiffre_03[0].description);
});


var units = "KWh";
 
var margin_sankey = {top: 10, right: 10, bottom: 10, left: 10},
    width_sankey = 880 - margin_sankey.left - margin_sankey.right,
    height_sankey = 380 - margin_sankey.top - margin_sankey.bottom;
 
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; };
 
// append the svg_sankey_sankey canvas to the page
var svg_sankey = d3.select("#sankey_chart");
 
// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .size([width_sankey, height_sankey]);
 
var path = sankey.link();
 
// load the data
d3.json("data/page4_bati/dpe_sankey.json").then((graph)=>{
  var nodeMap = {};
    graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
    graph.links = graph.links.map(function(x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });
 
  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(0);
 
// add in the links
  var link = svg_sankey.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });
 
// add the link titles
  link.append("title")
        .text(function(d) {
      	return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });
 

// add in the nodes
  var node = svg_sankey.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
    
 var color_nodes = d3.scaleOrdinal()
    .domain([">2000","1980-2000","1960-1980","1940-1960","<1940","Non connu",
    "A_ges","B_ges","C_ges","D_ges","E_ges","F_ges","G_ges","N_ges",
    "A_consomm","B_consomm","C_consomm","D_consomm","E_consomm","F_consomm","G_consomm","N_consomm"])
    .range(["#2C5A9C", "#3984B6", "#47AED0", "#83CACF", "#C6E3CB","E0E0E0",
    "#32984F","#96CE5D", "#DAEE88","#FFFEBD","#FBDF88","#F58C55","#D02D20","E0E0E0",
    "#EEF8FB","#C1D3E7", "#A1BDDB","#8D97C7","#8A6CB2","#85439E","#6A056C","E0E0E0"]);

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return color_nodes(d.name);})
      .style("stroke", "black")
    .append("title")
      .text(function(d) { 
		  return d.name + "\n" + format(d.value); });
 
// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");
 
});


var svg_cee = dimple.newSvg("#CEE-stackchart", 700, 330);
d3.csv("data/page4_bati/CEE_simplifiee.csv").then((data)=>{
  var cee_chart = new dimple.chart(svg_cee, data);
  cee_chart.setBounds(50, 30, 660, 255);
  cee_chart.defaultColors = [
    new dimple.color("#FF8900", "#FF8900", 1), 
    new dimple.color("#09A785", "#09A785", 1)
];
  var x = cee_chart.addCategoryAxis("x", "DATE");
  x.addOrderRule("DATE");
  var y = cee_chart.addMeasureAxis("y", "MONTANT");
  y.title = "Energie économisée cumulée (KWhc)"
  var s = cee_chart.addSeries("TYPE", dimple.plot.area);
  cee_chart.addLegend(60, 10, 500, 20, "right");
  cee_chart.draw();
});

