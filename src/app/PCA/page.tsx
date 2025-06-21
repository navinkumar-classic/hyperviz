"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import DBSCAN from "@/components/DBSCAN";
import TextField from '@mui/material/TextField';
import { clear } from "console";
import OriginalPlot from '@/components/PCA'

type Point3D = [number, number, number];

export default function KNN() {
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
  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [boundary, setBoundary] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [outlier, setOutlier] = useState<number>(0);
  const [eps, setEps] = useState<number>(1);
  const [K, setK] = useState<number>(3);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);

  const [x, setX] = useState<number>(1);
  const [y, setY] = useState<number>(1);
  const [z, setZ] = useState<number>(1);
  const [eigenvectors, setEigenvectors] = useState<Point3D[]>([[0,0,0],[0,0,0],[0,0,0]]);

  useEffect(()=>{

    let newasd = [...data]
    newasd.push([x,y,z])
    setData(newasd)

  },[value])

  

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

          <div className="w-[80%] rounded-tr-2xl rounded-bl-2xl bg-white my-4 py-4 flex flex-col items-center text-black px-4 border-t-3 border-t-[#E9EAEB] border-b-3 border-b-[#E9EAEB]">
              <div className="text-xl font-semibold text-center mb-2 pl-2">PCA</div>
              <div className="text-md font-light italic text-center pb-2">Choose Your HyperParameter</div>
          </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-K" label="X-Coordinate" type="number" variant="standard" className="w-full" value={x}
          onChange={(e) => setX(Number(e.target.value))}  /> 

        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-basic" label="Y-Coordinate" type="number" variant="standard" className="w-full" value={y}
          onChange={(e) => setY(Number(e.target.value))}  />

        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-basic" label="Z-Coordinate" type="number" variant="standard" className="w-full" value={z}
          onChange={(e) => setZ(Number(e.target.value))}  />

        </div>

        <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setValue(!value)}>Add Points</Button>

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Eigen Vector (PC1)", value: eigenvectors[0].map(n => n.toFixed(3)).join(', '), num: 2, basis: 'basis-[40%]' },
              { label: "Eigen Vector (PC2)", value: eigenvectors[1].map(n => n.toFixed(3)).join(', '), num: 2, basis: 'basis-[40%]' }
            ],
            [{ label: "Eigen Vector (PC3)", value: eigenvectors[2].map(n => n.toFixed(3)).join(', '), num: 2, basis: 'basis-[40%]' }
            ]]
          }
          />


        </div>
        <h1 className="mt-2 italic">Click Anywhere To Place Points</h1>
        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <OriginalPlot datapoints={data} setEighen={setEigenvectors}/>


        </div>

      </div>

    </div>
  );
}
