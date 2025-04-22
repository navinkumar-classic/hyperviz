"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import LinearRegression from "@/components/linearRegression";
import TextField from '@mui/material/TextField';


export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [r2, setR2] = useState<number>(1);
  const [rmse, setRmse] = useState<number>(0);
  const [mae, setMae] = useState<number>(0);
  const [regularisation, setRegularisation] = useState<string>("None");
  const [lambda, setLambda] = useState<number>(1);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);

  const btndm = [
    { name: "None", func: () => setRegularisation("None") },
    { name: "Ridge", func: () => setRegularisation("Ridge") },
    {name: "Polynomial", func: () => setRegularisation("Polynomial") }
  ];

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

        <LHS buttonsList={[btndm]} heading="Linear Regression" parameters={["Type of Regression"]} />

        <TextField id="filled-basic" label="Ridge - λ" variant="standard" className="w-[80%]" value={lambda}
        onChange={(e) => setLambda(Number(e.target.value))} type="number" inputProps={{ step: "any" }} />

        <div className="mt-3">
          <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>  
        </div>

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Loss Function", value: regularisation, num: 2 }],
            [{ label: "R² Score", value: r2.toString(), num: 3 },
            { label: "RMSE", value: rmse.toString(), num: 3 },
            { label: "MAE", value: mae.toString(), num: 3 }]]
          }
          />


        </div>
        <h1 className="mt-2 italic">Click Anywhere To Place Points</h1>
        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <LinearRegression r2func={setR2} rmsefunc = {setRmse} maefunc = {setMae} clearTrigger = {clearTrigger} reg = {regularisation} lambda = {lambda} 
          />


        </div>

      </div>

    </div>
  );
}
