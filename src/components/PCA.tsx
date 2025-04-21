"use client";

import { useMemo } from "react";
import { Canvas,useThree } from "@react-three/fiber";
import { OrbitControls,Line,Grid } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
const { PCA } = require('ml-pca');

type Point3D = [number, number, number];

function Point({ position, color = "hotpink" }: { position: [number, number]; color?: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

const ArrowHelper = ({
  direction,
  origin = [0, 0, 0],
  length = 5,
  color = "white",
}: {
  direction: [number, number, number];
  origin?: [number, number, number];
  length?: number;
  color?: string;
}) => {
  const arrow = useMemo(() => {
    const dir = new THREE.Vector3(...direction).normalize();
    const orig = new THREE.Vector3(...origin);
    return new THREE.ArrowHelper(dir, orig, length, color);
  }, [direction, origin, length, color]);

  return <primitive object={arrow} />;
};


function Axes({ size = 5 }: { size?: number }) {
  return (
    <group>
      {/* X Axis*/}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-size, 0, 0, size, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="red" />
      </line>

      {/* Y Axis*/}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -size, 0, 0, size, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="green" />
      </line>

      {/* Z Axis*/}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -size, 0, 0, size])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="blue" />
      </line>
    </group>
  );
}


const Arrow = ({ direction, color, scale = 5 }: { direction: Point3D; color: string; scale?: number }) => {
  const start: Point3D = direction.map((v) => -v * scale) as Point3D;
  const end: Point3D = direction.map((v) => v * scale) as Point3D;

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={3}
      dashed={false}
    />
  );
};

{/*This one's 4 the 3d plot where u can add points*/}
function OriginalPlot({
  points,
  onAddPoint,
}: {
  points: Point3D[];
  onAddPoint: (point: Point3D) => void;
}) {
  const [eigenvectors, setEigenvectors] = useState<Point3D[]>([]);
  const { camera, gl } = useThree();

  useEffect(() => {
    const pca = new PCA(points);
    const components = pca.components;
    setEigenvectors(components || []);
  }, [points]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const mouse = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0 plane
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        onAddPoint([intersection.x, intersection.y, intersection.z]);
      }
    };

    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    return () => {
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [camera, gl, onAddPoint]);

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Axes size={5} />
      {/* Plot the original points */}
      {points.map((pos, idx) => (
        <Point key={idx} position={pos} color="blue" />
      ))}
      {/* Eigenvectors as arrows */}
      {eigenvectors && eigenvectors.length > 0 &&
        eigenvectors.map((vec, idx) => (
          <Arrow key={idx} start={[0, 0, 0]} end={vec} color="red" />
        ))}
    </>
  );
}
{/*This one's 4 the 2d pca transformed plot where yellow and black are eigen vectors*/}
function PCAPlot({ points, onSetEigenvectors }: { points: Point3D[]; onSetEigenvectors: (vecs: Point3D[]) => void }) {
  const [transformedPoints, setTransformedPoints] = useState<[number, number][]>([]);
  const [eigenvectors, setEigenvectors] = useState<[number, number][]>([]);

  useEffect(() => {
    if (points.length < 2) return;
    const pca = new PCA(points);
    const result = pca.predict(points).to2DArray();  // Make sure this is 2D
    const components = pca.getLoadings().to2DArray();

    setTransformedPoints(result);
    setEigenvectors(components);
    onSetEigenvectors(components); // Lift eigenvectors to parent
  }, [points, onSetEigenvectors]);

  const SCALE = 10;

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Grid
        args={[10, 10]} // size
        sectionSize={1}
        sectionColor={"gray"}
        fadeDistance={50}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]} // rotate grid to XY plane
      />

      {/* 2D Points */}
      {transformedPoints.map((pos, idx) => (
        <Point key={idx} position={[pos[0], pos[1], 0]} color="blue" />
      ))}

      {/* Eigenvectors as arrows */}
      {eigenvectors && eigenvectors.length > 0 &&
        eigenvectors.slice(0, 2).map((vec, idx) => {
          const colors = ['black', 'yellow', 'orange']; // Add more if needed
          return (
            <Arrow
              key={idx}
              direction={[vec[0], vec[1], 0]}  // Use only 2D components
              color={colors[idx % colors.length]}
              scale={SCALE}
            />
          );
        })
      }
    </>
  );
}


export default function Home() {
  {/*Random initial data pts, can change if u want*/}
  const [data, setData] = useState<Point3D[]>([
    [2, 3, 5],
    [4, 5, 7],
    [3, 7, 2],
    [6, 2, 4],
    [5, 8, 6],
    [7, 3, 3],
    [8, 6, 9],
    [9, 1, 5],
    [10, 4, 8],
    [11, 7, 6],
  ]);

  const [eigenvectors, setEigenvectors] = useState<Point3D[]>([]); // ← new state

  const addPoint = (point: Point3D) => {
    setData((prev) => [...prev, point]);
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div>
        <h2>Original Data</h2>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: 500, height: 500 }}>
          <OrbitControls />
          <OriginalPlot points={data} onAddPoint={addPoint} />
        </Canvas>
      </div>

      <div>
        <h2>PCA Transformed</h2>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: 500, height: 500 }}>
          <OrbitControls />
          <PCAPlot points={data} onSetEigenvectors={setEigenvectors} />
        </Canvas>

        {/* Display eigenvectors below the PCA plot */}
        <div style={{ marginTop: "1rem" }}>
          <h3>Eigenvectors</h3>
          {eigenvectors.map((vec, idx) => (
            <div key={idx}>PC{idx + 1}: [{vec.map((v) => v.toFixed(2)).join(", ")}]</div>
          ))}
        </div>
      </div>
    </div>
  );
}
