"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "next/link";
import Papa from "papaparse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Updateleads from "@/components/Updateleads";
import { Input } from "@/components/ui/input";
import LeadCard from "@/components/LeadCard";
import CustomerCard from "@/components/CustomerCard";
import DealCard from "@/components/DealCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users,
  TrendingUp,
  DollarSign,
  Filter,
  Search,
  Phone,
  Mail,
  Building2,
  MapPin,
  Star,
  StarOff,
  Eye,
  Edit,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { supabase } from "@/utils/supabase/client";
import { Elsie } from "next/font/google";

const summaryStats = {
  customers: { total: 1247, new: 89, growth: 12 },
  leads: { total: 2456, qualified: 567, growth: 18 },
  deals: { total: 189, won: 67, growth: 15, value: 2340000 },
};

const customerStatus = ["Active", "Inactive", "At Risk"];
const leadStatus = [
  "New",
  "In progress",
  "Contact Attempted",
  "Contacted",
  "Meeting Booked",
  "Qualified",
  "Unqualified",
];
const dealStatus = [
  "New",
  "Proposal Sent",
  "Negotiation",
  "Closed-won",
  "Closed-lost",
  "On-hold",
  "Abandoned",
];
const rawSession = localStorage.getItem("session");
const session = JSON.parse(rawSession);
const userEmail = session.user.email;

if (!userEmail) {
  console.error("User email not found in session");
}

