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
    mapInfo = data[1];
    dataA86 = data[2];
    dataMGP = data[3];
    dataPeriph = data[4];
    mapEPCI = data[5];
    dataPCAET = data[6];
    mapMGP = data[1];
    prepareMapData(dataCommune, mapInfo);
    drawMapZFE(mapInfo);
    preparePCAETData(dataPCAET, mapEPCI);
    newFeatures = get_new_features(dataPCAET, mapMGP);
    drawMapPCAET(mapEPCI, newFeatures);
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

function prepareMapData(data, mapInfo) {
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

function drawMapZFE(mapInfo, dataMgp){
    // The svg
    var svg = d3.select("#map_ZFE"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.7, 48.83])                // GPS of location to zoom on
    .scale(42000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    keys = ["ZFE adoptée", "Obligation de ZFE/ZFE non encore adoptée", "ZFE adoptée sous conditions non levées", "Dérogation à l'obligation de ZFE"]

    let colorScale_terr = d3.scaleOrdinal().domain(keys)
        .range(["#0BC094", "#FF8300", "#FFCB8D", "#E0E0E0"])
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

function get_color(statut){
    if (statut === "Non concerné")
        return ("#d9d9d9");
    if (statut === "Sans information")
        return ("#fce5cd");
    if (statut === "Gestation")
        return ("#ffd966");
    if (statut === "Notifié")
        return ("#6fa8dc");
    if (statut === "Consultation")
        return ("#ea9999");
    if (statut.includes("Adopté"))
        return ("#b7e1cd");
}

function preparePCAETData(dataPCAET, mapEPCI){
    const statut = new Array();
    dataPCAET = dataPCAET.filter(function(d){
        return d["Type"] != "EPT";
    })
    for (var i = 0; i < dataPCAET.length; i++){
        let par_epci = {};
        let epci = "";
        epci = dataPCAET[i]["Code EPCI"];
        par_epci = dataPCAET.filter(function (d) {
            return (d["Code EPCI"] === epci)
        });
        statut[epci] = par_epci[0].Etat;
    }
    statut["247700438"] = statut["200077055"] //temporary, to merge Crecy and Coulommiers, must be changed
    //Filter data

    mapEPCI.features = mapEPCI.features.map(d => {
        let epci = d.properties.code;
        let status = statut[epci];
        let color = get_color(status);
        d.properties.statut = status;
        d.properties.color = color;
        return d;
    })

    // mapMGP.features = mapMGP.features.filter(function(d){
    //     return d.properties.nom_epci == "Métropole du Grand Paris"
    // })

    // console.log(mapMGP);
    // console.log(newFeatures);
    // mapMGP = newFeatures;
    // console.log(mapMGP.features.filter(function(d){
        // return d.properties.nom_com === "T3"
    // }));
    // mapInfo.features = mapInfo.features.map(d => {
    //     let ept = toString(d.properties.code_insee);
    //     let status = statut[ept];
    //     let color = get_color(status);
    //     d.properties.statut = status;
    //     d.properties.color = color;
    //     return d;
    // })
}

function get_new_features(dataPCAET, mapMGP){
    epts = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

    dataPCAET = dataPCAET.filter(function(d){
        return d["Type"] === "EPT";
    })
    const statut = new Array();
    epts.forEach(element => {
        for (var i = 0; i < dataPCAET.length; i++){
            par_ept = dataPCAET.filter(function (d) {
                return (d["Nom complet"].includes("("+element+")"))
            });
            statut[element] = par_ept[0].Etat;
        }
    });
    console.log(statut);
    mapMGP.features = mapMGP.features.filter(function(d){
        return d.properties.nom_epci == "Métropole du Grand Paris"
    })

    const newFeatures = {};
    newFeatures["type"] = "FeatureCollection";
    newFeatures["features"] = [];
    epts.forEach(element => {
        let this_ept = mapMGP.features.filter(function(d){
            return d.properties.id_ept === element;
        })
        let union = turf.union.apply(this, this_ept);
        union.properties.nom_com = element;
        let status = statut[element];
        let color = get_color(status);
        union.properties.statut = status;
        union.properties.color = color;
        newFeatures.features.push(union)
    })
    console.log(newFeatures);
    return (newFeatures)
}

function showTooltipPCAET(epci, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_PCAET")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + epci + "<br>")
            // + "<b>Statut : </b>" + statut + "<br>")
}

function showTooltipPCAET_EPT(ept, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_PCAET")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPT : </b>" + ept + "<br>")
            // + "<b>Statut : </b>" + statut + "<br>")
}

function drawMapPCAET(mapEPCI, newFeatures) {
    console.log(newFeatures);
    // The svg
    var svg = d3.select("#map_PCAET"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.4, 48.63])                // GPS of location to zoom on
    .scale(12000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    var projectionMGP = d3.geoMercator()
    .center([3.1, 49.0])
    .scale(25000)
    .translate([ width/2, height/2 ])

    // keys = ["ZFE adoptée", "Obligation de ZFE/ZFE non encore adoptée", "ZFE adoptée sous conditions non levées", "Dérogation à l'obligation de ZFE"]

    // let colorScale_terr = d3.scaleOrdinal().domain(keys)
    //     .range(["#0BC094", "#FF8300", "#FFCB8D", "#E0E0E0"])
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapEPCI.features)
        .enter()
        .append("path")
        .attr("fill", d => d.properties.color)
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "white")
        .on("mouseover", (d)=>{
            showTooltipPCAET(d.properties.nom,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_PCAET").style("display","none");
        })


    svg.append("g")
        .selectAll("path")
        .data(newFeatures.features)
        .enter()
        .append("path")
        .attr("fill", d => d.properties.color)
        .attr("d", d3.geoPath()
            .projection(projectionMGP)
        )
        .style("stroke", "white")
        .on("mouseover", (d)=>{
            showTooltipPCAET_EPT(d.properties.nom_ept,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_PCAET").style("display","none");
        })
}