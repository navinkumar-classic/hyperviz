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
        if (i === goal[0] && j === goal[1]) content = '';
        else if (i === currentPos[0] && j === currentPos[1]) content = '';

        row.push(
            <div
                key={`${i},${j}`}
                className={`md:w-20 md:h-20 w-12 h-12 flex-col border-2 border-[#E9EAEB] md:m-[2px] m-[1px] flex items-center justify-center text-xl font-bold ${
                    isObstacle || (i === goal[0] && j === goal[1]) || (i === currentPos[0] && j === currentPos[1])
                        ? ''
                        : 'bg-white'
                }`}
                style={
                  isObstacle
                      ? {
                        backgroundImage: "url('/barrier.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                      : i === goal[0] && j === goal[1]
                          ? {
                            backgroundImage: "url('/finish.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                          : i === currentPos[0] && j === currentPos[1]
                              ? {
                                backgroundImage: "url('/car.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }
                              : undefined
                }
            >
              {isObstacle ? '' : content}
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
