

"use client";

import Image from "next/image";
import { Slider } from "@mui/material";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import ImageDisplay from "@/components/imageDisplay"
import LineGraph from "@/components/lineGraph";
import BasicLineChart from "@/components/basicLineGraph";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import { IconButton } from "@mui/material";
import { PlayCircleFilled, PauseCircle, SkipNext, SkipPrevious } from "@mui/icons-material";
import Papa from "papaparse";
import Explanation from "@/components/Explanation";

const imageInfo = { width: 420, height: 420, heading: "Decision Boundary", alt: "K Value" };
interface CsvRow {
  Epochs: string;
  Loss: string;
  F1: string;
}

type DataDictionary = Record<string, CsvRow>;

const HIGH = 299;
const LOW = 1;

export default function KNN() {
  const [value, setValue] = useState<number>(LOW);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [learningRate, setLearningRate] = useState<string>("0.1");
  const [activation, setActivation] = useState<string>("ReLU");
  const [hidden, setHidden] = useState<string>("(10-10)");
  const [dataDict, setDataDict] = useState<DataDictionary>({});
  const [acc, setAcc] = useState<number[]>([]);
  const [arr, setArr] = useState<number[]>([]);
  const [expl_nn,setexpl_nn]=useState(false)

  const btndm = [
    { name: "0.1", func: () => setLearningRate("0.1") },
    { name: "0.01", func: () => setLearningRate("0.01") },
    { name: "1", func: () => setLearningRate("1") }
  ];

  const btnwf = [
    { name: "ReLU", func: () => setActivation("ReLU") },
    { name: "TanH", func: () => setActivation("TanH") }
  ];

  const btnhd = [
    { name: "(10, 10)", func: () => setHidden("(10-10)") },
    { name: "(10, 2)", func: () => setHidden("(10-2)") }
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    for (let i = LOW; i <= HIGH; i++) {
      //change this for new model
      const imgSrc = `/MLP/mlp_${activation.toLowerCase()}_${learningRate.toLowerCase()}_${hidden}/frame_${i}.png`;
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc;

        if (Object.keys(cache).length === HIGH - LOW + 1) {
          setImageCache(cache)
        }
      };
    }
  }, [learningRate, activation, hidden]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/MLP_acc/mlp_acc_${activation.toLowerCase()}_${learningRate.toLowerCase()}_${hidden.toLowerCase()}.csv`);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true, 
          skipEmptyLines: true,
          complete: (result) => {
            const dataObject: DataDictionary = {};
            (result.data as CsvRow[]).forEach((row) => {
              dataObject[row.Epochs] = row;
            });
            setDataDict(dataObject);
          },
        });

      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
    console.log(dataDict)
  }, [learningRate, activation, hidden]);

  useEffect(() => {
    const list: number[] = []
    for (let i = LOW; i <= HIGH; i++) {
      list.push(i);
    }
    setArr(list)

    const acc_list: number[] = []
    for (let i = LOW; i <= HIGH; i++) {
      acc_list.push(parseFloat(dataDict[i.toString()]?.Loss));
      console.log(dataDict[i.toString()]?.Loss)
    }

    console.log(acc_list)
    setAcc(acc_list)
  }, [dataDict])

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setValue((prev) => (prev < HIGH ? prev + 1 : LOW));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const skipNext = () => {
    if (value == HIGH) setValue(LOW);
    else setValue(value + 1);
  }

  const skipPrevious = () => {
    if (value == LOW) setValue(HIGH);
    else setValue(value - 1);
  }

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] h-[87vh] border-r-2 border-[#E9EAEB] flex flex-col items-center  ${expl_nn?'basis-[40%]':'basis-[22.5%]'}`}>
        {expl_nn?(
          <div className="grow overflow-y-auto bg-transparent bg-opacity-0">
              <Explanation model={"Multi Layer Perceptron"} onExplainClick={setexpl_nn}/>
              </div>
        ):(
          <>
        <LHS buttonsList={[btndm, btnwf, btnhd]} heading="Neural Network" parameters={["Learning Rate", "Activation Function", "Hidden Layer"]} />
        <Link model={"NN"} onExplainClick={setexpl_nn}/>
        </>
        )}
      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Learning Rate", value: learningRate, num: 2, basis: 'basis-[40%]' },
            { label: "Activation Function", value: activation, num: 2, basis: 'basis-[40%]' }],
            [{ label: "Epoch", value: value.toString(), num: 3, basis: 'basis-[30%]' },
            { label: "Test Loss", value: Number(dataDict[value.toString()]?.Loss).toString(), num: 3, basis: 'basis-[30%]' },
            { label: "F1 Score", value: Number(dataDict[value.toString()]?.F1).toString(), num: 3, basis: 'basis-[30%]' }]]
          }
          />

          <Slider
            value={value}
            onChange={(_, newValue) => setValue(newValue as number)}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={LOW}
            max={HIGH}
          />

          <div className="flex">

            <IconButton onClick={() => skipPrevious()} color="primary">
              <SkipPrevious sx={{ fontSize: 50 }} />
            </IconButton>

            <IconButton onClick={() => setIsPlaying(!isPlaying)} color="primary">
              {isPlaying ? <PauseCircle sx={{ fontSize: 50 }} /> : <PlayCircleFilled sx={{ fontSize: 50 }} />}
            </IconButton>

            <IconButton onClick={() => skipNext()} color="primary">
              <SkipNext sx={{ fontSize: 50 }} />
            </IconButton>

          </div>


        </div>

        <div className="flex md:flex-row flex-col w-full mt-3 justify-between">

          <ImageDisplay image={imageInfo} source={imageCache[value]} />

          <BasicLineChart x={arr} y={acc} mark={value} label = {'Test Loss'} />

        </div>

      </div>

    </div>
  );
}
