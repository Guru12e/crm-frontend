"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CampaignDetail({ params }) {
  const { slug } = React.use(params);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem("session");
      const user = localStorage.getItem("user");
      if (rawSession) {
        const session = JSON.parse(rawSession);
        setUserEmail(session?.user?.email || null);
      }
      if (user) {
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      let { data, error } = await supabase
        .from("Campaigns")
        .select("*")
        .eq("name", slug)
        .single();

      if (error) {
        console.error("Error fetching campaign:", error);
      } else {
        setCampaign(data);
      }
    };

    fetchCampaign();
  }, [slug]);

  const handleSend = async () => {
    if (!campaign) return;

    setLoading(true);

    try {
      const res = await fetch("/api/sendMailCampaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaign.name,
          subject: campaign.subject,
          body: campaign.body,
          recipients: campaign.audience,
          user,
        }),
      });

      if (res.ok) {
        toast.success("Campaign sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to send campaign.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending campaign.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return <p className="p-6">Loading campaign details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.name}</h1>

      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Subject:</span> {campaign.subject}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          <span className="font-semibold">Body:</span>
        </p>
        <div className="mt-2 p-3 border rounded-lg bg-gray-50">
          {campaign.body}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Audience</h2>
        {campaign.audience?.length > 0 ? (
          <ul className="list-disc list-inside">
            {campaign.audience.map((email, idx) => {
              if (email instanceof Object) {
                return (
                  <li
                    key={idx}
                    className={
                      email.success ? "text-green-600" : "text-red-600"
                    }
                  >
                    {email.email} -{" "}
                    {email.success ? "Sent" : `Failed: ${email.error}`}
                  </li>
                );
              } else {
                return <li key={idx}>{email}</li>;
              }
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No recipients</p>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 py-2 rounded-xl font-medium shadow transition ${
            loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => router.push("/campaigns")}
          className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium shadow hover:bg-gray-300 transition"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
