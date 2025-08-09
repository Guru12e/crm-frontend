"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const summaryStats = {
  customers: { total: 1247, new: 89, growth: 12 },
  leads: { total: 2456, qualified: 567, growth: 18 },
  deals: { total: 189, won: 67, growth: 15, value: 2340000 },
};

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
const mockCustomers = [
  {
    id: 1,
    name: "TechFlow Inc",
    contact: "Sarah Johnson",
    email: "sarah.j@techflow.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    industry: "Technology",
    value: "$45,000",
    status: "Active",
    onboardedDate: "2024-01-15",
    lastActivity: "2 days ago",
    source: "Referral",
  },
  {
    id: 2,
    name: "DataDrive Solutions",
    contact: "Michael Chen",
    email: "m.chen@datadrive.io",
    phone: "+1 (555) 987-6543",
    location: "Austin, TX",
    industry: "Software",
    value: "$78,500",
    status: "Active",
    onboardedDate: "2024-02-20",
    lastActivity: "1 day ago",
    source: "Website",
  },
  {
    id: 3,
    name: "GrowthCorp",
    contact: "Emily Rodriguez",
    email: "emily.r@growthcorp.com",
    phone: "+1 (555) 456-7890",
    location: "New York, NY",
    industry: "Marketing",
    value: "$125,000",
    status: "At Risk",
    onboardedDate: "2023-11-10",
    lastActivity: "1 week ago",
    source: "Campaign",
  },
];

let mockLeadsData = [
  {
    id: 1,
    name: "InnovateLab",
    contact: "David Kim",
    email: "d.kim@innovatelab.com",
    phone: "+1 (555) 234-5678",
    location: "Seattle, WA",
    industry: "Technology",
    score: 85,
    status: "New",
    source: "LinkedIn",
    created: "3 days ago",
    lastActivity: "1 day ago",
  },
  {
    id: 2,
    name: "ScaleUp Ventures",
    contact: "Lisa Thompson",
    email: "l.thompson@scaleup.vc",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    industry: "Finance",
    score: 92,
    status: "In progress",
    source: "Referral",
    created: "1 day ago",
    lastActivity: "2 hours ago",
  },
  {
    id: 3,
    name: "Dragon Ventures",
    contact: "Dwayne Thompson",
    email: "d.thompson@dragon.vc",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    industry: "Education",
    score: 78,
    status: "Contact Attempted",
    source: "Referral",
    created: "3 days ago",
    lastActivity: "1 hour ago",
  },
  {
    id: 4,
    name: "Snake Ventures",
    contact: "Morris Morkel",
    email: "m.morkel@snake.vc",
    phone: "+1 (555) 567-1234",
    location: "Denver, CO",
    industry: "Logistics",
    score: 80,
    status: "Meeting Booked",
    source: "Twitter",
    created: "2 days ago",
    lastActivity: "1 hour ago",
  },
  {
    id: 5,
    name: "NeuralTech",
    contact: "Jenna Park",
    email: "jenna@neuraltech.ai",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    industry: "AI",
    score: 91,
    status: "Contacted",
    source: "Event",
    created: "4 days ago",
    lastActivity: "Yesterday",
  },
  {
    id: 6,
    name: "OceanNet",
    contact: "Carl Nguyen",
    email: "carl@oceannet.io",
    phone: "+1 (555) 789-4561",
    location: "Miami, FL",
    industry: "Telecom",
    score: 74,
    status: "Qualified",
    source: "Cold Email",
    created: "5 days ago",
    lastActivity: "2 days ago",
  },
  {
    id: 7,
    name: "BrightWare",
    contact: "Priya Desai",
    email: "p.desai@brightware.com",
    phone: "+1 (555) 222-3344",
    location: "San Diego, CA",
    industry: "Software",
    score: 68,
    status: "Unqualified",
    source: "Website",
    created: "6 days ago",
    lastActivity: "5 days ago",
  },
  {
    id: 8,
    name: "GreenMatrix",
    contact: "Tom Richards",
    email: "tom.r@greenmatrix.org",
    phone: "+1 (555) 321-4567",
    location: "Portland, OR",
    industry: "Sustainability",
    score: 88,
    status: "New",
    source: "Campaign",
    created: "2 days ago",
    lastActivity: "Today",
  },
  {
    id: 9,
    name: "Finverse",
    contact: "Rita Singh",
    email: "r.singh@finverse.com",
    phone: "+1 (555) 908-7654",
    location: "Atlanta, GA",
    industry: "Finance",
    score: 82,
    status: "In progress",
    source: "LinkedIn",
    created: "1 week ago",
    lastActivity: "Yesterday",
  },
  {
    id: 10,
    name: "Aether Solutions",
    contact: "Ali Bashir",
    email: "a.bashir@aethersol.io",
    phone: "+1 (555) 901-2345",
    location: "Detroit, MI",
    industry: "Engineering",
    score: 89,
    status: "Qualified",
    source: "Cold Call",
    created: "5 days ago",
    lastActivity: "3 days ago",
  },
  {
    id: 11,
    name: "ZeroBit",
    contact: "Megan Wu",
    email: "megan@zerobit.tech",
    phone: "+1 (555) 876-4321",
    location: "Austin, TX",
    industry: "Cybersecurity",
    score: 90,
    status: "Meeting Booked",
    source: "Conference",
    created: "2 days ago",
    lastActivity: "1 hour ago",
  },
  {
    id: 12,
    name: "EvoLabs",
    contact: "Samir Patel",
    email: "samir@evolabs.org",
    phone: "+1 (555) 741-8529",
    location: "Phoenix, AZ",
    industry: "Biotech",
    score: 83,
    status: "Contacted",
    source: "Referral",
    created: "4 days ago",
    lastActivity: "Yesterday",
  },
  {
    id: 13,
    name: "BlockNet",
    contact: "Karla Gomez",
    email: "k.gomez@blocknet.io",
    phone: "+1 (555) 963-8527",
    location: "Dallas, TX",
    industry: "Blockchain",
    score: 76,
    status: "Contact Attempted",
    source: "Website",
    created: "6 days ago",
    lastActivity: "Today",
  },
  {
    id: 14,
    name: "FusionEdge",
    contact: "Ryan Burke",
    email: "r.burke@fusionedge.ai",
    phone: "+1 (555) 147-2583",
    location: "Las Vegas, NV",
    industry: "AI",
    score: 87,
    status: "In progress",
    source: "Cold Email",
    created: "3 days ago",
    lastActivity: "Yesterday",
  },
  {
    id: 15,
    name: "ClearCompute",
    contact: "Isabella Cruz",
    email: "i.cruz@clearcompute.com",
    phone: "+1 (555) 369-2587",
    location: "Charlotte, NC",
    industry: "Cloud",
    score: 84,
    status: "Qualified",
    source: "Partner",
    created: "5 days ago",
    lastActivity: "Today",
  },
];

