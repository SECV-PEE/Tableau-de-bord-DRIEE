<template>
  <div class="db-home-block" height="200" width="200">
    <div class="text-circle">
      <v-img class="db-stack-top" contain :height="`${data.img_size[0]}`" :width="`${data.img_size[1]}`" :src="`${path}${data.img}`"></v-img>
      <h3>{{ data.chiffre }}</h3>
      <h4>{{ data.motClé }}</h4>
      <p v-if="data.texte">{{ data.texte }}</p>
      <span class="db-tooltiptext">{{ data.description }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DataImgBlock',
  components: {
  },
  props: {
      path: String,
      data: Object,
      img: String
  },
  data() {
    return {
	}
  }
}
</script>


<style>
.db-home-block {
  color: transparent;
  border: none;
  position: relative;
  width: 200px;
  height: 200px;
  align-self: center;
  margin: auto;
}

.dc-accueil-up .db-home-block .text-circle {
  color: #696969; 
  position: relative;
  margin: 0;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle at center, rgb(248, 213, 59, 1) 0,white 70%);
}

.dc-accueil-down .db-home-block .text-circle {
  color: #696969; 
  position: relative;
  margin: 0;
  height: 100%;
  width: 100%;
  background: radial-gradient(circle at center, rgb(122, 196, 122, 1) 0,white 70%);
}

.text-circle::before {
  content: "";
  float: left;
  height: 100%;
  width: 50%;
  shape-margin: 7%;
  shape-outside: polygon(
    0 0,
    98% 0,
    50% 6%,
    23.4% 17.3%,
    6% 32.6%,
    0 50%,
    6% 65.6%,
    23.4% 82.7%,
    50% 94%,
    98% 100%,
    0 100%
  );
}

.text-circle h3 {
  font-size: 21px;
  line-height: 1.25;
  padding: 0;
  margin: 0;
  position: absolute;
  text-align: center;
  bottom: 60%;
  right: 15%;
  overflow: auto;
  white-space: nowrap;
}

.text-circle h3::before {
  content: "";
  float: right;
  height: 100%;
  width: 50%;
  shape-outside: polygon(
    2% 0%,
    100% 0%,
    100% 100%,
    2% 100%,
    50% 94%,
    76.6% 82.7%,
    94% 65.6%,
    100% 50%,
    94% 32.6%,
    76.6% 17.3%,
    50% 6%
  );
  shape-margin: 7%;
}

.text-circle h4 {
  bottom: 30%;
  font-size: 15px;
  position: absolute;
  text-align: center;
  width: 100%;
}

.text-circle h4::before {
  content: "";
  float: right;
  height: 100%;
  width: 50%;
  shape-outside: polygon(
    2% 0%,
    100% 0%,
    100% 100%,
    2% 100%,
    50% 94%,
    76.6% 82.7%,
    94% 65.6%,
    100% 50%,
    94% 32.6%,
    76.6% 17.3%,
    50% 6%
  );
  shape-margin: 7%;
}

.text-circle p {
  bottom: 25px;
  font-size: 17px;
  position: absolute;
  text-align: center;
  width: 100%;
}

.text-circle p::before {
  content: "";
  float: right;
  height: 100%;
  width: 50%;
  shape-outside: polygon(
    2% 0%,
    100% 0%,
    100% 100%,
    2% 100%,
    50% 94%,
    76.6% 82.7%,
    94% 65.6%,
    100% 50%,
    94% 32.6%,
    76.6% 17.3%,
    50% 6%
  );
  shape-margin: 7%;
}

.db-stack-top {
  position: absolute;
  z-index: 3;
  top: 5%;
  left: 5%;
}

.text-circle .db-tooltip {
  position: relative;
  display: inline-block;
}

.text-circle .db-tooltiptext {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.6s;
  width: 100%;
  background-color: rgb(229, 237, 245);
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;
  position: absolute;
  right: 70%;
  z-index: 4;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.text-circle .db-tooltiptext::before {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -15px;
    right: -30px;
    border: solid 15px transparent;
    border-left-color: rgb(229, 237, 245);
    z-index: 4;
}

.db-home-block:hover .db-tooltiptext {
  opacity: 1;
  visibility: visible;
}
</style>
