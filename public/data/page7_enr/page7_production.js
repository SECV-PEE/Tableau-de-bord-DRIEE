///////////////////////////////////////////
//Parametre a modifier
// Choisir l'annee pour afficher par defaut

var annee_p = "2017";

///////////////////////////////////////////


let body_prod = d3.select("#body_prod");
var selectedEPCI = undefined;

Promise.all([
    d3.csv("data/page7_enr/rose_production_epci.csv"),
    d3.json("data/page7_enr/EPCI-ile-de-france.geojson")
]).then((datasources)=>{
    mapInfo = datasources[1];
    data_prod = datasources[0];
    let prod_history = get_prod_history(data_prod);
    drawProdLine(prod_history);
    data_prod = annee_filter_prod(data_prod);
    prod_par_sec = get_ProdInfo(data_prod);
    drawPieProd(prod_par_sec);
    prepare_prod_data(mapInfo, data_prod);
    drawProdMap(data_prod, mapInfo, "prod_tot");
})



function get_prod_history(data){
    data = data.filter(function(d){return d.secteur !== "coge";});
    let years = data.map(function(d){return d.annee;});
    years = [...new Set(years)]
    let history = []
    for (let y of years){
        history.push({
            year: y,
            value: d3.sum(data.filter(function(d){return d.annee === y;}),
                d=>d.production) 
        })
    }
    return history;
}

function drawProdLine(data){
    var svg = d3.select("#linechart_prod")
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(60, 10, 350, 130);
    var x = myChart.addCategoryAxis("x", "year");
    x.addOrderRule("year");
	x.title = "Année";
    var y = myChart.addMeasureAxis("y", "value");
    y.title = "Production (KWh)";
    myChart.defaultColors = [
        new dimple.color("#09A785", "#FF483A", 1),
    ];
    var s = myChart.addSeries(null, dimple.plot.line);
    s.lineMarkers = true;
    myChart.draw();
}

function annee_filter_prod(data){
    return data.filter(function(d){return d.annee === annee_p;});
}

function get_ProdInfo(data){
    var prod_info = [{
        "Secteur": "Photovoltaïque",
        "Production": d3.sum(data.filter(d=>d.secteur === "pv"),d=>d.production)
    },{
        "Secteur": "Hydraulique",
        "Production": d3.sum(data.filter(d=>d.secteur === "hyd"),d=>d.production)
    },{
        "Secteur": "Eolien",
        "Production": d3.sum(data.filter(d=>d.secteur === "eol"),d=>d.production)
    },{
        "Secteur": "Bioénergie",
        "Production": d3.sum(data.filter(d=>d.secteur === "bionrj"),d=>d.production)
    },{
        "Secteur": "Autres",
        "Production": d3.sum(data.filter(d=>d.secteur === "autres"),d=>d.production)
    }];
    return prod_info;
}

function prepare_prod_data(mapInfo, data){
    data = data.filter(d=>d.secteur !== "coge");
    let energie=["hyd","pv","eol","bionrj","autres"];
    let dataEnergie = {};
    for(let c of data){
        let par_energie = {};
        let epci = c.epci;
        for(let e of energie){
            par_energie[e] = d3.sum(data.filter(d=>d.epci === c.epci && 
                d.secteur === e), d=>d.production);
        }
        par_energie["tot"] = d3.sum(data.filter(d=>d.epci === c.epci),d=>d.production);
        dataEnergie[epci] = par_energie;
    };

    mapInfo.features = mapInfo.features.map(d => {
        let epci = d.properties.code;
        let prod = dataEnergie[epci];

        d.properties.prod_pv = Math.round(prod.pv);
        d.properties.prod_hyd = Math.round(prod.hyd);
        d.properties.prod_eol = Math.round(prod.eol);
        d.properties.prod_bionrj = Math.round(prod.bonrj);
        d.properties.prod_autres = Math.round(prod.autres);
        d.properties.prod_tot = Math.round(prod.tot);
        return d;
    });
}

function drawProdMap(data, mapInfo, sec){
    
    let maxProd = d3.max(mapInfo.features,
        d => d.properties[sec]);
    
    let midProd = d3.median(mapInfo.features,
        d => d.properties[sec]);

    let cScale = d3.scaleLinear()
        .domain([0, 1000000, 2000000, 4000000, 10000000, 200000000])
        .range(["#18A1CD","#09A785", "#0AD8A2","#FFD29B","#FFB55F","#FF8900"]);

    let bodyHeight = width;
    let bodyWidth = height;

    let projection = d3.geoMercator()
        .center([3.9, 48.4])
        .scale(10600);
        
    let path = d3.geoPath()
        .projection(projection);

    body_prod.selectAll("path")
        .data(mapInfo.features)
        .enter().append("path")
        .attr('d', d=>path(d))
        .attr("stroke", "white")
        .attr("fill",d => d.properties[sec] ?
            cScale(d.properties[sec]): "#E0E0E0")
        .on("mouseover", (d)=>{
            showPordTooltip(d.properties.nom, d.properties[sec],
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_prod").style("display","none")
        });
}

function showPordTooltip(nom, prod, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_prod")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + nom + "<br>"
            + "<b>Production d'électricité : </b>" + Math.round(prod/10000)/100 + "GWh<br>")
        
}

function showPordTooltip_pie(sec, prod, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_prod_pie")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Source : </b>" + sec + "<br>"
        + "<b>Production d'électricité : </b>" + Math.round(prod/10000)/100 + "GWh<br>")
        
}

function drawPieProd(data){
    let body = d3.select("#piechart_prod");
    let bodyHeight = 200;
    let bodyWidth = 220;

    data = data.map(d => ({
        secteur: d.Secteur,
        production: +d.Production
    }))
    
    let pie = d3.pie()
        .value(d => d.production);
    let colorScale = d3.scaleOrdinal().domain(["Photovoltaïque","Hydraulique","Eolien","Bioénergie","Autres"])
        .range(["#3082A3", "#41A8C9", "#23617B", "#32A785", "#FAB45A"])
    let arc = d3.arc()
        .outerRadius(bodyHeight / 2)
        .innerRadius(60);
    let g = body.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        
    g.append("path")
        .attr("d", arc)
        .style("stroke", "white")
        .attr("fill", d => {
            return colorScale(d.data.secteur)
        })
        .on("mousemove", (d)=>{
            showPordTooltip_pie(d.data.secteur, d.data.production,[d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_prod_pie").style("display","none")
        });
}