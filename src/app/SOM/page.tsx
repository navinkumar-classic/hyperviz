"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import SOM from "@/components/SOM"
import TextField from '@mui/material/TextField';
import { clear } from "console";


export default function KNN() {
  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [boundary, setBoundary] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [outlier, setOutlier] = useState<number>(0);
  const [eps, setEps] = useState<number>(1);
  const [K, setK] = useState<number>(3);

  const [trigger, setTrigger] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [iterations, setIterations] = useState(100);
  const [somWidth, setSomWidth] = useState(2);
  const [somHeight, setSomHeight] = useState(3);
  const [useKMeans, setUseKMeans] = useState(false); // NEW
  

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center overflow-y-auto h-[87vh]">

        <div className="w-[80%] rounded-tr-2xl rounded-bl-2xl bg-white my-4 py-4 flex flex-col items-center text-black px-4 border-t-3 border-t-[#E9EAEB] border-b-3 border-b-[#E9EAEB]">
          <div className="text-xl font-semibold text-center mb-2 pl-2">SOM</div>
          <div className="text-md font-light italic text-center pb-2">Choose Your HyperParameter</div>
        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-iteration" label="Iteration" type="number" variant="standard" className="w-full" value={iterations}
          onChange={(e) => setIterations(Number(e.target.value))}  /> 

        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-learning-rate" label="Learning Rate" type="number" inputProps={{ step: "0.01" }} variant="standard" className="w-full" value={learningRate}
          onChange={(e) => setLearningRate(Number(e.target.value))}  /> 

        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-som-width" label="SOM Width" type="number" variant="standard" className="w-full" value={somWidth}
          onChange={(e) => setSomWidth(Number(e.target.value))}  /> 

        </div>

        <div className="mb-5 w-[80%]">

          <TextField id="filled-som-height" label="SOM Height" type="number" variant="standard" className="w-full" value={somHeight}
          onChange={(e) => setSomHeight(Number(e.target.value))}  /> 

        </div>

        <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setTrigger(!trigger)}>Classify The Points</Button>
        <div className="mt-2 mb-5">
          <Button variant="contained" className="py-5 PX-2" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>  
        </div>

        <Link model={"SOM"}/>

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Max Iteration", value: iterations.toString(), num: 2, basis: 'basis-[40%]' },
              { label: "Learning Rate", value: learningRate.toString(), num: 2, basis: 'basis-[40%]' }
            ],
            [{ label: "SOM Width", value: somWidth.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "SOM Height", value: somHeight.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4, basis: 'basis-[20%]' },
            ]]
          }
          />


        </div>
        <h1 className="mt-2 italic">Click Anywhere To Place Points</h1>
        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <SOM
            trigger={trigger}
            clearTrigger={clearTrigger}
            learningRate={learningRate}
            iterations={iterations}
            somWidth={somWidth}
            somHeight={somHeight}
            useKMeans={useKMeans}
            silh={setSilhouette}
          />


        </div>

      </div>

    </div>
  );
}
