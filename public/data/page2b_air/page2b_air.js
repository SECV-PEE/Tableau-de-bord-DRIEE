
///////////////////////////////////////////
//Parametre a modifier
//Choisir l'annee pour afficher par defaut

var annee_e = "2017";

///////////////////////////////////////////


Promise.all([
    d3.csv("data/page2b_air/air_polluants.csv") //pour les deux camemberts
    // d3.json("data/page2_emission/EPCI-ile-de-france.geojson")
]).then((data)=>{
    data_air = data[0];
    var sec_info = get_airInfo(data_air);
    drawPieNox(sec_info);
    drawPiePm(sec_info);
})

function secteur_filter_air(data, secteur){
    return data.filter(function(d){return d.Secteur === secteur;});
}

function get_airInfo(data){
    var air_info = [{
        "Secteur": "Industrie",
        "NOx": data.filter(function(d){return d.Secteur === "Industrie"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Industrie"})[0]["PM10"],
    },{
        "Secteur": "Branche énergie",
        "NOx": data.filter(function(d){return d.Secteur === "Branche énergie"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Branche énergie"})[0]["PM10"],
    },{
        "Secteur": "Déchets",
        "NOx": data.filter(function(d){return d.Secteur === "Déchets"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Déchets"})[0]["PM10"],
    },{
        "Secteur": "Résidentiel",
        "NOx": data.filter(function(d){return d.Secteur === "Résidentiel"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Résidentiel"})[0]["PM10"],
    },{
        "Secteur": "Tertiaire",
        "NOx": data.filter(function(d){return d.Secteur === "Tertiaire"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Tertiaire"})[0]["PM10"],
    },{
        "Secteur": "Chantiers",
        "NOx": data.filter(function(d){return d.Secteur === "Chantiers"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Chantiers"})[0]["PM10"],
    },{
        "Secteur": "Transport routier",
        "NOx": data.filter(function(d){return d.Secteur === "Transport routier"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Transport routier"})[0]["PM10"],
    },{
        "Secteur": "Transport ferroviaire et fluvial",
        "NOx": data.filter(function(d){return d.Secteur === "Transport ferroviaire et fluvial"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Transport ferroviaire et fluvial"})[0]["PM10"],
    },{
        "Secteur": "Plateformes aéroportuaires",
        "NOx": data.filter(function(d){return d.Secteur === "Plateformes aéroportuaires"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Plateformes aéroportuaires"})[0]["PM10"],
    },{
        "Secteur": "Agriculture",
        "NOx": data.filter(function(d){return d.Secteur === "Agriculture"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Agriculture"})[0]["PM10"],
    },{
        "Secteur": "Émissions naturelles",
        "NOx": data.filter(function(d){return d.Secteur === "Émissions naturelles"})[0].NOx,
        "pm": data.filter(function(d){return d.Secteur === "Émissions naturelles"})[0]["PM10"],
    }];
    console.log(air_info);
    return air_info;
}

function showAirTooltip_pie(sec, emiss, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_air_pie")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Secteur : </b>" + sec + "<br>"
            + "<b>Emission : </b>" + Math.round(emiss) + " tonnes par an<br>")
}

function showAirTooltip_pie_pm(sec, emiss, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_air_pie_pm")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Secteur : </b>" + sec + "<br>"
            + "<b>Emission : </b>" + Math.round(emiss) + " tonnes par an<br>")
}

function drawPieNox(data) {
    let body_air = d3.select("#piechart_air");
    let bodyHeight = 220;

    data = data.map(d => ({
        secteur: d.Secteur,
        nox: +d.NOx,
        pm: +d.pm
    }))
    console.log(data)
    let pie = d3.pie()
        .value(d => d.nox);
    let colorScale_nox = d3.scaleOrdinal()
        .domain(["Industrie", "Branche énergie", "Déchets", "Résidentiel", "Tertiaire", "Chantiers",
    "Transport routier", "Transport ferroviaire et fluvial", "Plateformes aéroportuaires", "Agriculture", "Émissions naturelles"])
        .range(["#09A785", "#FF8900", "#EE5126", "#FFB55F", "#15607A", "#1D81A2", "#18A1CD", "#B5E0F9", "#F9E7B5", "##E2F9B5", "#DDB5F9"])
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
            return colorScale_nox(d.data.secteur)
        })
        .style("stroke", "white")
        .on("mousemove", (d)=>{
            showAirTooltip_pie(d.data.secteur, d.data.nox,[d3.event.pageX + 30, d3.event.pageY - 30]);
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
        pm: +d.pm
    }))
    let pie = d3.pie()
        .value(d => d.pm);
    let colorScale_pm = d3.scaleOrdinal()
        .domain(["Industrie", "Branche énergie", "Déchets", "Résidentiel", "Tertiaire", "Chantiers",
    "Transport routier", "Transport ferroviaire et fluvial", "Plateformes aéroportuaires", "Agriculture"])
        .range(["#09A785", "#FF8900", "#EE5126", "#FFB55F", "#15607A", "#1D81A2", "#18A1CD", "#B5E0F9", "#F9E7B5", "##E2F9B5"])
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
            showAirTooltip_pie_pm(d.data.secteur, d.data.pm,[d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_air_pie_pm").style("display","none")
        });
}