
///////////////////////////////////////////
//Parametre a modifier
// Choisir l'annee pour afficher par defaut

var annee_c = "2017";

///////////////////////////////////////////

var width = 600,
    height = 400, 
    centered;

let body = d3.select("#body");

var mapInfo = undefined;
var data = undefined;
var selectedEPCI = undefined;

Promise.all([
    d3.csv("data/page1_consommation/airparif_consommation_epci.csv"),
    d3.json("data/page1_consommation/EPCI-ile-de-france.geojson")
]).then((datasources)=>{
    update_chiffre_cles();
    update_chiffre_consommation();
    mapInfo = datasources[1];
    data = datasources[0];
    let line_data = get_history(data);
    data = annee_filter(data);
    var sec_info = get_secteurInfo(data);
    var eng_info = get_energieInfo(data);
    drawTreemap(eng_info);
    drawPie(sec_info);
    prepare_data(mapInfo, data);
    drawMap(data, mapInfo, "conso_tot");
    drawLineChart(line_data);
})

function set_html(id, text){
    document.getElementById(id).innerHTML = text;
}

function draw_pie_region(){
    d3.csv("data/page1_consommation/airparif_consommation_epci.csv").then((data)=>{
        data = annee_filter(data);
        var sec_info = get_secteurInfo(data);
        drawPie(sec_info);
    })
}

function get_secteurInfo(data){
    var sec_info = [{
        "Nom": "Régionale",
        "Secteur": "Agriculture",
        "Consommation": d3.sum(data.filter(d=>d.secteur === "AGR"),d=>d.consommation)
    },{
        "Nom": "Régionale",
        "Secteur": "Tertiaire",
        "Consommation": d3.sum(data.filter(d=>d.secteur === "TER"),d=>d.consommation)
    },{
        "Nom": "Régionale",
        "Secteur": "Industrie",
        "Consommation": d3.sum(data.filter(d=>d.secteur === "IND"),d=>d.consommation)
    },{
        "Nom": "Régionale",
        "Secteur": "Residentiel",
        "Consommation": d3.sum(data.filter(d=>d.secteur === "RES"),d=>d.consommation)
    },{
        "Nom": "Régionale",
        "Secteur": "Transport Routier",
        "Consommation": d3.sum(data.filter(d=>d.secteur === "TRAF"),d=>d.consommation)
    }];
    return sec_info;
}

function get_energieInfo(data){
    conso_totale = d3.sum(data, d=>d.consommation);
    conso_e = d3.sum(data.filter(d=>d.energie === "ELEC"),d=>d.consommation);
    conso_p = d3.sum(data.filter(d=>d.energie === "PP_CMS"),d=>d.consommation);
    conso_u = d3.sum(data.filter(d=>d.energie === "URB"),d=>d.consommation);
    conso_b = d3.sum(data.filter(d=>d.energie === "BOIS"),d=>d.consommation);
    conso_g = d3.sum(data.filter(d=>d.energie === "GN"),d=>d.consommation);
    var eng_info = [{
        "Energie": "Electricité", 
        "Consommation": conso_e,
        "Taux": conso_e/conso_totale
    },{
        "Energie": "Gaz Naturel", 
        "Consommation": conso_g,
        "Taux": conso_g/conso_totale
    },{
        "Energie": "Produit pétrolier et charbon", 
        "Consommation": conso_p,
        "Taux": conso_p/conso_totale
    },{
        "Energie": "Chauffage urbain", 
        "Consommation": conso_u,
        "Taux": conso_u/conso_totale
    },{
        "Energie": "Bois", 
        "Consommation": conso_b,
        "Taux": conso_b/conso_totale
    }];
    return eng_info;
}

