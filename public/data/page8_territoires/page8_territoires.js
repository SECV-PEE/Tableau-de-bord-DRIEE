Promise.all([
    d3.csv("data/page8_territoires/liste_communes_obliges_zfem.csv"),
    d3.json("data/page8_territoires/L_COMMUNE_EPCI_EPT_BDT_S_R11_2018.json")
]).then((data)=>{
    dataCommune = data[0];
    mapInfo = data[1];
    prepareMapData(dataCommune, mapInfo);
    drawMap(mapInfo);
})

function prepareMapData(data, mapInfo) {
    const couleur = new Array();
    for(var i = 0; i < data.length; i++){
        let par_insee = {};
        let insee = data[i]["Code géographique"];
        console.log(data[i]["Code géographique"]);
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
        d.properties.couleur = color;
        return d;
    });
}

function showTooltipZFE(nom, ept, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_ZFE")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Commune : </b>" + nom + "<br>"
            + "<b>EPT : </b>" + ept + "<br>")
}

function drawMap(mapInfo){
    // The svg
    var svg = d3.select("#map_MGP"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // Map and projection
    var projection = d3.geoMercator()
    .center([2.4, 48.83])                // GPS of location to zoom on
    .scale(42000)                       // This is like the zoom
    .translate([ width/2, height/2 ])


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
            showTooltipZFE(d.properties.nom_com, d.properties.nom_ept,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_ZFE").style("display","none");
        })
}
