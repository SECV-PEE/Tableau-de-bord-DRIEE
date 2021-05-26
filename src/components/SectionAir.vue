<template>
    <div id="section-air" class="section-air">
      <div class="separateur">
        <h1 class="grand-titre">{{data.nom}}</h1>
      </div>
      <div class="info-hover">
        <div class="info-block">
          <div id="info-logo">
            <img :src="`${path}info.png`" width="24" height="20">
          </div>
          <p class="ensavoirplus">De quoi parle-t-on ?</p>
        </div>
        <div class="hide">
          <p class="info-txt" v-html="data.intro"></p>
        </div>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div id="air_container" style="width: 900px; height: 800px">
          <h3>Répartition des émissions par secteur (2017)</h3>
          <a href="https://data-airparif-asso.opendata.arcgis.com/" target="_blank">Source: AIRPARIF</a>
          <div id="container_pies" style="display: inline-flex;">
            <div id="container_pie_nox" style="margin-left: 5em; margin-right: 1em">
              <h4 style="margin-left: 100px">NOx</h4>
              <div>
                <svg id="container_pie_air" height="250" width="550">
                  <g id="piechart_air" transform="translate(110,110)"></g>
                </svg>
              </div>
            </div>
            <div id="container_pie_pm" style="margin-right: 5em; margin-left: 0">
              <h4 style="text-align: center;">PM10</h4>
              <div>
                <svg id="container_pie_air_pm" height="220" width="240">
                  <g id="piechart_air_pm" transform="translate(110,110)"></g>
                </svg>
              </div>
            </div>
          </div>
          <div id="container_charts" style="display: inline-flex; margin-top: 40px">
            <div id="dimple_air">
              <h4 style="text-align: left; margin-right: 30px">Population francilienne exposée à des dépassements des valeurs limites</h4>
              <a href="https://data-airparif-asso.opendata.arcgis.com/" target="_blank">Source: AIRPARIF</a>
            </div>
            <div class="mobilite-carte" id="air_linechart_NO2">
              <h4>Concentration moyenne en dioxyde d'azote (NO2) </h4>
              <a href="https://data-airparif-asso.opendata.arcgis.com/datasets/mes-idf-annuel-no2" target="_blank">Source: AIRPARIF</a>
            </div>
          </div>
        <div id="tooltip_air_pie" class="tt"></div>
        <div id="dimple_air_tool" class="tt"></div>
        <div id="tooltip_air_pie_pm" class="tt"></div>
        <script2 :src="`${path}data/page2b_air/page2b_air.js`"></script2>
      </div>
      <div class="info-hover">
        <div class="info-block">
          <div id="info-logo">
            <img :src="`${path}info.png`" width="24" height="20">
          </div>
          <p class="ensavoirplus">En savoir plus</p>
        </div>
        <div class="hide">
          <p class="info-txt" v-html="data.outro"></p>
        </div>
      </div>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionAir',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionAirImg",
    }
  }
}
</script>

<style>
.section-air {
  padding: inherit;
  justify-items: center;
}

</style>