function update_chiffre_consommation(){
    d3.csv("data/page1_consommation/page1_chiffres_cles.csv").then((data)=>{
        chiffre_01 = data.filter(function(d){return d.id === "chiffre_1";});
        chiffre_02 = data.filter(function(d){return d.id === "chiffre_2";});
        chiffre_03 = data.filter(function(d){return d.id === "chiffre_3";});
        set_html("page1_chiffre1", chiffre_01[0].chiffre_cles);
        set_html("page1_chiffre2", chiffre_02[0].chiffre_cles);
        set_html("page1_chiffre3", chiffre_03[0].chiffre_cles);
        set_html("page1_mot1", chiffre_01[0].mots_cles);
        set_html("page1_mot2", chiffre_02[0].mots_cles);
        set_html("page1_mot3", chiffre_03[0].mots_cles);
        set_html("page1_des1", chiffre_01[0].description);
        set_html("page1_des2", chiffre_02[0].description);
        set_html("page1_des3", chiffre_03[0].description);
    })
}

function update_chiffre_cles(){
    d3.csv("data/page1_consommation/page_chiffre_cles.csv").then((data)=>{
        consomm_1 = data.filter(function(d){return d.id === "consommation_1";});
        consomm_2 = data.filter(function(d){return d.id === "consommation_2";});
        consomm_3 = data.filter(function(d){return d.id === "consommation_3";});
        emission_1 = data.filter(function(d){return d.id === "emission_1";});
        emission_2 = data.filter(function(d){return d.id === "emission_2";});
        emission_3 = data.filter(function(d){return d.id === "emission_3";});
        production_1 = data.filter(function(d){return d.id === "production_1";});
        production_2 = data.filter(function(d){return d.id === "production_2";});
        production_3 = data.filter(function(d){return d.id === "production_3";});
        precarite_1 = data.filter(function(d){return d.id === "precarite_1";});
        precarite_2 = data.filter(function(d){return d.id === "precarite_2";});
        precarite_3 = data.filter(function(d){return d.id === "precarite_3";});
        bati_1 = data.filter(function(d){return d.id === "bati_1";});
        bati_2 = data.filter(function(d){return d.id === "bati_2";});
        bati_3 = data.filter(function(d){return d.id === "bati_3";});
        transport_1 = data.filter(function(d){return d.id === "transport_1";});
        transport_2 = data.filter(function(d){return d.id === "transport_2";});
        transport_3 = data.filter(function(d){return d.id === "transport_3";});
        chaleur_1 = data.filter(function(d){return d.id === "chaleur_1";});
        chaleur_2 = data.filter(function(d){return d.id === "chaleur_2";});
        chaleur_3 = data.filter(function(d){return d.id === "chaleur_3";});
        autre_enr_1 = data.filter(function(d){return d.id === "autre_enr_1";});
        autre_enr_2 = data.filter(function(d){return d.id === "autre_enr_2";});
        autre_enr_3 = data.filter(function(d){return d.id === "autre_enr_3";});
        set_html("consomm_1_chiffre", consomm_1[0].chiffre_cles);
        set_html("consomm_2_chiffre", consomm_2[0].chiffre_cles);
        set_html("consomm_3_chiffre", consomm_3[0].chiffre_cles);
        set_html("consomm_1_description", consomm_1[0].description);
        set_html("consomm_2_description", consomm_2[0].description);
        set_html("consomm_3_description", consomm_3[0].description);
        set_html("consomm_1_des_sup", consomm_1[0].description_sup);
        set_html("consomm_2_des_sup", consomm_2[0].description_sup);
        set_html("consomm_3_des_sup", consomm_3[0].description_sup);
        set_html("consomm_1_mot_cle", consomm_1[0].mot_cle);
        set_html("consomm_2_mot_cle", consomm_2[0].mot_cle);
        set_html("consomm_3_mot_cle", consomm_3[0].mot_cle);
        
        set_html("emission_1_chiffre", emission_1[0].chiffre_cles);
        set_html("emission_2_chiffre", emission_2[0].chiffre_cles);
        set_html("emission_3_chiffre", emission_3[0].chiffre_cles);
        set_html("emission_1_description", emission_1[0].description);
        set_html("emission_2_description", emission_2[0].description);
        set_html("emission_3_description", emission_3[0].description);
        set_html("emission_1_des_sup", emission_1[0].description_sup);
        set_html("emission_2_des_sup", emission_2[0].description_sup);
        set_html("emission_3_des_sup", emission_3[0].description_sup);
        set_html("emission_1_mot_cle", emission_1[0].mot_cle);
        set_html("emission_2_mot_cle", emission_2[0].mot_cle);
        set_html("emission_3_mot_cle", emission_3[0].mot_cle);

        set_html("production_1_chiffre", production_1[0].chiffre_cles);
        set_html("production_2_chiffre", production_2[0].chiffre_cles);
        set_html("production_3_chiffre", production_3[0].chiffre_cles);
        set_html("production_1_description", production_1[0].description);
        set_html("production_2_description", production_2[0].description);
        set_html("production_3_description", production_3[0].description);
        set_html("production_1_des_sup", production_1[0].description_sup);
        set_html("production_2_des_sup", production_2[0].description_sup);
        set_html("production_3_des_sup", production_3[0].description_sup);
        set_html("production_1_mot_cle", production_1[0].mot_cle);
        set_html("production_2_mot_cle", production_2[0].mot_cle);
        set_html("production_3_mot_cle", production_3[0].mot_cle);
                
        set_html("precarite_1_chiffre", precarite_1[0].chiffre_cles);
        set_html("precarite_2_chiffre", precarite_2[0].chiffre_cles);
        set_html("precarite_3_chiffre", precarite_3[0].chiffre_cles);
        set_html("precarite_1_description", precarite_1[0].description);
        set_html("precarite_2_description", precarite_2[0].description);
        set_html("precarite_3_description", precarite_3[0].description);
        set_html("precarite_1_des_sup", precarite_1[0].description_sup);
        set_html("precarite_2_des_sup", precarite_2[0].description_sup);
        set_html("precarite_3_des_sup", precarite_3[0].description_sup);
        set_html("precarite_1_mot_cle", precarite_1[0].mot_cle);
        set_html("precarite_2_mot_cle", precarite_2[0].mot_cle);
        set_html("precarite_3_mot_cle", precarite_3[0].mot_cle);


        set_html("bati_1_chiffre", bati_1[0].chiffre_cles);
        set_html("bati_2_chiffre", bati_2[0].chiffre_cles);
        set_html("bati_3_chiffre", bati_3[0].chiffre_cles);
        set_html("bati_1_description", bati_1[0].description);
        set_html("bati_2_description", bati_2[0].description);
        set_html("bati_3_description", bati_3[0].description);
        set_html("bati_1_des_sup", bati_1[0].description_sup);
        set_html("bati_2_des_sup", bati_2[0].description_sup);
        set_html("bati_3_des_sup", bati_3[0].description_sup);
        set_html("bati_1_mot_cle", bati_1[0].mot_cle);
        set_html("bati_2_mot_cle", bati_2[0].mot_cle);
        set_html("bati_3_mot_cle", bati_3[0].mot_cle);
        
        set_html("transport_1_chiffre", transport_1[0].chiffre_cles);
        set_html("transport_2_chiffre", transport_2[0].chiffre_cles);
        set_html("transport_3_chiffre", transport_3[0].chiffre_cles);
        set_html("transport_1_description", transport_1[0].description);
        set_html("transport_2_description", transport_2[0].description);
        set_html("transport_3_description", transport_3[0].description);
        set_html("transport_1_des_sup", transport_1[0].description_sup);
        set_html("transport_2_des_sup", transport_2[0].description_sup);
        set_html("transport_3_des_sup", transport_3[0].description_sup);
        set_html("transport_1_mot_cle", transport_1[0].mot_cle);
        set_html("transport_2_mot_cle", transport_2[0].mot_cle);
        set_html("transport_3_mot_cle", transport_3[0].mot_cle);
        
        set_html("chaleur_1_chiffre", chaleur_1[0].chiffre_cles);
        set_html("chaleur_2_chiffre", chaleur_2[0].chiffre_cles);
        set_html("chaleur_3_chiffre", chaleur_3[0].chiffre_cles);
        set_html("chaleur_1_description", chaleur_1[0].description);
        set_html("chaleur_2_description", chaleur_2[0].description);
        set_html("chaleur_3_description", chaleur_3[0].description);
        set_html("chaleur_1_des_sup", chaleur_1[0].description_sup);
        set_html("chaleur_2_des_sup", chaleur_2[0].description_sup);
        set_html("chaleur_3_des_sup", chaleur_3[0].description_sup);
        set_html("chaleur_1_mot_cle", chaleur_1[0].mot_cle);
        set_html("chaleur_2_mot_cle", chaleur_2[0].mot_cle);
        set_html("chaleur_3_mot_cle", chaleur_3[0].mot_cle);
        
        set_html("autre_enr_1_chiffre", autre_enr_1[0].chiffre_cles);
        set_html("autre_enr_2_chiffre", autre_enr_2[0].chiffre_cles);
        set_html("autre_enr_3_chiffre", autre_enr_3[0].chiffre_cles);
        set_html("autre_enr_1_description", autre_enr_1[0].description);
        set_html("autre_enr_2_description", autre_enr_2[0].description);
        set_html("autre_enr_3_description", autre_enr_3[0].description);
        set_html("autre_enr_1_des_sup", autre_enr_1[0].description_sup);
        set_html("autre_enr_2_des_sup", autre_enr_2[0].description_sup);
        set_html("autre_enr_3_des_sup", autre_enr_3[0].description_sup);
        set_html("autre_enr_1_mot_cle", autre_enr_1[0].mot_cle);
        set_html("autre_enr_2_mot_cle", autre_enr_2[0].mot_cle);
        set_html("autre_enr_3_mot_cle", autre_enr_3[0].mot_cle);
    })
}

