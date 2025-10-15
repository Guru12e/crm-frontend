"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function GrowthRateLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "📈 Weekly Growth Rate",
        left: "center",
        textStyle: { color: "#0f172a", fontWeight: "600" },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Current Period", "Previous Period"],
        bottom: 0,
        textStyle: { color: "#475569" },
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          name: "Current Period",
          type: "line",
          smooth: true,
          data: [12, 15, 20, 28, 32],
          lineStyle: { width: 3, color: "#14b8a6" }, // teal-500
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(20, 184, 166, 0.4)" },
              { offset: 1, color: "rgba(20, 184, 166, 0.05)" },
            ]),
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#14b8a6" },
        },
        {
          name: "Previous Period",
          type: "line",
          smooth: true,
          data: [10, 12, 18, 22, 25],
          lineStyle: { width: 3, color: "#0ea5e9" }, // sky-500
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(14, 165, 233, 0.4)" },
              { offset: 1, color: "rgba(14, 165, 233, 0.05)" },
            ]),
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#0ea5e9" },
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
