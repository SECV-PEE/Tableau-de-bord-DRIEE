<template>
  <div id="app">
    <v-app>
      <page-header :path="publicPath"></page-header>
      <app-bar></app-bar>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import PageHeader from '@/components/Header.vue'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
    AppBar
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
    }
  }
}
</script>

<style>
@import './TDB_DRIEE_CSS.css';
  
.v-application {
  position: relative;
  font-family:'Montserrat', sans-serif;
  line-height: 1;
  margin: auto;
}

.body {
  width: 100%;
  margin: auto;
  padding-left: 0;
  padding-right: 0;
}

*, *::before, *::after {
  box-sizing: content-box;
}

</style>
