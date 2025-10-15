"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function TrafficLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "🌐 Website Traffic Overview",
        left: "center",
        textStyle: { color: "#0f172a", fontWeight: "600" }, // dark slate
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Page Views", "Unique Visitors"],
        textStyle: { color: "#475569" },
        top: 30,
      },
      xAxis: {
        type: "category",
        data: ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"],
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      series: [
        {
          name: "Page Views",
          type: "line",
          data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
          smooth: true,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#14b8a6" },
              { offset: 1, color: "#0ea5e9" },
            ]),
          },
          symbolSize: 8,
        },
        {
          name: "Unique Visitors",
          type: "line",
          data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
          smooth: true,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#0ea5e9" },
              { offset: 1, color: "#14b8a6" },
            ]),
          },
          symbolSize: 8,
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
