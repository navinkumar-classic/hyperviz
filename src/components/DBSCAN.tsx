import React, { useRef, useEffect, useState } from 'react';


type Point = { x: number; y: number };

const CANVAS_WIDTH = 630;
const CANVAS_HEIGHT = 359;

const AXIS_COLOR = '#8b929a'; //'#5e977a
const MAIN_AXIS_COLOR = 'black';
const POINT_COLOR = 'blue';
const MARGIN_LEFT = 45;
const MARGIN_BOTTOM = 45;
const MARGIN_LEFT_GUIDE = 0;
const MARGIN_BOTTOM_GUIDE = 0;
const UNIT = 45; // 1 unit = 45px
const X_RANGE = 13;
const Y_RANGE = 7;

const EPSILON = 1; // in graph units
const MIN_POINTS = 5;

function euclidean(p1: Point, p2: Point) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function dbscan(points: Point[], eps: number, minPts: number): {
  labels: number[];
  coreCount: number;
  boundaryCount: number;
  silhouetteScore: number;
  outlier: number;
} {
  const labels = new Array(points.length).fill(-1);
  const visited = new Array(points.length).fill(false);
  const isCore = new Array(points.length).fill(false);
  let clusterId = 0;

  function regionQuery(idx: number): number[] {
    return points
      .map((p, i) => (euclidean(points[idx], p) <= eps ? i : -1))
      .filter(i => i !== -1);
  }

  function expandCluster(idx: number, neighbors: number[]) {
    labels[idx] = clusterId;
    isCore[idx] = true;
    let i = 0;
    while (i < neighbors.length) {
      const nIdx = neighbors[i];
      if (!visited[nIdx]) {
        visited[nIdx] = true;
        const nNeighbors = regionQuery(nIdx);
        if (nNeighbors.length >= minPts) {
          isCore[nIdx] = true;
          neighbors = [...neighbors, ...nNeighbors.filter(n => !neighbors.includes(n))];
        }
      }
      if (labels[nIdx] === -1) {
        labels[nIdx] = clusterId;
      }
      i++;
    }
  }

  for (let i = 0; i < points.length; i++) {
    if (visited[i]) continue;
    visited[i] = true;
    const neighbors = regionQuery(i);
    if (neighbors.length < minPts) {
      labels[i] = -1; // noise
    } else {
      expandCluster(i, neighbors);
      clusterId++;
    }
  }

  // Count core and boundary
  let coreCount = 0;
  let boundaryCount = 0;
  let outlier = 0;
  for (let i = 0; i < points.length; i++) {
    if (labels[i] !== -1) {
      if (isCore[i]) coreCount++;
      else boundaryCount++;
    }
    else{
      outlier++;
    }
  }

  // Silhouette score
  const silhouetteValues: number[] = [];

  for (let i = 0; i < points.length; i++) {
    const labelI = labels[i];
    if (labelI === -1) continue; // skip noise

    const sameCluster = points.filter((_, j) => labels[j] === labelI && j !== i);
    const otherClusters = Array.from(new Set(labels)).filter(l => l !== labelI && l !== -1);

    const a = sameCluster.length === 0
      ? 0
      : sameCluster.reduce((sum, p, j) => sum + euclidean(points[i], p), 0) / sameCluster.length;

    let b = Infinity;
    for (let l of otherClusters) {
      const otherPts = points.filter((_, j) => labels[j] === l);
      const avgDist = otherPts.reduce((sum, p) => sum + euclidean(points[i], p), 0) / otherPts.length;
      b = Math.min(b, avgDist);
    }

    if (sameCluster.length > 0 && b < Infinity) {
      silhouetteValues.push((b - a) / Math.max(a, b));
    }
  }

  const silhouetteScore = silhouetteValues.length === 0
    ? 0
    : silhouetteValues.reduce((sum, v) => sum + v, 0) / silhouetteValues.length;

  return { labels, coreCount, boundaryCount, silhouetteScore, outlier };
}


type LinearRegressionProps = {
  core: React.Dispatch<React.SetStateAction<number>>;
  boundary: React.Dispatch<React.SetStateAction<number>>;
  silh: React.Dispatch<React.SetStateAction<number>>;
  outlier: React.Dispatch<React.SetStateAction<number>>;
  eps: number;
  k: number;
  flag: Boolean;
  clearTrigger: Boolean;
  pointex: Point[];
};

