import React from 'react';
type Position = [number, number];

interface GridProps {
  rows: number;
  cols: number;
  goal: Position;
  currentPos: Position;
  obstacles: Position[];
}

const Grid: React.FC<GridProps> = ({ rows, cols, goal, currentPos, obstacles }) => {
  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const isObstacle = obstacles.some(([ox, oy]) => ox === i && oy === j);
        let content = '';
        if (i === goal[0] && j === goal[1]) content = '🏁';
        else if (i === currentPos[0] && j === currentPos[1]) content = '🤖';

        row.push(
          <div
            key={`${i},${j}`}
            className={`w-20 h-20 flex-col border flex items-center justify-center text-xl font-bold ${
              isObstacle
                ? 'bg-black'
                : i === goal[0] && j === goal[1]
                ? 'bg-green-300'
                : i === currentPos[0] && j === currentPos[1]
                ? 'bg-yellow-300'
                : 'bg-white'
            }`}
          >
            {content}
          </div>
        );
      }
      grid.push(
        <div key={i} className="flex">
          {row}
        </div>
      );
    }
    return grid;
  };

  return <div className="flex flex-col items-center">{renderGrid()}</div>;
};

export default Grid;
