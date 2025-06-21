import { BarChart } from "@mui/x-charts";

interface PriorBarChartProps {
  priors: Record<string, number>;
}

export default function PriorBarChart({ priors }: PriorBarChartProps) {
  const classLabels = Object.keys(priors);
  const values = classLabels.map((cls) => priors[cls]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-2 italic">Prior Probabilities</h3>
      <BarChart
        xAxis={[{ scaleType: "band", data: classLabels }]}
        series={[{ data: values}]}
        height={300}
        width={700}
      />
    </div>
  );
}
