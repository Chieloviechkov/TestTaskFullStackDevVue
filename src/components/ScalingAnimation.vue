<template>
  <!-- Canvas element to draw the mosaic -->
  <canvas ref="canvas" :width="canvasSize" :height="canvasSize"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

// Interfaces for point, polygon, and line segment
interface Point {
  x: number;
  y: number;
}

interface PolygonData {
  vertices: Point[];
  color: string;
  centroid: Point;
  originalPosition: Point;
}

interface LineSegment {
  start: Point;
  end: Point;
}

// A small epsilon value for floating point comparisons
const EPSILON = 1e-9;

export default defineComponent({
  name: 'ExplodingMosaicSquare',
  setup() {
    // Constants for mosaic and animation configuration
    const mosaicSize = 400;
    const canvasSize = mosaicSize * 1.5;
    const expansionFactor = 0.5;
    const centerOffset = (canvasSize - mosaicSize) / 2;
    const period = 5000; // Animation period in ms

    // Ref for canvas element
    const canvas = ref<HTMLCanvasElement | null>(null);

    // Variables for mosaic polygons and animation timing
    let polygons: PolygonData[] = [];
    let startTime: number | null = null;
    let lastCycleTime = 0;

    /*
      Generates a random bright color.
     */
    function getRandomColor(): string {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 200 + 55);
      const b = Math.floor(Math.random() * 200 + 55);
      return `rgb(${r}, ${g}, ${b})`;
    }

    /*
      Computes the centroid (average point) of given vertices.
     */
    function computeCentroid(vertices: Point[]): Point {
      const { sumX, sumY } = vertices.reduce(
        (acc, pt) => ({ sumX: acc.sumX + pt.x, sumY: acc.sumY + pt.y }),
        { sumX: 0, sumY: 0 }
      );
      return { x: sumX / vertices.length, y: sumY / vertices.length };
    }

    /*
      Creates the initial square polygon covering the mosaic area.
     */
    function createInitialPolygon(): PolygonData {
      const verts: Point[] = [
        { x: 0, y: 0 },
        { x: mosaicSize, y: 0 },
        { x: mosaicSize, y: mosaicSize },
        { x: 0, y: mosaicSize }
      ];
      const centroid = computeCentroid(verts);
      return {
        vertices: verts,
        color: getRandomColor(),
        centroid,
        originalPosition: { ...centroid }
      };
    }

    /*
      Returns a random point inside the mosaic with a margin.
     */
    function getRandomInternalPoint(): Point {
      const margin = mosaicSize * 0.1;
      return {
        x: margin + Math.random() * (mosaicSize - 2 * margin),
        y: margin + Math.random() * (mosaicSize - 2 * margin)
      };
    }

    /*
      Creates an array of random line segments that will be used to cut the polygon.
      @param numLines - Number of random lines to generate.
     */
    function createRandomLines(numLines: number): LineSegment[] {
      const result: LineSegment[] = [];
      for (let i = 0; i < numLines; i++) {
        const start = getRandomInternalPoint();
        const angle = Math.random() * Math.PI * 2;
        const length = mosaicSize * 1.5;
        const end = {
          x: start.x + Math.cos(angle) * length,
          y: start.y + Math.sin(angle) * length
        };
        result.push({ start, end });
      }
      return result;
    }

    /*
      Determines which side of a line the point lies on.
      Positive value means one side, negative means the other, and 0 means on the line.
     */
    function sideOfLine(p: Point, lineStart: Point, lineEnd: Point): number {
      return (lineEnd.x - lineStart.x) * (p.y - lineStart.y) -
             (lineEnd.y - lineStart.y) * (p.x - lineStart.x);
    }

    /*
      Calculates the intersection point between a segment (p1 -> p2) and a line (l1 -> l2).
      Returns null if there is no valid intersection within the segment.
     */
    function lineSegmentIntersection(
      p1: Point, p2: Point,
      l1: Point, l2: Point
    ): Point | null {
      const A1 = l2.y - l1.y;
      const B1 = l1.x - l2.x;
      const C1 = A1 * l1.x + B1 * l1.y;

      const A2 = p2.y - p1.y;
      const B2 = p1.x - p2.x;
      const C2 = A2 * p1.x + B2 * p1.y;

      const determinant = A1 * B2 - A2 * B1;
      if (Math.abs(determinant) < EPSILON) return null; // Lines are parallel

      const x = (B2 * C1 - B1 * C2) / determinant;
      const y = (A1 * C2 - A2 * C1) / determinant;

      // Check if the intersection is within the segment bounds
      if (
        x < Math.min(p1.x, p2.x) - EPSILON || x > Math.max(p1.x, p2.x) + EPSILON ||
        y < Math.min(p1.y, p2.y) - EPSILON || y > Math.max(p1.y, p2.y) + EPSILON
      ) {
        return null;
      }
      return { x, y };
    }

    /*
      Removes duplicate points from an array based on a small threshold.
     */
    function removeDuplicatePoints(points: Point[]): Point[] {
      const DUPLICATE_EPSILON = 1e-6;
      return points.filter((p1, i) =>
        !points.some((p2, j) =>
          j < i &&
          Math.abs(p1.x - p2.x) < DUPLICATE_EPSILON &&
          Math.abs(p1.y - p2.y) < DUPLICATE_EPSILON
        )
      );
    }

    /*
      Cuts a polygon with a line defined by (lineStart, lineEnd) and returns the resulting polygons.
      If the cut does not produce valid polygons, returns the original polygon.
     */
    function cutPolygon(
      polygon: PolygonData,
      lineStart: Point,
      lineEnd: Point
    ): PolygonData[] {
      const { vertices } = polygon;
      const poly1: Point[] = [];
      const poly2: Point[] = [];

      // Iterate over each edge of the polygon
      for (let i = 0; i < vertices.length; i++) {
        const current = vertices[i];
        const next = vertices[(i + 1) % vertices.length];
        const currentSide = sideOfLine(current, lineStart, lineEnd);

        // Add point to respective polygon based on which side of the line it falls on
        if (currentSide >= 0) poly1.push(current);
        if (currentSide <= 0) poly2.push(current);

        // If the edge intersects with the cutting line, add the intersection to both polygons
        const intersection = lineSegmentIntersection(current, next, lineStart, lineEnd);
        if (intersection) {
          poly1.push(intersection);
          poly2.push(intersection);
        }
      }

      // Remove duplicates and compute new centroids
      const newPoly1 = removeDuplicatePoints(poly1);
      const newPoly2 = removeDuplicatePoints(poly2);

      const result: PolygonData[] = [];
      if (newPoly1.length >= 3) {
        const centroid1 = computeCentroid(newPoly1);
        result.push({
          vertices: newPoly1,
          color: getRandomColor(),
          centroid: centroid1,
          originalPosition: { ...centroid1 }
        });
      }
      if (newPoly2.length >= 3) {
        const centroid2 = computeCentroid(newPoly2);
        result.push({
          vertices: newPoly2,
          color: getRandomColor(),
          centroid: centroid2,
          originalPosition: { ...centroid2 }
        });
      }
      return result.length > 0 ? result : [polygon];
    }

    /*
      Creates a mosaic by iteratively cutting the initial polygon with randomly generated lines.
      @param numLines - Number of random lines used to cut the polygon.
     */
    function createMosaic(numLines: number): PolygonData[] {
      let currentPolys: PolygonData[] = [createInitialPolygon()];
      const lines = createRandomLines(numLines);

      // For each line, cut every existing polygon and update the mosaic
      for (const line of lines) {
        const nextPolys: PolygonData[] = [];
        for (const poly of currentPolys) {
          const parts = cutPolygon(poly, line.start, line.end);
          nextPolys.push(...parts);
        }
        currentPolys = nextPolys;
      }
      return currentPolys;
    }

    /*
      Regenerates the mosaic by creating a new set of polygons.
     */
    function regenerateMosaic() {
      polygons = createMosaic(15);
    }

    /*
      Easing function (easeInOutQuad) for smooth animation.
     */
    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /*
      Calculates the current displacement factor based on the elapsed time.
      Also regenerates the mosaic at the start of each new cycle.
     */
    function getCurrentDisplacementFactor(timestamp: number): number {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) % period;
      const t = elapsed / period;
      
      const currentCycle = Math.floor((timestamp - startTime) / period);
      if (currentCycle > lastCycleTime) {
        lastCycleTime = currentCycle;
        regenerateMosaic();
      }

      // Define intervals for no displacement, expansion, and contraction
      if (t < 0.2) return 0;
      if (t < 0.6) {
        // Normalize t to [0, 1] for expansion phase (40% of period)
        return easeInOutQuad((t - 0.2) / 0.4);
      }
      if (t < 1.0) {
        // Normalize t to [0, 1] for contraction phase (40% of period)
        return 1 - easeInOutQuad((t - 0.6) / 0.4);
      }
      return 0;
    }

    /*
      Computes the displacement for a polygon based on its original position and the displacement factor.
     */
    function computeDisplacement(poly: PolygonData, factor: number): { dx: number; dy: number } {
      // Calculate vector from mosaic center scaled by expansion factor
      const scaleVector = {
        x: (poly.originalPosition.x - mosaicSize / 2) * expansionFactor,
        y: (poly.originalPosition.y - mosaicSize / 2) * expansionFactor
      };
      return {
        dx: scaleVector.x * factor,
        dy: scaleVector.y * factor
      };
    }

    /*
      Draws the mosaic on the canvas at the current animation frame.
     */
    function draw(timestamp: number) {
      if (!canvas.value) return;
      const ctx = canvas.value.getContext('2d');
      if (!ctx) return;

      // Clear canvas and fill background with white
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Apply translation to center the mosaic within the canvas
      ctx.save();
      ctx.translate(centerOffset, centerOffset);

      // Get current displacement factor based on time
      const factor = getCurrentDisplacementFactor(timestamp);

      // Draw each polygon with its computed displacement
      polygons.forEach(poly => {
        const disp = computeDisplacement(poly, factor);
        ctx.beginPath();
        poly.vertices.forEach((pt, i) => {
          const x = pt.x + disp.dx;
          const y = pt.y + disp.dy;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = poly.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      ctx.restore();
    }

    /*
      Main animation loop using requestAnimationFrame.
     */
    function animate(timestamp: number) {
      draw(timestamp);
      requestAnimationFrame(animate);
    }

    // Initialize the mosaic and start the animation loop on component mount
    onMounted(() => {
      polygons = createMosaic(15);
      requestAnimationFrame(animate);
    });

    return { canvas, canvasSize };
  }
});
</script>

<style scoped>
</style>
