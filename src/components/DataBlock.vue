<template>
    <div id="datablock" class="db-block">
        <template v-if="intro">
            <div class="db-face1">
                <div class="db-contenu">
                    <h3 class="db-chiffre">{{data.chiffre}}</h3>
                    <h4 class="db-mot-cle" v-if="data.motClé">{{data.motClé}}</h4>
                    <p class="db-texte">{{data.texte}}</p>
                </div>
            </div>
            <div class="db-face2">
                <div class="db-contenu">
                    <p class="db-description">{{data.description}}</p>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="db-face1">
                <div class="db-contenu">
                    <h1 class="db-chiffre">{{data.chiffre}}</h1>
                    <h3 class="db-mot-cle">{{data.motClé}}</h3>
                    <p class="db-texte">{{data.texte}}</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script>

export default {
  name: 'DataBlock',
  components: {
  },
  props: {
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
    .dc-intro-container .db-block {
        width:200px;
        height:142px;
        margin-left: 30px;
        justify-content: center;
        align-items: flex-end;
        vertical-align: middle;
        position: relative;
        display: flex;
    }
    
    .dc-general-container .db-block {
        width: 250px;
        height: 150px;
        font-size: 10px;
        background-color: #ffffff;
        border: solid #ff8900 2px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        padding: 5px 10px 10px 10px;
        margin: 1.5em;
        text-align: center;
        align-items: center;
        vertical-align: middle;
    }

    .dc-general-container .db-block .db-face1 {
        align-items: center;
        justify-content: center;
        background: white;
        display: flex;
        flex-direction: column;
        z-index: 1;
        padding-top: auto;
        padding-bottom: auto;
    }

    .dc-intro-container .db-block .db-face1 {
        width: 200px;
        height: 120px;
        transition: 0.5s;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        background: #fff;
        border: #18A1CD solid 2px;
        border-style: none none solid none;
    }

    .dc-intro-container .db-block:hover .db-face1 {
        transform: translateY(-30px);
    } 

    .dc-intro-container .db-block:hover .db-face2 {
        transform: translateY(30px);
    }

    .dc-intro-container .db-block .db-face2 {
        width: 200px;
        height: 60px;
        transition: 0.5s;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        padding: 20px;
        box-sizing: border-box;
    }

    .db-contenu {
        opacity: 1;
    }

    .dc-intro-container .db-block .db-face1 .db-contenu .db-chiffre {
        margin: 3px 0 0;
        padding: 0;
        color: #ff8900;
        text-align: center;
        font-size: 2em;
        font-weight: 600;
    }
    .dc-intro-container .db-block .db-face1 .db-contenu .db-mot-cle {
        margin: 0 0 2px 0;
        padding: 0;
        color: #ff8900;
        text-align: center;
        font-weight: 500;
        font-size: 1.2em;
    }
    .dc-intro-container .db-block .db-face1 .db-contenu .db-texte {
        margin: 2px 0 0;
        padding: 0;
        color: #ff8900;
        text-align: center;
        font-weight: 500;
        font-size: 0.75em;
    }
    
    .dc-intro-container .db-block .db-face2 .db-contenu .db-description {
        font-size: 0.6em;
        color: #6b6b6b;
        margin: 0;
        padding: 5px;
        font-weight: 500;
    }

    .dc-general-container .db-block .db-face1 .db-contenu .db-chiffre {
        margin: 0.3em 0 0 0;
        font-size: 40px;
        color:  #ff8900;
    }

    .dc-general-container .db-block .db-face1 .db-contenu .db-mot-cle {
        margin: 0;
        font-size: 15px;
        color:  #ff8900
    }

    .dc-general-container .db-block .db-face1 .db-contenu .db-texte {
        margin: 1em 0 3em 0;
        font-size: 12px;
        color:  #ff8900
    }
    
</style>