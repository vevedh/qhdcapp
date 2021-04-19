<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>

        <div>
          [{{(user)?user.email:null}}]
          <q-btn size="md" icon="logout"  :dense="true" @click="onExit()"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <MenuComponent
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import MenuComponent from '../components/Menu.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

import { defineComponent, ref } from '@vue/composition-api';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuComponent
  },
  data () {
    return {
      title: 'HDCApp'
    }
  },
  computed: {
    ...mapGetters('auth',['isAuthenticated','user']),
    ...mapGetters('users',['list']),
    ...mapGetters('tables',{tables:'list'}),

  },
  setup() {
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksData);

    return {leftDrawerOpen, essentialLinks}
  },
  mounted () {
    console.log("Store Racine",this.$store)
    this.title = document.title;
  },
  methods: {
    ...mapActions('auth',['authenticate','logout']),
    onExit() {
      //console.log("Store ",this.$store)
      //this.$store.commit('auth/logout')
      this.$store.dispatch('auth/logout').then((exit)=>{
        console.log("Exit :",exit);
        this.$router.replace('/login')
      })
    }
  },
  watch: {
    '$route':{
        handler: (to, from) => {
          console.log("Route change :",to.path)
          document.title = to.meta.title

        },
         immediate: true
      }
  }
});
</script>
