"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import LinearRegression from "@/components/linearRegression";
import TextField from '@mui/material/TextField';
import CustomLabel from "@/components/CustomLabel";
import Explanation from "@/components/Explanation";


export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [r2, setR2] = useState<number>(1);
  const [rmse, setRmse] = useState<number>(0);
  const [mae, setMae] = useState<number>(0);
  const [regularisation, setRegularisation] = useState<string>("None");
  const [lambda, setLambda] = useState<number>(1);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [explain,setexplain]=useState(false);

  const btndm = [
    { name: "None", func: () => setRegularisation("None") },
    { name: "Ridge", func: () => setRegularisation("Ridge") },
    {name: "Polynomial", func: () => setRegularisation("Polynomial") }
  ];

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] basis-[22.5%] md:border-r-2 border-b-2 border-[#E9EAEB] flex flex-col items-center ${explain?'basis-[40%]':'basis-[22.5%]'}`}>
        {explain? (
            <div className="grow overflow-y-auto bg-transparent bg-opacity-0">
              <Explanation model={"Linear"} onExplainClick={setexplain}/>
            </div>
        ):(
            <>
              <LHS buttonsList={[btndm]} heading="Linear Regression" parameters={["Type of Regression"]} description={['Linear regression fits a straight line, polynomial regression captures curves with higher-degree terms, and ridge regression adds regularization to linear models to prevent overfitting.']} />

              <TextField id="filled-basic"
                         label={<CustomLabel label={"λ parameter for Ridge Regression"} definition={'Controls regularization strength; higher values shrink coefficients to reduce overfitting, but may underfit if too strong.'} />} variant="standard" className="w-[80%]" value={lambda}
                         onChange={(e) => setLambda(Number(e.target.value))} type="number" inputProps={{ step: "any" }} />

              <div className="mt-5">
                <Button variant="contained" className="py-5" color="inherit" onClick={(e)=>setClearTrigger(!clearTrigger)}>Clear The Graph</Button>
              </div>

              <Link model={"Linear"} onExplainClick={setexplain}/>
            </>
        )}

      </div>
      <div className={`${explain?'basis-[60%]':'basis-[77.5%]'} bg-[#FAFAFA] flex flex-col p-5 md:px-9 px-4 items-center overflow-y-auto h-[87vh]`}>
      
        <div className="md:w-[80%] w-[100%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg md:p-4 p-2">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Type of Regression", value: regularisation, num: 2, basis: 'basis-[40%]', description: 'Linear regression fits a straight line, polynomial regression captures curves with higher-degree terms, and ridge regression adds regularization to linear models to prevent overfitting.' }],
            [{ label: "R² Score", value: r2.toString(), num: 3, basis: 'basis-[30%]', description: 'Indicates how much variance in the target is explained by the model; values closer to 1 mean better fit.' },
            { label: "RMSE", value: rmse.toString(), num: 3, basis: 'basis-[30%]', description: 'Root Mean Squared Error penalizes larger errors more than MAE; useful when large deviations are especially undesirable.' },
            { label: "MAE", value: mae.toString(), num: 3, basis: 'basis-[30%]', description: 'Mean Absolute Error measures average absolute difference between predictions and actual values; easier to interpret, but less sensitive to large errors.' }]]
          }
          />


        </div>
        <h1 className="mt-2 italic text-center">Simulate line fitting in linear regression by placing points anywhere on the graph</h1>
        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <LinearRegression r2func={setR2} rmsefunc = {setRmse} maefunc = {setMae} clearTrigger = {clearTrigger} reg = {regularisation} lambda = {lambda} 
          />


        </div>

      </div>

    </div>
  );
}
