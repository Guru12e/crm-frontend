"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ReactECharts from "echarts-for-react";

const TopIndustriesCard = () => {
  // Dummy industry data
  const dummyIndustryData = [
    ["E-commerce", 12],
    ["Finance", 8],
    ["Healthcare", 5],
  ];

  const dummyCustomers = {
    "E-commerce": [
      { name: "Alice", location: "New York", industry: "E-commerce", purchase_history: "Laptop, Phone", intent_score: 85 },
      { name: "Bob", location: "San Francisco", industry: "E-commerce", purchase_history: "Shoes, Bag", intent_score: 70 },
    ],
    Finance: [
      { name: "Charlie", location: "Chicago", industry: "Finance", purchase_history: "Insurance", intent_score: 90 },
    ],
    Healthcare: [
      { name: "David", location: "Boston", industry: "Healthcare", purchase_history: "Vitamins, Medicine", intent_score: 80 },
    ],
  };

  const [industryData, setIndustryData] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [industryCustomers, setIndustryCustomers] = useState([]);

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
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: industryData.map(([industry]) => industry),
    },
    series: [
      {
        type: "bar",
        data: industryData.map(([_, count]) => count),
        barWidth: "40%",
        itemStyle: { color: "#4F46E5", borderRadius: [5, 5, 5, 5] },
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Top 3 Industries</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts
            option={chartOptions}
            style={{ height: 300 }}
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
                  <div key={i} className="p-3 rounded-lg border hover:shadow-md transition">
                    <p><strong>Name:</strong> {cust.name}</p>
                    <p><strong>Location:</strong> {cust.location}</p>
                    <p><strong>Industry:</strong> {cust.industry}</p>
                    <p><strong>Purchase History:</strong> {cust.purchase_history}</p>
                    <p><strong>Intent Score:</strong> {cust.intent_score}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No customer data found for this industry.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TopIndustriesCard;
