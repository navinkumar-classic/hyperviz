
"use client";
declare module 'd3-graphviz' {
  export const graphviz: any;
}
import Image from "next/image";
import { useEffect } from "react";
import { Button, ButtonGroup} from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import DBSCAN from "@/components/DBSCAN";
import TextField from '@mui/material/TextField';
import { clear } from "console";
import { cluster_1, cluster_2 } from "@/components/data";
import { Box, InputLabel, FormControl, NativeSelect, Select, MenuItem } from '@mui/material';

import { SetStateAction, useState } from "react";
import * as d3 from "d3";
import { graphviz } from "d3-graphviz";
declare module 'd3-graphviz';

export default function DecisionTreeForm() {
  const [maxDepth, setMaxDepth] = useState(3);
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [criterion, setCriterion] = useState("gini");
  const [result, setResult] = useState<null | {
    accuracy: number;
    dot_data?: string | string[][];
    prediction?: string;
  }>(null);
  const [svg, setSvg] = useState<string>("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [cholesterol, setCholesterol] = useState("");
  const [bp, setBp] = useState("");
  const [naToK, setNaToK] = useState("");
  const [prediction, setPrediction] = useState(null);

  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [boundary, setBoundary] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [outlier, setOutlier] = useState<number>(0);
  const [eps, setEps] = useState<number>(1);
  const [K, setK] = useState<number>(3);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [points, setPoints] = useState<Point[]>([])
  const [exam, setExam] = useState<string>("")

  const btndm = [
    { name: "None", func: () => setExam("") },
    { name: "Moons", func: () => setExam("exam_1") },
    { name: "circles", func: () => setExam("exam_2") }
  ];



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/train", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_depth: maxDepth,
        min_samples_split: minSamplesSplit,
        criterion: criterion,
      }),
    });
    console.log(res)
    if (res.ok) {
      const data = await res.json();
      setResult(data);
      const graph = graphviz("#graph");

      // Handle array of frames (animation)
      if (Array.isArray(data.dot_data)) {
        const dotFrames = data.dot_data.map((lines: string[]) =>
          Array.isArray(lines) ? lines.join("") : lines
        );

        let index = 0;

        const renderStep = () => {
          if (index >= dotFrames.length) return;

          graph
            .transition(() =>
              d3.transition().duration(800).ease(d3.easeLinear)
            )
            .renderDot(dotFrames[index])
            .on("end", () => {
              index++;
              setTimeout(renderStep, 700);
            });
        };

        // Only initialize once
        graph.on("initEnd", renderStep);
      }

      // Handle single static dot string
      else if (typeof data.dot_data === "string") {
        graph.renderDot(data.dot_data);
      }

    } else {
      console.error("Failed to fetch");
    }
  };

  const handlePrediction = async (e: any) => {
    e.preventDefault();

    // Send the input data for prediction
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Age: Number(age),
          Sex: sex === "M" ? 0 : 1, // Convert 'M' to 0 and 'F' to 1
          BP: bp === "LOW" ? 0 : bp === "NORMAL" ? 1 : 2, // Convert BP to 0, 1, or 2
          Cholesterol: cholesterol === "LOW" ? 0 : cholesterol === "NORMAL" ? 1 : 2, // Encode Cholesterol
          Na_to_K: Number(naToK),
        }),
      });

      const prediction = await response.json();
      console.log("Received JSON:", prediction)
      setResult((prevResult) => ({
        ...prevResult,
        prediction: prediction.prediction,
      }));
    } catch (error) {
      console.error("Error making the prediction:", error);
    }
  };


  return (




    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center overflow-y-auto h-[87vh]">

      <div className="w-[80%] rounded-tr-2xl rounded-bl-2xl bg-white my-4 py-4 flex flex-col items-center text-black px-4 border-t-3 border-t-[#E9EAEB] border-b-3 border-b-[#E9EAEB]">
                <div className="text-xl font-semibold text-center mb-2 pl-2">Decision Tree</div>
                <div className="text-md font-light italic text-center pb-2">Choose Your HyperParameter</div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col w-full items-center">

              <div className="mb-5 w-[80%]">

                <TextField id="filled-mdepth" label="Max Depth" type="number" variant="standard" className="w-full" value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value))} />

              </div>

              <div className="mb-5 w-[80%]">

                <TextField id="filled-minsample" label="Min Samples Split" type="number" variant="standard" className="w-full" value={minSamplesSplit}
                  onChange={(e) => setMinSamplesSplit(Number(e.target.value))} />

              </div>

              <div className="mb-5 w-[80%]">
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="Criterion">Criterion</InputLabel>
                    <Select
                      labelId="Criterion"
                      id="Criterion"
                      onChange={(e) => setCriterion(e.target.value)}
                      value={criterion}
                    >
                      <MenuItem value={'gini'}>Gini</MenuItem>
                      <MenuItem value={'entropy'}>Entropy</MenuItem>

                    </Select>
                  </FormControl> 
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Train Model
              </button>
            </form>
            {/* Prediction Form */}
              <form onSubmit={handlePrediction} className="flex flex-col w-full items-center">

                <div className="mb-5 w-[80%]">

                  <TextField id="filled-age" label="Age" type="number" inputProps={{ step: "any" }} variant="standard" className="w-full" value={age}
                  onChange={(e) => setAge(e.target.value)} />

                </div>


                <div className="mb-5 w-[80%]">
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="sex">Sex</InputLabel>
                    <Select
                      labelId="sex"
                      id="sex"
                      onChange={(e) => setSex(e.target.value)}
                      value={sex}
                    >
                      <MenuItem value={'M'}>Male</MenuItem>
                      <MenuItem value={'F'}>Female</MenuItem>

                    </Select>
                  </FormControl> 
                </div>


                <div className="mb-5 w-[80%]">
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="chol">Cholesterol</InputLabel>
                    <Select
                      labelId="chol"
                      id="chol"
                      onChange={(e) => setCholesterol(e.target.value)}
                      value={cholesterol}
                    >
                      <MenuItem value={'HIGH'}>High</MenuItem>
                      <MenuItem value={'LOW'}>Low</MenuItem>
                      <MenuItem value={'NORMAL'}>Normal</MenuItem>

                    </Select>
                  </FormControl> 
                </div>

                <div className="mb-5 w-[80%]">
                  <FormControl fullWidth variant="standard">
                    <InputLabel id="BP">Blood Pressure</InputLabel>
                    <Select
                      labelId="BP"
                      id="BP"
                      onChange={(e) => setBp(e.target.value)}
                      value={bp}
                    >
                      <MenuItem value={'HIGH'}>High</MenuItem>
                      <MenuItem value={'LOW'}>Low</MenuItem>
                      <MenuItem value={'NORMAL'}>Normal</MenuItem>

                    </Select>
                  </FormControl> 
                </div>

                <div className="mb-5 w-[80%]">

                  <TextField id="filled-natok" label="Na_to_K" type="number" inputProps={{ step: "any" }} variant="standard" className="w-full" value={naToK}
                  onChange={(e) => setNaToK(e.target.value)} />

                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-8 py-2 rounded mb-2"
                >
                  Predict
                </button>
              </form>

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">


        <h1 className="font-bold text-2xl mt-2 mb-2">DRUG PREDICTION DATASET</h1>

        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Accuracy", value: result?.accuracy !== undefined ? result.accuracy.toFixed(3).toString(): "N/A", num: 2, basis: 'basis-[40%]' },
            { label: "Prediction", value: result?.prediction !== undefined ? result.prediction : "N/A", num: 2, basis: 'basis-[40%]' }
            ]]
          }
          />


        </div>
        <div className="flex flex-col items-center w-full">

          <h1 className="font-semibold italic text-xl mt-2">Trained Decision Tree</h1>

          <center><div id="graph" className="mt-4 rounded p-4 overflow-x-auto bg-white border-1 border-[#E9EAEB] w-[890px] h-[500px]" /></center>

        </div>

      </div>

    </div>

  );
}
