import React from 'react';
import { useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
type Position = [number, number];
type Action = 'up' | 'down' | 'left' | 'right';
type QTable = {
  [key: string]: { [action in Action]: number };
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GraphProps {
  qTable: QTable;
  setQTable: React.Dispatch<React.SetStateAction<QTable>>;
  start: Position;
  goal: Position;
  rows: number;
  cols: number;
  actions: Action[];
  alpha: number;
  setAlpha: (value: number) => void;
  gamma: number;
  setGamma: (value: number) => void;
  epsilon: number;
  setEpsilon: (value: number) => void;
  currentPos: Position;
  setCurrentPos: (pos: Position) => void;
  agentPath: Position[];
  setAgentPath: (path: Position[]) => void;
  episode: number;
  setEpisode: (ep: number) => void;
  graphData: {
    episodes: number[];
    rewards: number[];
    steps: number[];
  };
  setGraphData: React.Dispatch<
    React.SetStateAction<{
      episodes: number[];
      rewards: number[];
      steps: number[];
    }>
  >;
  obstacles: Position[];
  setObstacles: React.Dispatch<React.SetStateAction<Position[]>>;
  running: boolean;
  setRunning: (value: boolean) => void;
  stopRef: React.MutableRefObject<boolean>;
  
}

const Graph: React.FC<GraphProps> = ({
  qTable,
  setQTable,
  start,
  goal,
  rows,
  cols,
  actions,
  alpha,
  setAlpha,
  gamma,
  setGamma,
  epsilon,
  setEpsilon,
  setCurrentPos,
  setAgentPath,
  graphData,
  setGraphData,
  obstacles,
  setObstacles,
  running,
  setRunning,
  stopRef,
}) => {
  const rewards = Array(rows).fill(null).map(() => Array(cols).fill(-1));
  rewards[goal[0]][goal[1]] = 100;
  obstacles.forEach(([x, y]) => {
    rewards[x][y] = -100;
  });
  
  const chooseAction = (pos: Position): Action => {
    if (Math.random() < epsilon) {
      return actions[Math.floor(Math.random() * actions.length)];
    }
    const stateActions = qTable[`${pos[0]},${pos[1]}`];
    return Object.entries(stateActions).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as Action;
  };

  const getNextState = (pos: Position, action: Action): Position => {
    let [x, y] = pos;
    switch (action) {
      case 'up': x = Math.max(0, x - 1); break;
      case 'down': x = Math.min(rows - 1, x + 1); break;
      case 'left': y = Math.max(0, y - 1); break;
      case 'right': y = Math.min(cols - 1, y + 1); break;
    }
    const next: Position = [x, y];
    if (obstacles.some(([ox, oy]) => ox === next[0] && oy === next[1])) return pos;
    return next;
  };
  const [episode, setEpisode] = useState<number>(0);
  const runEpisode = async () => {
    let totalReward = 0;
    let steps = 0;
    let pos: Position = [...start];
    const updatedQ: QTable = { ...qTable };
    const path: Position[] = [pos];

    while (pos[0] !== goal[0] || pos[1] !== goal[1]) {
      const action = chooseAction(pos);
      const nextPos = getNextState(pos, action);
      const reward = rewards[nextPos[0]][nextPos[1]];
      const nextMax = Math.max(...Object.values(updatedQ[`${nextPos[0]},${nextPos[1]}`]));

      updatedQ[`${pos[0]},${pos[1]}`][action] +=
        alpha * (reward + gamma * nextMax - updatedQ[`${pos[0]},${pos[1]}`][action]);

      pos = nextPos;
      path.push(pos);
      totalReward += reward;
      steps++;
      if (steps > 1000) break;
    }
    setQTable(updatedQ);
    setEpisode((ep) => ep + 1);
    setGraphData((prev) => ({
      episodes: [...prev.episodes, episode + 1],
      rewards: [...prev.rewards, totalReward],
      steps: [...prev.steps, steps],
    }));
    setAgentPath(path);
    setCurrentPos(start);

    for (let step of path) {
      setCurrentPos(step);
      await new Promise((res) => setTimeout(res, 200));
    }

    return totalReward;
  };

  const runUntilGoal = async () => {
    setRunning(true);
    stopRef.current = false;
    let found = false;
    while (!found && !stopRef.current) {
      const reward = await runEpisode();
      if (reward >= 100) found = true;
    }
    setRunning(false);
  };

  const stopAutoRun = () => {
    stopRef.current = true;
  };

  const generateRandomObstacles = () => {
    const allPositions: Position[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if ((i !== start[0] || j !== start[1]) && (i !== goal[0] || j !== goal[1])) {
          allPositions.push([i, j]);
        }
      }
    }

    const shuffled = allPositions.sort(() => 0.5 - Math.random());
    const newObstacles = shuffled.slice(0, 5);
    setObstacles(newObstacles);
  };

  const chartData = {
    labels: graphData.episodes,
    datasets: [
      {
        label: 'Total Reward',
        data: graphData.rewards,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Steps',
        data: graphData.steps,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false },
      },
      y: { grid: { display: true } },
    },
  };

  return (
    <div className={`md:ml-auto ml-0 md:mr-4 mr-0 md:mt-0 mt-6`}>
      <Line data={chartData} options={chartOptions} />
      <div className="mt-8"><span className='text-lg italic font'>Current Episode: </span> {episode}</div>
      <div className="mt-4 flex md:flex-row flex-col gap-3 items-center flex-wrap">
        <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={runEpisode} disabled={running}>Run Episode</button>
        <button className="bg-green-500 text-white px-3 py-2 rounded" onClick={runUntilGoal} disabled={running}>Auto Run</button>
        <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={stopAutoRun} disabled={!running}>Stop Auto Run</button>
        <button className="bg-purple-500 text-white px-3 py-2 rounded" onClick={generateRandomObstacles} disabled={running}>Randomize Obstacles</button>
      </div>
      
    </div>
  );
};

export default Graph;