function showTooltip(nom, conso, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + nom + "<br>"
            + "<b>Consommation : </b>" + Math.round(conso/1000) + "GWh<br>"
            + "<b>Année : </b>" + annee_c + "<br>")
}

function showTooltipPie(nom, sec, conso, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip2")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>EPCI : </b>" + nom + "<br>"
        + "<b>Secteur : </b>" + sec + "<br>"
        + "<b>Consommation : </b>" + Math.round(conso/1000) + "GWh<br>"
        + "<b>Année : </b>" + annee_c + "<br>")
}

function showTooltipTree(sec, conso, taux, coords){
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip_tree")
        .style("display", "block")
        .style("top", (y)+"px")
        .style("left", (x)+"px")
        .html("<b>Energie : </b>" + sec + "<br>"
            + "<b>Consommation : </b>" + Math.round(conso/1000) + "GWh<br>"
            + "<b>Taux : </b>" + Math.round(taux*100)  + "%")
        
}

function drawTreemap(data){
    let width_map = 900;
    let height_map = 250;
    var svg_tree = d3.select("#container_treemap")
        .attr("transform", "translate(" + 10 + ", " + 10 + ")");
        
    var color_tree = d3.scaleOrdinal()
    .domain(["Electricité", "Produit pétrolier et charbon", "Gaz Naturel", "Chauffage urbain", "Bois"])
    .range(["#18A1CD", "#525252", "#09BB9F", "#F67272", "#09A785"]);

    root = {};
    root["name"] = "root";
    children = [];
    for(let c of data){
        obj = {
            energie: c.Energie,
            parent: "Root",
            consommation: c.Consommation,
            taux: c.Taux
        };
        children.push(obj);
    }
    root["children"] = children;
    tree = d3.hierarchy(root);
    
    tree.sum(function(d) { return +d.consommation})

    
    d3.treemap()
    .size([width_map, height_map])
    .padding(4)
    (tree)

    svg_tree
        .selectAll("rect")
        .data(tree.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", function(d) { return color_tree(d.data.energie);})
        .on("mousemove", (d)=>{
            showTooltipTree(d.data.energie, d.data.consommation, d.data.taux,[d3.event.pageX + 15, d3.event.pageY - 15]);})
        .on("mouseleave", d=>{
            d3.select("#tooltip_tree").style("display","none")});
    
    // and to add the text labels
    svg_tree
        .selectAll("text")
        .data(tree.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ 
            if(d.data.taux > 0.1){
                return d.data.energie;
            }else{
                return " ";
            }
        })
        .attr("font-size", "15px")
        .attr("fill", "white")

}

