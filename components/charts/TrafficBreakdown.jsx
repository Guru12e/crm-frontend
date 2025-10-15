"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function TrafficSourcePieChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "🌐 Traffic Source Breakdown",
        left: "center",
        textStyle: {
          color: "#0f172a", // dark slate
          fontWeight: "600",
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: { color: "#475569" },
      },
      series: [
        {
          name: "Traffic Source",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Social Media" },
            { value: 300, name: "Referral Links" },
          ],
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2,
            color: (params) => {
              const colors = [
                "#0ea5e9", // sky-500
                "#14b8a6", // teal-500
                "#22d3ee", // cyan-400
                "#38bdf8", // sky-400
                "#2dd4bf", // teal-400
              ];
              return colors[params.dataIndex % colors.length];
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => myChart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}