let mockDealsData = [
  {
    id: 1,
    name: "Enterprise Package - TechFlow",
    company: "TechFlow Inc",
    value: "$89,000",
    status: "Negotiation",
    probability: 75,
    closeDate: "2024-12-15",
    owner: "Sarah Johnson",
    source: "Referral",
    lastActivity: "1 day ago",
  },
  {
    id: 2,
    name: "Annual Subscription - DataDrive",
    company: "DataDrive Solutions",
    value: "$156,000",
    status: "Proposal Sent",
    probability: 60,
    closeDate: "2024-12-30",
    owner: "Michael Chen",
    source: "Website",
    lastActivity: "3 hours ago",
  },
  {
    id: 3,
    name: "Basic Plan - GrowthCorp",
    company: "GrowthCorp",
    value: "$25,000",
    status: "New",
    probability: 25,
    closeDate: "2024-10-05",
    owner: "Emily Rodriguez",
    source: "Campaign",
    lastActivity: "2 days ago",
  },
  {
    id: 4,
    name: "Startup Bundle - InnovateLab",
    company: "InnovateLab",
    value: "$40,000",
    status: "On-hold",
    probability: 35,
    closeDate: "2024-11-20",
    owner: "David Kim",
    source: "LinkedIn",
    lastActivity: "3 days ago",
  },
  {
    id: 5,
    name: "Growth Plan - ScaleUp",
    company: "ScaleUp Ventures",
    value: "$110,000",
    status: "Negotiation",
    probability: 70,
    closeDate: "2024-12-05",
    owner: "Lisa Thompson",
    source: "Referral",
    lastActivity: "Yesterday",
  },
  {
    id: 6,
    name: "Corporate Deal - OceanNet",
    company: "OceanNet",
    value: "$95,000",
    status: "Proposal Sent",
    probability: 65,
    closeDate: "2024-10-25",
    owner: "Carl Nguyen",
    source: "Cold Email",
    lastActivity: "1 hour ago",
  },
  {
    id: 7,
    name: "Subscription - GreenMatrix",
    company: "GreenMatrix",
    value: "$78,000",
    status: "Closed-won",
    probability: 100,
    closeDate: "2024-08-01",
    owner: "Tom Richards",
    source: "Campaign",
    lastActivity: "Today",
  },
  {
    id: 8,
    name: "Premium Plan - BrightWare",
    company: "BrightWare",
    value: "$60,000",
    status: "Closed-lost",
    probability: 0,
    closeDate: "2024-07-15",
    owner: "Priya Desai",
    source: "Website",
    lastActivity: "Last week",
  },
  {
    id: 9,
    name: "Elite Tier - FusionEdge",
    company: "FusionEdge",
    value: "$142,000",
    status: "Abandoned",
    probability: 0,
    closeDate: "2024-09-30",
    owner: "Ryan Burke",
    source: "Cold Email",
    lastActivity: "2 days ago",
  },
  {
    id: 10,
    name: "AI Services - NeuralTech",
    company: "NeuralTech",
    value: "$130,000",
    status: "Negotiation",
    probability: 80,
    closeDate: "2024-11-10",
    owner: "Jenna Park",
    source: "Event",
    lastActivity: "Today",
  },
  {
    id: 11,
    name: "Security Suite - ZeroBit",
    company: "ZeroBit",
    value: "$105,000",
    status: "Proposal Sent",
    probability: 55,
    closeDate: "2024-10-22",
    owner: "Megan Wu",
    source: "Conference",
    lastActivity: "Yesterday",
  },
  {
    id: 12,
    name: "Enterprise AI - ClearCompute",
    company: "ClearCompute",
    value: "$125,000",
    status: "New",
    probability: 35,
    closeDate: "2024-09-18",
    owner: "Isabella Cruz",
    source: "Partner",
    lastActivity: "Today",
  },
  {
    id: 13,
    name: "Full Package - BlockNet",
    company: "BlockNet",
    value: "$88,000",
    status: "Negotiation",
    probability: 77,
    closeDate: "2024-12-05",
    owner: "Karla Gomez",
    source: "Website",
    lastActivity: "Today",
  },
  {
    id: 14,
    name: "Biotech Plan - EvoLabs",
    company: "EvoLabs",
    value: "$93,000",
    status: "On-hold",
    probability: 45,
    closeDate: "2024-11-01",
    owner: "Samir Patel",
    source: "Referral",
    lastActivity: "2 days ago",
  },
  {
    id: 15,
    name: "Team Plan - Aether Solutions",
    company: "Aether Solutions",
    value: "$68,000",
    status: "Closed-lost",
    probability: 0,
    closeDate: "2024-08-18",
    owner: "Ali Bashir",
    source: "Cold Call",
    lastActivity: "Last week",
  },
];

