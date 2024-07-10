<template>
  <div id="app">
    <ShangFangMountain />
    <MapPopup/>
  </div>
</template>

<script>
import ShangFangMountain from './components/ShangFangMountain.vue'
import MapPopup from './views/MapPopup.vue'

export default {
  name: 'App',
  components: {
    ShangFangMountain,
    MapPopup
  }
}
</script>

<style>
</style>

