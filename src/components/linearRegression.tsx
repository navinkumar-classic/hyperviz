import React, { useRef, useEffect, useState } from 'react';

type Point = { x: number; y: number };

let CANVAS_WIDTH = 630;
let CANVAS_HEIGHT = 359;

const AXIS_COLOR = '#8b929a'; //'#5e977a
const MAIN_AXIS_COLOR = 'black';
const POINT_COLOR = 'blue';
const MARGIN_LEFT = 45;
const MARGIN_BOTTOM = 45;
const MARGIN_LEFT_GUIDE = 0;
const MARGIN_BOTTOM_GUIDE = 0;
let UNIT = 45; // 1 unit = 45px
let X_RANGE = 13;
let Y_RANGE = 7;

type LinearRegressionProps = {
  r2func: React.Dispatch<React.SetStateAction<number>>;
  maefunc: React.Dispatch<React.SetStateAction<number>>;
  rmsefunc: React.Dispatch<React.SetStateAction<number>>;
  reg: string;
  lambda: number;
  clearTrigger: Boolean
};

export default function LinearRegression({ r2func, maefunc, rmsefunc, reg, lambda, clearTrigger }: LinearRegressionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {

    setPoints([])

  }, [clearTrigger])

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

  function calculatePolynomialRegression(points: Point[]) {
    const n = points.length;
    if (n < 3) return null; // Need at least 3 points to fit a quadratic curve

    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;

    for (const p of points) {
      const x = p.x;
      const y = p.y;
      const x2 = x * x;
      const x3 = x2 * x;
      const x4 = x3 * x;

      sumX += x;
      sumX2 += x2;
      sumX3 += x3;
      sumX4 += x4;
      sumY += y;
      sumXY += x * y;
      sumX2Y += x2 * y;
    }

    const A = [
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4]
    ];
    const B = [sumY, sumXY, sumX2Y];

    const det = (m: number[][]): number =>
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    const detA = det(A);
    if (detA === 0) return null;

    const replaceCol = (matrix: number[][], colIndex: number, newCol: number[]): number[][] =>
      matrix.map((row, i) => row.map((val, j) => (j === colIndex ? newCol[i] : val)));

    const a = det(replaceCol(A, 0, B)) / detA;
    const b = det(replaceCol(A, 1, B)) / detA;
    const c = det(replaceCol(A, 2, B)) / detA;

    return { a, b, c };
  }

  type Point = { x: number; y: number };

  function calculatePolynomialR2(points: Point[], coeffs: number[]): number {
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    const ssTot = points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0);
    const ssRes = points.reduce((sum, p) => {
      const predictedY = predictPolynomialY(p.x, coeffs);
      return sum + Math.pow(p.y - predictedY, 2);
    }, 0);

    return ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  }

  function calculatePolynomialMAE(points: Point[], coeffs: number[]): number {
    const n = points.length;
    if (n === 0) return 0;

    let sumAbsoluteError = 0;

    for (const p of points) {
      const predictedY = predictPolynomialY(p.x, coeffs);
      sumAbsoluteError += Math.abs(p.y - predictedY);
    }

    return sumAbsoluteError / n;
  }

  function calculatePolynomialRMSE(points: Point[], coeffs: number[]): number {
    const n = points.length;
    if (n === 0) return 0;

    let sumSquaredError = 0;

    for (const p of points) {
      const predictedY = predictPolynomialY(p.x, coeffs);
      const error = p.y - predictedY;
      sumSquaredError += error ** 2;
    }

    return Math.sqrt(sumSquaredError / n);
  }

  function predictPolynomialY(x: number, coeffs: number[]): number {
    return coeffs.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const scale = window.devicePixelRatio || 1;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.innerWidth < 768) {
      CANVAS_WIDTH = 320;
      CANVAS_HEIGHT = 320;
      UNIT = 30;
      Y_RANGE = 10;
    } else {
      CANVAS_WIDTH = 630;
      CANVAS_HEIGHT = 359;
    }

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

    {/*
    // Axis labels
    ctx.font = '16px sans-serif';
    ctx.fillText('0', MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    for (let i = 1; i <= Y_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT - 25, CANVAS_HEIGHT - MARGIN_BOTTOM - i * UNIT + 5);
    }
    for (let i = 1; i <= X_RANGE; i++) {
      ctx.fillText(String(i), MARGIN_LEFT + i * UNIT - 4, CANVAS_HEIGHT - MARGIN_BOTTOM + 25);
    }
    */}

    for (const point of points) {
      const canvasX = MARGIN_LEFT + point.x * UNIT;
      const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - point.y * UNIT;

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fill();
    }

    let regression: any = null;

    if (reg === 'None') {
      regression = calculateLinearRegression(points);
    } else if (reg === 'Ridge') {
      regression = calculateRidgeRegression(points, lambda);
    } else if (reg === 'Polynomial') {
      regression = calculatePolynomialRegression(points);
    }

    if (regression) {
      if (reg === 'Polynomial') {
        const { a, b, c } = regression;
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let px = 0; px <= X_RANGE * UNIT; px++) {
          const x = px / UNIT;
          const y = a + b * x + c * x * x;
          const canvasX = MARGIN_LEFT + x * UNIT;
          const canvasY = CANVAS_HEIGHT - MARGIN_BOTTOM - y * UNIT;
          if (px === 0) ctx.moveTo(canvasX, canvasY);
          else ctx.lineTo(canvasX, canvasY);
        }

        ctx.stroke();

      } else {
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
      style={{ border: '1px solid #E9EAEB', cursor: 'crosshair' }}
      className='m-auto bg-white mt-2'
    />
  );
}
