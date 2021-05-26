
///////////////////////////////////////////
//Parametre a modifier
//Choisir l'annee pour afficher par defaut

var annee_e = "2017";

///////////////////////////////////////////


Promise.all([
    d3.csv("data/page2b_air/air_polluants.csv"), //pour les deux camemberts
    d3.csv("data/page2b_air/air_pop_expose.csv") //pour le dimple chart
    // d3.json("data/page2_emission/EPCI-ile-de-france.geojson")
]).then((data)=>{
    data_air = data[0];
    data_pop = data[1];
    var sec_info = get_airInfo(data_air);
    var sec_infop = get_airInfoP(data_air);
    dimple_data = get_history_air(data_pop);
    drawDimple_air(dimple_data);
    drawPieNox(sec_info);
    drawPiePm(sec_infop);
    drawLineChartNo2();
})

function get_history_air(data){
    let years = data.map(function(d){return d["ANNEE"];});
    years = [...new Set(years)]
    let history = []
    for (let y of years){
        history.push({
            annee: y, 
            "NO2": data.filter(function(d){return d["ANNEE"] === y})[0]["NO2"],
            "PM": data.filter(function(d){return d["ANNEE"] === y})[0]["PM10"]
        });
    }
    return history;
}


function showAirTooltip_bar(nom,annee, nb_Hbts, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#dimple_air_tool")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html(
              "<b>Nom: </b>" + nom + " <br>"
            + "<b>Annee: </b>" + annee + " <br>"
            + "<b>Nb_Hbts : </b>" + Intl.NumberFormat().format(nb_Hbts) + "<br>")
}

function drawDimple_air(data){
    var margin = {top: 30, right: 30, bottom: 70, left: 80};
    var height = 250;
    var width = 400;
    
    var svg = d3.select("#dimple_air")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
//modif

    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) {return d.annee;}))
        .padding(0.3);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x) )
          .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
   
    let pm_column = data.map(function(d) {
        return +d["PM"]
    });
    let no_column = data.map(function(d) {
        return +d["NO2"]
    });
    var y = d3.scaleLinear()
        .domain([0, d3.max(pm_column)])
        .range([height, 0])
    svg.append("g")
        .call(d3.axisLeft(y));
   
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.annee) ; })
            .attr("y", function(d) { return y(d["PM"] ); })
            .attr("width", x.bandwidth() / 2)
            .attr("height", function(d) { return height - y(d["PM"]  ); })
            .attr("fill", "#69b3a2")
            .on("mousemove", (d)=>{
                showAirTooltip_bar("PM10",d.annee,d["PM"], [d3.event.pageX + 30, d3.event.pageY - 30]);
                
                 })
              .on("mouseleave", d=>{
                d3.select("#dimple_air_tool").style("display","none")
                });

    svg.selectAll("mybar1")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.annee); })
            .attr("y", function(d) { return y(d["NO2"]); })
            .attr("width", x.bandwidth()/2)
            .attr("height", function(d) { return height - y(d["NO2"]); })
            .attr("fill", "red")
            .attr("transform",
                  "translate(" + x.bandwidth()/2 + ")")
            .on("mousemove", (d)=>{
                showAirTooltip_bar("NO2",d.annee,d["NO2"], [d3.event.pageX + 30, d3.event.pageY - 30]);
                 })
              .on("mouseleave", d=>{
                d3.select("#dimple_air_tool").style("display","none")
                });
                  

    var size = 10
    var x_dot = width - margin.right - 70
    var y_dot = margin.top + 10
    svg.append("rect")
            .attr("x", x_dot)
            .attr("y", y_dot + 1*(size+5))
            .attr("width", x.bandwidth())
            .attr("height", size)
            .style("fill", "#69b3a2")
    svg.append("rect")
            .attr("x", x_dot)
            .attr("y", y_dot + 2*(size+5))
            .attr("width", x.bandwidth())
            .style("height", size)
            .style("fill", "red")
    svg.append("text")
            .attr("x", x_dot + x.bandwidth()*1.2)
            .attr("y", y_dot + 1*(size+5) + (size/2))
            .text("PM10")
            .attr("text-anchor", "left")
            .style("fill", "black")
            .style("alignment-baseline", "middle")
            .style("font-family", "sans-serif")
            .style("font-size", "10")
    svg.append("text")
            .attr("x", x_dot + x.bandwidth()*1.2)
            .attr("y", y_dot + 2*(size+5) + (size/2))
            .text("NO2")
            .attr("text-anchor", "left")
            .style("fill", "black")
            .style("alignment-baseline", "middle")
            .style("font-family", "sans-serif")
            .style("font-size", "10")


   /* var line = d3.line()
        .x(function(d) {return x(d.annee); })
        .y(function(d) {return y(d["NO2"])})*/

    // X axis label:
   
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 20) + ")")
        .style("font-family", "sans-serif")
        .style("font-size", "10")
        .text("Année");

    // Y axis label:
   svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))  
        .style("font-family", "sans-serif")
        .style("font-size", "10")
        .text("Nombre d'habitants")

  /*  svg.append('path')
        .attr('d', line(data))
        .attr("stroke-width", 2)
        .attr('stroke', 'red')
        .attr('fill', 'none');*/
}

