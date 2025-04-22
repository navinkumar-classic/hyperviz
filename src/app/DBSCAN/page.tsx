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
import { cluster_1, cluster_2 } from "@/components/data";

const exam_1 = cluster_1
const exam_2 = cluster_2
type Point = { x: number; y: number };

export default function KNN() {
  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [boundary, setBoundary] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [outlier, setOutlier] = useState<number>(0);
  const [eps, setEps] = useState<number>(1);
  const [K, setK] = useState<number>(3);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [points,setPoints] = useState<Point[]>([])
  const [exam,setExam] = useState<string>("")

  const btndm = [
    { name: "None", func: () => setExam("") },
    { name: "Moons", func: () => setExam("exam_1") },
    { name: "circles", func: () => setExam("exam_2") }
  ];

  useEffect(()=>{

    if (exam == ""){
      setPoints([])
    }

    else if (exam == "exam_1"){
      setPoints(exam_1)
    }
    
    else if (exam == "exam_2"){
      setPoints(exam_2)
    }

  },[exam])

  

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

          <LHS buttonsList={[btndm]} heading="DBSCAN" parameters={["Example Dataset"]} />

        <div className="mb-5 w-[80%]">

          <TextField id="filled-K" label="ε (Epsilon)" type="number" inputProps={{ step: "0.2" }} variant="standard" className="w-full" value={eps}
          onChange={(e) => setEps(Number(e.target.value))}  /> 

        </div>

        <div className="mb-7 w-[80%]">

          <TextField id="filled-basic" label="K (Number of Neighbour)" type="number" variant="standard" className="w-full" value={K}
          onChange={(e) => setK(Number(e.target.value))}  />

        </div>

        <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setValue(!value)}>Classify The Points</Button>
        <div className="mt-2">
          <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>  
        </div>

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "K (Number of Neighbour)", value: K.toString(), num: 2 },
              { label: "ε (Epsilon)", value: eps.toString(), num: 2 }
            ],
            [{ label: "Core Points", value: core.toString(), num: 4 },
            { label: "Boundary Points", value: boundary.toString(), num: 4 },
            { label: "Outlier Points", value: outlier.toString(), num: 4 },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4 },
            ]]
          }
          />


        </div>
        <h1 className="mt-2 italic">Click Anywhere To Place Points</h1>
        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <DBSCAN core={setCore} boundary = {setBoundary} outlier={setOutlier} silh = {setSilhouette} clearTrigger={clearTrigger} eps = {eps} k = {K} flag = {value}
          pointex = {points}/>


        </div>

      </div>

    </div>
  );
}