export default function CRM() {
  const [activeTab, setActiveTab] = useState("Customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const today = new Date();
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    linkedIn: "",
    location: "",
    job: "",
    jobRole: "",
    status: "",
    created_at: today,
  });
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
  });
  const [errors, setErrors] = useState({});
  const [customerLoading, setCustomerLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [mockLeads, setMockLeads] = useState(mockLeadsData);
  const [mockDeals, setMockDeals] = useState(mockDealsData);

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
      console.log(customerFormData);
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
          job: "",
          jobRole: "",
          status: "",
          created_at: "",
        });
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
    console.log(leadsFormData);
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
      console.log("From if");
      setLeadsLoading(false);
      setErrors(errors);
      return;
    } else {
      console.log("From else");
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
        });
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
    if (!isValid) {
      setDealsLoading(false);
      setErrors(errors);
      return;
    } else {
      console.log(dealFormData);
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
          job: "",
          jobRole: "",
          status: "",
          created_at: "",
        });
      } else {
        toast.error("Error in Adding Deal", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setDealsLoading(false);
    }
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

  const CustomerCard = ({ customer }) => (
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
                {customer.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
                {customer.contact}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400 gap-1 sm:gap-0">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">{customer.industry}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">{customer.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div className="text-left sm:text-right">
              <div className="text-base sm:text-lg font-bold text-green-600">
                {customer.value}
              </div>
              <Badge
                variant={
                  customer.status === "Active"
                    ? "default"
                    : customer.status === "At Risk"
                    ? "destructive"
                    : "secondary"
                }
              >
                {customer.status}
              </Badge>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                Last activity: {customer.lastActivity}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          </div>
          <div className="flex space-x-2 justify-center sm:justify-end">
            <Button size="sm" variant="ghost" className="p-2">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const LeadCard = ({ lead }) => (
    <Card className="backdrop-blur-sm bg-white/70 h-[25vh] z-0 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6 ">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                {lead.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
                {lead.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
                {lead.contact}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400 gap-1 sm:gap-0">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-xs">{lead.industry}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-4 mr-1 flex-shrink-0" />
                  <span className="break-words">{lead.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div className="text-left sm:text-right">
              <div className="text-base sm:text-lg font-bold text-blue-600">
                Score: {lead.score}
              </div>
              <Badge
                variant={
                  lead.status === "Hot"
                    ? "destructive"
                    : lead.status === "Qualified"
                    ? "default"
                    : "secondary"
                }
              >
                {lead.status}
              </Badge>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                Created: {lead.created}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <DropdownMenu className="relative">
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none cursor-pointer ${
                    lead.status === "Unqualified" || lead.status === "Qualified"
                      ? "hidden"
                      : "block"
                  } `}
                  onClick={() => setId(lead.id)}
                >
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[-50%] translate-y-[-120%] rounded-lg p-2 mt-2">
                {leadStatus
                  .slice(leadStatus.indexOf(lead.status) + 1)
                  .map((statu) => (
                    <DropdownMenuItem
                      className="cursor-pointer border-b border-gray-300"
                      key={statu}
                      onClick={() => {
                        {
                          console.log(lead.id);
                          const leadItem = mockLeads.find(
                            (l) => l.id === lead.id
                          );
                          const updateLeads = mockLeads.map((l) => {
                            if (l.id === leadItem.id) {
                              return { ...l, status: statu };
                            }
                            return l;
                          });
                          setMockLeads(updateLeads);
                        }
                      }}
                    >
                      {statu}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex space-x-2 justify-center sm:justify-end">
            <Button size="sm" variant="ghost" className="p-2">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DealCard = ({ deal }) => (
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white break-words">
              {deal.name}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 break-words">
              {deal.company}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400 gap-1 sm:gap-0">
              <span className="break-words">Owner: {deal.owner}</span>
              <span className="break-words">Source: {deal.source}</span>
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
            <div className="text-left sm:text-right">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {deal.value}
              </div>
              <Badge variant="outline">{deal.status}</Badge>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words">
                Close: {deal.closeDate}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600 dark:text-slate-400">
              Probability
            </span>
            <span className="font-medium">{deal.probability}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${deal.probability}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-100  transition-opacity">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none cursor-pointer`}
                >
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 absolute top-[100%] bg-gray-700 text-white transform translate-x-[-50%] translate-y-[-120%] rounded-lg p-2 mt-2">
                {dealStatus
                  .slice(dealStatus.indexOf(deal.status) + 1)
                  .map((status) => (
                    <DropdownMenuItem
                      className="cursor-pointer border-b border-gray-300"
                      key={status}
                      onClick={() => {
                        const updatedDeals = mockDeals.map((d) => {
                          if (d.id === deal.id && status === "Closed-won") {
                            return { ...d, status: status, probability: 100 };
                          } else if (
                            (d.id === deal.id && status === "Closed-lost") ||
                            status === "Abandoned"
                          ) {
                            return { ...d, status: status, probability: 0 };
                          } else if (d.id === deal.id) {
                            return { ...d, status: status };
                          }
                          return d;
                        });
                        setMockDeals(updatedDeals);
                      }}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              Add Note
            </Button>
          </div>
          <div className="flex space-x-2 justify-center sm:justify-end">
            <Button size="sm" variant="ghost" className="p-2">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="p-2">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            CRM Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage customers, leads, and deals with comprehensive filtering
          </p>
        </div>

        <Sheet>
          <SheetTrigger>
            <div className="bg-gradient-to-r px-3 py-2 rounded-xl from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full sm:w-auto">
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
                        value={customerFormData.job}
                        onValueChange={(value) =>
                          updateCustomerFormData("job", value)
                        }
                        className={errors.job ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.job ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage error={errors.job} />
                    </div>
                    <div>
                      <Label
                        htmlFor="jobRole"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Company Website
                      </Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        value={customerFormData.jobRole}
                        onChange={(e) =>
                          updateCustomerFormData("jobRole", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.jobRole ? "border-red-500" : ""
                        }`}
                        placeholder="https://yourcompany.com"
                      />
                      <ErrorMessage error={errors.jobRole} />
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
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
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">
                              Manufacturing
                            </SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <ErrorMessage error={errors.job} />
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
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">
                              In progress
                            </SelectItem>
                            <SelectItem value="contact attempted">
                              Contact attempted
                            </SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="unqualified">
                              Unqualified
                            </SelectItem>
                            <SelectItem value="meeting booked">
                              Meeting booked
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
                            <SelectItem value="advertisement">
                              Advertisement
                            </SelectItem>
                            <SelectItem value="cold call">Cold call</SelectItem>
                            <SelectItem value="employee referral">
                              Employee referral
                            </SelectItem>
                            <SelectItem value="external referral">
                              External referral
                            </SelectItem>
                            <SelectItem value="sales email alias">
                              Sales email alias
                            </SelectItem>
                            <SelectItem value="chat">Chat</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="web research">
                              Web Research
                            </SelectItem>
                            <SelectItem value="twitter">X(Twitter)</SelectItem>
                            <SelectItem value="public realtions">
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
                        <Input
                          id="source"
                          type="text"
                          value={dealFormData.source}
                          onChange={(e) =>
                            updateDealFormData("source", e.target.value)
                          }
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                            errors.source ? "border-red-500" : ""
                          }`}
                          placeholder="e.g., CRM Subscription - 1 Year"
                        />
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
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="proposal_sent">
                              Proposal Sent
                            </SelectItem>
                            <SelectItem value="negotiation">
                              Negotiation
                            </SelectItem>
                            <SelectItem value="contract_sent">
                              Contract Sent
                            </SelectItem>
                            <SelectItem value="closed_won">
                              Closed - Won
                            </SelectItem>
                            <SelectItem value="closed_lost">
                              Closed - Lost
                            </SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="abandoned">Abandoned</SelectItem>
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
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
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
          total={summaryStats.customers.total}
          subtitle={`${summaryStats.customers.new} new this month`}
          growth={summaryStats.customers.growth}
          icon={Users}
        />
        <SummaryCard
          title="Active Leads"
          total={summaryStats.leads.total}
          subtitle={`${summaryStats.leads.qualified} qualified`}
          growth={summaryStats.leads.growth}
          icon={TrendingUp}
        />
        <SummaryCard
          title="Active Deals"
          total={`$${(summaryStats.deals.value / 1000000).toFixed(1)}M`}
          subtitle={`${summaryStats.deals.total} deals • ${summaryStats.deals.won} won`}
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
                  <SelectItem value="all-statuses">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sources">All sources</SelectItem>
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
                  <SelectItem value="all-time">All time</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                  <SelectItem value="2024-10">October 2024</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 border-white/20 w-full lg:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced
              </Button>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="Customers" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {mockCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Leads" className="space-y-6">
          <div className="overflow-y-hidden">
            {leadStatus.map((leadState) => (
              <Card
                key={leadState}
                className="mt-4 h-[35vh] relative overflow-hidden"
              >
                <CardContent className="flex h-full p-0">
                  {/* Sticky Left Label */}
                  <div className="w-[15%] bg-gray-300 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-800 dark:text-white absolute text-center left-0 top-0 bottom-0 z-10">
                    {leadState}
                  </div>

                  {/* Scrollable Right Content */}
                  <div className="ml-[15%] w-[85%] overflow-y-scroll p-4">
                    <div className="grid grid-cols-2 gap-6 min-w-fit">
                      {mockLeads
                        .filter((lead) => lead.status === leadState)
                        .map((l) => (
                          <LeadCard key={l.id} lead={l} />
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
            {dealStatus.map((dealState) => (
              <Card
                key={dealState}
                className="mt-4 h-[35vh] relative overflow-hidden"
              >
                <CardContent className="flex h-full p-0">
                  {/* Sticky Left Label */}
                  <div className="w-[15%] bg-gray-300 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-800 dark:text-white absolute text-center left-0 top-0 bottom-0 z-10">
                    {dealState}
                  </div>

                  {/* Scrollable Right Content */}
                  <div className="ml-[15%] w-[85%] overflow-y-scroll p-4">
                    <div className="grid grid-cols-2 gap-6 min-w-fit">
                      {mockDeals
                        .filter((deal) => deal.status === dealState)
                        .map((deal) => (
                          <DealCard key={deal.id} deal={deal} />
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
