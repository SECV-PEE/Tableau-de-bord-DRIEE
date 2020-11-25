d3.csv("data/page3_precarite/page3_chiffres_cles.csv").then((data)=>{
    chiffre_01 = data.filter(function(d){return d.id === "chiffre_1";});
    chiffre_02 = data.filter(function(d){return d.id === "chiffre_2";});
    chiffre_03 = data.filter(function(d){return d.id === "chiffre_3";});
    set_html("page3_chiffre1", chiffre_01[0].chiffre_cles);
    set_html("page3_chiffre2", chiffre_02[0].chiffre_cles);
    set_html("page3_chiffre3", chiffre_03[0].chiffre_cles);
    set_html("page3_mot1", chiffre_01[0].mots_cles);
    set_html("page3_mot2", chiffre_02[0].mots_cles);
    set_html("page3_mot3", chiffre_03[0].mots_cles);
    set_html("page3_des1", chiffre_01[0].description);
    set_html("page3_des2", chiffre_02[0].description);
    set_html("page3_des3", chiffre_03[0].description);
});