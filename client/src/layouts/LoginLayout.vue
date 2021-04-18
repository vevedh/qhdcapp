<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  // name: 'LayoutName',

  data (): { leftDrawer: boolean } {
    return {
      leftDrawer: false
    }
  }
})
</script>