function drawPie(data){
    let body = d3.select("#piechart");
    let bodyHeight = 200;
    let bodyWidth = 220;

    data = data.map(d => ({
        nom: d.Nom,
        secteur: d.Secteur,
        consommation: +d.Consommation
    }))

    let pie = d3.pie()
        .value(d => d.consommation);
    let colorScale = d3.scaleOrdinal()
        .domain(["Agriculture","Tertiaire","Industrie","Residentiel","Transport Routier"])
        .range(["#09A785", "#FFB55F", "#EE5126", "#FF8900", "#15607A"]);
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
            showTooltipPie(d.data.nom, d.data.secteur, d.data.consommation,[d3.event.pageX + 30, d3.event.pageY - 30]);})
        .on("mouseleave", d=>{
            d3.select("#tooltip2").style("display","none")});
}

function update_tree(eng_info){
    var color_tree = d3.scaleOrdinal()
        .domain(["Electricité", "Produit pétrolier et charbon", "Gaz Naturel", "Chauffage urbain", "Bois"])
        .range(["#18A1CD", "#525252", "#09BB9F", "#F67272", "#09A785"]);
    var svg_tree = d3.select("#container_treemap")
        .attr("transform", "translate(" + 10 + ", " + 10 + ")");
    root = {};
    root["name"] = "root";
    children = [];
    for(let c of eng_info){
        obj = {
            energie: c.Energie,
            parent: "Root",
            consommation: c.Consommation,
            taux: c.Taux
        };
        children.push(obj);
    }
    root["children"] = children;
    tree = d3.hierarchy(root);
    tree.sum(function(d) { return +d.consommation})

    d3.treemap()
    .size([900, 250])
    .padding(4)
    (tree)
    
    svg_tree
        .selectAll("rect")
        .data(tree.leaves())
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", function(d) { return color_tree(d.data.energie);})
        .on("mousemove", (d)=>{
            showTooltipTree(d.data.energie, d.data.consommation, d.data.taux,[d3.event.pageX + 15, d3.event.pageY - 15]);})
        .on("mouseleave", d=>{
            d3.select("#tooltip_tree").style("display","none")});
    
    // and to add the text labels
    svg_tree
        .selectAll("text")
        .data(tree.leaves())
        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ 
            if(d.data.taux > 0.1){
                return d.data.energie;
            }else{
                return " ";
            }
        })
        .attr("font-size", "15px")
        .attr("fill", "white")
}

