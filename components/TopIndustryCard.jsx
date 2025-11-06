"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReactECharts from "echarts-for-react";

const TopIndustriesCard = () => {
  // Dummy industry data
  const dummyIndustryData = [
    ["E-commerce & Retail", 12],
    ["Finance & Banking", 8],
    ["Healthcare Services", 5],
  ];

  const dummyCustomers = {
    "E-commerce & Retail": [
      {
        name: "Alice",
        location: "New York",
        industry: "E-commerce & Retail",
        purchase_history: "Laptop, Phone",
        intent_score: 85,
      },
      {
        name: "Bob",
        location: "San Francisco",
        industry: "E-commerce & Retail",
        purchase_history: "Shoes, Bag",
        intent_score: 70,
      },
    ],
    "Finance & Banking": [
      {
        name: "Charlie",
        location: "Chicago",
        industry: "Finance & Banking",
        purchase_history: "Insurance",
        intent_score: 90,
      },
    ],
    "Healthcare Services": [
      {
        name: "David",
        location: "Boston",
        industry: "Healthcare Services",
        purchase_history: "Vitamins, Medicine",
        intent_score: 80,
      },
    ],
  };

  const [industryData, setIndustryData] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [industryCustomers, setIndustryCustomers] = useState([]);

  const colors = ["#3BCEC0", "#20B8A6", "#A3E3DC", "#81DDD6", "#4FD1C5"];

  useEffect(() => {
    setIndustryData(dummyIndustryData);
  }, []);

  const fetchIndustryCustomers = (industry) => {
    setIndustryCustomers(dummyCustomers[industry] || []);
  };

  const chartOptions = {
    title: {
      text: "Top 3 Industries by Customer Count",
      left: "center",
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} customers",
    },
    grid: {
      left: "10%", // small gap for Y-axis labels
      right: "5%",
      top: "15%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: industryData.map(([industry]) => industry),
      axisLabel: {
        interval: 0,
        fontSize: 12,
        color: "#334155",
        formatter: (value) => value, // show full name
      },
    },
    series: [
      {
        type: "bar",
        data: industryData.map(([_, count], index) => ({
          value: count,
          itemStyle: {
            color: colors[index % colors.length],
            borderRadius: [5, 5, 5, 5],
          },
        })),
        barWidth: "40%",
        label: {
          show: true,
          position: "right",
          color: "#334155",
          fontWeight: "bold",
        },
      },
    ],
  };

  const onChartClick = (params) => {
    const industry = params.name;
    setSelectedIndustry(industry);
    fetchIndustryCustomers(industry);
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/500 dark:bg-slate-800/50 border-white/20">
        <CardHeader></CardHeader>
        <CardContent>
          <ReactECharts
            option={chartOptions}
            style={{ height: 300, width: "90%" }}
            onEvents={{ click: onChartClick }}
          />
        </CardContent>
      </Card>

      {selectedIndustry && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{selectedIndustry} — Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {industryCustomers.length > 0 ? (
              <div className="grid gap-4">
                {industryCustomers.map((cust, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border hover:shadow-md transition"
                  >
                    <p>
                      <strong>Name:</strong> {cust.name}
                    </p>
                    <p>
                      <strong>Location:</strong> {cust.location}
                    </p>
                    <p>
                      <strong>Industry:</strong> {cust.industry}
                    </p>
                    <p>
                      <strong>Purchase History:</strong> {cust.purchase_history}
                    </p>
                    <p>
                      <strong>Intent Score:</strong> {cust.intent_score}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No customer data found for this industry.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TopIndustriesCard;
