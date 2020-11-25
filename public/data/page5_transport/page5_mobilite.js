d3.csv("data/page5_transport/page5_chiffres_cles.csv").then((data)=>{
    chiffre_01 = data.filter(function(d){return d.id === "chiffre_1";});
    chiffre_02 = data.filter(function(d){return d.id === "chiffre_2";});
    chiffre_03 = data.filter(function(d){return d.id === "chiffre_3";});
    set_html("page5_chiffre1", chiffre_01[0].chiffre_cles);
    set_html("page5_chiffre2", chiffre_02[0].chiffre_cles);
    set_html("page5_chiffre3", chiffre_03[0].chiffre_cles);
    set_html("page5_mot1", chiffre_01[0].mots_cles);
    set_html("page5_mot2", chiffre_02[0].mots_cles);
    set_html("page5_mot3", chiffre_03[0].mots_cles);
    set_html("page5_des1", chiffre_01[0].description);
    set_html("page5_des2", chiffre_02[0].description);
    set_html("page5_des3", chiffre_03[0].description);
});


var svg_critair = dimple.newSvg("#mobilite_critair", 400, 330);
d3.csv("data/page5_transport/mobilite_immatriculation.csv").then((data)=>{
    var myChart = new dimple.chart(svg_critair, data);
    myChart.setBounds(85, 45, 300, 215)
    myChart.defaultColors = [
        new dimple.color("#18A1CD", "#FFFFFF", 1),
        new dimple.color("#09A785", "#FFFFFF", 1),
        new dimple.color("#09BB9F", "#FFFFFF", 1),
        new dimple.color("#FFB55F", "#FFFFFF", 1),
        new dimple.color("#FF8900", "#FFFFFF", 1),
        new dimple.color("#39F3BB", "#FFFFFF", 1)
    ];
    var x = myChart.addCategoryAxis("x", ["TYPE"]);
    var y = myChart.addPctAxis("y", "NOMBRE");
    y.title = "Pourcentage";
    x.title = "Type de véhicule";
    myChart.addSeries("CRIT_AIR", dimple.plot.bar);
    myChart.addLegend(100, 10, 240, 20, "right");
    myChart.draw();
});

var svg_pie = dimple.newSvg("#piechart_energie", 420, 300);
d3.csv("data/page5_transport/mobilite_energie.csv").then((data)=>{
var pie_energie = new dimple.chart(svg_pie, data);
    pie_energie.setBounds(20, 20, 360, 260)
    pie_energie.defaultColors = [
        new dimple.color("#C4C4C4", "#FFFFFF", 1),
        new dimple.color("#FFB55F", "#FFFFFF", 1),
        new dimple.color("#18A1CD", "#FFFFFF", 1),
        new dimple.color("#09A785", "#FFFFFF", 1),
        new dimple.color("#39F3BB", "#FFFFFF", 1),
    ];
    pie_energie.addMeasureAxis("p", "NOMBRE");
    pie_energie.addSeries("ENERGIE", dimple.plot.pie);
    pie_energie.addLegend(330, 20, 90, 300, "left");
    pie_energie.draw();
});

var svg_NO2 = dimple.newSvg("#linechart_NO2", 430, 300);
    d3.csv("data/page5_transport/mobilite_NO2.csv").then((data)=>{
      var linechart_NO2 = new dimple.chart(svg_NO2, data);
      linechart_NO2.setBounds(60, 30, 300, 205);
      linechart_NO2.defaultColors = [
        new dimple.color("#FF8900", "#EA8000", 1),
        new dimple.color("#09A785", "#089678", 1),
        new dimple.color("#1D81A2", "#186F8A", 1)
    ];
      var x = linechart_NO2.addCategoryAxis("x", "ANNEE");
      var y = linechart_NO2.addMeasureAxis("y", "NO2");
      y.title = "Concentration de NO2 (µg/m³ )";
      x.title = "Année";
      var s = linechart_NO2.addSeries("SOURCE", dimple.plot.line);
      s.lineMarkers = true;
      linechart_NO2.addLegend(60, 10, 400, 20, "right");
      linechart_NO2.draw();
});

var svg_ges = dimple.newSvg("#mixchart_ges", 440, 300);
    d3.csv("data/page5_transport/mobilite_ges.csv").then((data)=>{
        var mixchart_ges = new dimple.chart(svg_ges, data);
        mixchart_ges.setBounds(60, 30, 300, 205);
        var x = mixchart_ges.addCategoryAxis("x", "ANNEE");
        var y1 = mixchart_ges.addMeasureAxis("y", "CONSOMMATION");
        var y2 = mixchart_ges.addMeasureAxis("y", "EMISSION");
        x.title = "Année";
        y1.title = "Consommation (MWh)";
        y2.title = "Emission (kteq CO2)";
        var ges = mixchart_ges.addSeries(null, dimple.plot.line,[x, y2]);
        ges.lineMarkers = true;
        mixchart_ges.defaultColors = [
            new dimple.color("#09A785", "#FFB55F", 1),
        ];
        mixchart_ges.addSeries(null, dimple.plot.bar, [x, y1]);
        mixchart_ges.draw();
    });
