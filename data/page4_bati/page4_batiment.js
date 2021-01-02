Promise.all([
  d3.csv("data/page4_bati/DPE_IDF.csv"),
  d3.csv("data/page4_bati/DPE_IDF_Conso.csv"),
  d3.csv("data/page4_bati/CIDD.csv")
]).then((data)=>{
  data_cidd = data[2];
  data_conso = data[1];
  data = data[0];
  drawBarDpe(conversor(data));
  drawAreaDpe(conversor_conso(data_conso));
  drawPieCidd(get_BatimentInfo(data_cidd));
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
  var margin = {top: 30, right: 0, bottom: 70, left: 30},
    width = 420 - margin.left - margin.right,
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
    .attr("y", -margin.left + 5)
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
  var margin = {top: 30, right: 30, bottom: 70, left: 80},
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
    .domain([0, 600])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));


  var letters = ["Z", "A", "B", "C", "D", "E", "F", "G"];
  var colorzZz = d3.scaleOrdinal().domain(letters)
    .range(["#d3ee24", "#83BF74", "#22D55D", "#C9F970", "#FFFF3F", "#FFD72D", "#F3A24C", "#FF0100"])

  var last_x = x(0)
  var last_y = y(0)

  letters.forEach(element => {
    svg.append("line")
      .datum(data)
      .attr("stroke", colorzZz(element))
      .attr("stroke-width", 1.5)
      .attr("x1", last_x)
      .attr("x2", x(data[0][element]))
      .attr("y1", last_y)
      .attr("y2", y(data[1][element]))
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
    last_x = x(data[0][element])
    last_y = y(data[1][element])
  });

  svg.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", y(90))
    .attr("y2", y(90))
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 3)

  svg.append("text")
    .attr("x", x(10))
    .attr("y", y(100) - 7)
    .text("Niveau BBC rénovation")
    .attr("text-anchor", "left")
    .style("fill", "red")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10")
  
  svg.append("text")
    .attr("x", (x(data[0]["C"]) + x(data[0]["B"]))/2)
    .attr("y", y(30))
    .text("C")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12")
    .style("font-weight", "bold")
  svg.append("text")
    .attr("x", (x(data[0]["D"]) + x(data[0]["C"]))/2)
    .attr("y", y(30))
    .text("D")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12")
    .style("font-weight", "bold")
  svg.append("text")
    .attr("x", (x(data[0]["E"]) + x(data[0]["D"]))/2)
    .attr("y", y(30))
    .text("E")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12")
    .style("font-weight", "bold")
  svg.append("text")
    .attr("x", (x(data[0]["F"]) + x(data[0]["E"]))/2)
    .attr("y", y(30))
    .text("F")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12")
    .style("font-weight", "bold")
    svg.append("text")
    .attr("x", (x(data[0]["G"]) + x(data[0]["F"]))/2)
    .attr("y", y(30))
    .text("G")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "12")
    .style("font-weight", "bold")

  svg.append("text")
    .attr("x", -margin.top - 180)
    .attr("y", -margin.left + 40)
    .text("Consommation énergétique (kWhEP/m².an)")
    .attr("text-anchor", "left")
    .attr("transform", "rotate(-90)")
    .style("fill", "rgba(0, 0, 0, 0.87)")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10")

  svg.append("text")
    .attr("x", -margin.left + 200)
    .attr("y", height + 30)
    .text("% de surface cumulée")
    .attr("text-anchor", "left")
    .style("fill", "rgba(0, 0, 0, 0.87)")
    .style("alignment-baseline", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10")

}

function get_BatimentInfo(data){
    var materiau_info = [{
        "Nom": "Matériaux d'isolation des parois vitrées",
        "Taux": data[0]["taux"]
    },{
        "Nom": "Chaudières",
        "Taux": data[1]["taux"]
    },{ 
        "Nom": "Matériaux d'isolation des toitures",
        "Taux": data[2]["taux"]
    },{ 
        "Nom": "Matériaux d'isolation des murs donnant sur l'extérieur",
        "Taux": data[3]["taux"]
    },{ 
        "Nom": "Volets isolants",
        "Taux": data[4]["taux"]
    },{ 
        "Nom": "Chauffage bois/biomasse",
        "Taux": data[5]["taux"]
    },{ 
        "Nom": "Pompes à chaleur",
        "Taux": data[6]["taux"]
    },{ 
        "Nom": "Autres actions",
        "Taux": data[7]["taux"]
    }];
    return materiau_info;
}

function showBatiTooltip_pie(nom, taux, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_bati_pie")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Nom : </b>" + nom + "<br>"
            + "<b>Taux : </b>" + taux + " %<br>")
}

function drawPieCidd(data){
    let body = d3.select("#piechart_bati");
    let bodyHeight = 220;

    data = data.map(d => ({
        nom: d.Nom,
        taux: d.Taux
    }))
    
    var keys = ["Matériaux d'isolation des parois vitrées",
      "Chaudières",
      "Matériaux d'isolation des toitures",
      "Matériaux d'isolation des murs donnant sur l'extérieur",
      "Volets isolants",
      "Chauffage bois/biomasse",
      "Pompes à chaleur",
      "Autres actions"
    ]

    let pie = d3.pie()
        .value(d => d.taux);
    let colorScale_bati = d3.scaleOrdinal().domain(keys)
        .range(["#EE5126", "#FF8901", "#FFB55F", "#FFE25F", "#32A785", "#41A8CA", "#3082A3", "#22617B"])
    let arc = d3.arc()
        .outerRadius(bodyHeight / 2)
        .innerRadius(70);
    let g = body.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        
    // Add one dot in the legend for each name.
    var size = 7
    var svg = d3.select("#piechart_bati");
    x_dot = 150;
    y_dot = -100;
    svg.selectAll("pie_dots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", x_dot)
        .attr("y", function(d,i){ return y_dot + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale_bati(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("pie_labels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", x_dot + size*2)
        .attr("y", function(d,i){ return y_dot + i*(size+15) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "#696969")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => {
            return colorScale_bati(d.data.nom)
        })
        .style("stroke", "white")
        .on("mousemove", (d)=>{
            showBatiTooltip_pie(d.data.nom, d.data.taux,[d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_bati_pie").style("display","none")
        });
}