function secteur_filter_air(data, secteur){
    return data.filter(function(d){return d.Secteur === secteur;});
}

function get_airInfo(data){

    //NOx_totale = data, d=>d.nox;
    
    NOx_i = data.filter(function(d){return d.Secteur === "Industrie"})[0].NOx;
    NOx_br = data.filter(function(d){return d.Secteur === "Branche énergie"})[0].NOx;
    NOx_d = data.filter(function(d){return d.Secteur === "Déchets"})[0].NOx;
    NOx_r = data.filter(function(d){return d.Secteur === "Résidentiel"})[0].NOx;
    NOx_t = data.filter(function(d){return d.Secteur === "Tertiaire"})[0].NOx;
    NOx_c = data.filter(function(d){return d.Secteur === "Chantiers"})[0].NOx;
    NOx_tr = data.filter(function(d){return d.Secteur === "Transport routier"})[0].NOx;
    NOx_tff = data.filter(function(d){return d.Secteur === "Transport ferroviaire et fluvial"})[0].NOx;
    NOx_pa = data.filter(function(d){return d.Secteur === "Plateformes aéroportuaires"})[0].NOx;
    NOx_a = data.filter(function(d){return d.Secteur === "Agriculture"})[0].NOx;
    NOx_en = data.filter(function(d){return d.Secteur === "Émissions naturelles"})[0].NOx;

    //NOx_totale = NOx_i+NOx_br+NOx_d+NOx_r+NOx_t+NOx_c+NOx_tr+NOx_tff+NOx_pa+NOx_a+NOx_en;
    
    NOx_totale = parseInt(NOx_i) + parseInt(NOx_br)+ parseInt(NOx_d)+ parseInt(NOx_r)+ parseInt(NOx_t)+ parseInt(NOx_c) +parseInt(NOx_tr)+parseInt(NOx_tff)+ parseInt(NOx_pa)+parseInt(NOx_a)+ parseInt(NOx_en);
    
    var air_info = [{
        "Secteur": "Industrie",
        "NOx":NOx_i,
        "Taux": parseInt(NOx_i) /NOx_totale
    },{
        "Secteur": "Branche énergie",
        "NOx": NOx_br,
        "Taux": parseInt(NOx_br) /NOx_totale
    },{
        "Secteur": "Déchets",
        "NOx": NOx_d,
        "Taux": parseInt(NOx_d) /NOx_totale
    },{
        "Secteur": "Résidentiel",
        "NOx": NOx_r,
        "Taux": parseInt(NOx_r) /NOx_totale
    },{
        "Secteur": "Tertiaire",
        "NOx": NOx_t,
        "Taux": parseInt(NOx_t) /NOx_totale
    },{
        "Secteur": "Chantiers",
        "NOx": NOx_c,
        "Taux": parseInt(NOx_c) /NOx_totale
    },{
        "Secteur": "Transport routier",
        "NOx": NOx_tr,
        "Taux": parseInt(NOx_tr)/NOx_totale
    },{
        "Secteur": "Transport ferroviaire et fluvial",
        "NOx": NOx_tff,
        "Taux": parseInt(NOx_tff) /NOx_totale
    },{
        "Secteur": "Plateformes aéroportuaires",
        "NOx": NOx_pa,
        "Taux": parseInt(NOx_pa) /NOx_totale
    },{
        "Secteur": "Agriculture",
        "NOx": NOx_a,
        "Taux": parseInt(NOx_a) /NOx_totale
    
    },{
        "Secteur": "Émissions naturelles",
        "NOx": NOx_en,
        "Taux": parseInt(NOx_en) /NOx_totale
        
    }];
    return air_info;
}

