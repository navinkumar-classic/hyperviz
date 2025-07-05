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
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] h-[87vh] border-r-2 border-[#E9EAEB] flex flex-col items-center  ${expl_knn?'basis-[40%]':'basis-[22.5%]'}`}>
        {expl_knn? (
          <div className="grow overflow-y-auto bg-transparent bg-opacity-0">
              <Explanation model={"KNN"} onExplainClick={setexpl_knn}/>
          </div>):(
            <>

        <LHS buttonsList={[btndm, btnwf, btndb]} heading="K-Nearest Neighbour" parameters={["Distance Metric", "Weighting Function", "Dataset"]} />

        <Link model={"KNN"} onExplainClick={setexpl_knn}/>
        </>
        )}

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Distance Metric", value: distanceMetric, num: 2, basis: 'basis-[40%]' },
            { label: "Weigthing Function", value: weigtingFunction, num: 2, basis: 'basis-[40%]' }],
            [{ label: "K Value", value: value.toString(), num: 3, basis: 'basis-[30%]' },
            { label: "Error", value: (1 - Number(dataDict[value.toString()]?.accuracy)).toString(), num: 3, basis: 'basis-[30%]' },
            { label: "Accuracy", value: Number(dataDict[value.toString()]?.accuracy).toString(), num: 3, basis: 'basis-[30%]' }]]
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

          <BasicLineChart x={arr} y={acc} mark={value} label = {'Error Graph'} />

        </div>

      </div>

    </div>
  );
}