function change_year(a){
    d3.csv("data/page1_consommation/airparif_consommation_epci.csv").then((data_s)=>{
        annee_c = a;
        data_n = annee_filter(data_s);
        var sec_info = get_secteurInfo(data_n);
        var eng_info = get_energieInfo(data_n);
        update_tree(eng_info);
        
        drawPie(sec_info);
        prepare_data(mapInfo, data_n);

        let maxConso = d3.max(mapInfo.features,
            d => d.properties.conso_tot);

        let cScale = d3.scaleLinear()
            .domain([0, 1000000, 2000000, 3000000, 4000000, maxConso])
            .range(["#18A1CD","#09A785", "#0AD8A2","#FFD29B","#FFB55F","#FF8900"]);
        body.selectAll("path").data(mapInfo.features)
            .attr("fill",d => d.properties.conso_tot ?
                cScale(d.properties.conso_tot): "white")
            .attr("stroke", "white")
            .on("mouseover", (d)=>{
                showTooltip(d.properties.nom, d.properties.conso_tot,
                    [d3.event.pageX + 30, d3.event.pageY - 30]);
            })
            .on("mouseleave", d=>{
                d3.select("#tooltip").style("display","none");
            })
            .on("click", d=> {
                selectedEPCI = d.properties.nom;
                conso_totale = d.properties.conso_elec+d.properties.conso_bois+
                    d.properties.conso_gn+d.properties.conso_pp_cms+d.properties.conso_urb;
                let pie_data = [{
                    "Nom": d.properties.nom,
                    "Secteur": "Agriculture",
                    "Consommation": d.properties.conso_agr
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Tertiaire",
                    "Consommation": d.properties.conso_ter
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Industrie",
                    "Consommation": d.properties.conso_ind
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Residentiel",
                    "Consommation": d.properties.conso_res
                },{
                    "Nom": d.properties.nom,
                    "Secteur": "Transport Routier",
                    "Consommation": d.properties.conso_traf
                }];
                let tree_data = [{
                    "Energie": "Electricité", 
                    "Consommation": d.properties.conso_elec,
                    "Taux": d.properties.conso_elec/conso_totale
                },{
                    "Energie": "Gaz Naturel", 
                    "Consommation": d.properties.conso_gn,
                    "Taux": d.properties.conso_gn/conso_totale
                },{
                    "Energie": "Produit pétrolier et charbon", 
                    "Consommation": d.properties.conso_pp_cms,
                    "Taux": d.properties.conso_pp_cms/conso_totale
                },{
                    "Energie": "Chauffage urbain", 
                    "Consommation": d.properties.conso_urb,
                    "Taux": d.properties.conso_urb/conso_totale
                },{
                    "Energie": "Bois", 
                    "Consommation": d.properties.conso_bois,
                    "Taux": d.properties.conso_bois/conso_totale
                }];
                update_tree(tree_data);
                drawPie(pie_data);
            })
    })
}

