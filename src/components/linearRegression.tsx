import React, { useRef, useEffect, useState } from 'react';

type Point = { x: number; y: number };

const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 400;

const AXIS_COLOR = '#333';
const POINT_COLOR = 'blue';
const MARGIN_LEFT = 40;
const MARGIN_BOTTOM = 40;
const UNIT = 45; // 1 unit = 45px
const X_RANGE = 13;
const Y_RANGE = 7;

type LinearRegressionProps = {
    r2func: React.Dispatch<React.SetStateAction<number>>;
    maefunc: React.Dispatch<React.SetStateAction<number>>;
    rmsefunc: React.Dispatch<React.SetStateAction<number>>;
    reg: string;
    lambda: number;
};

export default function LinearRegression({ r2func, maefunc, rmsefunc, reg, lambda }: LinearRegressionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  function calculateLinearRegression(points: Point[]) {
    const n = points.length;
    if (n === 0) return null;

    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

    const meanX = sumX / n;
    const meanY = sumY / n;

    const numerator = sumXY - n * meanX * meanY;
    const denominator = sumXX - n * meanX * meanX;

    const m = denominator === 0 ? 0 : numerator / denominator;
    const b = meanY - m * meanX;

    return { m, b };
  }

  function calculateRidgeRegression(points: Point[], lambda: number = 1) {
    const n = points.length;
    if (n === 0) return null;
  
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
  
    const meanX = sumX / n;
    const meanY = sumY / n;
  
    const numerator = sumXY - n * meanX * meanY;
    const denominator = (sumXX - n * meanX * meanX) + lambda;
  
    const m = denominator === 0 ? 0 : numerator / denominator;
    const b = meanY - m * meanX;
  
    return { m, b };
  }

  function calculateR2(points: Point[], m: number, b: number) {
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
    const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const ssRes = points.reduce((sum, p) => {
      const predictedY = m * p.x + b;
      return sum + Math.pow(p.y - predictedY, 2);
    }, 0);
  
    return ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  }

  function calculateMAE(points: Point[], m: number, b: number): number {
    const n = points.length;
    if (n === 0) return 0;
  
    let sumAbsoluteError = 0;
  
    for (const p of points) {
      const predictedY = m * p.x + b;
      sumAbsoluteError += Math.abs(p.y - predictedY);
    }
  
    return sumAbsoluteError / n;
  }

  function calculateRMSE(points: Point[], m: number, b: number): number {
    const n = points.length;
    if (n === 0) return 0;
  
    let sumSquaredError = 0;
  
    for (const p of points) {
      const predictedY = m * p.x + b;
      const error = p.y - predictedY;
      sumSquaredError += error ** 2;
    }
  
    return Math.sqrt(sumSquaredError / n);
  }
  
  

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

    // Grid lines
    ctx.lineWidth = 0.3;
    for (let i = 1; i <= Y_RANGE; i++) {
      const y = CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT;
      ctx.beginPath();
      ctx.moveTo(MARGIN_LEFT, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    for (let i = 1; i <= X_RANGE; i++) {
      const x = MARGIN_LEFT + i * UNIT;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT - MARGIN_BOTTOM);
      ctx.stroke();
    }

    // Axis labels
    ctx.font = '16px sans-serif';
    ctx.fillText('0', MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    for (let i = 1; i <= Y_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT + 5);
    }
    for (let i = 1; i <= X_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT + i * UNIT - 4, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    }

    for (const point of points) {
      const canvasX = MARGIN_LEFT + point.x * UNIT;
      const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - point.y * UNIT;

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    const regression = reg == 'None' ? calculateLinearRegression(points): calculateRidgeRegression(points, lambda);
    if (regression) {
      const { m, b } = regression;

      const x1 = 0;
      const x2 = X_RANGE;
      const y1 = m * x1 + b;
      const y2 = m * x2 + b;

      const canvasX1 = MARGIN_LEFT + x1 * UNIT;
      const canvasY1 = CANVAS_HEIGHT - MARGIN_BOTTOM - y1 * UNIT;
      const canvasX2 = MARGIN_LEFT + x2 * UNIT;
      const canvasY2 = CANVAS_HEIGHT - MARGIN_BOTTOM - y2 * UNIT;

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvasX1, canvasY1);
      ctx.lineTo(canvasX2, canvasY2);
      ctx.stroke();

      const r2 = calculateR2(points, m, b);
      const mae = calculateMAE(points, m, b);
      const rmse = calculateRMSE(points, m, b);
      console.log('R² =', r2.toFixed(4));
      console.log('MAE =', mae.toFixed(4));
      console.log('RMSE =', rmse.toFixed(4));
      r2func(r2)
      maefunc(mae)
      rmsefunc(rmse)
    }
  }, [points, reg, lambda]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    // Convert pixel to graph coordinates
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
      className='m-auto bg-white mt-2 rounded-sm'
    />
  );
}
