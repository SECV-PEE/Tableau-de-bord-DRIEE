<template>
    <div id="section-emiss" class="section-emiss">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div id="emission_container_generale" style="width: 900px; height: 700px">
        <h3>Émissions de gaz à effet de serre (GES) par EPCI en Île-de-France</h3>
        <a href="http://sigr.iau-idf.fr/webapps/cartes/rose/?op=a" target="_blank">Source: AIRPARIF, ROSE</a>
        <div class="carte" style="width: 450px; height: 600px; margin-top: 12px;">
          <div class="area-button-container">
            <h4 style="color: #696969; font-size: 0.8em;">Territoire sélectionné</h4>
            <div class="sep_small"></div>
            <button class="button-region" id="btn-region-emiss" onclick="draw_pie_emiss_region()">Régional</button>
            <button class="button-epci" id="selected_epci_emiss"></button>
          </div>
          <div id="button-annee">
            <h4 style="color: #696969; font-size: 0.8em;">Années disponibles</h4>
            <div class="sep_small"></div>
            <button id="btn-emiss-2017" class="button-map" onclick="change_year_emission('2017')">2017</button>
            <button id="btn-emiss-2015" class="button-map" onclick="change_year_emission('2015')">2015</button>
            <button id="btn-emiss-2012" class="button-map" onclick="change_year_emission('2012')">2012</button>
            <button id="btn-emiss-2010" class="button-map" onclick="change_year_emission('2010')">2010</button>
            <button id="btn-emiss-2005" class="button-map" onclick="change_year_emission('2005')">2005</button>
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
          <div>
            <svg id="container_pie_emiss" height="220" width="240">
              <g id="piechart_emiss" transform="translate(110,110)"></g>
            </svg>
            <img :src="`${path}${img_page}/legend_pie_emiss.png`" width="140" height="200">
          </div>
        </div>
        <div id="tooltip_emission" class="tt" style="display: none; top: 4525px; left: 483px"></div>
        <div id="tooltip_emission_pie" class="tt"></div>
        <script2 :src="`${path}data/page2_emission/page2_emission.js`"></script2>
      </div>
      <div class="outro">
        <div id="info-logo">
          <img :src="`${path}info.png`" width="24" height="20">
        </div>
        <p class="ensavoirplus">En savoir plus</p>
      </div>
      <div class="hide">
        <p class="info-txt" v-html="data.outro"></p>
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

.section-emiss {
  padding: inherit;
}

</style>
