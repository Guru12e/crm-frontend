"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function CustomerSatisfactionRadar() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "🌟 Customer Satisfaction Overview",
        left: "center",
        textStyle: { color: "#0f172a", fontWeight: "600" },
      },
      tooltip: {},
      legend: {
        data: ["Current Month", "Previous Month"],
        bottom: 0,
        textStyle: { color: "#475569" },
      },
      radar: {
        indicator: [
          { name: "Product Quality", max: 100 },
          { name: "Pricing", max: 100 },
          { name: "Delivery Speed", max: 100 },
          { name: "Customer Support", max: 100 },
          { name: "Ease of Use", max: 100 },
        ],
        splitArea: {
          areaStyle: {
            color: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1"], // soft gray tones
          },
        },
        axisLine: { lineStyle: { color: "#94a3b8" } },
        splitLine: { lineStyle: { color: "#cbd5e1" } },
      },
      series: [
        {
          name: "Customer Feedback Comparison",
          type: "radar",
          data: [
            {
              value: [85, 78, 90, 88, 82],
              name: "Current Month",
              areaStyle: {
                color: "rgba(20, 184, 166, 0.4)", // teal-500
              },
              lineStyle: { color: "#14b8a6", width: 3 },
              itemStyle: { color: "#14b8a6" },
            },
            {
              value: [80, 75, 84, 82, 79],
              name: "Previous Month",
              areaStyle: {
                color: "rgba(14, 165, 233, 0.4)", // sky-500
              },
              lineStyle: { color: "#0ea5e9", width: 3 },
              itemStyle: { color: "#0ea5e9" },
            },
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
