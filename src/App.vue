<template>
  <div id="app">
    <v-app>
      <page-header :path="publicPath"></page-header>
      <app-bar></app-bar>
      <v-content>
        <v-container fluid style="padding: 0;">
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

.v-main__wrap {
  position: unset !important;
  margin: 0 auto;
}

.v-application {
  position: relative;
  font-family:'Montserrat', sans-serif;
  line-height: 1;
  margin: 0 auto;
}

.body {
  width: 1280px;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  margin: 0 auto;
  padding-left: 0;
  padding-right: 0;
}

*, *::before, *::after {
  box-sizing: content-box;
}

</style>
