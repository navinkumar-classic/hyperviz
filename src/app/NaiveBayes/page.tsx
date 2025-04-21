"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import ProbabilityTable from "@/components/NaiveTable";
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import { predictNaiveBayesClass } from "@/components/Naive/makePrediction";
import PredictionResultDisplay from "@/components/Naive/result";


export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [r2, setR2] = useState<number>(1);
  const [rmse, setRmse] = useState<number>(0);
  const [mae, setMae] = useState<number>(0);
  const [laplaceSmoothing, setLaplaceSmoothing] = useState<string>("None");
  const [K, setK] = useState<number>(1);
  const [features, setFeatures] = useState<string[]|null>(null)
  const [input, setInput] = useState<string[]|null>(null)
  const [result, setResult] = useState<any>(null)

  const btndm = [
    { name: "None", func: () => setLaplaceSmoothing("None") },
    { name: "1-Laplace Smoothing", func: () => setLaplaceSmoothing("1") },
    { name: "K-Laplace Smoothing", func: () => setLaplaceSmoothing("K") },
  ];

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  type ProbTable = Record<string, Record<string, Record<string, number>>>; //

  const [probabilities, setProbabilities] = useState<ProbTable | null>(null); //mark
  const [priors, setPriors] = useState<Record<string, number> | null>(null);
  const [data,setData] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const dat = results.data;
        setFeatures(Object.keys(dat[0]).slice(0,-1))
        const lst = []

        for (const i in features){
          lst.push("")  
        }
        setInput(lst)
        setData(dat)
        
        if (laplaceSmoothing == "None") {
          calculateProbabilitiesLaplace(dat, 0)
        }
  
        else if (laplaceSmoothing == "1") {
          calculateProbabilitiesLaplace(dat, 1)
        }
  
        else {
          calculateProbabilitiesLaplace(dat, K)
        }
      },
    });
  };

  const calculateProbabilitiesLaplace = (data: any[], k: number = 1) => {
    const labelKey = Object.keys(data[0]).pop()!;
    const labels = data.map((row) => row[labelKey]);
  
    const labelCounts: Record<string, number> = {};
    labels.forEach((label) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  
    const total = labels.length;
    const priors: Record<string, number> = {};
    for (const label in labelCounts) {
      priors[label] = labelCounts[label] / total;
    }
    setPriors(priors);
  
    // Likelihoods
    const features = Object.keys(data[0]).filter((k) => k !== labelKey);
    const probs: ProbTable = {};
  
    features.forEach((feature) => {
      probs[feature] = {};
  
      // Count feature value per class
      const valueSet = new Set<string>();
      const valueCountsPerClass: Record<string, Record<string, number>> = {};
  
      data.forEach((row) => {
        const value = row[feature];
        const label = row[labelKey];
        valueSet.add(value);
  
        if (!valueCountsPerClass[value]) {
          valueCountsPerClass[value] = {};
        }
        if (!valueCountsPerClass[value][label]) {
          valueCountsPerClass[value][label] = 0;
        }
        valueCountsPerClass[value][label]++;
      });
  
      const allValues = Array.from(valueSet);
      const numValues = allValues.length;
  
      // Laplace smoothed probability
      allValues.forEach((value) => {
        probs[feature][value] = {};
  
        for (const label in labelCounts) {
          const count = valueCountsPerClass[value]?.[label] || 0;
          probs[feature][value][label] = (count + k) / (labelCounts[label] + k * numValues);
        }
      });
    });
  
    setProbabilities(probs);
  };

  const handleInputModel = (e: any, index: number) => {
    if (input != null){
      const newInput = [...input];
      newInput[index] = e.target.value;
      setInput(newInput);  
    }
  };

  useEffect(() => {

    if (data != null) {
      if (laplaceSmoothing == "None") {
        calculateProbabilitiesLaplace(data, 0)
      }

      else if (laplaceSmoothing == "1") {
        calculateProbabilitiesLaplace(data, 1)
      }

      else {
        calculateProbabilitiesLaplace(data, K)
      }
    }
    
  },[laplaceSmoothing,K])

  const calculateResult = () => {

    if (features != null && input != null){
      const inlist:any = {}
      for (let i = 0; i < features.length; i++ ){
        inlist[features[i]] = input[i]
      }

      console.log('HMM: ' + inlist)


      if (probabilities != null && priors != null){

        let result
        if (laplaceSmoothing == 'None'){
          result = predictNaiveBayesClass(inlist, probabilities, priors,0);
        }
        else if (laplaceSmoothing == '1-Laplace Smoothing'){
          result = predictNaiveBayesClass(inlist, probabilities, priors,1);
        }
        else{
          result = predictNaiveBayesClass(inlist, probabilities, priors,K);
        }
        

        setResult(result)

        console.log("Predicted Class:", result.predictedClass);
        console.log("Class Probabilities:", result.classProbabilities);   
        console.log("Each Class Probabilities:", result.featureProbabilities); 
      }
    }
  }

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center overflow-y-auto h-[87vh]">

        <LHS buttonsList={[btndm]} heading="Naive Bayes Classifier" parameters={["Laplace Smoothing"]} />

        <div className="mb-5 w-[80%]">

          <TextField id="filled-basic" label="K (smoothing Factor)" variant="standard" className="w-full mb-5" value={K}
          onChange={(e) => setK(Number(e.target.value))} type="number" inputProps={{ step: "any" }} />

        </div>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileUpload}
          />
        </Button>

        {features && input && (
          <div className="w-[100%] mt-3 flex flex-col items-center">
            {
              features?.map((value,index) => (
                <div id={`f-${value}`} key={`feature-${index}`}className="mb-4">
                  <TextField id={`f-${value}`} label={value[0].toUpperCase()+value.slice(1,)} variant="filled" className="w-full mb-5" 
                  value = {input[index]} onChange={(e)=>{handleInputModel(e,index)}}/>
                </div>
              ))
            }

            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onClick = {(e)=>calculateResult()}
              className="mx-auto"
            >
              Classify
            </Button>
          </div>
        )}

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">

        {
          priors && probabilities && (
            <ProbabilityTable priors={priors} probabilities={probabilities}/>
          )
        }

        {
          priors && probabilities && result && input && (
            <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">

              <h1 className="text-2xl font-bold mb-2 italic center">Prediction Result</h1>

              <PredictionResultDisplay result={result} input={input} />

            </div>
          )
        }

      </div>

    </div>
  );
}
