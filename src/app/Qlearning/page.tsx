"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";
import LHS from "@/components/LHS";
import Link from "@/components/link"
import AttributeList from "@/components/AttributeList";
import DBSCAN from "@/components/DBSCAN";
import TextField from '@mui/material/TextField';
import { clear } from "console";
import OriginalPlot from '@/components/PCA'
import Graph from "@/components/Qlearning/Graph";
import Grid from "@/components/Qlearning/Grid";
import { Slider } from "@mui/material";
import Explanation from "@/components/Explanation";

type Position = [number, number];
type Action = 'up' | 'down' | 'left' | 'right';

type QTable = {
  [key: string]: { [action in Action]: number };
};

const numRows = 5;
const numCols = 5;
const actions: Action[] = ['up', 'down', 'left', 'right'];
const start: Position = [0, 0];
const goal: Position = [4, 4];

const getInitialQTable = (): QTable => {
  const qTable: QTable = {};
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      qTable[`${row},${col}`] = actions.reduce(
        (acc, a) => ({ ...acc, [a]: 0 }),
        {} as { [action in Action]: number }
      );
    }
  }
  return qTable;
};

export default function KNN() {
  const [value, setValue] = useState<Boolean>(true);
  const [core, setCore] = useState<number>(0);
  const [boundary, setBoundary] = useState<number>(0);
  const [silhouette, setSilhouette] = useState<number>(0);
  const [outlier, setOutlier] = useState<number>(0);
  const [eps, setEps] = useState<number>(1);
  const [K, setK] = useState<number>(3);
  const [clearTrigger, setClearTrigger] = useState<Boolean>(true);
  const [explain,setexplain]=useState(false);


  const [obstacles, setObstacles] = useState<Position[]>([
    [1, 2],
    [2, 2],
    [3, 1],
    [3, 2],
    [3, 3],
  ]);
  const [qTable, setQTable] = useState<QTable>(getInitialQTable());
  const [alpha, setAlpha] = useState(0.1);
  const [gamma, setGamma] = useState(0.9);
  const [epsilon, setEpsilon] = useState(0.1);
  const [currentPos, setCurrentPos] = useState<Position>(start);
  const [agentPath, setAgentPath] = useState<Position[]>([]);
  const [episode, setEpisode] = useState(0);
  const [graphData, setGraphData] = useState({
    episodes: [] as number[],
    rewards: [] as number[],
    steps: [] as number[],
  });
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);



  return (
    <div className="flex flex-grow md:flex-row flex-col">
      <div className={`bg-[#FFFFFF] border-r-2 border-[#E9EAEB] flex flex-col items-center ${explain?'basis-[40%]':'basis-[22.5%]'}`}>

        {explain? (
            <div className="grow overflow-y-auto bg-transparent bg-opacity-0">
              <Explanation model={"DBSCAN"} onExplainClick={setexplain}/>
            </div>
        ):(
            <>
              <div className="w-[80%] rounded-tr-2xl rounded-bl-2xl bg-white my-4 py-4 flex flex-col items-center text-black px-4 border-t-3 border-t-[#E9EAEB] border-b-3 border-b-[#E9EAEB]">
                <div className="text-xl font-semibold text-center mb-2 pl-2">QLearning</div>
                <div className="text-md font-light italic text-center pb-2">Choose Your HyperParameter</div>
              </div>

              <div className="mt-4 w-[80%]">
                <label><span className="italic font-semibold">Learning Rate:</span> {alpha.toFixed(2)}</label>
                <Slider
                    value={alpha}
                    onChange={(e, value) => setAlpha(value as number)}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={0}
                    max={1}
                    step={0.01}
                />
              </div>

              <div className="w-[80%]">
                <label><span className="italic font-semibold">Discount Factor (Gamma):</span> {gamma.toFixed(2)}</label>
                <Slider
                    value={gamma}
                    onChange={(e, value) => setGamma(value as number)}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={0}
                    max={1}
                    step={0.01}
                />
              </div>

              <Link model={"DBSCAN"} onExplainClick={setexplain}/>
            </>
        )}

      </div>
      <div className={`${explain?'basis-[60%]':'basis-[77.5%]'} bg-[#FAFAFA] flex flex-col p-5 px-9 items-center overflow-y-auto h-[87vh]`}>

        <h1 className="text-2xl mb-4 py-5 italic">Q-Learning Maze Visualizer</h1>
        <div className="flex w-full md:flex-row flex-col">
          <Grid
            rows={numRows}
            cols={numCols}
            goal={goal}
            currentPos={currentPos}
            obstacles={obstacles}
          />
          <Graph
            qTable={qTable}
            setQTable={setQTable}
            start={start}
            goal={goal}
            rows={numRows}
            cols={numCols}
            actions={actions}
            alpha={alpha}
            setAlpha={setAlpha}
            gamma={gamma}
            setGamma={setGamma}
            epsilon={epsilon}
            setEpsilon={setEpsilon}
            currentPos={currentPos}
            setCurrentPos={setCurrentPos}
            agentPath={agentPath}
            setAgentPath={setAgentPath}
            episode={episode}
            setEpisode={setEpisode}
            graphData={graphData}
            setGraphData={setGraphData}
            obstacles={obstacles}
            setObstacles={setObstacles}
            running={running}
            setRunning={setRunning}
            stopRef={stopRef}
          />
        </div>
        
      </div>

    </div>
  );
}
