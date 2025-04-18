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
  c_value: string;
  accuracy: string;
}

type DataDictionary = Record<string, CsvRow>;

export default function KNN() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageCache, setImageCache] = useState<Record<number, string>>({});
  const [kernelMetric, setKernelMetric] = useState<string>("linear");
  const [corgFunction, setCorgFunction] = useState<string>("constant");
  const [minSlider, setMinSlider] = useState<number>(25);
  const [maxSlider, setMaxSlider] = useState<number>(4975);
  const [stepSlider, setStepSlider] = useState<number>(25);
  const [value, setValue] = useState<number>(minSlider);
  const [dataDict, setDataDict] = useState<DataDictionary>({});
  const [acc, setAcc] = useState<number[]>([]);
  const [arr, setArr] = useState<number[]>([]);

  const btndm = [
    { name: "Linear", func: () => setKernelMetric("linear") },
    { name: "Radial Basis Function", func: () => setKernelMetric("rbf") }
  ];

  const btnwf = [
    { name: "Gamma", func: () => setCorgFunction("gamma") },
    { name: "Constant", func: () => setCorgFunction("constant") }
  ];

  useEffect(() => {
    const cache: Record<number, string> = {};

    let min: number = 0;
    let max: number = 0;
    let num: number = 0;
    let step: number = 0;

    if (kernelMetric == 'linear') {
      min = 25
      max = 4975
      num = 199
      step = 25
    }

    for (let i = min; i <= max; i += step) {
      const imgSrc = `/svm_lin/svm_lin_c_${i.toString().padStart(4, '0')}.png`
      console.log(imgSrc)
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        cache[i] = imgSrc;

        if (Object.keys(cache).length === num) {
          setImageCache(cache);
        }
      };
    }
  }, [kernelMetric, corgFunction]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setValue((prev) => (prev < maxSlider ? prev + stepSlider : minSlider));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const skipNext = () => {
    if (value == maxSlider) setValue(minSlider);
    else setValue(value + stepSlider);
  }
  const skipPrevious = () => {
    if (value == minSlider) setValue(maxSlider);
    else setValue(value - stepSlider);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/svm_linear_accuracies.csv`);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const dataObject: DataDictionary = {};
            (result.data as CsvRow[]).forEach((row) => {
              dataObject[row.c_value] = row;
            });
            setDataDict(dataObject);
          },
        });

      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
  }, [kernelMetric, corgFunction]);

  useEffect(() => {
    const list: number[] = []
    list.push(0)
    for (let i = minSlider/10000; i < maxSlider/10000; i += 0.0025) {
      list.push(i);
    }
    setArr(list)

    const acc_list: number[] = []
    acc_list.push(1)
    for (let i = minSlider/10000; i < maxSlider/10000; i += 0.0025) {
      acc_list.push(1 - parseFloat(dataDict[i.toString()]?.accuracy));
      console.log(dataDict[i.toString()]?.accuracy)
    }

    console.log(acc_list)
    setAcc(acc_list)
  }, [dataDict])

  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className="bg-[#FFFFFF] basis-[22.5%] border-r-2 border-[#E9EAEB] flex flex-col items-center">

        <LHS buttonsList={[btndm, btnwf]} heading="Support Vector Machine" parameters={["Kernel Metric", "Constant or Gamma"]} />

        <Link />

      </div>
      <div className="basis-[77.5%] bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]">

        <div className="w-[80%] mt-1 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-4">

          <AttributeList AttributeInfo={
            [[{ label: "Kernel", value: kernelMetric, num: 2 },
            { label: "Constant or Gamma", value: corgFunction, num: 2 }],
            [{ label: "Constant", value: (value / 10000).toString(), num: 3 },
            { label: "Gamma", value: (kernelMetric == 'linear') ? 'NA' : value.toString(), num: 3 },
            { label: "Error", value: (1 - Number(dataDict[(value/10000).toString()]?.accuracy)).toString(), num: 3 },]
            ]
          }
          />

          <Slider
            value={value}
            onChange={(_, newValue) => setValue(newValue as number)}
            aria-label="Default"
            valueLabelDisplay="auto"
            min={minSlider}
            max={maxSlider}
            step={stepSlider}
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

          <BasicLineChart x={arr} y={acc} mark={value/25} />

        </div>

      </div>

    </div>
  );
}