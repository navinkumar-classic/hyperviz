"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import Kmeans from '@/components/Kmeans'
import TextField from '@mui/material/TextField';
import BasicLineChart from "@/components/basicLineGraph";
import { cluster_1, cluster_2 } from "@/components/data";
import CustomLabel from "@/components/CustomLabel";
import Explanation from "@/components/Explanation";

const exam_1 = cluster_1
const exam_2 = cluster_2
type Point = { x: number; y: number };


export default function KNN() {
  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [init, setInit] = useState<string>('None');
  const [K, setK] = useState<number>(1);
  const [maxI, setMaxI] = useState<number>(10);
  const [acc, setAcc] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [arr, setArr] = useState<number[]>([1, 2, 3, 4, 5, 6, 8, 9, 10]);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [points, setPoints] = useState<Point[]>([])
  const [exam, setExam] = useState<string>("")
  const [explain,setexplain]=useState(false)

  const btndb = [
    { name: "None", func: () => setExam("") },
    { name: "circles", func: () => setExam("exam_2") }
  ];

  const btndm = [
    { name: "None", func: () => setInit("None") },
    { name: "Kmeans++", func: () => setInit("Kmeans++") },
  ];

  useEffect(() => {

    if (exam == "") {
      setPoints([])
    }

    else if (exam == "exam_2") {
      setPoints(exam_2)
    }

    setAcc([0, 0, 0, 0, 0, 0, 0, 0, 0])

  }, [exam])

  /*
  useEffect(()=>{

    const arr = [];
    setArr([])
    setAcc([])
    for (let i = 1; i <= 10; i++) {
      arr.push(i);
      acc.push(0);
    }
    setArr(arr)
    setAcc(acc)

  },[])
  */

  useEffect(() => {
    const newAcc = [...acc];
    newAcc[K - 1] = core;
    setAcc(newAcc);
  }, [core]);

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] h-[87vh] md:border-r-2 border-b-2 border-[#E9EAEB] flex flex-col items-center ${explain?'basis-[40%]':'basis-[22.5%]'} overflow-y-auto`}>

        {explain? (
              <Explanation model={"KMeans"} onExplainClick={setexplain}/>
        ):(
            <>
              <LHS buttonsList={[btndb,btndm]} heading="K Means" parameters={["Dataset","Initialization"]} description={['Predefined Datasets', ' Determines starting centroids. Poor initialization can lead to bad convergence; k-means++ reduces that risk by spreading centroids.']} />

              <div className="mb-7 w-[80%]">

                <TextField id="filled-basic" label={<CustomLabel label={"K Value"} definition={'Sets the number of clusters. A small K can merge distinct groups, while a large K may over-segment. The optimal K balances compactness and separation.'} />} type="number" variant="standard" className="w-full" value={K}
                           onChange={(e) => setK(Number(e.target.value))} />

              </div>

              <div className="mb-7 w-[80%]">

                <TextField id="filled-basic" label={<CustomLabel label={"Max Iteration"} definition={'Defines how many times the algorithm updates the centroids; if set too low, it may stop before converging, while too high may lead to unnecessary computation.'} />} type="number" variant="standard" className="w-full" value={maxI}
                           onChange={(e) => setMaxI(Number(e.target.value))} />

              </div>

              <Button variant="contained" className="py-5" color="inherit" onClick={(e) => setValue(!value)}>Classify The Points</Button>
              <div className="mt-5">
                <Button variant="contained" className="py-5" color="inherit" onClick={(e) => setClearTrigger(!clearTrigger)}>Clear The Graph</Button>
              </div>

              <Link model={"KMeans"} onExplainClick={setexplain}/>
            </>
        )}

      </div>
      <div className={`${explain?'basis-[60%]':'basis-[77.5%]'} bg-[#FAFAFA] flex flex-col p-5 px-6 items-center overflow-y-auto h-[87vh]`}>

        <div className="md:w-[80%] w-[100%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "K Value", value: K.toString(), num: 2, basis: 'basis-[40%]', description: 'Sets the number of clusters. A small K can merge distinct groups, while a large K may over-segment. The optimal K balances compactness and separation.'},
            { label: "Initialization", value: init.toString(), num: 2, basis: 'basis-[40%]', description: 'Determines starting centroids. Poor initialization can lead to bad convergence; k-means++ reduces that risk by spreading centroids.' }
            ],
            [{ label: "WCSS", value: core.toString(), num: 4, basis: 'basis-[20%]', description: 'Within-Cluster Sum of Squares measures compactness of clusters. Lower WCSS indicates tighter clusters but always decreases with higher K.' },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4, basis: 'basis-[20%]', description: 'Quantifies how well a point fits in its cluster compared to others. Higher values (closer to 1) mean better-defined clusters.' },
            ]]
          }
          />


        </div>
        <h1 className="mt-5 italic">Click Anywhere To Place Points</h1>
        <div className={`flex md:${explain ? 'flex-col':'flex-row'} flex-col w-full mt-5 justify-between`}>

          <Kmeans core={setCore} silh={setSilhouette} init={init} maxI={maxI} k={K} flag={value} clearTrigger={clearTrigger}
          pointex = {points} />

          <BasicLineChart x={arr} y={acc} mark={K - 1} label={'Elbow Graph'} />


        </div>

      </div>

    </div>
  );
}

