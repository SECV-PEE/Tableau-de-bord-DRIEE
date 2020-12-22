<template>
    <div id="section-terr" class="section-terr">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <div id=map_zfe>
        <h4>Zones à faibles émissions mobilité (ZFE)</h4>
        <svg id="map_ZFE" width="900" height="450"></svg>
      </div>
      <div id="tooltip_ZFE" class="tt"></div>
      <div id=map_pcaet style="margin-top: 30px; margin-bottom: 50px;">
        <h4>Carte d'avancement des PCAET d'Île-de-France</h4>
        <svg id="map_PCAET" width="900" height="450"></svg>
      </div>
      <div id="tooltip_PCAET" class="tt"></div>
      <script2 :src="`${path}data/page8_territoires/page8_territoires.js`"></script2>
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

export default {
  name: 'SectionTerr',
  components: {
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionTerrImg",
    }
  }
}
</script>

<style>

.section-terr {
  padding: inherit;
}

</style>
