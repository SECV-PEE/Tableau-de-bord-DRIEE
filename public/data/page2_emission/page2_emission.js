
///////////////////////////////////////////
//Parametre a modifier
//Choisir l'annee pour afficher par defaut

var annee_e = "2017";

///////////////////////////////////////////



let body_emiss = d3.select("#body_emiss");


Promise.all([
    d3.csv("data/page2_emission/airparif_emission_epci.csv"),
    d3.json("data/page2_emission/EPCI-ile-de-france.geojson")
]).then((datasources)=>{
    mapInfo = datasources[1];
    data_emiss = datasources[0];
    line_emiss = get_history_emiss(data_emiss);
    drawLineChart_emiss(line_emiss);
    data_emiss = annee_filter_emission(data_emiss);
    var sec_info = get_emissionInfo(data_emiss);
    drawPieEmiss(sec_info);
    prepare_emiss_data(mapInfo, data_emiss);
    drawEmissMap(mapInfo);
})

function get_history_emiss(data){
    let years = data.map(function(d){return d.annee;});
    years = [...new Set(years)]
    population = {
        '2005': 11532,
        '2010': 11786,
        '2012': 11898,
        '2015': 12082,
        '2017': 12174
    }
    let history = []
    for (let y of years){
        history.push({
            annee: y,
            emission_totale: d3.sum(data.filter(function(d){return d.annee === y && d.secteur === "Totale";}),
                d=>d.emission),
            emission_moyenne: d3.sum(data.filter(function(d){return d.annee === y && d.secteur === "Totale";}),
            d=>d.emission)/population[y]
        });
    }
    return history;
}

function drawLineChart_emiss(data){
    var svg = d3.select("#container_linechart_emiss")
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(50, 20, 300, 140);
    var x = myChart.addCategoryAxis("x", "annee");
    x.addOrderRule("annee");
    var y1 = myChart.addMeasureAxis("y", "emission_totale");
    var y2 = myChart.addMeasureAxis("y", "emission_moyenne");
    y1.title = "Emission totale (kteq CO2)";
    y2.title = "Emission par habitant (teq CO2)";
    var s = myChart.addSeries(null, dimple.plot.bar,[x,y1]);
    var t = myChart.addSeries(null, dimple.plot.line,[x,y2]);
    t.lineMarkers = true;
    myChart.defaultColors = [
        new dimple.color("#09A785", "#FF483A", 1),
    ];
    myChart.draw();
}

var selectedEPCI = undefined;

function annee_filter_emission(data){
    return data.filter(function(d){return d.annee === annee_e;});
}

function prepare_emiss_data(mapInfo, data){
    let secteurs=["Agriculture","Transport_R","Tertiaire","Industrie","Residentiel","Transport_A","Production_Energie","Totale"];
    let dataSecteur = {};
    for(let c of data){
        let par_secteur = {};
        let epci = c.epci;
        for(let s of secteurs){
            par_secteur[s] = d3.sum(data.filter(d=>d.epci === c.epci && 
                d.secteur === s),d=>d.emission);
        }
        dataSecteur[epci] = par_secteur;
    };

    mapInfo.features = mapInfo.features.map(d => {
        let epci = d.properties.code;
        let emiss = dataSecteur[epci];

        d.properties.emiss_agr = Math.round(emiss.Agriculture);
        d.properties.emiss_ind = Math.round(emiss.Industrie);
        d.properties.emiss_res = Math.round(emiss.Residentiel);
        d.properties.emiss_trR = Math.round(emiss.Transport_R);
        d.properties.emiss_trA = Math.round(emiss.Transport_A);
        d.properties.emiss_tot = Math.round(emiss.Totale);
        d.properties.emiss_ter = Math.round(emiss.Tertiaire);
        d.properties.emiss_prd = Math.round(emiss.Production_Energie);
        return d;
    });
}

function drawEmissMap(mapInfo){
    
    let cScale = d3.scaleLinear()
        .domain([0, 400, 800, 2000, 4000, 30000])
        .range(["#18A1CD","#09A785", "#0AD8A2","#FFD29B","#FFB55F","#FF8900"]);

    let projection = d3.geoMercator()
        .center([3.9, 48.45])
        .scale(11200);

    let path = d3.geoPath()
        .projection(projection);

    body_emiss.selectAll("path")
        .data(mapInfo.features)
        .enter().append("path")
        .attr('d', d=>path(d))
        .attr("stroke", "white")
        .attr("fill",d => d.properties.emiss_tot ?
            cScale(d.properties.emiss_tot): "white")
        .on("mouseover", (d)=>{
            showEmissTooltip(d.properties.nom, d.properties.emiss_tot,
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_emission").style("display","none")
        })
        .on("click", d=> {
            selectedEPCI = d.properties.nom;
            let pie_data = [{
                "Nom": d.properties.nom,
                "Secteur": "Agriculture",
                "Emission": d.properties.emiss_agr
            },{
                "Nom": d.properties.nom,
                "Secteur": "Tertiaire",
                "Emission": d.properties.emiss_ter
            },{
                "Nom": d.properties.nom,
                "Secteur": "Industrie",
                "Emission": d.properties.emiss_ind
            },{
                "Nom": d.properties.nom,
                "Secteur": "Residentiel",
                "Emission": d.properties.emiss_res
            },{
                "Nom": d.properties.nom,
                "Secteur": "Transport Routier",
                "Emission": d.properties.emiss_trR
            },{
                "Nom": d.properties.nom,
                "Secteur": "Transport Autres",
                "Emission": d.properties.emiss_trA
            },{
                "Nom": d.properties.nom,
                "Secteur": "Production_Energie",
                "Emission": d.properties.emiss_prd
            }];
        drawPieEmiss(pie_data);

        });
}

function showEmissTooltip_pie(nom, sec, emiss, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_emission_pie")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + nom + "<br>"
            + "<b>Secteur : </b>" + sec + "<br>"
            + "<b>Emission : </b>" + Math.round(emiss) + "kteq CO2<br>"
            + "<b>Année : </b>" + annee_e + "<br>")
}

