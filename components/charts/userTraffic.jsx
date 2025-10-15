"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export default function TrafficAreaChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "👥 User Traffic",
        left: "center",
        textStyle: {
          color: "#0f172a", // dark slate
          fontWeight: "600",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#14b8a6", // teal tone
          },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: { lineStyle: { color: "#94a3b8" } }, // slate-400
        axisLabel: { color: "#475569" }, // slate-600
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
        splitLine: { lineStyle: { color: "#e2e8f0" } }, // light slate grid
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      series: [
        {
          name: "Visitors",
          type: "line",
          smooth: true,
          showSymbol: false,
          areaStyle: {
            opacity: 0.6,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#14b8a6" }, // teal-500
              { offset: 1, color: "#0ea5e9" }, // sky-500
            ]),
          },
          lineStyle: {
            width: 3,
            color: "#14b8a6",
          },
          data: [320, 450, 390, 580, 640, 710, 780], // dummy user traffic
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
