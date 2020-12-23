Promise.all([
    d3.json("data/page8_territoires/L_COMMUNE_EPCI_EPT_BDT_S_R11_2018.json"),
    d3.json("data/page8_territoires/EPCI-ile-de-france.geojson"),
    d3.csv("data/page8_territoires/PCAET.csv")
]).then((data)=>{
    mapInfo = data[0];
    mapEPCI = data[1];
    dataPCAET = data[2];
    mapMGP = data[0];
    correctEPCI = split_pays_crecois(mapInfo, mapEPCI);
    preparePCAETData(dataPCAET, correctEPCI);
    newFeatures = get_new_features(dataPCAET, mapMGP);
    drawMapPCAET(correctEPCI, newFeatures);
})

function split_pays_crecois(mapInfo, mapEPCI){
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
    new_pays_meaux["features"] = mapInfo.features.filter(function (d){
        return d.properties.nom_epci == "CA du Pays de Meaux"
    });
    const new_pays_brie = {};
    new_pays_brie["type"] = "FeatureCollection";
    new_pays_brie["features"] = mapInfo.features.filter(function (d){
        return d.properties.nom_epci == "CA Coulommiers Pays de Brie"
    });
    const new_val_europe = {};
    new_val_europe["type"] = "FeatureCollection";
    new_val_europe["features"] = mapInfo.features.filter(function (d){
        return d.properties.nom_epci == "CA Val d'Europe Agglomération"
    });

    const old_crecois = {};
    old_crecois["type"] = "FeatureCollection";
    old_crecois["features"] = [];
    old_crecois.features = mapInfo.features.filter(function (d){
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

    return (correct_epcis);
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