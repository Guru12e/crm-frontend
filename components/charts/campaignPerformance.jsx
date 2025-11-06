"use client";

import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { supabase } from "@/utils/supabase/client";

const MarketingSankey = () => {
  const [dealCompletion, setDealCompletion] = useState(0);
  const [qualifiedLeads, setQualifiedLeads] = useState(0);
  const [Customeractivity, setCustomerActivity] = useState(0);
  const [campaignstatus, setCampaignStatus] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) {
      setUserEmail(user?.email);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        const { data: dealsData, error: dealsError } = await supabase
          .from("Deals")
          .select("*")
          .eq("status", "Closed-won")
          .eq("user_email", userEmail);

        console.log(dealsData, dealsError);

        if (dealsError) console.error("Deals error:", dealsError);
        else {
          setDealCompletion(dealsData.length);
        }

        const { data: leadsData, error: leadsError } = await supabase
          .from("Leads")
          .select("*")
          .eq("status", "Qualified")
          .eq("user_email", userEmail);

        console.log(leadsData, leadsError);

        if (leadsError) console.error("Leads error:", leadsError);
        else {
          setQualifiedLeads(leadsData.length);
        }
        const { data: customersData, error: customersError } = await supabase
          .from("Customers")
          .select("*")
          .eq("status", "Active")
          .eq("user_email", userEmail);

        console.log(customersData, customersError);

        if (customersError) console.error("customer error:", customersError);
        else {
          setCustomerActivity(customersData.length);
        }
        const { data: campaignData, error: campaignError } = await supabase
          .from("Campaigns")
          .select("*")
          .eq("status", "Sent")
          .eq("user_email", userEmail);

        console.log(campaignData, campaignError);

        if (campaignError) console.error("campaign error:", campaignError);
        else {
          setCampaignStatus(campaignData.length);
        }
      }
    };

    fetchData();
  }, [userEmail]);

  const option = {
    title: { text: "", left: "center", color: "#000" },
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      formatter: (params) => {
        if (params.name === "Campaign Performance")
          return "Main metric of your marketing campaign.";

        if (params.name === "Avg Lead → Deal")
          return `Qualified Leads: ${qualifiedLeads}`;
        if (params.name === "Customer")
          return `customers Activity: ${Customeractivity}`;

        if (params.name === "Deal Completion %")
          return `Completed Deals: ${dealCompletion}`;
        if (params.name === "Impressions")
          return "Number of times the campaign was displayed.";
        if (params.name === "Campaign Status")
          return `Campaigns Sent: ${campaignstatus}`;
      },
    },
    series: [
      {
        type: "sankey",
        emphasis: { focus: "adjacency" },
        draggable: false,
        data: [
          { name: "Campaign Performance", itemStyle: { color: "#14B8A6" } },

          { name: "Avg Lead → Deal", itemStyle: { color: "#3BCEC0" } },
          { name: "Deal Completion %", itemStyle: { color: "#20B8A6" } },
          { name: "Impressions", itemStyle: { color: "#A3E3DC" } },
          { name: "Customer", itemStyle: { color: "#81DDD6" } },
          { name: "Campaign Status", itemStyle: { color: "#4FD1C5" } },
        ],
        links: [
          {
            source: "Campaign Performance",
            target: "Avg Lead → Deal",
            value: qualifiedLeads * 2000,
          },
          {
            source: "Campaign Performance",
            target: "Deal Completion %",
            value: dealCompletion * 2000,
          },
          {
            source: "Campaign Performance",
            target: "Impressions",
            value: 4000,
          },
          {
            source: "Campaign Performance",
            target: "Customer",
            value: Customeractivity * 2000,
          },
          {
            source: "Campaign Performance",
            target: "Campaign Status",
            value: campaignstatus * 2000,
          },
        ],
        lineStyle: { color: "gradient", curveness: 0.6 },
        label: {
          color: "#000",
          formatter: (params) => {
            if (params.name === "Campaign Performance")
              return `{big|${params.name}}`;
            return params.name;
          },
          rich: { big: { fontSize: 24, color: "#000" } },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
  );
};

export default MarketingSankey;
