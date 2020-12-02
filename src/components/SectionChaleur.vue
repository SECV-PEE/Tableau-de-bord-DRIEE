<template>
    <div id="section-chaleur" class="section-chaleur">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <div class="chaleur-container">
        <div id="chaleur-geothermie">
          <h4>Production d'énergie par géothermie en Île-de-France</h4>
          <a href="">Source: DRIEE</a>
          <div id="chaleur-button">
            <button class="button-prod" onclick="update_sites_gth()">Nombre de sites</button>
            <button class="button-prod" onclick="update_prod_gth()">Production</button>
          </div>
          <svg id="chaleur_container_1" width="450" height="375">
            <g id="body_chaleur_gth"></g>
          </svg>
        </div>
        <div id="linechart_gth">
          <h4>Logements raccordés aux réseaux alimentés principalement par géothermie et production d'énergie par géothermie profonde</h4>
        </div>
      </div>
      <div class="chaleur-container">
        <div id="chaleur-biomasse">
          <h4>Production d'énergie par les installations collectives de biomasse en Île-de-France</h4>
          <a href="">Source: DRIEE</a>
          <div id="chaleur-button">
            <button class="button-prod" onclick="update_sites_bio()">Nombre de sites</button>
            <button class="button-prod" onclick="update_prod_bio()">Production</button>
          </div>
          <svg id="chaleur_container_2" width="450" height="375">
            <g id="body_chaleur_biomasse"></g>
          </svg>
        </div>
        <div id="chaleur-biomasse-graph">
          <h4>Évolution de la production d'énergie par les installations collectives de biomasse en Île-de-France</h4>
          <svg id="chaleur_container_2_2" width="460" height="350"></svg>
        </div>
      </div>
      <div id="tooltip_chaleur" class="tt" style="display: none; top: 10503px; left: 465px;"></div>
      <div id="tooltip_biomasse" class="tt" style="display: none; top: 11107px; left: 591px;"></div>
      <script2 :src="`${path}data/page6_chaleur/page6_chaleur_GTH.js`"></script2>
      <script2 :src="`${path}data/page6_chaleur/page6_chaleur_biomasse.js`"></script2>
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionChaleur',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionChaleurImg",
    }
  }
}
</script>

<style>

.section-chaleur {
  padding: inherit;
}

</style>
