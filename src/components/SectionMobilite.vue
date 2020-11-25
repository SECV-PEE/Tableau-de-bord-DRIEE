<template>
    <div id="section-mobilite">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div>
        <div id="mobi_deplacement">
          <h4>Nombre de déplacements quotidiens selon le mode en 2018</h4>
          <a href="http://www.omnil.fr/IMG/pdf/presentation_egt_v_publique_vf.pdf">Source:EGTH2020-Île-de-France Mobilités-OMNIL-DRIEA/Résultats partiels 2018</a>
          <img :src="`${path}${img_page}/infog_mobilite.png`" width="880">
        </div>
        <div id="mobi_critair">
          <h4>Répartition des immatriculations en Île-de-France par Crit'Air et par type d'énergie</h4>
          <a>Source: Imprimerie nationale, DRIEE</a>
        </div>
        <div class="mobilite-container">
          <div class="mobilite-carte" id="mobilite_critair"></div>
          <div class="mobilite-carte" id="piechart_energie"></div>
        </div>
        <div class="mobilite-container">
          <div class="mobilite-carte" id="linechart_NO2">
            <h4>Concentration moyenne en dioxyde d'azote (NO2) </h4>
            <a href="https://data-airparif-asso.opendata.arcgis.com/datasets/mes-idf-annuel-no2">Source: AIRPARIF</a>
          </div>
          <div class="mobilite-carte" id="mixchart_ges">
            <h4>Consommation et émissions de GES du secteur des transports</h4>
            <a href="http://sigr.iau-idf.fr/webapps/cartes/rose/?op=a">Source: AIRPARIF, ROSE</a>
          </div>
        </div>
      </div>
      <script2 :src="`${path}data/page5_transport/page5_mobilite.js`"></script2>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionMobilite',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionMobiliteImg",
    }
  }
}
</script>

<style>

</style>
