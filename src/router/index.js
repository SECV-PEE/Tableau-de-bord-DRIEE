import Vue from 'vue'
import Router from 'vue-router'
import SectionTableau from '@/components/SectionTableau.vue'
import SectionConso from '@/components/SectionConso.vue'
import SectionEmiss from '@/components/SectionEmiss.vue'
import SectionPreca from "@/components/SectionPreca.vue"
import SectionBatiment from "@/components/SectionBatiment.vue"
import SectionMobilite from "@/components/SectionMobilite.vue"
import SectionChaleur from "@/components/SectionChaleur.vue"
import SectionEnr from "@/components/SectionEnr.vue"
import SectionContact from "@/components/SectionContact.vue"
import SectionLiens from "@/components/SectionLiens.vue"
import goTo from 'vuetify/es5/services/goto'

Vue.use(Router)
export default new Router({
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  }, 
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: SectionTableau,
    },
    {
      path: '/conso',
      name: 'conso',
      component: SectionConso
    },
    {
      path: '/emiss',
      name: 'emiss',
      component: SectionEmiss
    },
    {
      path: '/air',
      name: 'air',
      component: SectionEmiss
    },
    {
      path: '/reno',
      name: 'reno',
      component: SectionBatiment
    },
    {
      path: '/preca',
      name: 'preca',
      component: SectionPreca
    },
    {
      path: '/mobi',
      name: 'mobi',
      component: SectionMobilite
    },
    {
      path: '/chal',
      name: 'chal',
      component: SectionChaleur
    },
    {
      path: '/enr',
      name: 'enr',
      component: SectionEnr
    },
    {
      path: '/contact',
      name: 'contact',
      component: SectionContact
    },
    {
      path: '/liens-utiles',
      name: 'liens',
      component: SectionLiens
    }
  ]
 })