function prepare_data(mapInfo, data){
    let secteurs=["RES","TRAF","TER","IND","AGR"];
    let energie=["ELEC","URB","BOIS","GN"];
    let dataSecteur = {};
    let dataEnergie = {};
    for(let c of data){
        let par_secteur = {};
        let par_energie = {};
        let epci = c.epci;
        for(let s of secteurs){
            par_secteur[s] = d3.sum(data.filter(d=>d.epci === c.epci && 
                d.secteur === s),d=>d.consommation);
        }
        for(let e of energie){
            par_energie[e] = d3.sum(data.filter(d=>d.epci === c.epci && 
                d.energie === e),d=>d.consommation);
        }
        par_energie["PP_CMS"] = d3.sum(data.filter(d=>d.epci === c.epci && 
            d.energie === "PP + CMS"),d=>d.consommation);
        par_secteur["TOT"] = d3.sum(data.filter(d=>d.epci === c.epci),d=>d.consommation);
        dataSecteur[epci] = par_secteur;
        dataEnergie[epci] = par_energie;
    };

    mapInfo.features = mapInfo.features.map(d => {
        let epci = d.properties.code;
        let conso = dataSecteur[epci];
        let conso_eng = dataEnergie[epci];
        
        d.properties.conso_agr = Math.round(conso.AGR);
        d.properties.conso_ind = Math.round(conso.IND);
        d.properties.conso_res = Math.round(conso.RES);
        d.properties.conso_traf = Math.round(conso.TRAF);
        d.properties.conso_ter = Math.round(conso.TER);
        d.properties.conso_tot = Math.round(conso.TOT);
        d.properties.conso_elec = Math.round(conso_eng.ELEC);
        d.properties.conso_urb = Math.round(conso_eng.URB);
        d.properties.conso_bois = Math.round(conso_eng.BOIS);
        d.properties.conso_gn = Math.round(conso_eng.GN);
        d.properties.conso_pp_cms = Math.round(conso_eng.PP_CMS);

        return d;
    });
}

function annee_filter(data){
    return data.filter(function(d){return d.annee === annee_c;});
}

function get_history(data){
    let years = data.map(function(d){return d.annee;});
    years = [...new Set(years)]
    let history = []
    for (let y of years){
        history.push({
            Annee: y,
            Consommation_totale: d3.sum(data.filter(function(d){return d.annee === y;}),
                d=>d.consommation)/1000,
            Consommation_moyenne: d3.sum(data.filter(function(d){return d.annee === y;}),
            d=>d.consommation)/12150
        });
    }
    return history;
}

