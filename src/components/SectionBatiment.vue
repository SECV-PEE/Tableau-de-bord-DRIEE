<template>
    <div id="section-batiment" class="section-bati">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <h3>Répartition des logements franciliens par classe de Diagnostic de performance énergétique (DPE)</h3>
      <a href="https://www.statistiques.developpement-durable.gouv.fr/le-parc-de-logements-par-classe-de-consommation-energetique">Source: CGDD/SDES </a>
      <div id="batiment-container1" style="display:inline-flex;">
        <div id="block1">
          <div id="dpe_bar_chart"></div>
        </div>
        <div id="block2">
          <div id="dpe_area_chart"></div>
        </div>
      </div>
      <h3>Répartition géographique par classe de Diagnostic de performance énergétique (DPE)</h3>
      <a href="https://www.insee.fr/fr/statistiques/3678895">Source: INSEE ANALYSES ILE-DE-FRANCE</a>
      <div style="margin-top: 20px; margin-bottom: 20px">
        <img :src="`${path}${img_page}/dpe_1.png`" width="400" height="225" alt="dpe_1">
        <img :src="`${path}${img_page}/dpe_2.png`" width="400" height="225" alt="dpe_2">
      </div>
      <div id="batiment-container2" style="display: inline-flex; flex-direction: column">
        <h3>Bilan du crédit d’impôt développement durable (CIDD) et transition énergétique (CITE)</h3>
        <a href="http://www.drihl.ile-de-france.developpement-durable.gouv.fr/renovation-energetique-des-logements-en-ile-de-a602.html">Source: DRIHL</a>
        <div id="bati-pie-text" style="display: inline-flex; margin: 20px">
          <div class="bati-text">
            <p v-html="data.txt"></p>
          </div>
          <div id="bati-container-pie" style="margin-left: 30px">
            <h4 style="text-align: middle; margin-bottom: 30px">Part des principales actions financées</h4>
            <svg id="container_pie_bati" height="220" width="585">
              <g id="piechart_bati" transform="translate(110,110)"></g>
            </svg>
          </div>
        </div>
      </div>
      <div id="tooltip_bati_dpe" class="tt"></div>
      <div id="tooltip_bati_pie" class="tt"></div>
      <div>
        <div class="bati-text-2">
          <p v-html="data.txt2"></p>
        </div>
      </div>
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
  display: inline-flex;
  flex-direction: column;
  padding: inherit;
}

.bati-text {
  vertical-align: middle;
  text-align: justify;
  border: solid #ff8900 2px;
  border-radius: 20px; 
  padding: 10px;
  margin: auto 0;
  margin-right: 30px;
  max-width: 250px;
  max-height: 250px;
}

.bati-text-2 {
  margin: 20px auto;
  vertical-align: middle;
  text-align: justify;
  border: solid #ff8900 2px;
  border-radius: 20px; 
  padding: 10px;
  max-width: 500px;
  max-height: 100px;
}

</style>
