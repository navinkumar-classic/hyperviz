import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect } from 'react';

export default function BasicLineChart({x,y,mark,label}:{x:number[],y:number[],mark:number,label:string}) {

    return (
        <div className="basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-2 justify-center">

            <LineChart
                xAxis={[{ data: x}]}
                series={[
                    {
                        data: y,
                        showMark: ({ index }) => index === mark
                    },
                ]}
                width={500}
            />
            <h1 className="text-lg my-2 font-inter italic font-semibold border-b-2 border-[#E9EAEB]">{label}</h1>

        </div>

    );
}