export default function CRM() {
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "Customers"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sourceFilter, setSourceFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [dealsData, setDealsData] = useState([]);
  const today = new Date();
  sessionStorage.setItem("activeTab", activeTab);
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    linkedIn: "",
    location: "",
    website: "",
    industry: "",
    status: "",
    created_at: today,
  });
  const [showUpdateLeads, setShowUpdateLeads] = useState(false);
  const [leadsFormData, setLeadsFormData] = useState({
    name: "", //req
    email: "",
    phone: "", //req
    age: 18,
    linkedIn: "",
    industry: "",
    company: "",
    income: 0,
    website: "",
    status: "", //req
    source: "",
    address: "",
    description: "",
    user_email: userEmail,
  });
  const [dealFormData, setDealFormData] = useState({
    name: "", //req
    email: "",
    title: "", //req
    phone: "", //req
    company: "",
    value: 0, //req
    status: "", //req
    priority: "Low",
    closeDate: today,
    owner: "",
    source: "",
    description: "",
    user_email: userEmail,
  });
  const [errors, setErrors] = useState({});
  const [customerLoading, setCustomerLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(false);

  const ErrorMessage = ({ error }) =>
    error && (
      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );

  const updateCustomerFormData = (field, value) => {
    setCustomerFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const updateLeadsFormData = (field, value) => {
    setLeadsFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const updateDealFormData = (field, value) => {
    setDealFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
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
    fetchCustomers();
    fetchLeads();
    fetchDeals();
  }, [userEmail]);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerLoading(true);
    let isValid = true;
    if (!customerFormData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else {
      errors.name = "";
    }

    if (!customerFormData.number) {
      errors.number = "Number is Required";
      isValid = false;
    } else {
      errors.number = "";
    }

    if (!customerFormData.status) {
      errors.status = "Status is Required";
      isValid = false;
    } else {
      errors.status = "";
    }
    if (!customerFormData.created_at) {
      customerFormData.created_at = today;
      errors.created_at = "";
      isValid = true;
    }

    if (customerFormData.linkedIn) {
      if (!customerFormData.linkedIn.includes("https://www.linkedin.com/")) {
        errors.linkedIn = "Linked Url Required";
        isValid = false;
      } else {
        errors.linkedIn = "";
      }
    }
    if (!isValid) {
      setCustomerLoading(false);
      setErrors(errors);
      return;
    } else {
      const session = localStorage.getItem("session");
      const req = await fetch("/api/addCustomer", {
        method: "POST",
        body: JSON.stringify({
          ...customerFormData,
          session: JSON.parse(session),
        }),
      });

      if (req.status == 200) {
        toast.success("Customer Added", {
          autoClose: 3000,
          position: "top-right",
        });
        setCustomerFormData({
          name: "",
          phone: "",
          email: "",
          linkedIn: "",
          location: "",
          website: "",
          industry: "",
          status: "",
          created_at: "",
        });
        window.location.reload(); // refresh once right now
      } else {
        toast.error("Error in Adding Customer", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setCustomerLoading(false);
    }
  };
  const handleLeadsSubmit = async (e) => {
    e.preventDefault();
    setLeadsLoading(true);
    let isValid = true;
    if (!leadsFormData.name) {
      errors.leadName = "Name is required";
      isValid = false;
    } else {
      errors.leadName = "";
    }
    if (!leadsFormData.phone) {
      errors.leadPhone = "Phone is required";
      isValid = false;
    } else {
      errors.leadPhone = "";
    }
    if (!leadsFormData.status) {
      errors.leadStatus = "Status is required";
      isValid = false;
    } else {
      errors.leadStatus = "";
    }

    if (!isValid) {
      setLeadsLoading(false);
      setErrors(errors);
      return;
    } else {
      const session = localStorage.getItem("session");
      const req = await fetch("/api/addLeads", {
        method: "POST",
        body: JSON.stringify({
          ...leadsFormData,
          session: JSON.parse(session),
        }),
      });

      if (req.status == 200) {
        toast.success("Lead Added", {
          autoClose: 3000,
          position: "top-right",
        });
        setLeadsFormData({
          name: "",
          phone: "",
          email: "",
          linkedIn: "",
          location: "",
          job: "",
          jobRole: "",
          status: "",
          created_at: "",
          user_email: userEmail,
        });
        window.location.reload(); // refresh once right now
      } else {
        toast.error("Error in Adding Leads", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setLeadsLoading(false);
    }
  };

  const handleDealsSubmit = async (e) => {
    e.preventDefault();
    setDealsLoading(true);
    let isValid = true;
    if (!dealFormData.name) {
      errors.dealName = "Name is required";
      isValid = false;
    } else {
      errors.dealName = "";
    }
    if (!dealFormData.phone) {
      errors.dealPhone = "Phone is required";
      isValid = false;
    } else {
      errors.dealPhone = "";
    }
    if (!dealFormData.title) {
      errors.dealTitle = "Title is required";
      isValid = false;
    } else {
      errors.dealTitle = "";
    }
    if (!dealFormData.value) {
      errors.dealValue = "Value is required";
      isValid = false;
    } else {
      errors.dealValue = "";
    }
    if (!dealFormData.status) {
      errors.dealStatus = "Status is required";
      isValid = false;
    } else {
      errors.dealStatus = "";
    }
    if (!dealFormData.closeDate) {
      dealFormData.closeDate = today;
      errors.closeDate = "";
    }
    if (!dealFormData.created_at) {
      dealFormData.created_at = today;
    }
    if (!isValid) {
      setDealsLoading(false);
      setErrors(errors);
      return;
    } else {
      const session = localStorage.getItem("session");
      const req = await fetch("/api/addDeals", {
        method: "POST",
        body: JSON.stringify({
          ...dealFormData,
          session: JSON.parse(session),
        }),
      });

      if (req.status == 200) {
        toast.success("Deal Added", {
          autoClose: 3000,
          position: "top-right",
        });
        setDealFormData({
          name: "",
          phone: "",
          email: "",
          linkedIn: "",
          location: "",
          title: "",
          value: "",
          status: "",
          created_at: "",
          closeDate: "",
          user_email: userEmail,
        });
        window.location.reload(); // refresh once right now
      } else {
        toast.error("Error in Adding Deal", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setDealsLoading(false);
    }
  };

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
        window.location.reload(); // refresh once right now
        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:");
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
              <button className="bg-gradient-to-r px-3 py-2 rounded-xl from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full md:ml-5">
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

                        {/* Tip Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      {/* Download Template */}
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

                        {/* Select CSV File */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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

                        {/* Pro Tips */}
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

                        {/* Tip Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      {/* Download Template */}
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

                        {/* Select CSV File */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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

                        {/* Pro Tips */}
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

                        {/* Tip Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4 text-sm text-blue-700">
                          💡 <span className="font-semibold">Tip:</span>{" "}
                          Download our template to ensure your CSV is properly
                          formatted for import.
                        </div>
                      </div>

                      {/* Download Template */}
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

                        {/* Select CSV File */}
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            📂 Select CSV File
                          </h3>
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
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

                        {/* Pro Tips */}
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
            <div className="bg-gradient-to-r px-3 py-2 rounded-xl from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full md:ml-5">
              Add New {activeTab}
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New {activeTab}</SheetTitle>
              <SheetDescription>
                <>
                  <div
                    className={`${
                      activeTab == "Customers" ? "grid" : "hidden"
                    } p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                  >
                    <div>
                      <Label
                        htmlFor="name"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={customerFormData.name}
                        onChange={(e) =>
                          updateCustomerFormData("name", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Customer full name"
                      />
                      <ErrorMessage error={errors.name} />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerFormData.email}
                        onChange={(e) =>
                          updateCustomerFormData("email", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="customer@email.com"
                      />
                      <ErrorMessage error={errors.email} />
                    </div>
                    <div>
                      <Label
                        htmlFor="number"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Number
                      </Label>
                      <Input
                        id="number"
                        type="text"
                        value={customerFormData.number}
                        onChange={(e) =>
                          updateCustomerFormData("number", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.number ? "border-red-500" : ""
                        }`}
                        placeholder="+91 12345 67890"
                      />
                      <ErrorMessage error={errors.number} />
                    </div>
                    <div>
                      <Label
                        htmlFor="linkedIn"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedIn"
                        type="url"
                        value={customerFormData.linkedIn}
                        onChange={(e) =>
                          updateCustomerFormData("linkedIn", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.linkedIn ? "border-red-500" : ""
                        }`}
                        placeholder="LinkedIn profile URL"
                      />
                      <ErrorMessage error={errors.linkedIn} />
                    </div>
                    <div>
                      <Label
                        htmlFor="industry"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Industry
                      </Label>
                      <Select
                        value={customerFormData.industry}
                        onValueChange={(value) =>
                          updateCustomerFormData("industry", value)
                        }
                        className={errors.industry ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.industry ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage error={errors.industry} />
                    </div>
                    <div>
                      <Label
                        htmlFor="website"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Company Website
                      </Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        value={customerFormData.website}
                        onChange={(e) =>
                          updateCustomerFormData("website", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.website ? "border-red-500" : ""
                        }`}
                        placeholder="https://yourcompany.com"
                      />
                      <ErrorMessage error={errors.website} />
                    </div>
                    <div>
                      <Label
                        htmlFor="address"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Customer Address
                      </Label>
                      <Input
                        id="address"
                        type="url"
                        value={customerFormData.address}
                        onChange={(e) =>
                          updateCustomerFormData("address", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.address ? "border-red-500" : ""
                        }`}
                        placeholder="Customer Address"
                      />
                      <ErrorMessage error={errors.address} />
                    </div>
                    <div>
                      <Label
                        htmlFor="status"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Customer Status
                      </Label>
                      <Select
                        value={customerFormData.status}
                        onValueChange={(value) =>
                          updateCustomerFormData("status", value)
                        }
                        className={errors.status ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.status ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Customer Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="At Risk">At Risk</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage error={errors.status} />
                    </div>
                    <div>
                      <Label
                        htmlFor="price"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Customer Price
                      </Label>
                      <Input
                        id="price"
                        type="url"
                        value={customerFormData.price}
                        onChange={(e) =>
                          updateCustomerFormData("price", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.price ? "border-red-500" : ""
                        }`}
                        placeholder="Customer Price"
                      />
                      <ErrorMessage error={errors.price} />
                    </div>
                    <div>
                      <Label
                        htmlFor="issue"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Customer issue
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        value={customerFormData.issue}
                        onChange={(e) =>
                          updateCustomerFormData("issue", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.issue ? "border-red-500" : ""
                        }`}
                        placeholder="Customer issue"
                      />
                      <ErrorMessage error={errors.issue} />
                    </div>
                    <div>
                      <Label
                        htmlFor="issue"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Customer On-boarded Date
                      </Label>
                      <Input
                        id="onboarded-date"
                        type="date"
                        value={customerFormData.created_at}
                        onChange={(e) =>
                          updateCustomerFormData("created_at", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.created_at ? "border-red-500" : ""
                        }`}
                        placeholder="Customer On Boarded Date"
                      />
                      <ErrorMessage error={errors.created_at} />
                    </div>
                    <Button
                      disabled={customerLoading}
                      onClick={handleCustomerSubmit}
                      className={`${
                        customerLoading
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      }  cursor-pointer text-white`}
                    >
                      {customerLoading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Add Customers
                    </Button>
                  </div>
                  <div
                    className={`${activeTab == "Leads" ? "block" : "hidden"}`}
                  >
                    <div
                      className={`grid p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                    >
                      <div>
                        <Label
                          htmlFor="name"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={leadsFormData.name}
                          onChange={(e) =>
                            updateLeadsFormData("name", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          placeholder="Lead's full name"
                        />
                        <ErrorMessage error={errors.name} />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={leadsFormData.email}
                          onChange={(e) =>
                            updateLeadsFormData("email", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder="lead@email.com"
                        />
                        <ErrorMessage error={errors.email} />
                      </div>
                      <div>
                        <Label
                          htmlFor="number"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="text"
                          value={leadsFormData.phone}
                          onChange={(e) =>
                            updateLeadsFormData("phone", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.phone ? "border-red-500" : ""
                          }`}
                          placeholder="+91 12345 67890"
                        />
                        <ErrorMessage error={errors.phone} />
                      </div>
                      <div>
                        <Label
                          htmlFor="age"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Age
                        </Label>
                        <Input
                          id="age"
                          value={leadsFormData.age}
                          onChange={(e) =>
                            updateLeadsFormData("age", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.age ? "border-red-500" : ""
                          }`}
                          placeholder="Lead's age"
                        />
                        <ErrorMessage error={errors.age} />
                      </div>
                      <div>
                        <Label
                          htmlFor="linkedIn"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          LinkedIn Profile
                        </Label>
                        <Input
                          id="linkedIn"
                          type="url"
                          value={leadsFormData.linkedIn}
                          onChange={(e) =>
                            updateLeadsFormData("linkedIn", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.linkedIn ? "border-red-500" : ""
                          }`}
                          placeholder="LinkedIn profile URL"
                        />
                        <ErrorMessage error={errors.linkedIn} />
                      </div>
                      <div>
                        <Label
                          htmlFor="industry"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Industry
                        </Label>
                        <Select
                          value={leadsFormData.industry}
                          onValueChange={(value) =>
                            updateLeadsFormData("industry", value)
                          }
                          className={errors.industry ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.industry ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="Healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Manufacturing">
                              Manufacturing
                            </SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.industry} />
                      </div>
                      <div>
                        <Label
                          htmlFor="company"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Company
                        </Label>
                        <Input
                          id="company"
                          value={leadsFormData.company}
                          onChange={(e) =>
                            updateLeadsFormData("company", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.company ? "border-red-500" : ""
                          }`}
                          placeholder="Lead Company"
                        />
                        <ErrorMessage error={errors.company} />
                      </div>
                      <div>
                        <Label
                          htmlFor="income"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Income
                        </Label>
                        <Input
                          id="income"
                          value={leadsFormData.income}
                          onChange={(e) =>
                            updateLeadsFormData("income", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.income ? "border-red-500" : ""
                          }`}
                          placeholder="Lead's income"
                        />
                        <ErrorMessage error={errors.income} />
                      </div>
                      <div>
                        <Label
                          htmlFor="website"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Company Website
                        </Label>
                        <Input
                          id="companyWebsite"
                          type="url"
                          value={leadsFormData.website}
                          onChange={(e) =>
                            updateLeadsFormData("website", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.website ? "border-red-500" : ""
                          }`}
                          placeholder="https://yourcompany.com"
                        />
                        <ErrorMessage error={errors.website} />
                      </div>
                      <div>
                        <Label
                          htmlFor="status"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Lead Status
                        </Label>
                        <Select
                          value={leadsFormData.status}
                          onValueChange={(value) =>
                            updateLeadsFormData("status", value)
                          }
                          className={errors.status ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.status ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Lead Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="In progress">
                              In progress
                            </SelectItem>
                            <SelectItem value="Contact Attempted">
                              Contact Attempted
                            </SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Unqualified">
                              Unqualified
                            </SelectItem>
                            <SelectItem value="Meeting Booked">
                              Meeting Booked
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.status} />
                      </div>
                      <div>
                        <Label
                          htmlFor="source"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Lead Source
                        </Label>
                        <Select
                          value={leadsFormData.source}
                          onValueChange={(value) =>
                            updateLeadsFormData("source", value)
                          }
                          className={errors.source ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.source ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Lead Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Advertisement">
                              Advertisement
                            </SelectItem>
                            <SelectItem value="Cold call">Cold call</SelectItem>
                            <SelectItem value="Employee referral">
                              Employee referral
                            </SelectItem>
                            <SelectItem value="External referral">
                              External referral
                            </SelectItem>
                            <SelectItem value="Sales email alias">
                              Sales email alias
                            </SelectItem>
                            <SelectItem value="Chat">Chat</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Web Research">
                              Web Research
                            </SelectItem>
                            <SelectItem value="X(Twitter)">
                              X(Twitter)
                            </SelectItem>
                            <SelectItem value="Public relations">
                              Public relations
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.source} />
                      </div>
                      <div>
                        <Label
                          htmlFor="address"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Address
                        </Label>
                        <Input
                          id="address"
                          type="url"
                          value={leadsFormData.address}
                          onChange={(e) =>
                            updateLeadsFormData("address", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.address ? "border-red-500" : ""
                          }`}
                          placeholder="Lead's Address"
                        />
                        <ErrorMessage error={errors.address} />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={leadsFormData.description}
                        onChange={(e) =>
                          updateLeadsFormData("description", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.income ? "border-red-500" : ""
                        }`}
                        placeholder="Lead description"
                      />
                      <ErrorMessage error={errors.description} />
                      <Button
                        disabled={leadsLoading}
                        onClick={handleLeadsSubmit}
                        className={`${
                          leadsLoading
                            ? "bg-gray-400 hover:bg-gray-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        }  cursor-pointer text-white`}
                      >
                        {leadsLoading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Add Leads
                      </Button>
                    </div>
                  </div>
                  <div
                    className={`${activeTab == "Deals" ? "block" : "hidden"}`}
                  >
                    <div
                      className={`grid p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                    >
                      <div>
                        <Label
                          htmlFor="title"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Title
                        </Label>
                        <Input
                          id="title"
                          type="text"
                          value={dealFormData.title}
                          onChange={(e) =>
                            updateDealFormData("title", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.title ? "border-red-500" : ""
                          }`}
                          placeholder="e.g., CRM Subscription - 1 Year"
                        />
                        <ErrorMessage error={errors.title} />
                      </div>
                      <div>
                        <Label
                          htmlFor="name"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Name / Company
                        </Label>
                        <Input
                          id="name"
                          value={dealFormData.name}
                          onChange={(e) =>
                            updateDealFormData("name", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          placeholder="Full name of the deal"
                        />
                        <ErrorMessage error={errors.name} />
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="text"
                          value={dealFormData.phone}
                          onChange={(e) =>
                            updateDealFormData("phone", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.phone ? "border-red-500" : ""
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        <ErrorMessage error={errors.phone} />
                      </div>
                      <div>
                        <Label
                          htmlFor="owner"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Owner
                        </Label>
                        <Input
                          id="owner"
                          type="text"
                          value={dealFormData.owner}
                          onChange={(e) =>
                            updateDealFormData("owner", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.dealOwner ? "border-red-500" : ""
                          }`}
                          placeholder="e.g., John Doe"
                        />
                        <ErrorMessage error={errors.owner} />
                      </div>
                      <div>
                        <Label
                          htmlFor="source"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Source
                        </Label>
                        <Select
                          value={dealFormData.source}
                          onValueChange={(value) =>
                            updateDealFormData("source", value)
                          }
                          className={errors.source ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.source ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Deal Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Advertisement">
                              Advertisement
                            </SelectItem>
                            <SelectItem value="Cold call">Cold call</SelectItem>
                            <SelectItem value="Employee referral">
                              Employee referral
                            </SelectItem>
                            <SelectItem value="External referral">
                              External referral
                            </SelectItem>
                            <SelectItem value="Sales email alias">
                              Sales email alias
                            </SelectItem>
                            <SelectItem value="Chat">Chat</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Web Research">
                              Web Research
                            </SelectItem>
                            <SelectItem value="X(Twitter)">
                              X(Twitter)
                            </SelectItem>
                            <SelectItem value="Public relations">
                              Public relations
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.source} />
                      </div>
                      <div>
                        <Label
                          htmlFor="status"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Status
                        </Label>
                        <Select
                          value={dealFormData.status}
                          onValueChange={(value) =>
                            updateDealFormData("status", value)
                          }
                          className={errors.status ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.status ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Deal Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Proposal Sent">
                              Proposal Sent
                            </SelectItem>
                            <SelectItem value="Negotiation">
                              Negotiation
                            </SelectItem>
                            <SelectItem value="Contract Sent">
                              Contract Sent
                            </SelectItem>
                            <SelectItem value="Closed-won">
                              Closed - Won
                            </SelectItem>
                            <SelectItem value="Closed-lost">
                              Closed - Lost
                            </SelectItem>
                            <SelectItem value="On-hold">On Hold</SelectItem>
                            <SelectItem value="Abandoned">Abandoned</SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.dealStatus} />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={dealFormData.email}
                          onChange={(e) =>
                            updateDealFormData("email", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.dealEmail ? "border-red-500" : ""
                          }`}
                          placeholder="Enter email"
                        />
                        <ErrorMessage error={errors.dealEmail} />
                      </div>
                      <div>
                        <Label
                          htmlFor="priority"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Priority
                        </Label>
                        <Select
                          value={dealFormData.priority}
                          onValueChange={(value) =>
                            updateDealFormData("priority", value)
                          }
                          className={errors.priority ? "border-red-500" : ""}
                        >
                          <SelectTrigger
                            className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.priority ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Deal Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.priority} />
                      </div>
                      <div>
                        <Label
                          htmlFor="value"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Deal Amount / Value
                        </Label>
                        <Input
                          id="value"
                          type="number"
                          value={dealFormData.value}
                          onChange={(e) =>
                            updateDealFormData("value", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.value ? "border-red-500" : ""
                          }`}
                          placeholder="₹50000"
                        />
                        <ErrorMessage error={errors.value} />
                      </div>

                      <div>
                        <Label
                          htmlFor="closeDate"
                          className="mb-2 text-slate-700 dark:text-slate-300"
                        >
                          Expected Close Date
                        </Label>
                        <Input
                          id="closeDate"
                          type="date"
                          value={dealFormData.closeDate}
                          onChange={(e) =>
                            updateDealFormData("closeDate", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.closeDate ? "border-red-500" : ""
                          }`}
                          placeholder="YYYY-MM-DD"
                        />
                        <ErrorMessage error={errors.closeDate} />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="description"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Status Description
                      </Label>
                      <textarea
                        id="description"
                        type="text"
                        value={dealFormData.description}
                        onChange={(e) =>
                          updateDealFormData("description", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 w-full pl-1 border-white dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.description ? "border-red-500" : ""
                        }`}
                        placeholder="Enter the insights gathered during this status"
                      />
                      <Button
                        disabled={dealsLoading}
                        onClick={handleDealsSubmit}
                        className={`${
                          dealsLoading
                            ? "bg-gray-400 hover:bg-gray-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        }  cursor-pointer text-white`}
                      >
                        {dealsLoading && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Add Deals
                      </Button>
                    </div>
                  </div>
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
        onValueChange={setActiveTab}
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
          <div className="grid grid-cols-1 gap-6">
            {customersData
              .filter(
                (customer) =>
                  statusFilter === "All statuses" ||
                  customer.status === statusFilter
              )
              .map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
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
                    <div className="w-full md:w-[15%] absolute md:left-0 top-0 md:bottom-0 bg-gray-300 dark:bg-slate-800 flex items-center justify-center py-3 md:py-1 px-2 md:p-1 text-xl font-bold text-slate-800 dark:text-white z-10 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                      {leadState}
                    </div>

                    <div
                      className="w-full md:ml-[15%] md:w-[85%] 
                          h-[calc(35vh-40px)] md:h-full 
                          overflow-y-auto p-2 md:p-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 min-w-fit">
                        {leadsData
                          .filter((lead) => lead.status === leadState)
                          .map((l) => (
                            <LeadCard
                              key={l.id}
                              lead={l}
                              onChange={() => {
                                fetchLeads();
                              }}
                            />
                          ))}
                      </div>
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
                  className="mt-4 h-[35vh] relative overflow-hidden"
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
                              key={deal.id}
                              deal={deal}
                              onChange={() => {
                                fetchDeals();
                              }}
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
