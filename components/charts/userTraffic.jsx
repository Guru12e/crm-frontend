"use client";

import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function TrafficAreaChart() {
  const chartRef = useRef(null);
  const [userEmail, setUserEmail] = useState("");
  const [trafficData, setTrafficData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) setUserEmail(user?.email);
  }, []);

  useEffect(() => {
    const fetchTraffic = async () => {
      if (!userEmail) return;

      // Fetch creation timestamps from all relevant tables
      const [customers, leads, deals] = await Promise.all([
        supabase.from("Customers").select("created_at").eq("user_email", userEmail),
        supabase.from("Leads").select("created_at").eq("user_email", userEmail),
        supabase.from("Deals").select("created_at, status").eq("user_email", userEmail),
      ]);

      if (customers.error) console.error("Customers fetch error:", customers.error);
      if (leads.error) console.error("Leads fetch error:", leads.error);
      if (deals.error) console.error("Deals fetch error:", deals.error);

      // Combine all timestamps (count only active-type events)
      const allTimestamps = [
        ...(customers.data || []).map((c) => c.created_at),
        ...(leads.data || []).map((l) => l.created_at),
        ...(deals.data || [])
          .filter((d) => d.status === "Closed-won") // only successful deals
          .map((d) => d.created_at),
      ];

      // Initialize traffic count per weekday (0=Sun, 1=Mon, … 6=Sat)
      const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];

      allTimestamps.forEach((timestamp) => {
        const day = new Date(timestamp).getDay(); // 0–6
        weekdayCounts[day] += 1;
      });

      // Reorder: Mon–Sun (since JS getDay starts from Sun)
      const orderedTraffic = [
        weekdayCounts[1], // Mon
        weekdayCounts[2], // Tue
        weekdayCounts[3], // Wed
        weekdayCounts[4], // Thu
        weekdayCounts[5], // Fri
        weekdayCounts[6], // Sat
        weekdayCounts[0], // Sun
      ];

      setTrafficData(orderedTraffic);
    };

    fetchTraffic();
  }, [userEmail]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "👥 User Traffic (Weekly)",
        left: "center",
        textStyle: {
          color: "#0f172a",
          fontWeight: "600",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#14b8a6",
          },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#475569" },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      series: [
        {
          name: "Visitors (Customers + Leads + Deals)",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 3, color: "#14b8a6" },
          areaStyle: {
            opacity: 0.6,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#14b8a6" },
              { offset: 1, color: "#0ea5e9" },
            ]),
          },
          data: trafficData,
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
  }, [trafficData]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
}
