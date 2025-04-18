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


const imageInfo = { width: 420, height: 420, heading: "Decision Boundary", alt: "K Value" };
interface CsvRow {
  k_value: string;
  accuracy: string;
}

type DataDictionary = Record<string, CsvRow>;

export default function KNN() {
  const [value, setValue] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [init, setInit] = useState<string>("Random");
  const [algo, setAlgo] = useState<string>("Lloyd");
  const [dataDict, setDataDict] = useState<DataDictionary>({});
  const [acc, setAcc] = useState<number[]>([]);
  const [arr, setArr] = useState<number[]>([]);

  const btndm = [
    { name: "Random", func: () => setInit("Random") },
    { name: "K-means++", func: () => setInit("K-means++") }
  ];

  const btnwf = [
    { name: "Lloyd", func: () => setAlgo("Lloyd") },
    { name: "Elkan", func: () => setAlgo("Elkan") }
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    for (let i = 2; i <= 10; i++) {
      //change this for new model
      const imgSrc = `/kmeans_${init == "Random" ? "r" : "k"}${algo[0].toLowerCase()}/_${init.toLowerCase()}_${algo.toLowerCase()}_${i}.png`;
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc;

        console.log(cache[i])
        console.log(Object.keys(cache).length)

        if (Object.keys(cache).length === 9) {
          setImageCache(cache)
          console.log(cache)
          console.log(imageCache)
        }
      };
    }

    console.log(imageCache)
  }, [init, algo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/knn_acc_${init[0].toLowerCase()}${algo[0].toLowerCase()}.csv`);
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
  }, [init, algo]);

  useEffect(() => {
    const list: number[] = []
    for (let i = 0; i < 240; i++) {
      list.push(i);
    }
    setArr(list)

    const acc_list: number[] = []
    acc_list.push(1)
    for (let i = 1; i < 240; i++) {
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
      setValue((prev) => (prev < 10 ? prev + 1 : 2));
    }, 900);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const skipNext = () => {
    if (value == 10) setValue(2);
    else setValue(value + 1);
  }

  const skipPrevious = () => {
    if (value == 2) setValue(10);
    else setValue(value - 1);
  }

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

        <LHS buttonsList={[btndm, btnwf]} heading="K-Nearest Neighbour" parameters={["Distance Metric", "Weighting Function"]} />

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">
      
        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">
          {/* for the info above the play button. 1st list is for 1st row and 2nd list is for 2nd row*/}
          <AttributeList AttributeInfo={
            [[{ label: "Initiation", value: init, num: 2 },
            { label: "Algorithm Function", value: algo, num: 2 }],
            [{ label: "Clusters", value: value.toString(), num: 3 },
            { label: "Error", value: (1 - Number(dataDict[value.toString()]?.accuracy)).toString(), num: 3 },
            { label: "Accuracy", value: Number(dataDict[value.toString()]?.accuracy).toString(), num: 3 }]]
          }
          />

          <Slider
            value={value}
            onChange={(_, newValue) => setValue(newValue as number)}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={2}
            max={10}
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

          <BasicLineChart x={arr} y={acc} mark={value} />

        </div>

      </div>

    </div>
  );
}
