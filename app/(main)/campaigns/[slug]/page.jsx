"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function CampaignDetail({ params }) {
  const { slug } = React.use(params);
  const name = decodeURIComponent(slug);
  const [campaign, setCampaign] = useState(null);
  const [audience, setAudience] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [newAudience, setNewAudience] = useState([{ email: "" }]);
  const router = useRouter();

  const handleUpdateAudience = () => {
    setAudience((prev) => [
      ...prev,
      ...newAudience.map((c) => c.email).filter((e) => e),
    ]);
    setNewAudience([{ email: "" }]);
    handleChange(
      `audience`,
      [...audience, ...newAudience.map((c) => c.email).filter((e) => e)].filter(
        (e) => e
      )
    );
  };

  const handleRemoveAudience = (email) => {
    setAudience((prev) => prev.filter((e) => e !== email));
    handleChange(
      `audience`,
      audience.filter((e) => e !== email)
    );
  };

  const handleRemoveNewAudience = (email) => {
    setNewAudience((prev) => prev.filter((c) => c.email !== email.email));
  };

  const handleChange = (field, value) => {
    setCampaign((prev) => ({ ...prev, [field]: value }));
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
          audience: audience,
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
        .eq("name", name)
        .single();

      if (error) {
        console.error("Error fetching campaign:", error);
      } else {
        setCampaign(data);
        setAudience(data.audience || []);
        setStatus(data.status || null);
      }
    };

    fetchCampaign();
  }, [userEmail, name]);

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
    router.push("/campaigns");
    sessionStorage.setItem("campaignsTab", "Sent");
  };

  if (!campaign) {
    return <p className="p-6">Loading campaign details...</p>;
  }

  return (
    <div className="min-h-screen">
      {status === "Sent" && (
        <div className="max-w-3xl mx-auto mt-10 bg-white/70 dark:bg-slate-800/50 shadow rounded-2xl p-6">
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
              onClick={() => router.push("/campaigns")}
              className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium shadow hover:bg-gray-300 transition"
            >
              Exit
            </button>
          </div>
        </div>
      )}
      {status === "Saved" && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-start max-w-3xl mx-auto  ">
            Edit Campaign Details
          </h1>
          <div className="max-w-3xl mx-auto mt-10 bg-white/70 dark:bg-slate-800/50 shadow rounded-2xl p-6">
            <div className="mb-4">
              <Label className={"mb-4 text-gray-600"} htmlFor="name">
                Campaign Name
              </Label>
              <Input
                id="name"
                value={campaign.name}
                placeholder={campaign.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

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
                <div className="list-disc list-inside">
                  {campaign.audience.map((email, idx) => (
                    <div
                      key={idx}
                      className="mb-2 flex justify-center items-center gap-2"
                    >
                      <Input
                        value={email}
                        id={`email-${idx}`}
                        placeholder={email}
                        onChange={(e) =>
                          handleAudienceChange(idx, e.target.value)
                        }
                      />

                      <Button
                        type="button"
                        onClick={() => handleRemoveAudience(email)}
                        className="px-2 py-1 text-sm bg-transparent border border-red-600 text-red-600 hover:bg-red-100"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-400">No recipients</p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Contacts</h2>
              {newAudience.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={c.email}
                    onChange={(e) => {
                      const updated = [...newAudience];
                      updated[i] = { email: e.target.value };
                      setNewAudience(updated);
                    }}
                    className="border rounded p-2 w-1/2"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveNewAudience(c)}
                    className="px-2 py-1 text-sm bg-transparent border border-red-600 text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => setNewAudience([...newAudience, { email: "" }])}
                className="mt-2 bg-transparent border border-sky-600 text-sky-600 hover:bg-sky-100"
              >
                + Add More
              </Button>
            </div>
            <Button
              onClick={handleUpdateAudience}
              className="mt-2 bg-transparent border border-teal-600 text-teal-600 hover:bg-teal-100"
            >
              Update Audience
            </Button>
            <div className="flex justify-end gap-4 pt-2 border-t mt-2">
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-transparent border border-green-600 text-green-600 hover:bg-green-100"
              >
                {loading ? "Updating..." : "Save"}
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading}
                className={`px-5 py-2 rounded-xl font-medium shadow transition ${
                  loading
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
              <Button
                onClick={() => router.push("/campaigns")}
                className="px-5 py-2 rounded-xl bg-purple-100 border border-purple-800 text-purple-800 font-medium shadow hover:bg-purple-300 transition"
              >
                Exit
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
