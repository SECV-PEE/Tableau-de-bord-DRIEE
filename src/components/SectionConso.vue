<template>
  <div id="section-conso" class="section-conso">
    <div class="separateur">
      <h1 class="grand-titre">{{data.nom}}</h1>
    </div>
    <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
    <h3 class="grand-titre">Consommation énergétique par EPCI en Île-de-France</h3>
    <a href="http://sigr.iau-idf.fr/webapps/cartes/rose/?op=a" target="_blank">Source: AIRPARIF, ROSE</a>
    <div id="container_conso" class="container">
      <div id="container_carte_conso" class="carte" style="width: 450px;">
        <div id="button-annee">
          <h4 style="color: #696969; font-size: 0.8em;">Années disponibles</h4>
          <div class="sep_small"></div>
          <button class="button-conso" onclick="change_year('2017')">2017</button>
          <button class="button-conso" onclick="change_year('2015')">2015</button>
          <button class="button-conso" onclick="change_year('2012')">2012</button>
          <button class="button-conso" onclick="change_year('2010')">2010</button>
          <button class="button-conso" onclick="change_year('2005')">2005</button>
        </div>
        <img id="legend_02" :src="`${path}${img_page}/legend_conso.png`" alt="legend" style="width: 450px; height: 78px; margin-top: 0em;">
        <svg id="container" width="450" height="375">
          <g id="body"></g>  
        </svg>
      </div>
      <div id="container_inner_cartes" style="width: 450px;">
        <h4>Évolution de la consommation d'énergie francilienne</h4>
        <svg id="container_linechart" height="210" width="400"></svg>
        <h4>Répartition par secteur</h4>
        <button class="button-region" onclick="draw_pie_region()">Régionale</button>
        <div>
          <svg id="container_pie" height="200" width="220">
            <g id="piechart" transform="translate(100, 100)"></g>
          </svg>
          <img :src="`${path}${img_page}/legend_pie.png`" height="200" width="108" alt="legend">
        </div>
      </div>
    </div>
    <div style="text-align: left;">
      <h4>Répartition de la consommation par type d'énergie</h4>
      <svg id="container_treemap" height="300" width="900"></svg>
    </div>
    <div id="tooltip" class="tt" style="display: none; top: 3176px; left: 609px;"></div>
    <div id="tooltip2" class="tt" style="display: none; top: 3245px; left: 737px;"></div>
    <div id="tooltip_tree" class="tt" style="display: none; top: 3757px; left: 748px;"></div>
    <script2 :src="`${path}data/page1_consommation/page1_consomm.js`"></script2>
  </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionConso',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionConsoImg",
    }
  }
}
</script>

<style>
.section-conso {
  padding: inherit;
  justify-items: center;
}
</style>
