<template>
  <div id="section-header" class="header-title">
    <img class="logo-FDR" :src="`${path}logo_FDR.png`" width="150" height="150" alt="logo">
    <div class="title">
      <h2 style="margin-bottom: 0.5em">Baromètre de la</h2>
      <h1>Transition énergétique en Île-de-France</h1>
    </div>
    <img id="logo-pref" :src="`${path}logo_prif.png`" width="185" height="150" alt="logo">
  </div>
</template>

<script>

export default {
  name: 'PageHeader',
  props: {
    path: String,
  },
  computed: {
    options () {
      return {
        duration: 1000,
        offset: +40,
        easing: 'easeInOutQuad',
      }
    }
   }
}
</script>

<style>
  .header-title {
    max-width: 1300px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2px;
    margin-top: 1px;
    margin-left: auto;
    margin-right: auto;
  }

  .header-title .title {
    margin-top: 0.3em;
  }

  .logo-FDR {
    margin-left: 2em;
    margin-right: 2em;
  }

</style>
