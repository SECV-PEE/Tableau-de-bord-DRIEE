Promise.all([
    d3.json("data/page8_territoires/L_COMMUNE_EPCI_EPT_BDT_S_R11_2018.json"),
    d3.json("data/page8_territoires/EPCI-ile-de-france.geojson"),
    d3.csv("data/page8_territoires/PCAET.csv"),
    d3.json("data/page8_territoires/MGP.geojson"),
    d3.json("data/page8_territoires/departements-ile-de-france.geojson")
]).then((data)=>{
    mapPCAET = data[0];
    mapEPCI = data[1];
    dataPCAET = data[2];
    mapMGP = data[0];
    contourMGP = data[3];
    depIDF = data[4];
    correctEPCI = split_pays_crecois(mapPCAET, mapEPCI);
    preparePCAETData(dataPCAET, correctEPCI);
    newFeatures = get_new_features(dataPCAET, mapMGP);
    drawMapPCAET(correctEPCI, newFeatures, contourMGP, depIDF);
})

function split_pays_crecois(mapPCAET, mapEPCI){
    to_modify = ["CC Pays Créçois", "CA Coulommiers Pays de Brie", "CA du Pays de Meaux", "CA Val d'Europe Agglomération"];
    to_meaux = ["Quincy-Voisins", "Boutigny", "Saint-Fiacre", "Villemareuil"];
    to_val_europe = ["Esbly", "Montry", "Saint-Germain-sur-Morin"];

    //store correct epcis that we will add to the corrected ones at the end
    const correct_epcis = {};
    correct_epcis["type"] = "FeatureCollection";
    correct_epcis["features"] = mapEPCI.features.filter(function(d){
        return !to_modify.includes(d.properties.nom);
    })

    // create new epcis where we will merge the geoms of the old cities with the added ones
    const new_pays_meaux = {};
    new_pays_meaux["type"] = "FeatureCollection";
    new_pays_meaux["features"] = mapPCAET.features.filter(function (d){
        return d.properties.nom_epci == "CA du Pays de Meaux"
    });
    const new_pays_brie = {};
    new_pays_brie["type"] = "FeatureCollection";
    new_pays_brie["features"] = mapPCAET.features.filter(function (d){
        return d.properties.nom_epci == "CA Coulommiers Pays de Brie"
    });
    const new_val_europe = {};
    new_val_europe["type"] = "FeatureCollection";
    new_val_europe["features"] = mapPCAET.features.filter(function (d){
        return d.properties.nom_epci == "CA Val d'Europe Agglomération"
    });

    const old_crecois = {};
    old_crecois["type"] = "FeatureCollection";
    old_crecois["features"] = [];
    old_crecois.features = mapPCAET.features.filter(function (d){
        return d.properties.nom_epci == "CC Pays Créçois"
    })

    //put all the cities from the old CC to the new ones
    old_crecois.features.forEach(element => {
        if (to_meaux.includes(element.properties.nom_com))
            new_pays_meaux.features.push(element);
        else if (to_val_europe.includes(element.properties.nom_com))
            new_val_europe.features.push(element);
        else
            new_pays_brie.features.push(element);
    });

    //merge geoms of newly formed epcis
    let union_meaux = turf.union.apply(this, new_pays_meaux.features);
    union_meaux.properties = {code: "200072130", nom: "CA du Pays de Meaux"};
    let union_brie = turf.union.apply(this, new_pays_brie.features);
    union_brie.properties = {code: "200077055", nom: "CA Coulommiers Pays de Brie"};
    let union_europe = turf.union.apply(this, new_val_europe.features);
    union_europe.properties = {code: "247700339", nom: "CA Val d'Europe Agglomération"};

    //push the new epcis to the old correct ones
    correct_epcis.features.push(union_meaux)
    correct_epcis.features.push(union_brie)
    correct_epcis.features.push(union_europe)

    //find a way to write new feature collection in file to use later
    return (correct_epcis);
}

function get_color(statut){
    if (statut === "Non concerné")
        return ("#d9d9d9");
    if (statut === "Non notifié")
        return ("#fce5cd");
    if (statut === "Notifié")
        return ("#6fa8dc");
    if (statut === "Consultation")
        return ("#ea9999");
    if (statut === "Adopté")
        return ("#94c5ad");
    else if (statut.includes("Adopté"))
        return ("#b7e1cd");
}

