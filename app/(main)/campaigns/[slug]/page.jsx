"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { decode } from "next-auth/jwt";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";

export default function CampaignDetail({ params }) {
  const { slug } = React.use(params);
  const name = decodeURIComponent(slug);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [audience, setAudience] = useState([]);
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
        .eq("user_email", userEmail)
        .eq("name", name)
        .single();

      if (error) {
        console.error("Error fetching campaign:", error);
      } else {
        setCampaign(data);
        setAudience(data.audience || []);
      }
    };

    fetchCampaign();
  }, [userEmail, name]);

  console.log("Campaign data:", campaign);

  const handleSend = async () => {
    if (!campaign) return;

    setLoading(true);
    setMessage("");

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
        setMessage("✅ Campaign sent successfully!");
      } else {
        const err = await res.json();
        setMessage(` Failed: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(" Error sending campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setCampaign((prev) => ({ ...prev, [field]: value }));
  };

  const handleAudience = (index, field, value) => {
    setAudience((prev) => {
      const newAudience = [...prev];
      newAudience[index] = { ...newAudience[index], [field]: value };
      setAudience(newAudience);
      handleChange(`audience`, newAudience);
    });
  };

  const handleAudienceChange = (index, value) => {
    setAudience((prev) => {
      const newAudience = [...prev];
      newAudience[index] = value;
      setAudience(newAudience);
      handleChange(`audience`, newAudience);
    });
  };

  const handleUpdate = async () => {
    if (!campaign) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("Campaigns")
        .update({
          subject,
          body,
          audience: audience
            .split(",")
            .map((email) => email.trim())
            .filter((e) => e),
        })
        .eq("id", campaign.id)
        .eq("user_email", userEmail);

      if (error) {
        setMessage("❌ Update failed: " + error.message);
      } else {
        setMessage("✅ Campaign updated successfully!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating campaign.");
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
        <Label className={"mb-4 text-gray-600"} htmlFor="subject">
          Subject
        </Label>
        <Input
          id="subject"
          value={campaign.subject}
          placeholder={campaign.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label className={"mb-4 text-gray-600"} htmlFor="body">
          Body
        </Label>
        <Input
          id="body"
          value={campaign.body}
          placeholder={campaign.body}
          onChange={(e) => handleChange("body", e.target.value)}
        />
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
                    <Input
                      value={email.email}
                      id={`email-${idx}`}
                      placeholder={email.email}
                      onChange={(e) =>
                        handleAudience(idx, "email", e.target.value)
                      }
                    />
                    - {email.success ? "Sent" : `Failed: ${email.error}`}
                  </li>
                );
              } else {
                return (
                  <li key={idx}>
                    <Input
                      value={email}
                      id={`email-${idx}`}
                      placeholder={email}
                      onChange={(e) =>
                        handleAudienceChange(idx, e.target.value)
                      }
                    />
                  </li>
                );
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
