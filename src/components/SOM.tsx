import React, { useRef, useEffect, useState } from 'react';

type Point = { x: number; y: number };
type Neuron = { x: number; y: number };

const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 400;
const MARGIN_LEFT = 40;
const MARGIN_BOTTOM = 40;
const UNIT = 45;
const X_RANGE = 13;
const Y_RANGE = 7;
const AXIS_COLOR = '#333';

// ... (imports and constants unchanged)

function euclidean(p1: Point | Neuron, p2: Point | Neuron) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
  
  function kMeansInit(points: Point[], k: number): Neuron[] {
    const centroids: Neuron[] = [];
  
    // Initialize first centroid randomly
    centroids.push(points[Math.floor(Math.random() * points.length)]);
  
    // KMeans++ style init
    while (centroids.length < k) {
      const distances = points.map(p =>
        Math.min(...centroids.map(c => euclidean(p, c)))
      );
      const sum = distances.reduce((a, b) => a + b, 0);
      const probs = distances.map(d => d / sum);
      const r = Math.random();
      let cumulative = 0;
      for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i];
        if (r < cumulative) {
          centroids.push(points[i]);
          break;
        }
      }
    }
  
    return centroids;
  }
  
  function trainSOM(
    data: Point[],
    width: number,
    height: number,
    iterations: number,
    baseLearningRate: number,
    useKMeans: boolean
  ) {
    const neuronCount = width * height;
    let neurons: Neuron[];
  
    if (useKMeans && data.length >= neuronCount) {
      neurons = kMeansInit(data, neuronCount);
    } else {
      neurons = Array.from({ length: neuronCount }, () => ({
        x: Math.random() * X_RANGE,
        y: Math.random() * Y_RANGE,
      }));
    }
  
    for (let iter = 0; iter < iterations; iter++) {
      for (const point of data) {
        let bmuIndex = 0;
        let minDist = Infinity;
        neurons.forEach((n, i) => {
          const d = euclidean(n, point);
          if (d < minDist) {
            minDist = d;
            bmuIndex = i;
          }
        });
  
        const learningRate = baseLearningRate * (1 - iter / iterations);
        const bmu = neurons[bmuIndex];
        bmu.x += learningRate * (point.x - bmu.x);
        bmu.y += learningRate * (point.y - bmu.y);
      }
    }
  
    const labels = data.map(point => {
      let bmuIndex = 0;
      let minDist = Infinity;
      neurons.forEach((n, i) => {
        const d = euclidean(n, point);
        if (d < minDist) {
          minDist = d;
          bmuIndex = i;
        }
      });
      return bmuIndex;
    });
  
    return { neurons, labels };
  }

  function calculateSilhouette(points: Point[], labels: number[]): number {
    const n = points.length;
    if (n <= 1) return 0;
  
    const labelGroups: Record<number, Point[]> = {};
    labels.forEach((label, i) => {
      if (!labelGroups[label]) labelGroups[label] = [];
      labelGroups[label].push(points[i]);
    });
  
    const distances = (a: Point, b: Point) => euclidean(a, b);
  
    const silhouettes = points.map((p, i) => {
      const label = labels[i];
      const sameCluster = labelGroups[label].filter((_, idx) => idx !== i);
      const otherClusters = Object.entries(labelGroups)
        .filter(([l]) => parseInt(l) !== label)
        .map(([_, pts]) => pts);
  
      const a =
        sameCluster.length > 0
          ? sameCluster.reduce((sum, q) => sum + distances(p, q), 0) / sameCluster.length
          : 0;
  
      const b =
        otherClusters.length > 0
          ? Math.min(
              ...otherClusters.map(cluster =>
                cluster.reduce((sum, q) => sum + distances(p, q), 0) / cluster.length
              )
            )
          : 0;
  
      const s = a === 0 && b === 0 ? 0 : (b - a) / Math.max(a, b);
      return s;
    });
  
    return silhouettes.reduce((sum, s) => sum + s, 0) / n;
  }

  
  type SOMProps = {
    trigger: boolean;
    clearTrigger: boolean;
    learningRate: number;
    iterations: number;
    somWidth: number;
    somHeight: number;
    useKMeans: boolean; // NEW
    silh: React.Dispatch<React.SetStateAction<number>>;
  };
  
  export default function SOM({
    trigger,
    clearTrigger,
    learningRate,
    iterations,
    somWidth,
    somHeight,
    useKMeans,
    silh
  }: SOMProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [neurons, setNeurons] = useState<Neuron[]>([]);
    const [clusters, setClusters] = useState<number[]>([]);
  
    useEffect(() => {
      setPoints([]);
      setNeurons([]);
      setClusters([]);
    }, [clearTrigger]);
  
    useEffect(() => {
      if (points.length === 0) return;
      const result = trainSOM(
        points,
        somWidth,
        somHeight,
        iterations,
        learningRate,
        useKMeans
      );
      setNeurons(result.neurons);
      setClusters(result.labels);
      const silh_score = calculateSilhouette(points,result.labels)

      silh(silh_score)
    }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw axes
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGIN_LEFT, 0);
    ctx.lineTo(MARGIN_LEFT, CANVAS_HEIGHT);
    ctx.moveTo(0, CANVAS_HEIGHT - MARGIN_BOTTOM);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - MARGIN_BOTTOM);
    ctx.stroke();

    // Axis labels
    ctx.font = '16px sans-serif';
    ctx.fillStyle = AXIS_COLOR;
    ctx.fillText('0', MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    for (let i = 1; i <= Y_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT + 5);
    }
    for (let i = 1; i <= X_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT + i * UNIT - 4, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    }

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.3;
    for (let i = 0; i <= X_RANGE; i++) {
      const x = MARGIN_LEFT + i * UNIT;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT - MARGIN_BOTTOM);
      ctx.stroke();
    }
    for (let i = 0; i <= Y_RANGE; i++) {
      const y = CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    const colorPalette = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'teal'];

    points.forEach((p, idx) => {
      const px = MARGIN_LEFT + p.x * UNIT;
      const py = CANVAS_HEIGHT - MARGIN_BOTTOM - p.y * UNIT;
      const clusterId = clusters[idx];
      const color = clusterId !== undefined ? colorPalette[clusterId % colorPalette.length] : 'black';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    for (const n of neurons) {
      const nx = MARGIN_LEFT + n.x * UNIT;
      const ny = CANVAS_HEIGHT - MARGIN_BOTTOM - n.y * UNIT;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(nx, ny, 8, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = 'black';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(nx, ny, 10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [points, neurons]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const x = (pixelX - MARGIN_LEFT) / UNIT;
    const y = (CANVAS_HEIGHT - MARGIN_BOTTOM - pixelY) / UNIT;

    if (x >= 0 && x <= X_RANGE && y >= 0 && y <= Y_RANGE) {
      setPoints(prev => [...prev, { x, y }]);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      style={{ border: '2px solid #E9EAEB', cursor: 'crosshair' }}
      className="m-auto bg-white mt-2 rounded-sm"
    />
  );
}
