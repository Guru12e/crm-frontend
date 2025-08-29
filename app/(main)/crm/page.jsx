"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import Papa from "papaparse";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeadCard from "@/components/cards/LeadCard";
import LeadForm from "@/components/forms/LeadForm";
import CustomerCard from "@/components/cards/CustomerCard";
import CustomerForm from "@/components/forms/CustomerForm";
import DealCard from "@/components/cards/DealCard";
import DealForm from "@/components/forms/DealForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users, TrendingUp, DollarSign, Search } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabase/client";
import {
  customerStatus,
  dealStatus,
  leadStatus,
  summaryStats,
} from "@/constants/constant";

export default function CRM() {
  const [activeTab, setActiveTab] = useState("Customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sourceFilter, setSourceFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);
  const [leadsData, setLeadsData] = useState([]);
  const [dealsData, setDealsData] = useState([]);
  const today = new Date();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const getSession = () => {
      const sessionJSON = JSON.parse(localStorage.getItem("session"));
      setSession(sessionJSON);
      setUserEmail(sessionJSON.user.email);
      setActiveTab(sessionStorage.getItem("activeTab") || "Customers");
    };
    const user = JSON.parse(localStorage.getItem("user"));
    setProducts(
      user?.products?.map((product) => ({
        value: product.name,
        label: product.name,
      })) || []
    );

    getSession();
  }, []);

  const fetchCustomers = async () => {
    const { data: customersData } = await supabase
      .from("Customers")
      .select("*")
      .eq("user_email", !userEmail ? "undefined" : userEmail)
      .order("created_at", { ascending: false });
    if (customersData) {
      setCustomersData(customersData);
    } else {
      console.error("Error fetching customers");
    }
  };

  const fetchLeads = async () => {
    const { data: leadsData } = await supabase
      .from("Leads")
      .select("*")
      .eq("user_email", !userEmail ? "undefined" : userEmail)
      .order("created_at", { ascending: false });
    if (leadsData) {
      setLeadsData(leadsData);
    } else {
      console.error("Error fetching leads");
    }
  };

  const fetchDeals = async () => {
    const { data: dealsData } = await supabase
      .from("Deals")
      .select("*")
      .eq("user_email", !userEmail ? "undefined" : userEmail)
      .order("created_at", { ascending: false });
    if (dealsData) {
      setDealsData(dealsData);
    } else {
      console.error("Error fetching deals");
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchCustomers();
      fetchLeads();
      fetchDeals();
    }

    const intervalId = setInterval(() => {
      fetchCustomers();
      fetchLeads();
      fetchDeals();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [userEmail]);

  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        results.data.forEach((item) => {
          item.user_email = userEmail;
          item.created_at = today;
        });

        const { data, error } = await supabase
          .from(activeTab)
          .insert(results.data);
        if (error) {
          console.error("Error inserting data:", error);
        } else {
          toast.success("Data inserted successfully:", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      },
    });
  };

  const SummaryCard = ({ title, total, subtitle, growth, icon: Icon }) => (
    <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {total}
            </p>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <Icon className="h-8 w-8 text-blue-500 mb-2" />
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />+{growth}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  const sum = dealsData.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
  const formatNumber = (num) => {
    if (num >= 1_000_000_000_000) {
      return (num / 1_000_000_000_000).toFixed(2) + "T";
    } else if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + "K";
    } else {
      return num.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-left sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            CRM Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage customers, leads, and deals with comprehensive filtering
          </p>
        </div>

        <div className="flex sm:flex-col py-5 md:py-0 md:flex-row md:ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white w-full md:ml-5 cursor-pointer">
                Upload {activeTab} CSV
              </button>
            </SheetTrigger>
            <SheetContent className="space-y-6 overflow-y-auto min-h-[80vh]">
              <SheetHeader>
                <SheetTitle>Upload {activeTab} CSV</SheetTitle>
                <SheetDescription>
                  <>
                    <div
                      className={`${
                        activeTab == "Customers" ? "grid" : "hidden"
                      } p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          📄 CSV Format Requirements
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                          <li>
                            Required Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>
                                <b>name</b>
                              </li>
                              <li>
                                <b>number</b>
                              </li>
                              <li>
                                <b>email</b>
                              </li>
                              <li>
                                <b>status</b>
                              </li>
                            </ul>
                          </li>
                          <li>
                            Optional Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>address</li>
                              <li>website</li>
                              <li>industry</li>
                              <li>linkedIn</li>
                              <li>price</li>
                              <li>issues</li>
                            </ul>
                          </li>
                        </ul>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      <div className="gap-4 md:space-y-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📥 Download Template
                          </h3>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open("/templates/customer_template.csv")
                            }
                          >
                            Download Sample CSV
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white cursor-pointer"
                          >
                            Choose File
                          </Button>
                          <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            💡 Pro Tips
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                            <li>Double-check for typos before uploading.</li>
                            <li>
                              Keep file size under 5MB for faster uploads.
                            </li>
                            <li>
                              Ensure phone numbers are in international format.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        activeTab == "Leads" ? "grid" : "hidden"
                      } p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          📄 CSV Format Requirements
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                          <li>
                            Required Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>
                                <b>name</b>
                              </li>
                              <li>
                                <b>number</b>
                              </li>
                              <li>
                                <b>status</b>
                              </li>
                            </ul>
                          </li>
                          <li>
                            Optional Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>email</li>
                              <li>age</li>
                              <li>industry</li>
                              <li>company</li>
                              <li>income</li>
                              <li>address</li>
                              <li>linkedIn</li>
                              <li>description</li>
                              <li>website</li>
                              <li>source</li>
                            </ul>
                          </li>
                        </ul>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      <div className="gap-4 md:space-y-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📥 Download Template
                          </h3>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open("/templates/leads_template.csv")
                            }
                          >
                            Download Sample CSV
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white"
                          >
                            Choose File
                          </Button>
                          <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            💡 Pro Tips
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                            <li>Double-check for typos before uploading.</li>
                            <li>
                              Keep file size under 5MB for faster uploads.
                            </li>
                            <li>
                              Ensure phone numbers are in international format.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        activeTab == "Deals" ? "grid" : "hidden"
                      } p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          📄 CSV Format Requirements
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                          <li>
                            Required Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>
                                <b>name</b>
                              </li>
                              <li>
                                <b>title</b>
                              </li>
                              <li>
                                <b>number</b>
                              </li>
                              <li>
                                <b>email</b>
                              </li>
                              <li>
                                <b>status</b>
                              </li>
                              <li>
                                <b>value</b>
                              </li>
                            </ul>
                          </li>
                          <li>
                            Optional Columns:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>owner</li>
                              <li>source</li>
                              <li>priority</li>
                              <li>closeDate</li>
                            </ul>
                          </li>
                        </ul>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      <div className="gap-4 md:space-y-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📥 Download Template
                          </h3>
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open("/templates/deals_template.csv")
                            }
                          >
                            Download Sample CSV
                          </Button>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white"
                          >
                            Choose File
                          </Button>
                          <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            💡 Pro Tips
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                            <li>Double-check for typos before uploading.</li>
                            <li>
                              Keep file size under 5MB for faster uploads.
                            </li>
                            <li>
                              Ensure phone numbers are in international format.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

        <Sheet>
          <SheetTrigger>
            <div className="bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white w-full md:ml-5">
              Add New {activeTab}
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New {activeTab}</SheetTitle>
              <SheetDescription>
                <>
                  {activeTab === "Customers" && (
                    <CustomerForm
                      session={session}
                      fetchCustomers={fetchCustomers}
                      setCustomersData={setCustomersData}
                    />
                  )}
                  {activeTab === "Leads" && (
                    <LeadForm
                      session={session}
                      fetchDeals={fetchDeals}
                      fetchLeads={fetchLeads}
                      setLeadsData={setLeadsData}
                    />
                  )}
                  {activeTab === "Deals" && (
                    <DealForm
                      fetchDeals={fetchDeals}
                      session={session}
                      products={products}
                      setDealsData={setDealsData}
                    />
                  )}
                </>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <SummaryCard
          title="On-boarded Customers"
          total={customersData.length}
          subtitle={`${
            customersData.filter((cust) => {
              const createdAt = new Date(cust.created_at);
              const now = new Date();
              return (
                createdAt.getMonth() === now.getMonth() &&
                createdAt.getFullYear() === now.getFullYear()
              );
            }).length
          } new this month`}
          growth={summaryStats.customers.growth}
          icon={Users}
        />
        <SummaryCard
          title="Active Leads"
          total={leadsData.length}
          subtitle={`${
            leadsData.filter((lead) => lead.status === "Qualified").length
          } qualified`}
          growth={summaryStats.leads.growth}
          icon={TrendingUp}
        />

        <SummaryCard
          title="Active Deals"
          total={formatNumber(sum)}
          subtitle={`${dealsData.length} deals • ${
            dealsData.filter((deal) => deal.status === "Closed - Won").length
          } won`}
          growth={summaryStats.deals.growth}
          icon={DollarSign}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(e) => {
          setActiveTab(e);
          sessionStorage.setItem("activeTab", e);
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/20">
          <TabsTrigger
            value="Customers"
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </TabsTrigger>
          <TabsTrigger value="Leads" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Leads</span>
          </TabsTrigger>
          <TabsTrigger value="Deals" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Deals</span>
          </TabsTrigger>
        </TabsList>

        <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All statuses">All statuses</SelectItem>
                  {activeTab === "Customers" ? (
                    <>
                      {customerStatus.map((state, index) => (
                        <SelectItem key={index} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </>
                  ) : activeTab === "Leads" ? (
                    <>
                      {leadStatus.map((state, index) => (
                        <SelectItem key={index} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <>
                      {dealStatus.map((state, index) => (
                        <SelectItem key={index} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All sources">All sources</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Campaign">Campaign</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All time">All time</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                  <SelectItem value="2024-10">October 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="Customers" className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {customersData
              .filter(
                (customer) =>
                  statusFilter === "All statuses" ||
                  customer.status === statusFilter
              )
              .map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onChange={fetchCustomers}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="Leads" className="space-y-6">
          <div className="overflow-y-hidden">
            {leadStatus
              .filter(
                (leadState) =>
                  statusFilter === "All statuses" || leadState === statusFilter
              )
              .map((leadState) => (
                <Card
                  key={leadState}
                  className="mt-4 h-[35vh] relative overflow-hidden"
                >
                  <CardContent className="flex flex-col md:flex-row h-full p-0">
                    <div className="w-full md:w-[15%] absolute md:left-0 top-0 md:bottom-0 bg-gray-300 dark:bg-slate-800 flex items-center text-center justify-center py-3 md:py-1 px-2 md:p-1 text-xl font-bold text-slate-800 dark:text-white z-10 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                      {leadState}
                    </div>

                    <div
                      className="w-full md:ml-[15%] md:w-[85%] 
                          h-[calc(35vh-40px)] md:h-full 
                          overflow-y-auto p-2 md:p-4"
                    >
                      <Sheet>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 min-w-fit">
                          {leadsData
                            .filter((lead) => lead.status === leadState)
                            .map((l) => (
                              <LeadCard
                                fetchLeads={fetchLeads}
                                fetchDeals={fetchDeals}
                                key={l.id}
                                lead={l}
                                setData={setLeadsData}
                                onChange={() => {
                                  fetchLeads();
                                }}
                              />
                            ))}
                        </div>
                      </Sheet>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="Deals" className="space-y-6">
          <div className="overflow-y-hidden">
            {dealStatus
              .filter(
                (dealState) =>
                  statusFilter === "All statuses" || dealState === statusFilter
              )
              .map((dealState) => (
                <Card
                  key={dealState}
                  className="mt-4 h-[45vh] relative overflow-hidden"
                >
                  <CardContent className="flex flex-col md:flex-row h-full p-0">
                    <div className="w-full md:w-[15%] absolute md:left-0 top-0 md:bottom-0 bg-gray-300 dark:bg-slate-800 flex items-center justify-center py-3 md:py-1 px-2 md:p-1 text-xl font-bold text-slate-800 dark:text-white z-10 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                      {dealState}
                    </div>

                    <div
                      className="w-full md:ml-[15%] md:w-[85%] 
                          h-[calc(35vh-40px)] md:h-full 
                          overflow-y-auto p-2 md:p-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 min-w-fit">
                        {dealsData
                          .filter((deal) => deal.status === dealState)
                          .map((deal) => (
                            <DealCard
                              fetchDeals={fetchDeals}
                              fetchCustomers={fetchCustomers}
                              key={deal.id}
                              deal={deal}
                              onChange={() => {
                                fetchDeals();
                              }}
                              session={session}
                            />
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
