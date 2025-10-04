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
  k_value: string;
  accuracy: string;
}

type DataDictionary = Record<string, CsvRow>;

const LOW = 1;
const HIGH = 20;

export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [distanceMetric, setDistanceMetric] = useState<string>("Manhattan");
  const [weigtingFunction, setweigtingFunction] = useState<string>("Uniform");
  const [dataset, setDataset] = useState<string>("Random");
  const [dataDict, setDataDict] = useState<DataDictionary>({});
  const [acc, setAcc] = useState<number[]>([]);
  const [arr, setArr] = useState<number[]>([]);
  const [expl_knn,setexpl_knn]=useState(false);

  const btndm = [
    { name: "Manhattan", func: () => setDistanceMetric("Manhattan") },
    { name: "Cosine", func: () => setDistanceMetric("Cosine") },
    { name: "Euclidean", func: () => setDistanceMetric("Euclidean") }
  ];

  const btnwf = [
    { name: "Uniform", func: () => setweigtingFunction("Uniform") },
    { name: "Distance", func: () => setweigtingFunction("Distance") }
  ];

  const btndb = [
    { name: "Random", func: () => setDataset("Random") },
    { name: "Moons", func: () => setDataset("Moons") },
    { name: "Circles", func: () => setDataset("Circles") },
    { name: "Blobs", func: () => setDataset("Blobs") }
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    for (let i = LOW; i <= HIGH; i++) {
      //change this for new model
      const imgSrc = `/KNN/${dataset.toLowerCase()}/${dataset == "Random" ? "og": dataset.toLowerCase()}_${distanceMetric.toLowerCase()}_${weigtingFunction.toLowerCase()}_k${i}.png`;
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc;

        if (Object.keys(cache).length === HIGH - LOW + 1) {
          setImageCache(cache);
        }
      };
    }
  }, [weigtingFunction, distanceMetric, dataset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/KNN_acc/${dataset.toLowerCase()}_knn_acc_${weigtingFunction[0].toLowerCase()}${distanceMetric[0].toLowerCase()}.csv`);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true, 
          skipEmptyLines: true,
          complete: (result) => {
            const dataObject: DataDictionary = {};
            (result.data as CsvRow[]).forEach((row) => {
              dataObject[row.k_value] = row;
            });
            setDataDict(dataObject);
          },
        });

      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
  }, [weigtingFunction, distanceMetric, dataset]);

  useEffect(() => {
    const list: number[] = []
    for (let i = LOW; i <= HIGH; i++) {
      list.push(i);
    }
    setArr(list)

    const acc_list: number[] = []
    for (let i = LOW; i < HIGH; i++) {
      acc_list.push(1 - parseFloat(dataDict[i.toString()]?.accuracy));
      console.log(dataDict[i.toString()]?.accuracy)
    }

    console.log(acc_list)
    setAcc(acc_list)
  }, [dataDict])

  useEffect(() => {
    if (!isPlaying) return;
    //240 because thats the totsl number of images in knn
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
    <div className="flex flex-grow flex-col lg:flex-row">
      <div className={`bg-[#FFFFFF] h-auto lg:h-[87vh] border-r-0 lg:border-r-2 border-b-2 lg:border-b-0 border-[#E9EAEB] flex flex-col items-center ${expl_knn?'lg:basis-[40%]':'lg:basis-[22.5%]'} w-full lg:w-auto`}>
        {expl_knn? (
          <div className="grow overflow-y-auto bg-transparent bg-opacity-0 w-full">
              <Explanation model={"KNN"} onExplainClick={setexpl_knn}/>
          </div>):(
            <>
        <LHS buttonsList={[btndm, btnwf, btndb]} heading="K-Nearest Neighbour" parameters={["Distance Metric", "Weighting Function", "Dataset"]} />
        <Link model={"KNN"} onExplainClick={setexpl_knn}/>
        </>
        )}
      </div>
      <div className="lg:basis-[77.5%] bg-[#FAFAFA] flex flex-col p-3 sm:p-5 lg:px-9 items-center overflow-y-auto h-auto lg:h-[87vh] w-full">
        <div className="w-full max-w-4xl mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 sm:p-4">
          <AttributeList AttributeInfo={
            [[{ label: "Distance Metric", value: distanceMetric, num: 2, basis: 'basis-[40%]' },
            { label: "Weigthing Function", value: weigtingFunction, num: 2, basis: 'basis-[40%]' }],
            [{ label: "K Value", value: value.toString(), num: 3, basis: 'basis-[30%]' },
            { label: "Error", value: (1 - Number(dataDict[value.toString()]?.accuracy)).toString(), num: 3, basis: 'basis-[30%]' },
            { label: "Accuracy", value: Number(dataDict[value.toString()]?.accuracy).toString(), num: 3, basis: 'basis-[30%]' }]]
          }
          />

          <div className="w-full max-w-md my-4">
            <Slider
              value={value}
              onChange={(_, newValue) => setValue(newValue as number)}
              aria-label="Default"
              valueLabelDisplay="auto"
              min={LOW}
              max={HIGH}
            />
          </div>

          <div className="flex gap-2">
            <IconButton onClick={() => skipPrevious()} color="primary">
              <SkipPrevious sx={{ fontSize: { xs: 40, sm: 50 } }} />
            </IconButton>

            <IconButton onClick={() => setIsPlaying(!isPlaying)} color="primary">
              {isPlaying ? <PauseCircle sx={{ fontSize: { xs: 40, sm: 50 } }} /> : <PlayCircleFilled sx={{ fontSize: { xs: 40, sm: 50 } }} />}
            </IconButton>

            <IconButton onClick={() => skipNext()} color="primary">
              <SkipNext sx={{ fontSize: { xs: 40, sm: 50 } }} />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full mt-3 gap-4 lg:gap-0 lg:justify-between">
          <div className="w-full lg:w-auto">
            <ImageDisplay image={imageInfo} source={imageCache[value]} />
          </div>
          <div className="w-full lg:w-auto">
            <BasicLineChart x={arr} y={acc} mark={value} label = {'Error Graph'} />
          </div>
        </div>
      </div>
    </div>
  );
}
