<template>
  <div class="page-mosaic">
    <q-toggle
      v-model="useCanvas"
      label="Режим: Canvas / SVG"
      true-label="Canvas"
      false-label="SVG"
      color="primary"
    />
    <div v-if="useCanvas">
      <CanvasMosaic />
    </div>
    <div v-else>
      <SVGMosaic />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CanvasMosaic from './CanvasMosaic.vue';
import SVGMosaic from './SVGMosaic.vue';

export default defineComponent({
  name: 'MosaicSwitcher',
  components: { CanvasMosaic, SVGMosaic },
  setup() {
    const useCanvas = ref(true);
    return { useCanvas };
  }
});
</script>

<style scoped lang="scss">
.page-mosaic {
  padding: 1rem;
  text-align: center;

}
</style>
