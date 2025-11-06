"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const LeadSourcesChart = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // 1️⃣ Get user email from session
  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) setUserEmail(user.email);
  }, []);

  // 2️⃣ Fetch leads source data
  useEffect(() => {
    const fetchSources = async () => {
      if (!userEmail) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("Leads")
        .select("source")
        .eq("user_email", userEmail);

      if (error) {
        console.error("Error fetching lead sources:", error);
        setLoading(false);
        return;
      }

      // 3️⃣ Group and count sources
      const counts = data.reduce((acc, lead) => {
        const key = lead.source || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      const formatted = Object.entries(counts).map(([source, count]) => ({
        source,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }));

      setLeadSources(formatted);
      setLoading(false);
    };

    fetchSources();
  }, [userEmail]);

  // 4️⃣ UI Loading state
  if (loading) {
    return (
      <div className="text-center text-slate-500">Loading lead sources...</div>
    );
  }

  // 5️⃣ Render chart
  return (
    <div className="space-y-4">
      {leadSources.map((source, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full bg-gradient-to-r from-blue-${
                (index + 1) * 100
              } to-purple-${(index + 1) * 100}`}
            ></div>
            <span className="font-medium">{source.source}</span>
          </div>
          <div className="text-right">
            <div className="font-bold">{source.count}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {source.percentage}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadSourcesChart;
