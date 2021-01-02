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
    myChart.addSeries("CRIT_AIR", dimple.plot.bar)
        .addOrderRule(["EL", "Crit'air1", "Crit'air2", "Crit'air3", "Crit'air4", "Crit'air5", "Non classé"]);
    myChart.addLegend(60, 10, 350, 60, "right");
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
