import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart() {
    return (
        <div className="basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-2 justify-center">

            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                ]}
                width={500}
            />
            <h1 className="text-lg my-2 font-inter italic font-semibold border-b-2 border-[#E9EAEB]">Error Graph</h1>

        </div>

    );
}