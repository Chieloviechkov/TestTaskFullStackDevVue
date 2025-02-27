<template>
  <svg :width="canvasSize" :height="canvasSize">
    <g :transform="`translate(${centerOffset}, ${centerOffset})`">
      <polygon
        v-for="(poly, index) in displayedPolygons"
        :key="index"
        :points="formatPoints(poly.vertices, poly.displacement)"
        :fill="poly.color"
        stroke="#333"
        stroke-width="0.5"
      />
    </g>
    <!-- Подпись для SVG -->
    <text x="10" y="30" class="svg-label">SVG Mosaic</text>
  </svg>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  createMosaic,
  getCurrentDisplacementFactor,
  computeDisplacement,
  mosaicSize,
  PolygonData
} from '../utils/mosaic';

export default defineComponent({
  name: 'SVGMosaic',
  setup() {
    const canvasSize = mosaicSize * 1.1;
    const centerOffset = (canvasSize - mosaicSize) / 2;
    const basePolygons = ref<PolygonData[]>(createMosaic(15));
    const displayedPolygons = ref<any[]>([]);

    const formatPoints = (vertices: any[], disp: { dx: number; dy: number }) => {
      return vertices.map(pt => `${pt.x + disp.dx},${pt.y + disp.dy}`).join(' ');
    };

    const animate = (timestamp: number) => {
      const factor = getCurrentDisplacementFactor(timestamp);
      displayedPolygons.value = basePolygons.value.map(poly => ({
        ...poly,
        displacement: computeDisplacement(poly, factor)
      }));
      requestAnimationFrame(animate);
    };

    onMounted(() => {
      requestAnimationFrame(animate);
    });

    return { canvasSize, centerOffset, displayedPolygons, formatPoints };
  }
});
</script>

<style scoped lang="scss">
.svg-label {
  font-size: 18px;
  font-family: 'Inter', sans-serif;
  fill: #333;
}
</style>
