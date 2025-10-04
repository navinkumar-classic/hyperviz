"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import Kmeans from '@/components/Kmeans'
import TextField from '@mui/material/TextField';
import BasicLineChart from "@/components/basicLineGraph";
import { cluster_1, cluster_2 } from "@/components/data";
import Explanation from "@/components/Explanation"

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
  const [expl_kmeans,setexpl_kmeans]=useState(false)

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
    <div className="flex flex-grow flex-col lg:flex-row">
      <div className={`bg-[#FFFFFF] h-auto lg:h-[87vh] border-r-0 lg:border-r-2 border-b-2 lg:border-b-0 border-[#E9EAEB] flex flex-col items-center ${expl_kmeans?'lg:basis-[40%]':'lg:basis-[22.5%]'} w-full lg:w-auto`}>
        {expl_kmeans? (
                    <div className="grow overflow-y-auto bg-transparent bg-opacity-0 w-full">
                      <Explanation model={"KMeans"} onExplainClick={setexpl_kmeans}/>
                      </div>
                  ):(
                    <>
        <LHS buttonsList={[btndb,btndm]} heading="K Means" parameters={["Dataset","Initialization"]} />

        <div className="mb-4 sm:mb-7 w-full max-w-sm px-2">

          <TextField id="filled-basic" label="K Value" type="number" variant="standard" className="w-full" value={K}
            onChange={(e) => setK(Number(e.target.value))} />

        </div>

        <div className="mb-4 sm:mb-7 w-full max-w-sm px-2">

          <TextField id="filled-basic" label="Max Iteration" type="number" variant="standard" className="w-full" value={maxI}
            onChange={(e) => setMaxI(Number(e.target.value))} />

        </div>

        <div className="w-full max-w-sm px-2 mb-3">
          <Button variant="contained" className="py-3 sm:py-5 w-full text-sm sm:text-base" color="inherit" onClick={(e) => setValue(!value)}>Classify The Points</Button>
        </div>
        <div className="w-full max-w-sm px-2 mb-3">
          <Button variant="contained" className="py-3 sm:py-5 w-full text-sm sm:text-base" color="inherit" onClick={(e) => setClearTrigger(!clearTrigger)}>Clear The Graph</Button>
        </div>

        <Link model={"KMeans"} onExplainClick={setexpl_kmeans}/>
        </>
        )}

      </div>
      <div className="lg:basis-[77.5%] bg-[#FAFAFA] flex flex-col p-3 sm:p-5 lg:px-6 items-center overflow-y-auto h-auto lg:h-[87vh] w-full">

        <div className="w-full max-w-4xl mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 sm:p-4">
          <AttributeList AttributeInfo={
            [[{ label: "K Value", value: K.toString(), num: 2, basis: 'basis-[40%]' },
            { label: "Initialization", value: init.toString(), num: 2, basis: 'basis-[40%]' }
            ],
            [{ label: "WCSS", value: core.toString(), num: 4, basis: 'basis-[20%]' },
            { label: "Silhouette Score", value: silhouette.toString(), num: 4, basis: 'basis-[20%]' },
            ]]
          }
          />
        </div>
        <h1 className="mt-3 sm:mt-5 italic text-sm sm:text-base text-center">Click Anywhere To Place Points</h1>
        <div className="flex flex-col lg:flex-row w-full mt-3 sm:mt-5 gap-4 lg:gap-0 lg:justify-between">

          <div className="w-full lg:w-auto">
            <Kmeans core={setCore} silh={setSilhouette} init={init} maxI={maxI} k={K} flag={value} clearTrigger={clearTrigger}
            pointex = {points} />
          </div>

          <div className="w-full lg:w-auto">
            <BasicLineChart x={arr} y={acc} mark={K - 1} label={'Elbow Graph'} />
          </div>

        </div>

      </div>

    </div>
  );
}

