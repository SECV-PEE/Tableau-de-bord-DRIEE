<template>
  <div class="dc-container">
    <template v-if="intro">
      <div class="dc-intro-container">
        <img @click="$vuetify.goTo(data.section, options)" :src="`${path}/${data.img}`" alt="logo" class="dc-logo">
        <template v-for="data in data.datas">
          <DataBlock :key="data.key" :data="data" v-bind:intro="true"></DataBlock>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="dc-general-container">
        <template v-for="data in data.datas">
          <DataBlock :key="data.key" :data="data" v-bind:intro="false"></DataBlock>
        </template>
      </div>
    </template>
  </div>
</template>

<script>

import DataBlock from "./DataBlock.vue"

export default {
  name: 'DataContainer',
  components: {
    DataBlock: DataBlock
  },
  props: {
      path: String,
      data: Object,
      intro: Boolean
  },
  data() {
    return {
      msg:"",
	}
  }
}
</script>

<style>
  .dc-logo {
    width: 220px;
    height: 90px;
  }

  .dc-logo:hover{
    cursor: pointer;
  }

  .dc-container {
    margin-bottom: 15px;
  }

  .dc-container .dc-intro-container {
    display:flex;
    flex-direction: row;
    align-items: center;
    width: 100%;;
  }

  .dc-container .dc-general-container {
    display:flex;
    flex-direction: row;
    align-items: center;
    width: 100%
  }
</style>