"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function TopProductsChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "🏆 Top Selling Products",
        left: "center",
        textStyle: {
          color: "#0f172a", // dark slate
          fontWeight: "600",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      yAxis: {
        type: "category",
        data: ["T-Shirt", "Sneakers", "Wrist Watch", "Backpack", "Sunglasses"],
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [540, 720, 460, 310, 250], // Dummy data
          barWidth: "50%",
          itemStyle: {
            borderRadius: 6,
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: "#0ea5e9" }, // sky-500
              { offset: 1, color: "#14b8a6" }, // teal-500
            ]),
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
