import { BarChart } from '@mui/x-charts';
import { useMemo } from 'react';

type ProbTable = Record<string, Record<string, Record<string, number>>>;

interface ProbChartProps {
    probTable: ProbTable;
}

export default function ProbChart({ probTable }: ProbChartProps) {
    return (
        <div className="flex flex-col items-center gap-8 w-full">

            <h3 className="text-2xl font-bold mb-2 italic center">Likelihood Probabilities</h3>

            {Object.entries(probTable).map(([feature, values]) => {
                const xAxisValues = Object.keys(values);
                const classes = Object.keys(
                    Object.values(values)[0] || {}
                );

                const series = classes.map((cls) => ({
                    label: cls,
                    data: xAxisValues.map((val) => values[val]?.[cls] ?? 0),
                }));

                return (
                    <div key={feature}>
                        <h3 className="text-xl font-semibold mb-2 italic">Feature - {feature[0].toUpperCase() + feature.slice(1,)}</h3>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: xAxisValues }]}
                            yAxis={[{ min: 0, max: 1 }]}
                            series={series}
                            height={300}
                            width={800}
                        />
                    </div>
                );
            })}
        </div>
    );
}
