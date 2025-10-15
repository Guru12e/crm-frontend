"use client";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { supabase } from "@/utils/supabase/client";

export default function TopProductsChart() {
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);

  // 🧠 Get logged-in user's email from localStorage session
  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) setUserEmail(user?.email);
  }, []);

  // 📦 Fetch product data from Supabase once userEmail is available
  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;

      const { data, error } = await supabase
        .from("user")
        .select("name, stock, price, category, user_email")
        .eq("user_email", userEmail);

      if (error) {
        console.error("Error fetching product data:", error);
        return;
      }

      // Clean and sort top-selling (lowest stock) products
      const cleaned = (data || [])
        .map((p) => ({
          name: p.name,
          stock: Number(p.stock) || 0,
          category: p.category,
          price: Number(p.price) || 0,
        }))
        .sort((a, b) => a.stock - b.stock) // sort by stock (lowest first)
        .slice(0, 5); // limit to top 5

      setProducts(cleaned);
    };

    fetchData();
  }, [userEmail]);

  // 📊 ECharts option setup
  const option = {
    title: {
      text: "🏆 Top Selling Products",
      left: "center",
      textStyle: { color: "#0f172a", fontWeight: "600" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const item = params[0];
        const product = products[item.dataIndex];
        return `
          <b>${product.name}</b><br/>
          🏷️ Category: ${product.category || "N/A"}<br/>
          💲 Price: $${product.price}<br/>
          📦 Stock: ${product.stock}
        `;
      },
    },
    grid: { left: "3%", right: "4%", bottom: "5%", top: "15%", containLabel: true },
    xAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#94a3b8" } },
      axisLabel: { color: "#475569" },
      splitLine: { lineStyle: { color: "#e2e8f0" } },
    },
    yAxis: {
      type: "category",
      data: products.map((item) => item.name),
      axisLine: { lineStyle: { color: "#94a3b8" } },
      axisLabel: { color: "#475569" },
    },
    series: [
      {
        name: "Stock",
        type: "bar",
        data: products.map((item) => item.stock),
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

  return (
    <ReactECharts
      option={option}
      style={{ height: "400px", width: "100%" }}
    />
  );
}
