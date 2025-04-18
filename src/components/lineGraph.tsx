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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 5, 9, 10, 2, 7, 6],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: [3, 3, 9, 3, 3, 3, 3]
      }
    ],
};

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
};

export default function LineGraph({x}:{x:string}) {

    console.log(x)
    return (
        <>
            <div className="basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 justify-center">

                <Line options={options} data={data} />
                <h1 className="text-lg my-2">Error Graph</h1>

            </div>
        </>
    );
}