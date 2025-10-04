"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import LinearRegression from "@/components/linearRegression";
import TextField from '@mui/material/TextField';
import Explanation from "@/components/Explanation";


export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [r2, setR2] = useState<number>(1);
  const [rmse, setRmse] = useState<number>(0);
  const [mae, setMae] = useState<number>(0);
  const [regularisation, setRegularisation] = useState<string>("None");
  const [lambda, setLambda] = useState<number>(1);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [expl_linear,setexpl_linear]=useState(false)

  const btndm = [
    { name: "None", func: () => setRegularisation("None") },
    { name: "Ridge", func: () => setRegularisation("Ridge") },
    {name: "Polynomial", func: () => setRegularisation("Polynomial") }
  ];

  return (
    <div className="flex flex-grow flex-col lg:flex-row">
      <div className={`bg-[#FFFFFF] h-auto lg:h-[87vh] border-r-0 lg:border-r-2 border-b-2 lg:border-b-0 border-[#E9EAEB] flex flex-col items-center ${expl_linear?'lg:basis-[40%]':'lg:basis-[22.5%]'} w-full lg:w-auto`}>
        {expl_linear?(
          <div className="grow overflow-y-auto bg-transparent bg-opacity-0 w-full">
              <Explanation model={"Linear and Polynomial Regression"} onExplainClick={setexpl_linear}/>
              </div>
        ):(
        <>
        <LHS buttonsList={[btndm]} heading="Linear Regression" parameters={["Type of Regression"]} />

        <div className="w-full max-w-sm px-2 mb-4">
          <TextField id="filled-basic" label="λ parameter for Ridge Regression" variant="standard" className="w-full" value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))} type="number" inputProps={{ step: "any" }} />
        </div>

        <div className="w-full max-w-sm px-2 mb-3">
          <Button variant="contained" className="py-3 sm:py-5 w-full text-sm sm:text-base" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>  
        </div>

        <Link model={"Linear"} onExplainClick={setexpl_linear}/>
      </>
        )}

      </div>
      <div className="lg:basis-[77.5%] bg-[#FAFAFA] flex flex-col p-3 sm:p-5 lg:px-9 items-center overflow-y-auto h-auto lg:h-[87vh] w-full">
      
        <div className="w-full max-w-4xl mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 sm:p-4">
          <AttributeList AttributeInfo={
            [[{ label: "Type of Regression", value: regularisation, num: 2, basis: 'basis-[40%]' }],
            [{ label: "R² Score", value: r2.toString(), num: 3, basis: 'basis-[30%]' },
            { label: "RMSE", value: rmse.toString(), num: 3, basis: 'basis-[30%]' },
            { label: "MAE", value: mae.toString(), num: 3, basis: 'basis-[30%]' }]]
          }
          />
        </div>
        <h1 className="mt-2 sm:mt-3 italic text-sm sm:text-base text-center px-4">Simulate line fitting in linear regression by placing points anywhere on the graph</h1>
        <div className="flex flex-col lg:flex-row w-full mt-3 gap-4 lg:gap-0 lg:justify-between">

          <div className="w-full lg:w-auto">
            <LinearRegression r2func={setR2} rmsefunc = {setRmse} maefunc = {setMae} clearTrigger = {clearTrigger} reg = {regularisation} lambda = {lambda} />
          </div>

        </div>

      </div>

    </div>
  );
}