function drawLineChart(data){
    var svg = d3.select("#container_linechart")
    var myChart = new dimple.chart(svg, data);
    myChart.setBounds(50, 20, 300, 140);
    var x = myChart.addCategoryAxis("x", "Annee");
    x.addOrderRule("Annee");
    var y1 = myChart.addMeasureAxis("y", "Consommation_totale");
    var y2 = myChart.addMeasureAxis("y", "Consommation_moyenne");
    y1.title = "Consommation totale (GWh)"
    y2.title = "Consommation par habitant (KWh)"
    x.title ="Année"
    var s = myChart.addSeries(null, dimple.plot.bar,[x,y1]);
    var t = myChart.addSeries(null, dimple.plot.line,[x,y2]);
    t.lineMarkers = true;
    myChart.defaultColors = [
        new dimple.color("#09A785", "#FF483A", 1),
    ];
    myChart.draw();
}

function drawMap(data, mapInfo, sec){
    let maxConso = d3.max(mapInfo.features,
        d => d.properties[sec]);

    let cScale = d3.scaleLinear()
        .domain([0, 1000000, 2000000, 3000000, 4000000, maxConso])
        .range(["#18A1CD","#09A785", "#0AD8A2","#FFD29B","#FFB55F","#FF8900"]);

    let projection = d3.geoMercator()
        .center([3.9, 48.45])
        .scale(11200);

    let path = d3.geoPath()
        .projection(projection);

    body.selectAll("path")
        .data(mapInfo.features)
        .enter().append("path")
        .attr('d', d=>path(d))
        .attr("stroke", "white")
        .attr("fill",d => d.properties[sec] ?
            cScale(d.properties[sec]): "white")
        .on("mouseover", (d)=>{
            showTooltip(d.properties.nom, d.properties[sec],
                [d3.event.pageX + 30, d3.event.pageY - 30]);
        })
        .on("mouseleave", d=>{
            d3.select("#tooltip").style("display","none");
        })
        .on("click", d=> {
            selectedEPCI = d.properties.nom;
            conso_totale = d.properties.conso_elec+d.properties.conso_bois+
                d.properties.conso_gn+d.properties.conso_pp_cms+d.properties.conso_urb;
            let pie_data = [{
                "Nom": d.properties.nom,
                "Secteur": "Agriculture",
                "Consommation": d.properties.conso_agr
            },{
                "Nom": d.properties.nom,
                "Secteur": "Tertiaire",
                "Consommation": d.properties.conso_ter
            },{
                "Nom": d.properties.nom,
                "Secteur": "Industrie",
                "Consommation": d.properties.conso_ind
            },{
                "Nom": d.properties.nom,
                "Secteur": "Residentiel",
                "Consommation": d.properties.conso_res
            },{
                "Nom": d.properties.nom,
                "Secteur": "Transport Routier",
                "Consommation": d.properties.conso_traf
            }];
            let tree_data = [{
                "Energie": "Electricité", 
                "Consommation": d.properties.conso_elec,
                "Taux": d.properties.conso_elec/conso_totale
            },{
                "Energie": "Gaz Naturel", 
                "Consommation": d.properties.conso_gn,
                "Taux": d.properties.conso_gn/conso_totale
            },{
                "Energie": "Produit pétrolier et charbon", 
                "Consommation": d.properties.conso_pp_cms,
                "Taux": d.properties.conso_pp_cms/conso_totale
            },{
                "Energie": "Chauffage urbain", 
                "Consommation": d.properties.conso_urb,
                "Taux": d.properties.conso_urb/conso_totale
            },{
                "Energie": "Bois", 
                "Consommation": d.properties.conso_bois,
                "Taux": d.properties.conso_bois/conso_totale
            }];
            update_tree(tree_data);
            drawPie(pie_data);
        })
        
}
