<template>
    <div id="section-air" class="section-air">
      <div class="separateur">
        <h1 class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div id="air_container" style="width: 900px; height: 700px">
          <h3>Répartition des émissions par secteur</h3>
          <div id="container_pies" style="display: inline-flex; margin-top: 15px">
            <div id="container_pie_nox" style="margin-left: 5em; margin-right: 3em">
              <h4 style="text-align: center;">NOx</h4>
              <div>
                <svg id="container_pie_air" height="220" width="240">
                  <g id="piechart_air" transform="translate(110,110)"></g>
                </svg>
              </div>
            </div>
            <img :src="`${path}${img_page}/legend_pie_air.png`" width="140" height="200" style="margin-top: 20px">
            <div id="container_pie_pm" style="margin-right: 5em; margin-left: 3em">
              <h4 style="text-align: center;">PM10</h4>
              <div>
                <svg id="container_pie_air_pm" height="220" width="240">
                  <g id="piechart_air_pm" transform="translate(110,110)"></g>
                </svg>
              </div>
            </div>
          </div>
        <div id="tooltip_air_pie" class="tt"></div>
        <div id="tooltip_air_pie_pm" class="tt"></div>
        <script2 :src="`${path}data/page2b_air/page2b_air.js`"></script2>
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