function preparePCAETData(dataPCAET, mapEPCI){
    const statut = new Array();
    const date = new Array();
    const plan_air = new Array();
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
        date[epci] = par_epci[0]["Délai légal de réalisation"]
        if (par_epci[0]["Délai légal de réalisation"] == "01/01/2022")
            plan_air[epci] = 2;
        else if (par_epci[0]["Délai légal de réalisation"] == "01/01/2021")
            plan_air[epci] = 1;
        else
            plan_air[epci] = 0;
    }

    //Filter data
    mapEPCI.features = mapEPCI.features.map(d => {
        let epci = d.properties.code;
        let status = statut[epci];
        let date_air = date[epci];
        let air = plan_air[epci];
        if (statut[epci] == "Sans information" || statut[epci] == "Gestation")
            status = "Non notifié"
        let color = get_color(status);
        if (statut[epci] != "Adopté" && statut[epci].includes("Adopté"))
            status = "Adopté, éval. env. manquante"
        d.properties.statut = status;
        d.properties.color = color;
        d.properties.plan_air = air;
        d.properties.date = date_air;
        return d;
    })
}

function get_new_features(dataPCAET, mapMGP){
    epts = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

    dataPCAET = dataPCAET.filter(function(d){
        return d["Type"] === "EPT";
    })
    const statut = new Array();
    const date = new Array();
    const plan_air = new Array();
    epts.forEach(element => {
        for (var i = 0; i < dataPCAET.length; i++){
            par_ept = dataPCAET.filter(function (d) {
                return (d["Nom complet"].includes("("+element+")"))
            });
            statut[element] = par_ept[0].Etat;
            date[element] = par_ept[0]["Délai légal de réalisation"]
            if (par_ept[0]["Délai légal de réalisation"] == "01/01/2022")
                plan_air[element] = 2;
            else if (par_ept[0]["Délai légal de réalisation"] == "01/01/2021")
                plan_air[element] = 1;
            else
                plan_air[element] = 0;
        }
    });
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
        let date_air = date[element];
        let air = plan_air[element];
        if (statut[element] == "Sans information" || statut[element] == "Gestation")
            status = "Non notifié"
        let color = get_color(status);
        if (statut[element] != "Adopté" && statut[element].includes("Adopté"))
            status = "Adopté, éval. env. manquante"
        union.properties.statut = status;
        union.properties.color = color;
        union.properties.plan_air = air;
        union.properties.date = date_air;
        newFeatures.features.push(union)
    })
    return (newFeatures)
}

function showTooltipPCAET(epci, statut, date, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_PCAET")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + epci + "<br>"
            + "<b>Statut : </b>" + statut + "<br>"
            + "<b>Plan air : </b>" + date + "<br")
}

function showTooltipPCAET_EPT(ept, statut, date, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_PCAET")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPT : </b>" + ept + "<br>"
            + "<b>Statut : </b>" + statut + "<br>"
            + "<b>Plan air : </b>" + date + "<br")
}

