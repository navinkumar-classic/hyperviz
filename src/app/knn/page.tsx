'use client'

import Image from "next/image";
import { Slider } from "@mui/material";
import { useState,useEffect } from "react";
import { Button } from "@mui/material"

export default function Home() {
  const [value, setValue] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true); 

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setValue((prev) => (prev < 240 ? prev + 1 : 1)); 
    }, 100);

    return () => clearInterval(interval); 
  }, [isPlaying]); 

  return (
    <div className="flex flex-grow flex-row bg-amber-200">
        <div className="bg-[#FFFFFF] basis-1/4 border-r-2 border-[#E9EAEB]">

        </div>
        <div className="basis-3/4 bg-[#FAFAFA] flex flex-col p-5 px-9 items-center">

          <Image src={`/knn_um/_uniform_manhattan_${value}.png`} width={600} height={600} alt = "K-Value" priority loading="eager"/>    
          <div className="w-[80%] mt-1">
            <Slider value={value} onChange={(_, newValue) => setValue(newValue as number)} aria-label="Default" valueLabelDisplay="auto" min={1} max={240} />   
          </div>    
          <Button 
            variant="contained" 
            onClick={() => setIsPlaying(!isPlaying)} 
            sx={{ mt: 1 }}
          >
            {isPlaying ? "Pause" : "Resume"}
          </Button>
          
        </div>
    </div>
  );
}