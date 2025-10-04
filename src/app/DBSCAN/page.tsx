"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import DBSCAN from "@/components/DBSCAN";
import Explanation from "@/components/Explanation"
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
  const [expl_dbscan,setexpl_dbscan]=useState(false)
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

  
  console.log(expl_dbscan)
  return (
    <div className="flex flex-grow flex-col lg:flex-row">
      <div className={`bg-[#FFFFFF] h-auto lg:h-[87vh] border-r-0 lg:border-r-2 border-b-2 lg:border-b-0 border-[#E9EAEB] flex flex-col items-center ${expl_dbscan?'lg:basis-[40%]':'lg:basis-[22.5%]'} w-full lg:w-auto`}>
          {expl_dbscan? (
            <div className="grow overflow-y-auto bg-transparent bg-opacity-0 w-full">
              <Explanation model={"DBSCAN"} onExplainClick={setexpl_dbscan}/>
              </div>
          ):(
            <>
              <LHS buttonsList={[btndm]} heading="DBSCAN" parameters={["Example Dataset"]} />

              <div className="mb-4 sm:mb-5 w-full max-w-sm px-2">

                <TextField id="filled-K" label="ε (Epsilon)" type="number" inputProps={{ step: "0.2" }} variant="standard" className="w-full" value={eps}
                onChange={(e) => setEps(Number(e.target.value))}  />

              </div>

              <div className="mb-4 sm:mb-7 w-full max-w-sm px-2">

                <TextField id="filled-basic" label="K (Number of Neighbour)" type="number" variant="standard" className="w-full" value={K}
                onChange={(e) => setK(Number(e.target.value))}  />

              </div>

              <div className="w-full max-w-sm px-2 mb-3">
                <Button variant="contained" className="py-3 sm:py-5 w-full text-sm sm:text-base" color="inherit" onClick={(e)=>setValue(!value)}>Classify The Points</Button>
              </div>
              <div className="w-full max-w-sm px-2 mb-3">
                <Button variant="contained" className="py-3 sm:py-5 w-full text-sm sm:text-base" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>
              </div>

              <Link model={"DBSCAN"} onExplainClick={setexpl_dbscan}/>
            </>
      )}

      </div>
      <div className={`${expl_dbscan?'lg:basis-[60%]':'lg:basis-[77.5%]'} bg-[#FAFAFA] flex flex-col p-3 sm:p-5 lg:px-9 items-center overflow-y-auto h-auto lg:h-[87vh] w-full`}>
      
        <div className="w-full max-w-4xl mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 sm:p-4">
          <AttributeList AttributeInfo={
            [[{ label: "K- Number of Neighbour", value: K.toString(), num: 3, basis: 'basis-[40%]' },
              { label: "ε- Max distance between 2 neighbouring pts", value: eps.toString(), num: 3, basis: 'basis-[40%]' }
            ],
            [{ label: "Core Points", value: core.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "Boundary Points", value: boundary.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "Outliers (Gray)", value: outlier.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4, basis: 'basis-[20%]' },
            ]]
          }
          />
        </div>
        <div className="text-center px-4">
          <h1 className="mt-2 sm:mt-3 italic text-sm sm:text-base">Click anywhere on the graph to place the points.</h1>
          <h1 className="mt-1 sm:mt-2 italic text-sm sm:text-base">The different colours represent the clusters whereas the grey points represent the outliers.</h1>
        </div>
        <div className="flex flex-col lg:flex-row w-full h-full mt-3 gap-4 lg:gap-0 lg:justify-between">
          <div className="w-full lg:w-auto">
            <DBSCAN
              core={setCore}
              boundary={setBoundary}
              outlier={setOutlier}
              silh={setSilhouette}
              clearTrigger={clearTrigger}
              eps={eps}
              k={K}
              flag={value}
              pointex={points}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