function drawMapPCAET(mapEPCI, newFeatures, contourMGP, depIDF) {
    // The svg
    var svg = d3.select("#map_PCAET"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.0, 48.63])                // GPS of location to zoom on
    .scale(12000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    var projectionMGP = d3.geoMercator()
    .center([2.9, 49.02])
    .scale(25000)
    .translate([ width/2, height/2 ])

    keys = ["Non obligé", "Non notifié", "Notifié", "En consultation", "Adopté", "Adopté -"]

    let colorScale_pcaet = d3.scaleOrdinal().domain(keys)
        .range(["#d9d9d9", "#fce5cd", "#6fa8dc", "#ea9999", "#94c5ad", "#b7e1cd"])

    geo_path = d3.geoPath().projection(projection)
    const full_array = new Array();
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(mapEPCI.features)
        .enter()
        .append("path")
        .attr("fill", d => d.properties.color)
        .attr("d", geo_path)
        .style("stroke", "white")
        .on("mouseover", (d)=>{
            showTooltipPCAET(d.properties.nom, d.properties.statut,
                d.properties.date, [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_PCAET").style("display","none");
        })
        .append("image")
            .attr("x", function(d) {
                let bbox = d3.select(this.parentNode).node().getBBox();
                let cloud = d.properties.plan_air;
                full_array.push([bbox, cloud]);
                return (bbox.x);
            })
   
    //add departements
    svg.append("g")
        .selectAll("path")
        .data(depIDF.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "#949494")
        .style("stroke-width", "2")

    //add departements
    svg.append("g")
        .selectAll("path")
        .data(depIDF.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "#868686")
        .style("stroke-width", "1")

    for (var i = 0; i < full_array.length; i++){
        svg.append("image")
            .attr("xlink:href", function(d){
                if (full_array[i][1] == 1)
                    return ("data/page8_territoires/cloud.png")
                else if (full_array[i][1] == 2)
                    return ("data/page8_territoires/cloudgray.png")
            })
            .attr("width", "20")
            .attr("height", "15")
            .style("pointer-events", "none")
            .attr("x", (full_array[i][0].x + full_array[i][0].width/3))
            .attr("y", (full_array[i][0].y + full_array[i][0].height/3))
    }
  
    const full_array2 = new Array();
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
            showTooltipPCAET_EPT(d.properties.nom_ept, d.properties.statut,
                d.properties.date, [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_PCAET").style("display","none");
        })
        .append("image")
            .attr("x", function(d) {
                let bbox = d3.select(this.parentNode).node().getBBox();
                let cloud = d.properties.plan_air;
                full_array2.push([bbox, cloud]);
                return (bbox.x);
            })
   
    //add MGP
    svg.append("g")
        .selectAll("path")
        .data(contourMGP.features)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("d", d3.geoPath()
            .projection(projectionMGP)
        )
        .style("stroke", "#99baea")
        .style("stroke-width", 4)

    for (var i = 0; i < full_array2.length; i++){
        svg.append("image")
            .attr("xlink:href", function(d){
                if (full_array2[i][1] == 1)
                    return ("data/page8_territoires/cloud.png")
                else if (full_array2[i][1] == 2)
                    return ("data/page8_territoires/cloudgray.png")
            })
            .attr("width", "20")
            .attr("height", "15")
            .style("pointer-events", "none")
            .attr("x", (full_array2[i][0].x + full_array2[i][0].width/3))
            .attr("y", (full_array2[i][0].y + full_array2[i][0].height/3))
    }

    var size = 7;
    var x_dot = 0;
    var y_dot = 50;

    svg.selectAll("map_dots")
    .data(keys)
    .enter()
    .append("rect")
        .attr("x", x_dot)
        .attr("y", function(d,i){ return y_dot + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return colorScale_pcaet(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("map_labels")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", x_dot + size*4)
        .attr("y", function(d,i){ return y_dot + i*(size+15) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "#696969")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    svg.append("text")
        .attr("x", x_dot + size*4 + 55)
        .attr("y", y_dot + 5*(size+15) + size/2)
        .text("avec évaluation environnementale manquante")
        .style("fill", "#696969")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "10px")

    svg.append("rect")
        .attr("x", x_dot)
        .attr("y", y_dot + 6*(size+15) + size/2)
        .attr("width", size*2)
        .attr("height", 3*size/4)
        .style("fill", "#99baea")

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot + 6*(size+15) + size)
        .style("fill", "#696969")
        .text("Métropole du Grand Paris")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    svg.append("rect")
        .attr("x", x_dot)
        .attr("y", y_dot + 7*(size+15) + size/2)
        .attr("width", size*2)
        .attr("height", size/2)
        .style("fill", "#949494")

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot + 7*(size+15) + size)
        .style("fill", "#696969")
        .text("Départements")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    svg.append("text")
        .attr("x", x_dot)
        .attr("y", y_dot + 9*(size+15) + size)
        .style("fill", "#696969")
        .text("Plan air à réaliser avant le")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    svg.append("image")
        .attr("xlink:href", "data/page8_territoires/cloud.png")
        .attr("width", "20")
        .attr("height", "15")
        .attr("x", x_dot)
        .attr("y", y_dot + 10*(size+15))

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot + 10*(size+15) + size)
        .style("fill", "#696969")
        .text("1er janvier 2021")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")

    svg.append("image")
        .attr("xlink:href", "data/page8_territoires/cloudgray.png")
        .attr("width", "20")
        .attr("height", "15")
        .attr("x", x_dot)
        .attr("y", y_dot + 11*(size+15))

    svg.append("text")
        .attr("x", x_dot + size*3)
        .attr("y", y_dot + 11*(size+15) + size)
        .style("fill", "#696969")
        .text("1er janvier 2022")
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "13px")
}