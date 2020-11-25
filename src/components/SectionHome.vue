<template>
  <div id="section-home">
    <p>
      <router-link to="/tableau-de-bord">Accéder au tableau</router-link>
    </p>
    <DataContainer :path="`${path}${img_page}`"></DataContainer>
  </div>
</template>

<script>
import DataContainer from "./DataContainer.vue"

export default {
  name: 'SectionHome',
  components: {
    DataContainer: DataContainer,
  },
  props: {
    path: String,
  },
  data () {
    return {
      img_page: "sectionHomeImg",
    }
  }
}
</script>

<style>
</style>
