"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpLeft, ArrowUpRight, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);

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
    if (!userEmail) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: customerData } = await supabase
          .from("Customers")
          .select("id, name, email, user_email")
          .eq("user_email", userEmail);

        const { data: leadData } = await supabase
          .from("Leads")
          .select("id, name, email, user_email")
          .eq("user_email", userEmail);

        const { data: dealData } = await supabase
          .from("Deals")
          .select("id, name, email, user_email")
          .eq("user_email", userEmail);

        const { data: campaignData } = await supabase
          .from("Campaigns")
          .select("*")
          .eq("user_email", userEmail)
          .order("created_at", { ascending: false });

        setCustomers(customerData || []);
        setLeads(leadData || []);
        setDeals(dealData || []);
        setCampaigns(campaignData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [newContacts, setNewContacts] = useState([{ name: "", email: "" }]);
  const [campaign, setCampaign] = useState({ name: "", subject: "", body: "" });

  const toggleSelect = (contact) => {
    setSelectedContacts((prev) =>
      prev.find((c) => c.email === contact.email)
        ? prev.filter((c) => c.email !== contact.email)
        : [...prev, contact]
    );
  };

  const handleSaveCampaign = async () => {
    const allRecipients = [
      ...selectedContacts,
      ...newContacts.filter((c) => c.email),
    ];

    if (allRecipients.length === 0) {
      alert("Please select or add at least one contact.");
      return;
    }
    if (!campaign.name || !campaign.subject || !campaign.body) {
      alert("Please fill in all campaign details.");
      return;
    }

    try {
      const { data: alreadyExistingCamp, errorCamp } = await supabase
        .from("Campaigns")
        .select("*")
        .eq("name", campaign.name)
        .eq("user_email", userEmail)
        .single();

      if (alreadyExistingCamp) {
        toast.error(
          "Campaign with this name already exists. Please choose a different name."
        );
        return;
      }

      const { error } = await supabase.from("Campaigns").insert({
        name: campaign.name,
        subject: campaign.subject,
        body: campaign.body,
        audience: allRecipients.map((c) => c.email),
        user_email: userEmail,
      });

      if (error) {
        toast.error("Failed to save campaign: " + error.message);
        return;
      }

      const { data: campaignData } = await supabase
        .from("Campaigns")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });
      setCampaigns(campaignData || []);

      setCampaign({ name: "", subject: "", body: "" });
      setSelectedContacts([]);
      setNewContacts([{ name: "", email: "" }]);

      toast.success("Campaign saved successfully!");
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("An error occurred while saving the campaign.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen  p-8 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:justify-left sm:items-center">
        <Sheet>
          <div className="flex justify-between items-center w-screen">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Campaigns
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Manage your email campaigns effectively
              </p>
            </div>
            <SheetTrigger as Child>
              <Button className="bg-gradient-to-r px-3 py-2 rounded-xl from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white w-full ">
                Create Campaign
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="min-w-[85vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create Email Campaign</SheetTitle>
              <SheetDescription>
                <>
                  <div className="p-3 flex flex-col gap-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Campaign Details
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Campaign Name"
                          value={campaign.name}
                          onChange={(e) =>
                            setCampaign({ ...campaign, name: e.target.value })
                          }
                          className="border rounded p-2"
                        />
                        <input
                          type="text"
                          placeholder="Subject"
                          value={campaign.subject}
                          onChange={(e) =>
                            setCampaign({
                              ...campaign,
                              subject: e.target.value,
                            })
                          }
                          className="border rounded p-2"
                        />
                      </div>
                      <textarea
                        placeholder="Email Body..."
                        rows={6}
                        value={campaign.body}
                        onChange={(e) =>
                          setCampaign({ ...campaign, body: e.target.value })
                        }
                        className="border rounded p-2 w-full mt-4"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Select Audience
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Customers</h3>
                          {customers.map((c) => (
                            <label
                              key={c.id}
                              className="flex items-center mb-1"
                            >
                              <input
                                type="checkbox"
                                checked={selectedContacts.some(
                                  (sc) => sc.email === c.email
                                )}
                                onChange={() => toggleSelect(c)}
                                className="mr-2"
                              />
                              {c.name} ({c.email})
                            </label>
                          ))}
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Leads</h3>
                          {leads.map((l) => (
                            <label
                              key={l.id}
                              className="flex items-center mb-1"
                            >
                              <input
                                type="checkbox"
                                checked={selectedContacts.some(
                                  (sc) => sc.email === l.email
                                )}
                                onChange={() => toggleSelect(l)}
                                className="mr-2"
                              />
                              {l.name} ({l.email})
                            </label>
                          ))}
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Deals</h3>
                          {deals.map((d) => (
                            <label
                              key={d.id}
                              className="flex items-center mb-1"
                            >
                              <input
                                type="checkbox"
                                checked={selectedContacts.some(
                                  (sc) => sc.email === d.email
                                )}
                                onChange={() => toggleSelect(d)}
                                className="mr-2"
                              />
                              {d.name} ({d.email})
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Add New Contacts
                      </h2>
                      {newContacts.map((c, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={c.name}
                            onChange={(e) => {
                              const updated = [...newContacts];
                              updated[i].name = e.target.value;
                              setNewContacts(updated);
                            }}
                            className="border rounded p-2 w-1/2"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={c.email}
                            onChange={(e) => {
                              const updated = [...newContacts];
                              updated[i].email = e.target.value;
                              setNewContacts(updated);
                            }}
                            className="border rounded p-2 w-1/2"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setNewContacts([
                            ...newContacts,
                            { name: "", email: "" },
                          ])
                        }
                        className="bg-teal-200 px-3 py-1 rounded hover:bg-teal-300"
                      >
                        + Add More
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveCampaign}
                        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
                      >
                        Save Campaign
                      </button>
                    </div>
                  </div>
                </>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {campaigns.length === 0 ? (
          <Card className="shadow-sm rounded-2xl  bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 w-[75vw] h-[60vh] flex flex-col items-center justify-center p-10 text-center">
            <h3 className="text-lg font-semibold  text-slate-900 dark:text-white mb-2">
              No Campaigns Available
            </h3>
            <p className="text-sm  text-slate-600 dark:text-slate-400 mb-4">
              Start by creating your first campaign to reach your audience.
            </p>
          </Card>
        ) : (
          campaigns.map((c) => (
            <Link key={c.id} href={`/campaigns/${c.name}`} className="block">
              <Card className="shadow-sm  rounded-2xl border hover:scale-105 hover:shadow-lg  bg-white/70 dark:bg-slate-800/50  border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 cursor-pointer h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="border border-teal-200 dark:border-sky-800 rounded-lg p-4 bg-sky-50/50 dark:bg-blue-900/20">
                    {/* Title */}
                    <h3 className="font-semibold text-xl text-gray-900 mb-2">
                      {c.name}
                    </h3>

                    {/* Subject */}
                    <p className="text-sm  text-slate-600 dark:text-slate-400 mb-3">
                      {c.subject}
                    </p>

                    {/* Body */}
                    <p className="text-sm text-slate-900 dark:text-white line-clamp-3 flex-grow leading-relaxed">
                      {c.body}
                    </p>

                    {/* Audience */}
                    <div className="mt-4 text-sm  text-slate-600 dark:text-slate-400">
                      {c.audience?.length > 0 ? (
                        <p>{c.audience.length} recipients</p>
                      ) : (
                        <p className="text-gray-400">No recipients</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
