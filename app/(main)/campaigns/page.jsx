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
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { create, set } from "lodash";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [sentCampaigns, setSentCampaigns] = useState([]);
  const [campaignsTab, setCampaignsTab] = useState("Saved");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // "" = all
  const [audienceFilter, setAudienceFilter] = useState("");

  useEffect(() => {
    const storedTab = sessionStorage.getItem("campaignsTab");
    if (storedTab) {
      setCampaignsTab(storedTab);
    }
  }, []);
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
      setSavedCampaigns(campaignData.filter((c) => c.status === "Saved"));
      setSentCampaigns(campaignData.filter((c) => c.status === "Sent"));
      setCampaigns(campaignData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userEmail) return;

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
        status: "Saved",
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

      toast.success("Campaign Saved successfully!");
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("An error occurred while saving the campaign.");
    }
    await fetchData();
  };

  const handleDuplicateCampaign = async (campaign) => {
    const { error } = await supabase.from("Campaigns").insert({
      ...campaign,
      id: undefined,
      status: "Saved",
      audience: campaign.audience.map((a) => a.email),
      name: campaign.name + " (Copy)",
      created_at: new Date().toISOString().split("T")[0],
    });

    if (error) {
      toast.error("Failed to duplicate campaign: " + error.message);
      return;
    }

    toast.success(
      "Campaign duplicated successfully! You can view it in saved Campaigns tab."
    );

    await fetchData();
    setCampaignsTab("Saved");
  };

  const filterByDate = (campaign) => {
    if (!monthFilter) return true; // no filter applied

    const created = new Date(campaign.created_at);
    const now = new Date();

    switch (monthFilter) {
      case "last2days": {
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        return created >= twoDaysAgo;
      }
      case "last10days": {
        const tenDaysAgo = new Date(now);
        tenDaysAgo.setDate(now.getDate() - 10);
        return created >= tenDaysAgo;
      }
      case "lastMonth": {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return created >= oneMonthAgo;
      }
      case "lastYear": {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return created >= oneYearAgo;
      }
      default:
        return true;
    }
  };
  const filterByMonth = (campaign) => {
    if (!monthFilter) return true; // no filter applied

    const campaignMonth = new Date(campaign.created_at).getMonth() + 1; // 1-12
    const filterMonth = parseInt(monthFilter, 10); // ensure numeric

    return campaignMonth === filterMonth;
  };

  const filterByAudience = (campaign) => {
    if (!audienceFilter) return true;
    const size = campaign.audience?.length || 0;

    switch (audienceFilter) {
      case "lt10":
        return size < 10;
      case "10to50":
        return size >= 10 && size <= 50;
      case "50to100":
        return size > 50 && size <= 100;
      case "100to500":
        return size > 100 && size <= 500;
      case "gt500":
        return size > 500;
      default:
        return true;
    }
  };

  const filteredSaved = savedCampaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.body.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      filterByDate(c) &&
      filterByAudience(c) &&
      filterByMonth(c)
    );
  });

  const filteredSent = sentCampaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.body.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      filterByDate(c) &&
      filterByAudience(c) &&
      filterByMonth(c)
    );
  });

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen rounded-lg">
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

      <div className="mt-10">
        <Card className="mb-6 shadow-sm rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 p-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-1/2 focus:ring-2 focus:ring-sky-500 dark:bg-slate-900 dark:text-white"
            />
            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All time</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All time</option>
              <option value="last2days">Last 2 days</option>
              <option value="last10days">Last 10 days</option>
              <option value="lastMonth">Last 1 month</option>
              <option value="lastYear">Last 1 year</option>
            </select>
            {/* Audience Filter */}
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
            >
              <option value="">All audiences</option>
              <option value="lt10">Less than 10</option>
              <option value="10to50">10 - 50</option>
              <option value="50to100">50 - 100</option>
              <option value="100to500">100 - 500</option>
              <option value="gt500">More than 500</option>
            </select>
          </div>
        </Card>

        {savedCampaigns.length === 0 && sentCampaigns.length === 0 ? (
          <Card className="shadow-sm rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 w-[75vw] h-[60vh] flex flex-col items-center justify-center p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Campaigns Available
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Start by creating your first campaign to reach your audience.
            </p>
          </Card>
        ) : (
          <Tabs
            value={campaignsTab}
            onValueChange={(e) => {
              setCampaignsTab(e);
              sessionStorage.setItem("campaignsTab", e);
            }}
            className="w-full"
          >
            {/* Tab Header */}
            <TabsList className="mb-1 w-full">
              <TabsTrigger value="Saved">Saved Campaigns</TabsTrigger>
              <TabsTrigger value="Sent">Sent Campaigns</TabsTrigger>
            </TabsList>

            {/* Saved Campaigns */}
            <TabsContent value="Saved">
              <div className="grid grid-cols-1 gap-6 p-6">
                {filteredSaved.map((c) => (
                  <Card
                    key={c.id}
                    className="shadow-sm rounded-2xl border hover:scale-[1.01] transition-all duration-200 hover:shadow-lg bg-white/70 dark:bg-slate-800/50 border-slate-200/50 dark:border-white/20 cursor-pointer h-full"
                  >
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                          {c.name}
                        </h3>

                        <Link
                          href={`/campaigns/${c.name}`}
                          className="text-sm px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 
                       bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600
                       transition-colors"
                        >
                          Edit
                        </Link>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {c.subject}
                      </p>

                      <p className="text-sm text-slate-900 dark:text-white line-clamp-3 flex-grow leading-relaxed mb-3">
                        {c.body.length > 50
                          ? `${c.body.slice(0, 50)}...`
                          : c.body}
                      </p>

                      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-auto pt-3 border-t border-slate-200 dark:border-slate-700">
                        <span>
                          {c.audience?.length > 0
                            ? `${c.audience.length} recipients`
                            : "No recipients"}
                        </span>
                        <span>
                          Last edited:{" "}
                          {new Date(
                            c.updated_at || c.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sent Campaigns */}
            <TabsContent value="Sent">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSent.map((c) => (
                  <Card key={c.id}>
                    <CardContent>
                      <Link href={`/campaigns/${c.name}`}>
                        <h3 className="font-semibold text-lg">{c.name}</h3>
                      </Link>
                      <p className="text-sm text-slate-600">{c.subject}</p>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => handleDuplicateCampaign(c)}>
                          Duplicate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
