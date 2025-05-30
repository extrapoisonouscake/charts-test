import { useMediaQuery } from "@uidotdev/usehooks";
import Chart from "chart.js/auto";
import { useEffect, useState } from "react";

interface PrecipitationRecord {
  month: string;
  precipitation_mm: number;
}
const MONTHS_COLORS: Record<string, string> = {
  January: "#9B111E",
  February: "#9966CC",
  March: "#7FFFD4",
  April: "#FFFFFF",
  May: "#50C787",
  June: "#5D3FD3",
  July: "#9B111E",
  August: "#b4E1B1",
  September: "#0F52BA",
  October: "#A8C3BC",
  November: "#fFFCC00",
  December: "#40E0D0",
};
const generateChart = (
  data: PrecipitationRecord[],
  isMobile: boolean,
  shouldAnimateOnInit = true
) => {
  const ctx = document.getElementById("myChart") as HTMLCanvasElement;

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((record) => record.month),
      datasets: [
        {
          label: "Precipitation",
          data: data.map((record) => record.precipitation_mm),
          backgroundColor: data.map((record) => MONTHS_COLORS[record.month]),

          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#eee",
          bodyColor: "#000",
          titleColor: "#000",
        },
      },
      // animation: shouldAnimateOnInit ? undefined : false,
      maintainAspectRatio: false,
      responsive: true,
      indexAxis: isMobile ? "y" : "x",
      scales: {
        y: {
          position: isMobile ? "left" : "bottom",
          title: { align: "end" },
          grid: { display: false },
          beginAtZero: true,
        },
        x: {
          position: isMobile ? "top" : "left",
          title: { align: "end" },
          grid: { display: false },
          beginAtZero: true,
        },
      },
    },
  });
  return chart;
};
export default function App() {
  const [chart, setChart] = useState<Chart | null>(null);
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [data, setData] = useState<PrecipitationRecord[] | null>(null);
  useEffect(() => {
    fetch("/data.json")
      .then(
        (res) =>
          res.json() as Promise<{ precipitation_data: PrecipitationRecord[] }>
      )
      .then(({ precipitation_data: data }) => {
        setData(data);
        setChart(generateChart(data, isMobile));
      });
  }, []);
  useEffect(() => {
    if (!chart || !data) return;

    chart.destroy();
    const newChart = generateChart(data, isMobile, false);
    setChart(newChart);
  }, [isMobile]);
  return (
    <main>
      <h2>Precipitation Data for Regina, Saskatchewan</h2>
      <div
        className="container"
        style={{
          height: `${isMobile ? 800 : 600}px`,
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        <canvas id="myChart"></canvas>
      </div>
    </main>
  );
}
