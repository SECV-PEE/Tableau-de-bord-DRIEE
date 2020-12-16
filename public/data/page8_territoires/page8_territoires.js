Promise.all([
    d3.csv("data/page8_territoires/liste_communes_obliges_zfem.csv"),
    d3.json("data/page8_territoires/L_COMMUNE_EPCI_EPT_BDT_S_R11_2018.json"),
    d3.json("data/page8_territoires/Reseau_routier_magistral.geojson")
]).then((data)=>{
    dataCommune = data[0];
    mapInfo = data[1];
    dataRoad = data[2];
    prepareMapData(dataCommune, mapInfo, dataRoad);
    drawMap(mapInfo);
})

function get_statut(couleur) {
    if (couleur === "#E0E0E0")
        return ("Dérogation à l'obligation de ZFE")
    if (couleur === "#FFCB8D")
        return ("ZFE adoptée sous conditions non levées")
    if (couleur === "#0BC094")
        return ("ZFE adoptée")
    if (couleur === "#FF8300")
        return ("Obligation de ZFE/ZFE non encore adoptée")
}

function prepareMapData(data, mapInfo, dataRoad) {
    const couleur = new Array();
    for(var i = 0; i < data.length; i++){
        let par_insee = {};
        let insee = data[i]["Code géographique"];
        par_insee = data.filter(function (d) {
                return (d["Code géographique"] === insee);
            });
        couleur[insee] = par_insee[0].couleur;
    };

    // Filter data
    mapInfo.features = mapInfo.features.filter(function(d){
        return d.properties.nom_epci == "Métropole du Grand Paris"
    })

    mapInfo.features = mapInfo.features.map(d => {
        let insee = d.properties.code_insee;
        let color = couleur[insee];
        let statut = get_statut(color);
        d.properties.couleur = color;
        d.properties.statut = statut;
        return d;
    });

    dataRoad.features = dataRoad.features.filter(function(d){
        return (d.properties.nom.includes("A86") || d.properties.nom === "N186" 
        || d.properties.objectid == "424"
        || d.properties.objectid == "427" || d.properties.objectid == "428"
        || d.properties.objectid == "423" || d.properties.objectid == "422"
        || d.properties.objectid == "421" || d.properties.objectid == "432"
        || d.properties.objectid == "431")
    })
    // console.log(dataRoad);
}

function showTooltipZFE(nom, ept, statut, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_ZFE")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Commune : </b>" + nom + "<br>"
            + "<b>EPT : </b>" + ept + "<br>"
            + "<b>Statut : </b>" + statut + "<br>")
}

function drawMap(mapInfo){
    // The svg
    var svg = d3.select("#map_MGP"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.6, 48.83])                // GPS of location to zoom on
    .scale(42000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    keys = ["ZFE adoptée", "Obligation de ZFE/ZFE non encore adoptée", "ZFE adoptée sous conditions non levées", "Dérogation à l'obligation de ZFE"]

    let colorScale_terr = d3.scaleOrdinal().domain(keys)
        .range(["#0BC094", "#FF8300", "#FFCB8D", "#E0E0E0"])
    console.log(mapInfo)
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapInfo.features)
        .enter()
        .append("path")
        .attr("fill", d => d.properties.couleur)
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "white")
        .on("mouseover", (d)=>{
            showTooltipZFE(d.properties.nom_com, d.properties.nom_ept, d.properties.statut,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_ZFE").style("display","none");
        })

    //draw road on map
    // svg.append("g")
    //     .selectAll("path")
    //     .data(dataRoad.features)
    //     .enter()
    //     .append("path")
    //     .attr("fill", "none")
    //     .attr("d", d3.geoPath()
    //         .projection(projection)
    //     )
    //     // .style("stroke", "#ffe72a") //yelow
    //     .style("stroke", "#369bfb") //blu
    //     .style("stroke-width", "4")

    // Add one dot in the legend for each name.
    var size = 7
    x_dot = 420;
    y_dot = 150;
    svg.selectAll("pie_dots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", x_dot)
        .attr("y", function(d,i){ return y_dot + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale_terr(d)})

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
}
