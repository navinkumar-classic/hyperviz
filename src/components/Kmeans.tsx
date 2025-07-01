import React, { useRef, useEffect, useState } from 'react';

type Point = { x: number; y: number };

const CANVAS_WIDTH = 495;
const CANVAS_HEIGHT = 404;

const AXIS_COLOR = '#8b929a'; //'#5e977a
const MAIN_AXIS_COLOR = 'black';
const POINT_COLOR = 'blue';
const MARGIN_LEFT = 45;
const MARGIN_BOTTOM = 45;
const MARGIN_LEFT_GUIDE = 0;
const MARGIN_BOTTOM_GUIDE = 0;
const UNIT = 45; // 1 unit = 45px
const X_RANGE = 10;
const Y_RANGE = 8;

function euclidean(p1: Point, p2: Point) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

type LinearRegressionProps = {
    core: React.Dispatch<React.SetStateAction<number>>;
    silh: React.Dispatch<React.SetStateAction<number>>;
    init: string;
    maxI: number;
    k: number;
    flag: Boolean;
    clearTrigger: Boolean;
    pointex: Point[];
};

function getRandomCentroids(points: Point[], k: number): Point[] {
    const shuffled = [...points].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
}

function kMeansPlusPlus(points: Point[], k: number): Point[] {
    const centroids: Point[] = [];
    
    // Step 1: Choose one center uniformly at random
    //const firstIndex = Math.floor(Math.random() * points.length);
    const firstIndex = Math.floor(0);
    centroids.push(points[firstIndex]);
  
    // Step 2: Choose remaining k - 1 centers
    for (let i = 1; i < k; i++) {
      const distances = points.map(p => {
        const minDist = Math.min(...centroids.map(c => euclidean(p, c)));
        return minDist ** 2;
      });
  
      const total = distances.reduce((acc, val) => acc + val, 0);
      const probs = distances.map(d => d / total);
      const cumulativeProbs = probs.reduce<number[]>((acc, val, idx) => {
        if (idx === 0) return [val];
        acc.push(acc[idx - 1] + val);
        return acc;
      }, []);
  
      const r = Math.random();
      const nextIdx = cumulativeProbs.findIndex(cp => r < cp);
      centroids.push(points[nextIdx]);
    }
  
    return centroids;
}
  

function assignClusters(points: Point[], centroids: Point[]): number[] {
    return points.map((p) =>
        centroids.reduce((bestIdx, centroid, idx, arr) => {
            return euclidean(p, centroid) < euclidean(p, arr[bestIdx]) ? idx : bestIdx;
        }, 0)
    );
}

function recomputeCentroids(points: Point[], clusters: number[], k: number): Point[] {
    const newCentroids = Array(k).fill(null).map(() => ({ x: 0, y: 0 }));
    const counts = Array(k).fill(0);

    points.forEach((point, i) => {
        const cluster = clusters[i];
        newCentroids[cluster].x += point.x;
        newCentroids[cluster].y += point.y;
        counts[cluster]++;
    });

    return newCentroids.map((centroid, i) => ({
        x: centroid.x / counts[i] || 0,
        y: centroid.y / counts[i] || 0,
    }));
}

function kmeansClustering(points: Point[], k: number, maxIter = 10, init: string): { centroids: Point[], clusters: number[] } {
    let centroids = null
    if (init == 'None'){
        centroids = getRandomCentroids(points, k); 
    }
    else{
        centroids = kMeansPlusPlus(points, k); 
    }
    
    let clusters = assignClusters(points, centroids);

    for (let i = 0; i < maxIter; i++) {
        centroids = recomputeCentroids(points, clusters, k);
        const newClusters = assignClusters(points, centroids);
        if (newClusters.every((v, i) => v === clusters[i])) break;
        clusters = newClusters;
    }

    return { centroids, clusters };
}

