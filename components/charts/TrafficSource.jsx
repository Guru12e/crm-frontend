"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function TrafficSourcesPie() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "🌐 Traffic Sources",
        subtext: "Visitor Channels",
        left: "center",
        textStyle: {
          color: "#0f172a",
          fontWeight: "600",
        },
        subtextStyle: { color: "#64748b", fontSize: 13 },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} visits ({d}%)",
      },
      legend: {
        bottom: 0,
        textStyle: { color: "#475569" },
      },
      series: [
        {
          name: "Traffic Source",
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
            formatter: "{b}\n{d}%",
            color: "#0f172a",
            fontWeight: "500",
          },
          labelLine: { show: true },
          data: [
            { value: 500, name: "Organic Search" },
            { value: 300, name: "Paid Ads" },
            { value: 200, name: "Direct" },
            { value: 150, name: "Referral" },
            { value: 100, name: "Social Media" },
          ],
          color: [
            "#14b8a6", // teal-500
            "#0ea5e9", // sky-500
            "#38bdf8", // sky-400
            "#2dd4bf", // teal-400
            "#7dd3fc", // sky-300
          ],
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
