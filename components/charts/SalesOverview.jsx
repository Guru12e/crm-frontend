"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function ThemedBarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    
    const option = {
      title: {
        text: "📊 Sales Overview",
        left: "center",
        textStyle: { color: "#0f172a", fontWeight: "600" }, // dark slate
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: { lineStyle: { color: "#94a3b8" } }, // slate-400
        axisLabel: { color: "#475569" }, // slate-600
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      series: [
        {
          type: "bar",
          data: [120, 200, 150, 80, 70, 110, 130],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#14b8a6" }, // teal-500
              { offset: 1, color: "#0ea5e9" }, // sky-500
            ]),
            borderRadius: 6,
          },
          barWidth: "40%",
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
