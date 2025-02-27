export interface Point {
    x: number;
    y: number;
  }
  
  export interface PolygonData {
    vertices: Point[];
    color: string;
    centroid: Point;
    originalPosition: Point;
  }
  
  export interface LineSegment {
    start: Point;
    end: Point;
  }
  
  const EPSILON = 1e-9;
  export const mosaicSize = 400;
  export const period = 5000; // время анимации в мс
  export const finalScale = 1.1; // итоговый масштаб
  
  export function getRandomColor(): string {
    const r = Math.floor(Math.random() * 200 + 55);
    const g = Math.floor(Math.random() * 200 + 55);
    const b = Math.floor(Math.random() * 200 + 55);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  export function computeCentroid(vertices: Point[]): Point {
    const { sumX, sumY } = vertices.reduce(
      (acc, pt) => ({ sumX: acc.sumX + pt.x, sumY: acc.sumY + pt.y }),
      { sumX: 0, sumY: 0 }
    );
    return { x: sumX / vertices.length, y: sumY / vertices.length };
  }
  
  export function createInitialPolygon(): PolygonData {
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
  
  export function getRandomBorderPoint(): Point {
    const side = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    switch (side) {
      case 0:
        x = Math.random() * mosaicSize;
        y = 0;
        break;
      case 1:
        x = mosaicSize;
        y = Math.random() * mosaicSize;
        break;
      case 2:
        x = Math.random() * mosaicSize;
        y = mosaicSize;
        break;
      case 3:
        x = 0;
        y = Math.random() * mosaicSize;
        break;
    }
    return { x, y };
  }
  
  export function createRandomLines(numLines: number): LineSegment[] {
    const result: LineSegment[] = [];
    for (let i = 0; i < numLines; i++) {
      const start = getRandomBorderPoint();
      let end = getRandomBorderPoint();
      while (start.x === end.x && start.y === end.y) {
        end = getRandomBorderPoint();
      }
      result.push({ start, end });
    }
    return result;
  }
  
  export function sideOfLine(p: Point, lineStart: Point, lineEnd: Point): number {
    return (lineEnd.x - lineStart.x) * (p.y - lineStart.y) -
           (lineEnd.y - lineStart.y) * (p.x - lineStart.x);
  }
  
  export function lineSegmentIntersection(
    p1: Point,
    p2: Point,
    l1: Point,
    l2: Point
  ): Point | null {
    const A1 = l2.y - l1.y;
    const B1 = l1.x - l2.x;
    const C1 = A1 * l1.x + B1 * l1.y;
  
    const A2 = p2.y - p1.y;
    const B2 = p1.x - p2.x;
    const C2 = A2 * p1.x + B2 * p1.y;
  
    const determinant = A1 * B2 - A2 * B1;
    if (Math.abs(determinant) < EPSILON) return null; // Параллельные линии
  
    const x = (B2 * C1 - B1 * C2) / determinant;
    const y = (A1 * C2 - A2 * C1) / determinant;
  
    if (
      x < Math.min(p1.x, p2.x) - EPSILON || x > Math.max(p1.x, p2.x) + EPSILON ||
      y < Math.min(p1.y, p2.y) - EPSILON || y > Math.max(p1.y, p2.y) + EPSILON
    ) {
      return null;
    }
    return { x, y };
  }
  
  export function removeDuplicatePoints(points: Point[]): Point[] {
    const DUPLICATE_EPSILON = 1e-6;
    return points.filter((p1, i) =>
      !points.some((p2, j) =>
        j < i &&
        Math.abs(p1.x - p2.x) < DUPLICATE_EPSILON &&
        Math.abs(p1.y - p2.y) < DUPLICATE_EPSILON
      )
    );
  }
  
  export function cutPolygon(
    polygon: PolygonData,
    lineStart: Point,
    lineEnd: Point
  ): PolygonData[] {
    const { vertices } = polygon;
    const poly1: Point[] = [];
    const poly2: Point[] = [];
  
    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];
      const currentSide = sideOfLine(current, lineStart, lineEnd);
  
      if (currentSide >= 0) poly1.push(current);
      if (currentSide <= 0) poly2.push(current);
  
      const intersection = lineSegmentIntersection(current, next, lineStart, lineEnd);
      if (intersection) {
        poly1.push(intersection);
        poly2.push(intersection);
      }
    }
  
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
  
  export function createMosaic(numLines: number): PolygonData[] {
    let currentPolys: PolygonData[] = [createInitialPolygon()];
    const lines = createRandomLines(numLines);
  
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
  
  export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  let startTime: number | null = null;
  let lastCycleTime = 0;
  
  export function getCurrentDisplacementFactor(timestamp: number): number {
    if (startTime === null) startTime = timestamp;
    const elapsed = (timestamp - startTime) % period;
    const t = elapsed / period;
    
    const currentCycle = Math.floor((timestamp - startTime) / period);
    if (currentCycle > lastCycleTime) {
      lastCycleTime = currentCycle;
      // Здесь можно добавить вызов regenerateMosaic(), если требуется обновление мозаики
    }
  
    if (t < 0.2) return 0;
    if (t < 0.6) return easeInOutQuad((t - 0.2) / 0.4);
    if (t < 1.0) return 1 - easeInOutQuad((t - 0.6) / 0.4);
    return 0;
  }
  
  export function computeDisplacement(poly: PolygonData, factor: number): { dx: number; dy: number } {
    const mosaicCenter = { x: mosaicSize / 2, y: mosaicSize / 2 };
    const scaleVector = {
      x: poly.originalPosition.x - mosaicCenter.x,
      y: poly.originalPosition.y - mosaicCenter.y
    };
    const multiplier = (finalScale - 1) * factor;
    return {
      dx: scaleVector.x * multiplier,
      dy: scaleVector.y * multiplier
    };
  }
  