<template>
    <div id="section-batiment" class="section-bati">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <h4>Certificats d'économies d'énergie (CEE) en Île-de-France</h4>
      <a>Source: DGEC, MTES</a>
      <div id="CEE-stackchart"></div>
      <h4>Répartition des logements franciliens par classe de Diagnostic de performance énergétique (DPE)</h4>
      <a href="https://www.statistiques.developpement-durable.gouv.fr/le-parc-de-logements-par-classe-de-consommation-energetique">Source: CGDD/SDES </a>
      <div>
        <img :src="`${path}${img_page}/dpe_IDF.png`" width="400">
      </div>
      <h4>Répartition géographique par classe de Diagnostic de performance énergétique (DPE)</h4>
      <a href="https://www.insee.fr/fr/statistiques/3678895">Source: INSEE ANALYSES ILE-DE-FRANCE</a>
      <div>
        <img :src="`${path}${img_page}/dpe_1.png`" width="400" height="225" alt="dpe_1">
        <img :src="`${path}${img_page}/dpe_2.png`" width="400" height="225" alt="dpe_2">
      </div>
      <h4>Analyse des DPE en Île-de-France </h4>
      <a href="https://data.ademe.fr/datasets/dpe-france">Source: Opendata de l'ADEME</a>
      <img :src="`${path}${img_page}/legende_sankey.png`" width="880" height="40">
      <svg id="sankey_chart" style="width: 880px; height: 380px;"></svg>
      <script2 :src="`${path}data/page4_bati/page4_batiment.js`"></script2>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionBatiment',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionBatimentImg",
    }
  }
}
</script>

<style>

.section-bati {
  padding: inherit;
}

</style>
