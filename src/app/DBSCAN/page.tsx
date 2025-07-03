"use client";

import React, { useState, useEffect } from "react";
import {Button, IconButton, Tooltip} from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import DBSCAN from "@/components/DBSCAN";
import Explanation from "@/components/Explanation"
import TextField from '@mui/material/TextField';
import { cluster_1, cluster_2 } from "@/components/data";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomLabel from "@/components/CustomLabel";

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
  const [explain,setexplain]=useState(false)
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

  
  console.log(explain)
  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] h-[87vh] md:border-r-2 border-b-2 border-[#E9EAEB] flex flex-col items-center  ${explain?'basis-[40%]':'basis-[22.5%]'}`}>
          {explain? (
            <div className="grow overflow-y-auto bg-transparent bg-opacity-0">
              <Explanation model={"DBSCAN"} onExplainClick={setexplain}/>
              </div>
          ):(
            <>
              <LHS buttonsList={[btndm]} heading="DBSCAN" parameters={["Example Dataset"]} description={['Predefined Dataset']} />

              <div className="mb-5 w-[80%]">

                <TextField id="filled-K"
                           label={<CustomLabel label={'Epsilon ε'} definition={'Maximum distance between two points to be considered neighbors; controls the size of the neighborhood and influences cluster density.'} />}
                           type="number"
                           inputProps={{ step: "0.2" }}
                           variant="standard"
                           className="w-full" value={eps}
                           onChange={(e) => setEps(Number(e.target.value))}
                />

              </div>

              <div className="mb-7 w-[80%]">

                <TextField id="filled-basic"
                           label={<CustomLabel label={'K (Number of Neighbour)'} definition={'Minimum number of points required in a neighborhood to form a core point; higher values lead to stricter clustering, while lower values may capture noise.'} />}
                           type="number" variant="standard"
                           className="w-full" value={K}
                onChange={(e) => setK(Number(e.target.value))}  />

              </div>

              <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setValue(!value)}>Classify The Points</Button>
              <div className="mt-5">
                <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>
              </div>

              <Link model={"DBSCAN"} onExplainClick={setexplain}/>
            </>
      )}

      </div>
      <div className={`${explain?'basis-[60%]':'basis-[77.5%]'} bg-[#FAFAFA] flex flex-col p-5 md:px-9 px-4 items-center overflow-y-auto h-[87vh]`}>
      
        <div className="w-[100%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg md:p-4 p-2">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "K- Number of Neighbour", value: K.toString(), num: 3, basis: 'basis-[40%]', description: 'Minimum number of points required in a neighborhood to form a core point; higher values lead to stricter clustering, while lower values may capture noise.' },
              { label: "ε- Epsilon", value: eps.toString(), num: 3, basis: 'basis-[40%]', description: 'Maximum distance between two points to be considered neighbors; controls the size of the neighborhood and influences cluster density.' }
            ],
            [{ label: "Core Points", value: core.toString(), num: 4, basis: 'basis-[20%]', description: 'Points that have at least K neighbors within epsilon; they are the centers of dense regions and form the backbone of clusters.' },
            { label: "Boundary Points", value: boundary.toString(), num: 4, basis: 'basis-[20%]', description: 'Points within epsilon of a core point but with fewer than K neighbors themselves; they are attached to clusters but not dense enough to be core points.' },
            { label: "Outliers (Gray)", value: outlier.toString(), num: 4, basis: 'basis-[20%]', description: 'Points that are not reachable from any core point and do not belong to any cluster; treated as noise.' },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4, basis: 'basis-[20%]', description: 'Evaluates how well each point fits within its cluster; can be used for DBSCAN but may be less reliable with non-globular clusters.' },
            ]]
          }
          />


        </div>
        <center><h1 className="mt-2 mx-2 italic">Click anywhere on the graph to place the points.
        </h1></center>
        <center><h1 className="mt-2 mx-2 italic">The different colours represent the
          clusters whereas the grey points represent the outliers.
        </h1></center>
        <div className="flex md:flex-row flex-col w-full h-full mt-3 justify-between">
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
  
  );
}
