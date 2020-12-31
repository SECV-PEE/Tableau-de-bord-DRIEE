<template>
  <div id="section-intro" class="section-intro">
    <!-- SUBSECTION 1 -->
    <h1 class="grand-titre">Chiffres clés</h1>
    <p>Passez le curseur sur les chiffres pour en savoir plus.</p>
    <div class="header">
      <div class="info-block">
        <div id="info-logo">
          <img :src="`${path}info.png`" width="24" height="20" alt="">
        </div>
        <p>Connaissiez-vous ces unités énergétiques?</p>
      </div>
      <img class="img-unite" :src="`${path}${img_page}/info-unite.png`" width="660" height="220" alt="unite">
    </div>
    <template v-for="container in SectionIntroJSON.sub1">
      <DataContainer :key="container.name" :path="`${path}${img_page}`" :data="container" intro=true></DataContainer>
    </template>
    <div class="separateur"></div>

    <!-- SUBSECTION 2 -->
    <h2 >Priorités d'action</h2>
    <template v-for="container in SectionIntroJSON.sub2">
      <DataContainer :key="container.name" :path="`${path}${img_page}`" :data="container" intro=true></DataContainer>
    </template>
  </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

import SectionIntroJSON from './sectionIntro.json';

export default {
  name: 'SectionIntro',
  components: {
    DataContainer: DataContainer
  },
  props: {
    path: String
  },
  data () {
    return {
      SectionIntroJSON: SectionIntroJSON,
      img_page: "sectionIntroImg",
    }
  },
}
</script>

<style>

.section-intro {
  padding: inherit;
}

</style>
