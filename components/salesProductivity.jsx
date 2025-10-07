// components/SalesProductivity.jsx
"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { useRouter } from "next/navigation";

const SalesProductivityDonut = ({ title = "Sales Team Productivity", data }) => {
  const router = useRouter();

  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: { fontSize: 18, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const item = data.find((d) => d.name === params.name);
        return `${params.name}: ${params.value} (${params.percent}%)<br/>${
          item?.description || ""
        }`;
      },
    },
    legend: { orient: "vertical", left: "left" },
    series: [
      {
        name: "Productivity",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {d}%",
          fontSize: 14,
        },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" } },
        labelLine: { show: true },
        data,
      },
    ],
  };

  const onChartClick = (params) => {
    const routeName = params.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/analytics/productivity/${routeName}`);
  };

  const onEvents = { click: onChartClick };

  return (
    <ReactECharts
      option={option}
      style={{ height: "400px", width: "100%" }}
      onEvents={onEvents}
    />
  );
};

export default SalesProductivityDonut;