function get_airInfoP(data){

    Pm_i = data.filter(function(d){return d.Secteur === "Industrie"})[0]["PM10"];
    Pm_br = data.filter(function(d){return d.Secteur === "Branche énergie"})[0]["PM10"];
    Pm_d  = data.filter(function(d){return d.Secteur === "Déchets"})[0]["PM10"];
    Pm_r = data.filter(function(d){return d.Secteur === "Résidentiel"})[0]["PM10"];
    Pm_t = data.filter(function(d){return d.Secteur === "Tertiaire"})[0]["PM10"];
    Pm_c = data.filter(function(d){return d.Secteur === "Chantiers"})[0]["PM10"];
    Pm_tr = data.filter(function(d){return d.Secteur === "Transport routier"})[0]["PM10"];
    Pm_tff = data.filter(function(d){return d.Secteur === "Transport ferroviaire et fluvial"})[0]["PM10"];
    Pm_pa = data.filter(function(d){return d.Secteur === "Plateformes aéroportuaires"})[0]["PM10"];
    Pm_a = data.filter(function(d){return d.Secteur === "Agriculture"})[0]["PM10"];
    Pm_en = data.filter(function(d){return d.Secteur === "Émissions naturelles"})[0]["PM10"];

    Pm_totale = parseInt(Pm_i) + parseInt(Pm_br) + parseInt(Pm_d) + parseInt(Pm_r) + parseInt(Pm_t) + parseInt(Pm_c) + parseInt(Pm_tr) + parseInt(Pm_tff) + parseInt(Pm_pa) + parseInt(Pm_a) + parseInt(Pm_en);
    var air_infop = [{
        "Secteur": "Industrie",
        "pm": Pm_i,
        "Taux": parseInt(Pm_i)/Pm_totale
    },{
        "Secteur": "Branche énergie",
        "pm": Pm_br,
        "Taux": parseInt(Pm_br)/Pm_totale
    },{
        "Secteur": "Déchets",
        "pm": Pm_d,
        "Taux": parseInt(Pm_d)/Pm_totale
    },{
        "Secteur": "Résidentiel",
        "pm": Pm_r,
        "Taux": parseInt(Pm_r)/Pm_totale
    },{
        "Secteur": "Tertiaire",
        "pm": Pm_t,
        "Taux": parseInt(Pm_t)/Pm_totale
    },{
        "Secteur": "Chantiers",
        "pm": Pm_c,
        "Taux": parseInt(Pm_c)/Pm_totale
    },{
        "Secteur": "Transport routier",
        "pm": Pm_tr,
        "Taux": parseInt(Pm_tr)/Pm_totale
    },{
        "Secteur": "Transport ferroviaire et fluvial",
        "pm": Pm_tff,
        "Taux": parseInt(Pm_tff)/Pm_totale
    },{
        "Secteur": "Plateformes aéroportuaires",
        "pm": Pm_pa,
        "Taux": parseInt(Pm_pa)/Pm_totale
    },{
        "Secteur": "Agriculture",
        "pm": Pm_a,
        "Taux": parseInt(Pm_a)/Pm_totale
    
    },{
        "Secteur": "Émissions naturelles",
        "pm": Pm_en,
        "Taux":  + parseInt(Pm_en)/Pm_totale
        
    }];
    return air_infop;

}
function showAirTooltip_pie(sec, emiss, taux, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_air_pie")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Secteur : </b>" + sec + "<br>"
            + "<b>Emission : </b>" + Math.round(emiss) + " tonnes par an<br>"
            + "<b>Taux : </b>" + Math.round(taux*100) + "%<br>")
}

function showAirTooltip_pie_pm(sec, emiss, taux, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_air_pie_pm")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Secteur : </b>" + sec + "<br>"
            + "<b>Emission : </b>" + Math.round(emiss) + " tonnes par an<br>"
            + "<b>Taux : </b>" + Math.round(taux*100) + "%<br>")
} 

