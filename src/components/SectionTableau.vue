<template>
  <div id="section-tableau" class="tableau_de_bord">
    <SectionAccueil :path="publicPath" :data=SectionsJSON.accueil></SectionAccueil>
    <SectionIntro :path="publicPath"></SectionIntro>
    <SectionConso :path="publicPath" :data=SectionsJSON.conso></SectionConso>
    <SectionEmiss :path="publicPath" :data=SectionsJSON.ges></SectionEmiss>
    <SectionAir :path="publicPath" :data=SectionsJSON.air></SectionAir>
    <SectionPreca :path="publicPath" :data=SectionsJSON.preca></SectionPreca>
    <SectionBatiment :path="publicPath" :data=SectionsJSON.bati></SectionBatiment>
    <SectionMobilite :path="publicPath" :data=SectionsJSON.mobilite></SectionMobilite>
    <SectionChaleur :path="publicPath" :data=SectionsJSON.chaleur></SectionChaleur>
    <SectionEnr :path="publicPath" :data=SectionsJSON.enr></SectionEnr>
    <SectionTerritoire :path="publicPath" :data=SectionsJSON.terr></SectionTerritoire>
  </div>
</template>

<script>
import SectionAccueil from "@/components/SectionAccueil.vue"
import SectionIntro from "@/components/SectionIntro.vue"
import SectionConso from "@/components/SectionConso.vue"
import SectionEmiss from "@/components/SectionEmiss.vue"
import SectionAir from "@/components/SectionAir.vue"
import SectionPreca from "@/components/SectionPreca.vue"
import SectionBatiment from "@/components/SectionBatiment.vue"
import SectionMobilite from "@/components/SectionMobilite.vue"
import SectionChaleur from "@/components/SectionChaleur.vue"
import SectionEnr from "@/components/SectionEnr.vue"
import SectionTerritoire from "@/components/SectionTerritoire.vue"

import SectionsJSON from '@/components/sections.json';

export default {
  name: 'SectionTableau',
  components: {
    SectionAccueil: SectionAccueil,
    SectionIntro: SectionIntro,
    SectionConso: SectionConso,
    SectionEmiss: SectionEmiss,
    SectionAir: SectionAir,
    SectionPreca: SectionPreca,
    SectionBatiment: SectionBatiment,
    SectionMobilite: SectionMobilite,
    SectionChaleur: SectionChaleur,
    SectionEnr: SectionEnr,
    SectionTerritoire: SectionTerritoire
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      SectionsJSON: SectionsJSON
    }
  }
}
</script>

<style>

.tableau_de_bord {
  width: 100%;
  margin: auto;
  justify-items: center;
  padding-right: 6em;
  padding-left: 6em;
  margin-bottom: 20em;
  max-width: 1300px;
  min-width: 1000px;
}

.tableau_de_bord a {
  color: #c0c0c0 !important;
}

</style>