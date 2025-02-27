<template>
  <canvas ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
  createMosaic,
  getCurrentDisplacementFactor,
  computeDisplacement,
  mosaicSize,
  PolygonData
} from '../utils/mosaic';

export default defineComponent({
  name: 'CanvasMosaic',
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const canvasSize = mosaicSize * 1.1;
    let polygons: PolygonData[] = createMosaic(15);

    const animate = (timestamp: number) => {
      const ctx = canvas.value?.getContext('2d');
      if (!ctx) return;

      // Очищаем холст и заливаем белым
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Отрисовка мозаики
      ctx.save();
      const centerOffset = (canvasSize - mosaicSize) / 2;
      ctx.translate(centerOffset, centerOffset);
      const factor = getCurrentDisplacementFactor(timestamp);
      polygons.forEach(poly => {
        const disp = computeDisplacement(poly, factor);
        ctx.beginPath();
        poly.vertices.forEach((pt, index) => {
          const x = pt.x + disp.dx;
          const y = pt.y + disp.dy;
          index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = poly.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      ctx.restore();

      // Отрисовка подписи "Canvas Mosaic"
      ctx.fillStyle = '#333';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('Canvas Mosaic', 10, 30);

      requestAnimationFrame(animate);
    };

    onMounted(() => {
      requestAnimationFrame(animate);
    });

    return { canvas, canvasSize };
  }
});
</script>

<style scoped>
/* Дополнительные стили можно добавить по необходимости */
</style>
