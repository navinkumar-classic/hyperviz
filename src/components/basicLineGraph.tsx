import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect } from 'react';

export default function BasicLineChart({x,y,mark,label}:{x:number[],y:number[],mark:number,label:string}) {

    return (
        <div className="w-full lg:basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-2 justify-center">

            <LineChart
                xAxis={[{ data: x}]}
                series={[
                    {
                        data: y,
                        showMark: ({ index }) => index === mark
                    },
                ]}
                width={Math.min(500, window.innerWidth * 0.8)}
                height={300}
            />
            <h1 className="text-sm sm:text-base lg:text-lg my-2 font-inter italic font-semibold border-b-2 border-[#E9EAEB] text-center">{label}</h1>

        </div>

    );
}