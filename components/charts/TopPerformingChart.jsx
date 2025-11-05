"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";

const SourcesOverviewChart = () => {
  const [sources, setSources] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // 1️⃣ Get logged-in user's email
  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) setUserEmail(user.email);
  }, []);

  // 2️⃣ Fetch sources from both tables
  useEffect(() => {
    const fetchSources = async () => {
      if (!userEmail) return;

      setLoading(true);

      // Fetch sources from both Leads and Deals
      const [leadsRes, dealsRes] = await Promise.all([
        supabase.from("Leads").select("source").eq("user_email", userEmail),
        supabase.from("Deals").select("source").eq("user_email", userEmail),
      ]);

      if (leadsRes.error || dealsRes.error) {
        console.error(
          "Error fetching sources:",
          leadsRes.error || dealsRes.error
        );
        setLoading(false);
        return;
      }

      const leads = leadsRes.data || [];
      const deals = dealsRes.data || [];

      // Merge both datasets
      const combined = [...leads, ...deals];

      // 3️⃣ Group by source
      const counts = combined.reduce((acc, record) => {
        const key = record.source || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      const formatted = Object.entries(counts).map(([source, count]) => ({
        source,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }));

      setSources(formatted);
      setLoading(false);
    };

    fetchSources();

    // 4️⃣ Enable real-time updates for both tables
    const leadsChannel = supabase
      .channel("realtime-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Leads" },
        () => fetchSources()
      )
      .subscribe();

    const dealsChannel = supabase
      .channel("realtime-deals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Deals" },
        () => fetchSources()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(dealsChannel);
    };
  }, [userEmail]);

  // 5️⃣ UI Loading state
  if (loading) {
    return <div className="text-center text-slate-500">Loading sources...</div>;
  }

  // 6️⃣ Render card view
  return (
    <div className="space-y-3 sm:space-y-4">
      {sources.map((source, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: `linear-gradient(135deg, hsl(${
                  (index * 60) % 360
                }, 70%, 60%), hsl(${(index * 60 + 120) % 360}, 70%, 60%))`,
              }}
            ></div>

            <div>
              <div className="font-medium">{source.source}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {source.count} total entries
              </div>
            </div>
          </div>

          <Badge variant="outline" className="self-start sm:self-center">
            {source.percentage}%
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default SourcesOverviewChart;
