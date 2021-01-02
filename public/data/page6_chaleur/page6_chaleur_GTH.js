
let body_chaleur_gth = d3.select("#body_chaleur_gth");

Promise.all([
    d3.csv("data/page6_chaleur/chaleur_GTH.csv"),
    d3.json("data/page6_chaleur/departements-ile-de-france.geojson"),
]).then((datasources)=>{
    mapInfo_gth = datasources[1];
    data_gth = datasources[0];
    draw_gth_line();
    prepare_gth_data(mapInfo_gth, data_gth);
    drawProdMap_gth(data_gth, mapInfo_gth);
})

function draw_gth_line(){
    var svg_gth = dimple.newSvg("#linechart_gth", 450, 400);
    d3.csv("data/page6_chaleur/chaleur_GTH_nb_logement.csv").then((data)=>{
        var line_gth = new dimple.chart(svg_gth, data);
        line_gth.setBounds(60, 30, 330, 230);
        var x = line_gth.addCategoryAxis("x", "ANNEE");
        x.title = "Année"; 
        y1 = line_gth.addMeasureAxis("y", "NB_LOGEMENT");
        y2 = line_gth.addMeasureAxis("y", "PRODUCTION");
        y1.title ="Nombre de logements raccordés";
        y2.title = "Production d'énergie par géothermie (MWh)";
        var ges = line_gth.addSeries(null, dimple.plot.line,[x, y2]);
        ges.lineMarkers = true;
        line_gth.defaultColors = [
            new dimple.color("#FF8900", "#EA8000", 1)
        ];

        line_gth.addSeries(null, dimple.plot.line, [x, y1]);
        line_gth.draw();
    });
}


function prepare_gth_data(mapInfo_gth, data){
    let dataEnergie = {};
    let nb_site_gth = {};
    for(let c of data){
        let dep = c.Dpt;
        gth_dep = data.filter(d=>d.Dpt === dep);
        dataEnergie[dep] = d3.sum(gth_dep,d=>d.MWh_GTH);
        nb_site_gth[dep] = gth_dep.length;
    };

    mapInfo_gth.features = mapInfo_gth.features.map(d => {
        let dep = d.properties.code_departement;
        let prod = dataEnergie[dep];
        let nb_site = nb_site_gth[dep];

        d.properties.production = Math.round(prod);
        d.properties.nb_site = nb_site;
        return d;
    });
}

function update_sites_gth(){
    let maxnb_gth = d3.max(mapInfo_gth.features,
        d => d.properties.nb_site);
    
    let midnb_gth = d3.median(mapInfo_gth.features,
        d => d.properties.nb_site);

    let cScale_gth_nb = d3.scaleLinear()
        .domain([0, midnb_gth, maxnb_gth])
        .range(["#FFD29B","#FFB55F", "#FF8900"]);

    body_chaleur_gth.selectAll("path")
        .data(mapInfo_gth.features)
        .attr("fill",d => d.properties.nb_site ?
        cScale_gth_nb(d.properties.nb_site): "#E0E0E0")
        .on("mouseover", (d)=>{
            showGTHTooltip(d.properties.nb_site, d.properties.code_departement, d.properties.production,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_chaleur").style("display","none")
        });
}

function update_prod_gth(){
    let maxProd_gth = d3.max(mapInfo_gth.features,
        d => d.properties.production);
    
    let midProd_gth = d3.median(mapInfo_gth.features,
        d => d.properties.production);

    let cScale = d3.scaleLinear()
        .domain([0, midProd_gth, maxProd_gth])
        .range(["#FFD29B","#FFB55F", "#FF8900"]);

    body_chaleur_gth.selectAll("path")
        .data(mapInfo_gth.features)
        .attr("fill",d => d.properties.production ?
            cScale(d.properties.production): "#E0E0E0")
        .on("mouseover", (d)=>{
            showGTHTooltip(d.properties.nb_site, d.properties.code_departement, d.properties.production,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_chaleur").style("display","none")
        });
}



function drawProdMap_gth(data, mapInfo_gth){   
    let maxProd_gth = d3.max(mapInfo_gth.features,
        d => d.properties.production);
    
    let midProd_gth = d3.median(mapInfo_gth.features,
        d => d.properties.production);

    let cScale = d3.scaleLinear()
        .domain([0, midProd_gth, maxProd_gth])
        .range(["#FFD29B","#FFB55F", "#FF8900"]);

    let projection = d3.geoMercator()
        .center([3.9, 48.4])
        .scale(10600);

    let path = d3.geoPath()
        .projection(projection);

    body_chaleur_gth.selectAll("path")
        .data(mapInfo_gth.features)
        .enter().append("path")
        .attr('d', d=>path(d))
        .attr("stroke", "white")
        .attr("fill",d => d.properties.production ?
            cScale(d.properties.production): "#E0E0E0")
        .on("mouseover", (d)=>{
            showGTHTooltip(d.properties.nb_site, d.properties.code_departement, d.properties.production,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_chaleur").style("display","none")
        });
}

function showGTHTooltip(nb_gth, nom, prod, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_chaleur")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Département : </b>" + nom + "<br>"
            + "<b>Production géothermique : </b>" + prod + "MWh<br>"
            + "<b>Nombre de sites : </b>" + nb_gth + "<br>")
        
}
