<template>
    <div id="section-mobilite" class="section-mobi">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div>
        <div id="mobi_deplacement" style="margin-top: 30px; margin-bottom: 30px">
          <h4>Nombre de déplacements quotidiens selon le mode en 2018</h4>
          <a href="http://www.omnil.fr/IMG/pdf/presentation_egt_v_publique_vf.pdf" target="_blank">Source:EGTH2020-Île-de-France Mobilités-OMNIL-DRIEA/Résultats partiels 2018</a>
          <img :src="`${path}${img_page}/infog_mobilite.png`" style="margin-top: 30px; margin-bottom: 30px" width="880">
        </div>
        <div id="mobi_critair">
          <h4>Répartition des immatriculations en Île-de-France par Crit'Air et par type d'énergie</h4>
          <a>Source: SDES, Imprimerie nationale</a>
        </div>
        <div class="mobilite-container">
          <div class="mobilite-carte" id="mobilite_critair"></div>
          <div class="mobilite-carte" id="piechart_energie"></div>
        </div>
      </div>
      <div>
        <h4>Mise en place du Grand Paris Express</h4>
        <a href="https://www.societedugrandparis.fr/" target="_blank">Source: Société du Grand Paris</a>
      </div>
      <div style="display: inline-flex; flex-direction: row">
        <img :src="`${path}${img_page}/Carte_grand_paris_express_2.jpg`" style="margin: 30px" width=500 height=500>
          <div class="mobi-text">
            <p style="margin: 0px !important" v-html="data.txt"></p>
          </div>
      </div>
      <script2 :src="`${path}data/page5_transport/page5_mobilite.js`"></script2>
      <div class="outro">
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

.section-mobi {
  display: inline-flex;
  flex-direction: column;
  padding: inherit;
}

.mobi-text {
  vertical-align: middle;
  text-align: justify;
  border: solid #ff8900 2px;
  border-radius: 20px; 
  padding: 20px;
  margin: auto 0;
  margin-left: 30px;
  max-width: 250px;
  max-height: 250px;
}

</style>
