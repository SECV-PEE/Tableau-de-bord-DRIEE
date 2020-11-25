<template>
    <div id="section-preca">
      <div class="separateur">
        <h1 id="page_02" class="grand-titre">{{data.nom}}</h1>
      </div>
      <DataContainer :path="`${path}${img_page}`" :data="data" v-bind:intro="false"></DataContainer>
      <h3>Facture moyenne annuelle de chauffage dans les EPCI d'Île-de-France</h3>
      <img class="img-precarite" :src="`${path}${img_page}/facture_energetique.png`" style="width: 600px" alt="facture_energetique">
      <h3>Nombre et part de ménages vulnérables énergétiquement dans les EPCI d'Île-de-France</h3>
      <img class="img-precarite" :src="`${path}${img_page}/precarite_idf.png`" alt="precarite_idf" style="width: 800px; height: 520px;">
    </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionPreca',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
    data: Object
  },
  data () {
    return {
      img_page: "sectionPrecaImg",
    }
  }
}
</script>

<style>

</style>
