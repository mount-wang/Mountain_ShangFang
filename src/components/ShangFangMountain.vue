<template>
  <div>
    <div class="map-container">
      <div id="ShangFang-Mountain"
           class="ShangFang-Mountain" />
    </div>
  </div>
</template>

<script>
import { initMap, RotateNorthControl, setupPopup } from '@/router/MapSetUp'

export default {
  name: 'ShangFangMountain',
  mounted() {
    const map = initMap()
    const rotateNorthControl = new RotateNorthControl()
    map.addControl(rotateNorthControl)

    this.$nextTick(() => {
      setupPopup(map)
    })
    
    window.addEventListener('resize', () => map.updateSize())
  },
}
</script>

<style>
.map-container {
  width: 100%;
  height: 95vh;
  position: relative;
}
.ShangFang-Mountain {
  width: 100%;
  height: 100%;
}

.rotate-north {
  top: 65px;
  left: 0.5em;
  position: absolute;
}

.ol-touch,
.rotate-north {
  top: 80px;
}
</style>