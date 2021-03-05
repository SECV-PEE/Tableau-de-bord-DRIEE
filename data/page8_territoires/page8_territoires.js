Promise.all([
    d3.csv("data/page8_territoires/liste_communes_obliges_zfem.csv"),
    d3.json("data/page8_territoires/L_COMMUNE_EPCI_EPT_BDT_S_R11_2018.json"),
    d3.json("data/page8_territoires/A86.geojson"),
    d3.json("data/page8_territoires/MGP.geojson"),
    d3.json("data/page8_territoires/periph.geojson"),
    d3.json("data/page8_territoires/EPCI-ile-de-france.geojson"),
    d3.csv("data/page8_territoires/PCAET.csv")
]).then((data)=>{
    dataCommune = data[0];
    mapTerr = data[1];
    dataA86 = data[2];
    dataMGP = data[3];
    dataPeriph = data[4];
    mapEPCI = data[5];
    dataPCAET = data[6];
    mapMGP = data[1];
    mapOld = data[1];
    prepareMapData(dataCommune, mapTerr);
    drawMapZFE(mapTerr);
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
    if (couleur === "#318CE7")
        return ("Hors périmètre souhaitant rejoindre la ZFE")
}

function prepareMapData(data, mapTerr) {
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
    mapTerr.features = mapTerr.features.filter(function(d){
        return d.properties.nom_epci == "Métropole du Grand Paris"
    })

    mapTerr.features = mapTerr.features.map(d => {
        let insee = d.properties.code_insee;
        let color = couleur[insee];
        let statut = get_statut(color);
        d.properties.couleur = color;
        d.properties.statut = statut;
        return d;
    });
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

function drawMapZFE(mapTerr, dataMgp){
    // The svg
    var svg = d3.select("#map_ZFE"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.7, 48.83])                // GPS of location to zoom on
    .scale(42000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    keys = ["ZFE adoptée", "Obligation de ZFE/ZFE non encore adoptée", "ZFE adoptée sous conditions non levées", "Dérogation à l'obligation de ZFE", "Hors périmètre souhaitant rejoindre la ZFE"]

    let colorScale_terr = d3.scaleOrdinal().domain(keys)
        .range(["#0BC094", "#FF8300", "#FFCB8D", "#E0E0E0", "#318CE7"])
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapTerr.features)
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

    // MGP

    svg.append("g")
        .selectAll("path")
        .data(dataMGP.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projection)
            )
        .style("stroke", "#1A92B9")
        .style("stroke-width", 3)

    var size = 7
    x_dot = 470;
    y_dot = 120;

    // legend title
    svg.append("text")
        .attr("x", x_dot - 20)
        .attr("y", y_dot - 70)
        .text("Communes soumises à l'obligation d'instaurer une ZFE")
        .style("font-size", "15px")
        .style("fill", "#696969")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    svg.append("text")
        .attr("x", x_dot - 20)
        .attr("y", y_dot - 50)
        .style("font-size", "15px")
        .style("fill", "#696969")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .text("en application du décret D2213-1-0-2 du CGCT")

    svg.append("text")
        .attr("x", x_dot - 20)
        .attr("y", y_dot - 30)
        .style("font-size", "15px")
        .style("fill", "#696969")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .text("pour l'année 2021")

    //MGP        
    y_dot2 = y_dot + (keys.length + 1) * (size+15)
    svg.append("rect")
        .attr("x", x_dot)
        .attr("y", y_dot2)
        .attr("width", size*2)
        .attr("height", 3*size/4)
        .style("fill", "#1A92B9")

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot2 + size/2)
        .style("fill", "#696969")
        .text("Métropole du Grand Paris")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    // A86
    svg.append("g")
        .selectAll("path")
        .data(dataA86.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projection)
            )
        .style("stroke", "#E03D26")
        .style("stroke-width", 4)

    svg.append("g")
        .selectAll("path")
        .data(dataA86.features)
        .enter()
        .append("path")
        .attr("fill", "#FFD223")
        .attr("d", d3.geoPath()
            .projection(projection)
            )
        .style("stroke", "#FFD223")
        .style("stroke-width", 3)

    y_dot3 = y_dot2 + (size+15)
    svg.append("rect")
        .attr("x", x_dot)
        .attr("y", y_dot3)
        .attr("width", size*2)
        .attr("height", 3*size/4)
        .style("fill", "#E03D26")
    svg.append("rect")
        .attr("x", x_dot + 1)
        .attr("y", y_dot3 + 1)
        .attr("width", size*2-2)
        .attr("height", 3*size/4-2)
        .style("fill", "#FFD223")

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot3 + size/2)
        .style("fill", "#696969")
        .text("Périmètre objectif de la ZFE A86 (non incluse)")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    // Periph
    svg.append("g")
        .selectAll("path")
        .data(dataPeriph.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projection)
            )
        .style("stroke", "#E03D26")
        .style("stroke-width", 2)

    y_dot4 = y_dot3 + (size+15)
    svg.append("rect")
        .attr("x", x_dot)
        .attr("y", y_dot4)
        .attr("width", size*2)
        .attr("height", 3*size/4)
        .style("fill", "#E03D26")

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot4 + size/2)
        .style("fill", "#696969")
        .text("Périphérique")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    // Add one dot in the legend for each name.
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
        .attr("x", x_dot + size*3)
        .attr("y", function(d,i){ return y_dot + i*(size+15) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "#696969")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

}
