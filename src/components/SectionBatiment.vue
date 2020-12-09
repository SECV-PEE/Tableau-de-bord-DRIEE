<template>
    <div id="section-batiment" class="section-bati">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div id="batiment-container1">
        <h4>Répartition des logements franciliens par classe de Diagnostic de performance énergétique (DPE)</h4>
        <a href="https://www.statistiques.developpement-durable.gouv.fr/le-parc-de-logements-par-classe-de-consommation-energetique">Source: CGDD/SDES </a>
        <div id="dpe_bar_chart"></div>
        <div id="dpe_area_chart"></div>
      </div>
      <h4>Répartition géographique par classe de Diagnostic de performance énergétique (DPE)</h4>
      <a href="https://www.insee.fr/fr/statistiques/3678895">Source: INSEE ANALYSES ILE-DE-FRANCE</a>
      <div style="margin-top: 20px; margin-bottom: 20px">
        <img :src="`${path}${img_page}/dpe_1.png`" width="400" height="225" alt="dpe_1">
        <img :src="`${path}${img_page}/dpe_2.png`" width="400" height="225" alt="dpe_2">
      </div>
      <div id="tooltip_bati_dpe" class="tt"></div>
      <script2 :src="`${path}data/page4_bati/page4_batiment.js`"></script2>
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