export default function DBSCAN({ core, boundary, silh, outlier, eps, k, flag, clearTrigger, pointex}: LinearRegressionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [clusters, setClusters] = useState<number[]>([]);

  useEffect(() => {
    
    setPoints(pointex)
    setClusters([])

  },[pointex])

  useEffect(() => {
  
    setPoints([])
    setClusters([])
  
  },[clearTrigger])

  useEffect(() => {
    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio || 1;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Save original size
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    // Resize the canvas for high DPI
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale the context
    ctx.scale(scale, scale);

    // Draw axes
    ctx.strokeStyle = MAIN_AXIS_COLOR;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(MARGIN_LEFT, 0);
    ctx.lineTo(MARGIN_LEFT, CANVAS_HEIGHT);
    ctx.moveTo(0, CANVAS_HEIGHT - MARGIN_BOTTOM);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - MARGIN_BOTTOM);
    ctx.stroke();


    // Grid lines
    ctx.strokeStyle = AXIS_COLOR;
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= Y_RANGE; i++) {
      const y = CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT_GUIDE, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    for (let i = 1; i <= X_RANGE; i++) {
      const x = MARGIN_LEFT + i * UNIT;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT - MARGIN_BOTTOM_GUIDE);
      ctx.stroke();
    }

    // Axis labels
    ctx.font = '16px monospace';
    ctx.textBaseline = 'top'; // Ensures consistent vertical alignment
    ctx.fillStyle = 'black';  // Text color

    ctx.fillText('0', MARGIN_LEFT - 15, CANVAS_HEIGHT - MARGIN_BOTTOM + 10);
    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 1; i <= Y_RANGE-1; i++) {
      const x = MARGIN_LEFT - 13;
      const y = CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT - 8;

      // Draw white rectangle background
      ctx.fillStyle = 'white';
      ctx.fillRect(x-12, y-2, 20, 20); // adjust width/height as needed

      ctx.strokeStyle = MAIN_AXIS_COLOR;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x+5, y+8);
      ctx.lineTo(x+12, y+8);
      ctx.stroke();

      // Draw text on top
      ctx.fillStyle = 'black';
      ctx.fillText(String(i), x, y);
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    for (let i = 1; i <= X_RANGE-1; i++) {
      const x = MARGIN_LEFT + i * UNIT;
      const y = CANVAS_HEIGHT - MARGIN_BOTTOM + 10;

      // Draw white rectangle background
      ctx.fillStyle = 'white';
      ctx.fillRect(x - 8, y - 2, 16, 20); // adjust width/height as needed

      ctx.strokeStyle = MAIN_AXIS_COLOR;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y-9);
      ctx.lineTo(x, y-2);
      ctx.stroke();

      // Draw text on top
      ctx.fillStyle = 'black';
      ctx.fillText(String(i), x, y+2);
    }

    // Draw points
    points.forEach((point, idx) => {
      const canvasX = MARGIN_LEFT + point.x * UNIT;
      const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - point.y * UNIT;
      const label = clusters[idx];

      if (clusters.length === 0 || label === undefined) {

      }
      else{
        const neighbors = points
          .map((p, i) => (euclidean(point, p) <= eps ? i : -1))
          .filter(i => i !== -1);
        if (neighbors.length >= k) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 1;
          ctx.arc(canvasX, canvasY, eps * UNIT, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);

      if (clusters.length === 0 || label === undefined) {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = label === -1 ? '#999' : ['red', 'blue', 'green', 'orange', 'purple'][label % 5];
      }
      ctx.fill();


    });
  }, [points, clusters]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const x = (pixelX - MARGIN_LEFT) / UNIT;
    const y = (CANVAS_HEIGHT - MARGIN_BOTTOM - pixelY) / UNIT;

    if (x >= 0 && x <= X_RANGE && y >= 0 && y <= Y_RANGE) {
      const newPoints = [...points, { x, y }];
      setPoints(newPoints);
    }
  };

  useEffect(()=>{

    console.log(points)

    const newClusters = dbscan(points, eps, k);
    setClusters(newClusters.labels);
    core(newClusters.coreCount)
    boundary(newClusters.boundaryCount)
    silh(newClusters.silhouetteScore)
    outlier(newClusters.outlier)

    

  },[eps,k,flag])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleClick}
      style={{ border: '2px solid #E9EAEB', cursor: 'crosshair' }}
      className='m-auto bg-white mt-2 rounded-sm'
    />
  );
}