function drawPieNox(data) {
    let body_air = d3.select("#piechart_air");
    let bodyHeight = 220;

    var keys = ["Industrie", "Branche énergie", "Déchets", "Résidentiel", "Tertiaire", "Chantiers",
    "Transport routier", "Transport ferroviaire et fluvial", "Plateformes aéroportuaires", "Agriculture", "Émissions naturelles"]
    data = data.map(d => ({
        secteur: d.Secteur,
        nox: +d.NOx,
        pm: +d.pm,
        taux: d.Taux
    }))
    let pie = d3.pie()
        .value(d => d.nox);
    let colorScale_nox = d3.scaleOrdinal()
        .domain(keys)
        .range(["#EE5126", "#FF8900", "#FFB55F", "#FBDB23", "#26cc45", "#09A785", "#18A1CD", "#0055ff", "#5326cc", "#b926cc", "#ff9cdb"])
    let arc = d3.arc()
        .outerRadius(bodyHeight / 2)
        .innerRadius(70);
    let g = body_air.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
    
        // Add one dot in the legend for each name.
    var size = 7
    var svg = d3.select("#piechart_air");
    x_dot = 200;
    y_dot = -100;
    svg.selectAll("dots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", x_dot)
        .attr("y", function(d,i){ return y_dot + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale_nox(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("labels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", x_dot + size*2)
        .attr("y", function(d,i){ return y_dot + i*(size+15) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "#696969")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    g.append("path")
        .attr("d", arc)
        .attr("fill", d => {
            return colorScale_nox(d.data.secteur)
        })
        .style("stroke", "white")

        .on("mousemove", (d)=>{
            showAirTooltip_pie(d.data.secteur, d.data.nox, d.data.taux, [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_air_pie").style("display","none")
        });
}

function drawPiePm(data) {
    let body_air = d3.select("#piechart_air_pm");
    let bodyHeight = 220;

    data = data.map(d => ({
        secteur: d.Secteur,
        nox: +d.NOx,
        pm: +d.pm,
        taux: d.Taux
    }))
    let pie = d3.pie()
        .value(d => d.pm);
    let colorScale_pm = d3.scaleOrdinal()
        .domain(["Industrie", "Branche énergie", "Déchets", "Résidentiel", "Tertiaire", "Chantiers",
    "Transport routier", "Transport ferroviaire et fluvial", "Plateformes aéroportuaires", "Agriculture"])
        .range(["#EE5126", "#FF8900", "#FFB55F", "#FBDB23", "#26cc45", "#09A785", "#18A1CD", "#0055ff", "#5326cc", "#b926cc", "#ff9cdb"])
    let arc = d3.arc()
        .outerRadius(bodyHeight / 2)
        .innerRadius(70);
    let g = body_air.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        
    g.append("path")
        .attr("d", arc)
        .attr("fill", d => {
            return colorScale_pm(d.data.secteur)
        })
        .style("stroke", "white")
        .on("mousemove", (d)=>{
            showAirTooltip_pie_pm(d.data.secteur, d.data.pm, d.data.taux,[d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_air_pie_pm").style("display","none")
        });
}

function drawLineChartNo2() {
    var height = 400;
    var width = 400;
    var svg_NO2 = dimple.newSvg("#air_linechart_NO2", width, height);
        d3.csv("data/page2b_air/mobilite_NO2.csv").then((data)=>{ 
        //    data_clean = data.filter(data_var => data_var.SOURCE !="Seuil Réglementaire");
        //    data_blue = data.filter(data_var => data_var.SOURCE =="Seuil Réglementaire");
        var linechart_NO2 = new dimple.chart(svg_NO2, data);
        linechart_NO2.setBounds(45, 70, 300, 205);
        linechart_NO2.defaultColors = [
            new dimple.color("#DF3500", "#DF3500", 1),
            new dimple.color("#FF8900", "#EA8000", 1),
            new dimple.color("#1D81A2", "#186F8A", 1)
        ];
        var x = linechart_NO2.addCategoryAxis("x", "ANNEE");
        var y = linechart_NO2.addMeasureAxis("y", "NO2");
        y.title = "Concentration de NO2 (µg/m³)";
        x.title = "Année";
        var s1 = linechart_NO2.addSeries("SOURCE", dimple.plot.line);
        s1.lineMarkers = true;
        
        linechart_NO2.addLegend(10, 50, 400, 20, "middle");
        linechart_NO2.draw();
    });
}
