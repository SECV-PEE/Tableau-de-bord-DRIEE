<template>
    <div id="section-enr" class="section-enr">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div class="container-enr">
        <div style="width: 450px; height: 450px;">
          <h4>Production d'énergie par méthanisation en Île-de-France</h4>
          <a href="">Source: DRIEE</a>
          <div id="enr-button">
            <button class="button-prod" onclick="update_sites_methan()">Nombre de sites</button>
            <button class="button-prod" onclick="update_prod_methan()">Production</button>
          </div>
          <svg id="enr_container_1" width="450" height="450">
            <g id="body_enr_methan"></g>
          </svg>
        </div>
        <div id="enr-linechart">
          <h4>Évolution de la capacité de production d'énergie par méthanisation</h4>
          <svg id="enr_container_1_2" height="350" width="420"></svg>
        </div>
      </div>
      <div style="width: 900px; height: 600px; display: inline-flex; margin-top: 3em;">
        <div class="carte" style="width: 450px; height: 520px;">
          <h4>Production d'électricité renouvelable en 2017</h4>
          <a href="http://sigr.iau-idf.fr/webapps/cartes/rose/?op=a" target="_blank">Source: ROSE, ENERGIF</a>
          <img :src="`${path}${img_page}/legend_prod.png`" alt="legend" width="450" height="67">
          <svg id="production_container" width="450" height="400">
            <g id="body_prod"></g>
          </svg>
        </div>
        <div class="production-subcarte" style="width: 450px; height: 600px;">
          <h4>Répartition de la production régionale d'électricité renouvelable par source d'énergie</h4>
          <div id="container-pie">
            <svg id="container-pie-prod" height="200" width="220">
              <g id="piechart_prod" transform="translate(100, 100)"></g>
            </svg>
            <img :src="`${path}${img_page}/legend_prod_pie.png`" width="115" height="200" alt="legend">
          </div>
          <h4 style="margin-top:30px">Évolution de la production annuelle régionale d'électricité renouvelable</h4>
          <svg id="linechart_prod" height="180" width="420"></svg>
        </div>
      </div>
      <div id="enr-photovoltaique">
        <h4>Nombre d'installations photovoltaïques en mars 2020</h4>
        <a href="https://opendata.agenceore.fr/explore/dataset/nombre-dinstallations-solaires-par-commune/information/?disjunctive.1_f_code_insee_installation" target="_blank">Source: Open Data Réseaux Énergies</a>
      </div>
      <div style="width: 900px; height: 375px; display: inline-flex;">
        <svg id="enr_container_2" width="450" height="375">
          <g id="body_enr_pv"></g>
        </svg>
        <div style="width: 450px; height: 375px;">
          <!-----Ci-dessous place retenue pour la description, à insérer entre > et < .------>
          <p class="text"> </p>
        </div>
      </div>
      <div style="width: 450px">
        <h4>Puissance éolienne totale raccordée par département au 30 juin 2020 </h4>
        <a href="https://www.statistiques.developpement-durable.gouv.fr/publicationweb/296" target="_blank">Source: SDES d’après Enedis, RTE, EDF-SEI et la CRE</a>
        <img :src="`${path}${img_page}/carte_nat_eolien.png`" width="450">
      </div>
      <div id="tooltip_prod" class="tt" style="display: none; top: 12442px; left: 475px;"></div>
      <div id="tooltip_prod_pie" class="tt" style="display: none; top: 12305px; left: 788px;"></div>
      <div id="tooltip_methan" class="tt" style="display: none; top: 11866px; left: 519px;"></div>
      <div id="tooltip_pv" class="tt" style="display: none; top: 13150px; left: 519px;"></div>
      <div class="outro">
        <div id="info-logo">
          <img :src="`${path}info.png`" width="24" height="20">
        </div>
        <p class="ensavoirplus">En savoir plus</p>
      </div>
      <div class="hide">
        <p class="info-txt" v-html="data.outro"></p>
      </div>
      <script2 :src="`${path}data/page7_enr/page7_ENR_methan.js`"></script2>
      <script2 :src="`${path}data/page7_enr/page7_ENR_PV.js`"></script2>
      <script2 :src="`${path}data/page7_enr/page7_production.js`"></script2>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionEnr',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionEnrImg",
    }
  }
}
</script>

<style>

.section-enr {
  padding: inherit;
}

</style>
