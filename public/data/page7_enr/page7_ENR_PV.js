
let body_enr_pv = d3.select("#body_enr_pv");


Promise.all([
    d3.csv("data/page7_enr/ENR_pv.csv"),
    d3.json("data/page7_enr/departements-ile-de-france.geojson")
]).then((datasources)=>{
    mapInfo_pv = datasources[1];
    data_pv = datasources[0];
    prepare_pv_data(mapInfo_pv, data_pv);
    drawProdMap_pv(mapInfo_pv);
})

function prepare_pv_data(mapInfo_pv, data){
    
    let prod_pv = {};
    for(let c of data){
        let dep = c.Departement;
        prod_pv[dep] = c.nb_sites;
    };

    mapInfo_pv.features = mapInfo_pv.features.map(d => {
        let dep = d.properties.code_departement;
        let prod = +prod_pv[dep];
        d.properties.production = prod;
        return d;
    });
}

function drawProdMap_pv(mapInfo_pv){
    
    let maxProd_pv = d3.max(mapInfo_pv.features,
        d => d.properties.production);
    
    let midProd_pv = d3.median(mapInfo_pv.features,
        d => d.properties.production);

    let cScale = d3.scaleLinear()
        .domain([0, midProd_pv, maxProd_pv])
        .range(["#97DDF3","#18A1CD", "#1D81A2"]);

    let projection = d3.geoMercator()
        .center([3.9, 48.4])
        .scale(10600);

    let path = d3.geoPath()
        .projection(projection);

    body_enr_pv.selectAll("path")
        .data(mapInfo_pv.features)
        .enter().append("path")
        .attr('d', d=>path(d))
        .attr("stroke", "white")
        .attr("fill",d => d.properties.production ?
            cScale(d.properties.production): "#E0E0E0")
        .on("mouseover", (d)=>{
            showpvTooltip(d.properties.code_departement, d.properties.production,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_pv").style("display","none")
        });
}

function showpvTooltip(nom, prod, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_pv")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Département : </b>" + nom + "<br>"
                    + "<b>Nombre de site PV: </b>" + prod )
        
}