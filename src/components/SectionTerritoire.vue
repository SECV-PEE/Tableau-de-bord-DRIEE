<template>
    <div id="section-terr" class="section-terr">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <div id=map_zfe>
        <h4>Communes soumises à l'obligation d'instaurer une zone à faibles émissions mobilités (ZFE) en application du décret D2213-1-0-2 du CGCT pour l'année 2021</h4>
        <svg id="map_MGP" width="700" height="450"></svg>
      </div>
      <div id="tooltip_ZFE" class="tt"></div>
      <script2 :src="`${path}data/page8_territoires/page8_territoires.js`"></script2>
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
