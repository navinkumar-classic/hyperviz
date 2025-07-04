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
        <div className="w-full md:aspect-[7/3] aspect-[5/4]">
            <BarChart
                xAxis={[{ scaleType: "band", data: classLabels }]}
                series={[{ data: values }]}
                width={undefined}  // Let it stretch
                height={undefined} // Let it stretch
                // optional: if needed
                sx={{ width: "100%", height: "100%" }}
            />
        </div>
    </div>
  );
}