function calculateSilhouetteScore(points: Point[], clusters: number[], k: number): number {
    const silhouetteScores: number[] = [];

    points.forEach((point, i) => {
        const ownCluster = clusters[i];

        const sameClusterPoints = points.filter((_, j) => clusters[j] === ownCluster && j !== i);
        const a = sameClusterPoints.length === 0 ? 0 :
            sameClusterPoints.reduce((sum, p) => sum + euclidean(p, point), 0) / sameClusterPoints.length;

        const otherClusters: number[] = [];
        for (let c = 0; c < k; c++) if (c !== ownCluster) otherClusters.push(c);

        const b = Math.min(...otherClusters.map(clusterId => {
            const otherPoints = points.filter((_, j) => clusters[j] === clusterId);
            if (otherPoints.length === 0) return Infinity;
            const avgDist = otherPoints.reduce((sum, p) => sum + euclidean(p, point), 0) / otherPoints.length;
            return avgDist;
        }));

        const s = (b - a) / Math.max(a, b);
        silhouetteScores.push(s);
    });

    const avgSilhouette = silhouetteScores.reduce((a, b) => a + b, 0) / silhouetteScores.length;
    return avgSilhouette;
}

function calculateWCSS(points: Point[], clusters: number[], centroids: Point[]): number {
    return points.reduce((sum, point, i) => {
      const clusterId = clusters[i];
  
      // Ensure the cluster index is valid
      if (clusterId == null || clusterId >= centroids.length || clusterId < 0) {
        console.warn(`Invalid cluster ID ${clusterId} at index ${i}`);
        return sum;
      }
  
      const centroid = centroids[clusterId];
      const distSquared = euclidean(point, centroid) ** 2;
      return sum + distSquared;
    }, 0);
}
  



export default function Kmeans({ core, silh, init, maxI, k, flag, clearTrigger, pointex }: LinearRegressionProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [clusters, setClusters] = useState<number[]>([]);
    const [centroids, setCentroids] = useState<Point[]>([]);
    const [clustered, setClustered] = useState(false);

    useEffect(() => {
        
        setPoints(pointex)
        setClusters([])
        setCentroids([])
        setClustered(false)
    
    },[pointex])

    useEffect(() => {

        setPoints([])
        setClusters([])
        setCentroids([])
        setClustered(false)

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
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);

            ctx.fillStyle = 'black';
            ctx.fill();
        });

        // Draw cluster boundaries and centroids
        if (clustered) {
            const colors = ['red', 'green', 'blue', 'orange', 'purple', 'teal'];

            centroids.forEach((centroid, clusterIdx) => {
                const clusterPoints = points.filter((_, i) => clusters[i] === clusterIdx);
                const distances = clusterPoints.map(p => euclidean(p, centroid));
                const radius = Math.max(...distances, 0.1) * UNIT;

                const canvasX = MARGIN_LEFT + centroid.x * UNIT;
                const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - centroid.y * UNIT;

                // Draw boundary circle
                ctx.beginPath();
                ctx.arc(canvasX, canvasY, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = colors[clusterIdx % colors.length];
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw centroid
                ctx.beginPath();
                ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
                ctx.fillStyle = 'yellow'
                ctx.fill();
            });
        }

        points.forEach((point, idx) => {
            const canvasX = MARGIN_LEFT + point.x * UNIT;
            const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - point.y * UNIT;
          
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
          
            if (clustered && clusters.length > idx) {
              const colors = ['red', 'green', 'blue', 'orange', 'purple', 'teal'];
              ctx.fillStyle = colors[clusters[idx] % colors.length];
            } else {
              ctx.fillStyle = 'black';
            }
          
            ctx.fill();
        });
  

    }, [points, clusters]);

    useEffect(() => {
        if (points.length >= k) {
            const { centroids, clusters: newClusters } = kmeansClustering(points, k, maxI, init);
            setClusters(newClusters);
            setCentroids(centroids);
            setClustered(true);

            const silhouette = calculateSilhouetteScore(points, clusters, k);
            //const wcss = calculateWCSS(points, clusters, centroids);
            //console.log('ghjgjg: '+wcss+' '+silhouette)
        }
    }, [flag]);

    useEffect(()=>{
        silh(calculateSilhouetteScore(points, clusters, k)) 
        core(calculateWCSS(points, clusters, centroids))

    },[clusters,flag])
      

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

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleClick}
            style={{ border: '1px solid #E9EAEB', cursor: 'crosshair' }}
            className='m-auto bg-white mt-2'
        />
    );
}

