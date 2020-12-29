<template>
  <div id="section-accueil" class="section-accueil">
    <!-- SUBSECTION 1 -->
    <h2 class="title-accueil">Le profil WOW énergétique de l'Île-de-France en 5 chiffres, c'est...</h2>
    <div class="dc-accueil-up">
      <template v-for="block in SectionsJSON.accueil.up">
        <DataImgBlock :key="block.name" :path="`${path}${img_page}/`" :data="block" :img="block.img"></DataImgBlock>
      </template>
    </div>
    <div class="dc-accueil-down">
      <template v-for="block in SectionsJSON.accueil.down">
        <DataImgBlock :key="block.name" :path="`${path}${img_page}/`" :data="block" :img="block.img"></DataImgBlock>
      </template>
    </div>
  </div>
</template>

<script>
import DataImgBlock from "./DataImgBlock.vue"

import SectionsJSON from './sections.json';

export default {
  name: 'SectionAccueil',
  components: {
    DataImgBlock
  },
  props: {
    path: String
  },
  data () {
    return {
      SectionsJSON: SectionsJSON,
      img_page: "sectionAccueilImg",
    }
  },
}
</script>

<style>
.section-accueil {
  padding: inherit;
  margin-top: 1em;
  justify-items: center;
}

.dc-accueil-up {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.dc-accueil-down {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;;
}

.title-accueil {
  text-align: center;
  margin-bottom: 0.2em;
}

.chiffres-accueil {
  margin: auto;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 2em;
  padding-right: 2em;
  align-self: center;
  vertical-align: middle;
}
</style>

