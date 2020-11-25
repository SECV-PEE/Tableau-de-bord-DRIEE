<template>
    <div id="section-emiss">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div id="emission_container_generale" style="width: 900px; height: 700px">
        <h3>Émissions de gaz à effet de serre (GES) par EPCI en Île-de-France</h3>
        <a href="http://sigr.iau-idf.fr/webapps/cartes/rose/?op=a">Source: AIRPARIF, ROSE</a>
        <div class="carte" style="width: 450px; height: 600px;">
          <div id="button-emission">
            <h4>Années disponibles</h4>
            <div class="sep_small"></div>
            <button onclick="change_year_emission('2017')">2017</button>
            <button onclick="change_year_emission('2015')">2015</button>
            <button onclick="change_year_emission('2012')">2012</button>
            <button onclick="change_year_emission('2010')">2010</button>
            <button onclick="change_year_emission('2005')">2005</button>
          </div>
          <img :src="`${path}${img_page}/legend_emiss.png`" alt="legend" width="450" height="67">
          <svg id="emission_container" width="450" height="350">
            <g id="body_emiss"></g>
          </svg>
        </div>
        <div id="emission_cartes" style="width: 450px;">
          <h4>Évolution des émissions de GES franciliennes</h4>
          <svg id="container_linechart_emiss" height="210" width="400"></svg>
          <h4>Répartition par secteur</h4>
          <button class="button-region" onclick="draw_pie_emiss_region()">Régionale</button>
          <div>
            <svg id="container_pie_emiss" height="220" width="240">
              <g id="piechart_emiss" transform="translate(110,110)"></g>
            </svg>
            <img :src="`${path}${img_page}/legend_pie_emiss.png`" width="140" height="200">
          </div>
        </div>
        <div id="tooltip_emission" class="tt" style="display: none; top: 4525px; left: 483px"></div>
        <div id="tooltip_emission_pie" class="tt">Tooltip</div>
        <script2 :src="`${path}data/page2_emission/page2_emission.js`"></script2>
      </div>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionEmiss',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionEmissImg",
    }
  }
}
</script>

<style>

</style>
