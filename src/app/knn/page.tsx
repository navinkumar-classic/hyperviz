"use client";

import Image from "next/image";
import { Slider } from "@mui/material";
import { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";

export default function Home() {
  const [value, setValue] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({}); 
  const [distanceMetric, setDistanceMetric] = useState<string>("Manhattan");
  const [weigtingFunction, setweigtingFunction] = useState<string>("Uniform");

  const buttons_dm = [
    <Button key="manhattan" onClick={()=>{setDistanceMetric("Manhattan")}} sx={{ textTransform: "none",fontSize: "large",fontFamily: "var(--font-plexmono);"}}>Manhattan</Button>,
    <Button key="cosine" onClick={()=>{setDistanceMetric("Cosine")}} sx={{ textTransform: "none",fontSize: "large",fontFamily: "var(--font-plexmono);"}}>Cosine</Button>,
  ];

  const buttons_wf = [
    <Button key="uniform" onClick={()=>{setweigtingFunction("Uniform")}} sx={{ textTransform: "none",fontSize: "large",fontFamily: "var(--font-plexmono);"}}>Uniform</Button>,
    <Button key="distance" onClick={()=>{setweigtingFunction("Distance")}} sx={{ textTransform: "none",fontSize: "large",fontFamily: "var(--font-plexmono);"}}>Distance</Button>,
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    for (let i = 1; i <= 240; i++) {
      const imgSrc = `/knn_${weigtingFunction=="Distance"?"d":"u"}${distanceMetric=="Manhattan"?"m":"c"}/_${weigtingFunction.toLowerCase()}_${distanceMetric.toLowerCase()}_${i}.png`;
      
      console.log(imgSrc)
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc; 

        if (Object.keys(cache).length === 240) {
          setImageCache(cache);
        }
      };
    }
  },[weigtingFunction,distanceMetric]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setValue((prev) => (prev < 240 ? prev + 1 : 1));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-grow flex-row bg-amber-200">
      <div className="bg-[#FFFFFF] basis-1/4 border-r-2 border-[#E9EAEB] flex flex-col items-center">

        <h2 className="italic text-xl font-semibold my-2">Distance Metrics</h2>

        <ButtonGroup
          orientation="vertical"
          aria-label="Vertical button group"
          variant="contained"
          className="w-[80%]"
        >
          {buttons_dm}
        </ButtonGroup>

        <h2 className="italic text-xl font-semibold my-2">Weighting Function</h2>

        <ButtonGroup
          orientation="vertical"
          aria-label="Vertical button group"
          variant="contained"
          className="w-[80%]"
        >
          {buttons_wf}
        </ButtonGroup>

      </div>
      <div className="basis-3/4 bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]" id = "navin">

        <div className="w-[80%] mt-1 flex flex-col items-center">

          <div className="mb-2">
            <span className="font-bold italic text-xl">Distance-Metric:</span>  
            <span className="text-xl">&nbsp; {distanceMetric}</span>  
          </div>

          <div className="mb-3">
            <span className="font-bold italic text-xl">Weigthing-Function:</span>  
            <span className="text-xl">&nbsp; {weigtingFunction}</span>  
          </div>


          <div className="mb-1 flex flex-row w-full items-center justify-center">

            <div className="basis-1/5">
              <span className="font-bold italic text-xl">K-Value:</span>  
              <span className="text-xl">&nbsp; {value}</span>  
            </div>

            <div className="basis-1/5">
              <span className="font-bold italic text-xl">Error:</span>  
              <span className="text-xl">&nbsp; {value}</span>  
            </div>

            <div className="basis-1/5">
              <span className="font-bold italic text-xl">Accuracy:</span>  
              <span className="text-xl">&nbsp; {value}</span>  
            </div>
           
          </div>

          <Slider 
            value={value} 
            onChange={(_, newValue) => setValue(newValue as number)} 
            aria-label="Default" 
            valueLabelDisplay="auto" 
            min={1} 
            max={240} 
          />

          <Button 
            variant="contained" 
            onClick={() => setIsPlaying(!isPlaying)} 
            sx={{ mt: 1,mb: 2,fontFamily: "var(--font-plexmono);",textTransform: "none",fontSize: "large" }}
          >
            {isPlaying ? "Pause" : "Resume"}
          </Button>

        </div>

        <div className="flex flex-row w-full">

          <div className="basis-1/2 flex flex-col items-center">

            <h1 className="text-2xl my-2 font-semibold">Descision Boundary</h1>

            {imageCache[value] ? (
              <img 
                src={imageCache[value]} 
                width={500} 
                height={500} 
                alt="K-Value"
              />
            ) : (
              <p>Loading Image...</p>
            )}
          </div>

          <div className="basis-1/2 flex flex-col items-center">

            <h1 className="text-2xl my-2 font-semibold">Error Graph w.r.t to K</h1>

          </div>

        </div>

      </div>

    </div>
  );
}
