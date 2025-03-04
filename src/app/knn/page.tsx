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
import { PlayCircleFilled , PauseCircle , SkipNext, SkipPrevious } from "@mui/icons-material";

const imageInfo = {width:420, height:420, heading: "Decision Boundary",alt: "K Value"};

export default function KNN() {
  const [value, setValue] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [distanceMetric, setDistanceMetric] = useState<string>("Manhattan");
  const [weigtingFunction, setweigtingFunction] = useState<string>("Uniform");

  const btndm = [
    {name: "Manhattan", func: () => setDistanceMetric("Manhattan")},
    {name: "Cosine", func: () => setDistanceMetric("Cosine")},
    {name: "Euclidean", func: () => setDistanceMetric("Euclidean")}
  ];

  const btnwf = [
    {name: "Uniform", func: () => setweigtingFunction("Uniform")},
    {name: "Distance", func: () => setweigtingFunction("Distance")}
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    for (let i = 1; i <= 240; i++) {
      const imgSrc = `/knn_${weigtingFunction == "Distance" ? "d" : "u"}${distanceMetric[0].toLowerCase()}/_${weigtingFunction.toLowerCase()}_${distanceMetric.toLowerCase()}_${i}.png`;
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc;

        if (Object.keys(cache).length === 240) {
          setImageCache(cache);
        }
      };
    }
  }, [weigtingFunction, distanceMetric]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setValue((prev) => (prev < 240 ? prev + 1 : 1));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const skipNext = () => {
    if(value == 240) setValue(1);
    else setValue(value + 1);
  }
  const skipPrevious = () => {
    if(value == 1) setValue(240);
    else setValue(value - 1);
  }

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

        <LHS buttonsList={[btndm,btnwf]} heading = "K-Nearest Neighbour" parameters={["Distance Metric","Weighting Function"]} />

        <Link/>

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">

        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          
          <AttributeList AttributeInfo={
              [[{label: "Distance Metric", value:  distanceMetric, num: 2},
                {label: "Weigthing Function", value:  weigtingFunction, num: 2}],
               [{label: "K Value", value:  value.toString(), num: 3},
                {label: "Error", value:  value.toString(), num: 3},
                {label: "Accuracy", value:  value.toString(), num: 3}]
              ]
            }
          />

          <Slider
            value={value}
            onChange={(_, newValue) => setValue(newValue as number)}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={1}
            max={240}
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

          <ImageDisplay image = {imageInfo} source = {imageCache[value]} />

          <BasicLineChart />

        </div>

      </div>

    </div>
  );
}