function showEmissTooltip(nom, emiss, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_emission")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + nom + "<br>"
            + "<b>Emission : </b>" + emiss + "kteq CO2<br>"
            + "<b>Année : </b>" + annee_e + "<br>")
}

function drawPieEmiss(data){
    let body = d3.select("#piechart_emiss");
    let bodyHeight = 220;

    data = data.map(d => ({
        nom: d.Nom,
        secteur: d.Secteur,
        emission: +d.Emission
    }))
    
    let pie = d3.pie()
        .value(d => d.emission);
    let colorScale_emiss = d3.scaleOrdinal().domain(["Agriculture","Residentiel","Industrie","Tertiaire",
    "Transport Routier","Transport Autres","Production_Energie"])
        .range(["#09A785", "#FF8900", "#EE5126", "#FFB55F", "#15607A", "#1D81A2", "#18A1CD"])
    let arc = d3.arc()
        .outerRadius(bodyHeight / 2)
        .innerRadius(70);
    let g = body.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        
    g.append("path")
        .attr("d", arc)
        .attr("fill", d => {
            return colorScale_emiss(d.data.secteur)
        })
        .style("stroke", "white")
        .on("mousemove", (d)=>{
            showEmissTooltip_pie(d.data.nom, d.data.secteur, d.data.emission,[d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip_emission_pie").style("display","none")
        });
}

function draw_pie_emiss_region(){
    d3.csv("data/page2_emission/airparif_emission_epci.csv").then((data)=>{
        data = annee_filter_emission(data);
        var sec_info = get_emissionInfo(data);
        drawPieEmiss(sec_info);
    })
}


function change_year_emission(a){
    d3.csv("data/page2_emission/airparif_emission_epci.csv").then((data_s)=>{
        annee_e = a;
        data_emiss = annee_filter_emission(data_s);
        var sec_info = get_emissionInfo(data_emiss);
        drawPieEmiss(sec_info);
        prepare_emiss_data(mapInfo, data_emiss);
        
        let cScale = d3.scaleLinear()
        .domain([0, 400, 800, 2000, 4000, 30000])
        .range(["#18A1CD","#09A785", "#0AD8A2","#FFD29B","#FFB55F","#FF8900"]);
        
        body_emiss.selectAll("path")
            .data(mapInfo.features)
            .attr("fill",d => d.properties.emiss_tot ?
                cScale(d.properties.emiss_tot): "white")
            .on("mouseover", (d)=>{
                showEmissTooltip(d.properties.nom, d.properties.emiss_tot,
                    [d3.event.pageX + 30, d3.event.pageY - 30]);
            })
            .on("mouseleave", d=>{
                d3.select("#tooltip_emission").style("display","none")
            })
            .on("click", d=> {
                selectedEPCI = d.properties.nom;
                let pie_data = [{
                    "Nom": d.properties.nom,
                    "Secteur": "Agriculture",
                    "Emission": d.properties.emiss_agr
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Tertiaire",
                    "Emission": d.properties.emiss_ter
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Industrie",
                    "Emission": d.properties.emiss_ind
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Residentiel",
                    "Emission": d.properties.emiss_res
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Transport Routier",
                    "Emission": d.properties.emiss_trR
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Transport Autres",
                    "Emission": d.properties.emiss_trA
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Production_Energie",
                    "Emission": d.properties.emiss_prd
                }];
            drawPieEmiss(pie_data);
            });
    })
}

function get_emissionInfo(data){
    var sec_info = [{
        "Nom": "Régionale",
        "Secteur": "Agriculture",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Agriculture"),d=>d.emission)
    },{
        "Nom": "Régionale",
        "Secteur": "Tertiaire",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Tertiaire"),d=>d.emission)
    },{ 
        "Nom": "Régionale",
        "Secteur": "Industrie",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Industrie"),d=>d.emission)
    },{ 
        "Nom": "Régionale",
        "Secteur": "Residentiel",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Residentiel"),d=>d.emission)
    },{ 
        "Nom": "Régionale",
        "Secteur": "Transport Routier",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Transport_R"),d=>d.emission)
    },{ 
        "Nom": "Régionale",
        "Secteur": "Transport Autres",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Transport_A"),d=>d.emission)
    },{ 
        "Nom": "Régionale",
        "Secteur": "Production_Energie",
        "Emission": d3.sum(data.filter(d=>d.secteur === "Production_Energie"),d=>d.emission)
    }];
    return sec_info;
}