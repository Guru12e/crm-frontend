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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const summaryStats = {
  customers: { total: 1247, new: 89, growth: 12 },
  leads: { total: 2456, qualified: 567, growth: 18 },
  deals: { total: 189, won: 67, growth: 15, value: 2340000 },
};

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

const mockLeads = [
  {
    id: 1,
    name: "InnovateLab",
    contact: "David Kim",
    email: "d.kim@innovatelab.com",
    phone: "+1 (555) 234-5678",
    location: "Seattle, WA",
    industry: "Technology",
    score: 85,
    status: "Qualified",
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
    status: "Hot",
    source: "Referral",
    created: "1 day ago",
    lastActivity: "2 hours ago",
  },
];

const mockDeals = [
  {
    id: 1,
    name: "Enterprise Package - TechFlow",
    company: "TechFlow Inc",
    value: "$89,000",
    stage: "Negotiation",
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
    stage: "Proposal",
    probability: 60,
    closeDate: "2024-12-30",
    owner: "Michael Chen",
    source: "Website",
    lastActivity: "3 hours ago",
  },
];

export default function CRM() {
  const [activeTab, setActiveTab] = useState("Customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ErrorMessage = ({ error }) =>
    error && (
      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let isValid = true;
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    } else {
      errors.name = "";
    }

    if (!formData.number) {
      errors.number = "Number is Required";
      isValid = false;
    } else {
      errors.number = "";
    }

    if (!formData.status) {
      errors.status = "Status is Required";
      isValid = false;
    } else {
      errors.status = "";
    }

    if (formData.linkedIn) {
      if (!formData.linkedIn.includes("https://www.linkedin.com/")) {
        errors.linkedIn = "Linked Url Required";
        isValid = false;
      } else {
        errors.linkedIn = "";
      }
    }

    if (!isValid) {
      setLoading(false);
      setErrors(errors);
      return;
    } else {
      const session = localStorage.getItem("session");
      const req = await fetch("/api/addCustomer", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          session: JSON.parse(session),
        }),
      });

      if (req.status == 200) {
        toast.success("Customer Added", {
          autoClose: 3000,
          position: "top-right",
        });
        setFormData({
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

      setLoading(false);
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
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-300 group">
      <CardContent className="p-4 sm:p-6">
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
                  <span className="break-words">{lead.industry}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
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
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-1 sm:flex-none"
            >
              Convert
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
              <Badge variant="outline">{deal.stage}</Badge>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 border-white/20 flex-1 sm:flex-none"
            >
              Update Stage
            </Button>
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

        <Dialog>
          <DialogTrigger>
            <div className="bg-gradient-to-r px-3 py-2 rounded-xl from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full sm:w-auto">
              Add New {activeTab}
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New {activeTab}</DialogTitle>
              <DialogDescription>
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
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
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
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
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
                        value={formData.number}
                        onChange={(e) =>
                          updateFormData("number", e.target.value)
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
                        value={formData.linkedIn}
                        onChange={(e) =>
                          updateFormData("linkedIn", e.target.value)
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
                        value={formData.job}
                        onValueChange={(value) => updateFormData("job", value)}
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
                        value={formData.jobRole}
                        onChange={(e) =>
                          updateFormData("jobRole", e.target.value)
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
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
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
                        value={formData.status}
                        onValueChange={(value) =>
                          updateFormData("status", value)
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
                        value={formData.price}
                        onChange={(e) =>
                          updateFormData("price", e.target.value)
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
                        value={formData.issue}
                        onChange={(e) =>
                          updateFormData("issue", e.target.value)
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
                        value={formData.created_at}
                        onChange={(e) =>
                          updateFormData("created_at", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.created_at ? "border-red-500" : ""
                        }`}
                        placeholder="Customer On Boarded Date"
                      />
                      <ErrorMessage error={errors.created_at} />
                    </div>
                  </div>
                  <div
                    className={`${
                      activeTab == "Leads" ? "grid" : "hidden"
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
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
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
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
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
                        Number
                      </Label>
                      <Input
                        id="number"
                        type="text"
                        value={formData.number}
                        onChange={(e) =>
                          updateFormData("number", e.target.value)
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
                        htmlFor="age"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Age
                      </Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
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
                        value={formData.linkedIn}
                        onChange={(e) =>
                          updateFormData("linkedIn", e.target.value)
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
                        value={formData.job}
                        onValueChange={(value) => updateFormData("job", value)}
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
                        htmlFor="company"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          updateFormData("company", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.income ? "border-red-500" : ""
                        }`}
                        placeholder="Lead Company"
                      />
                      <ErrorMessage error={errors.income} />
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
                        value={formData.income}
                        onChange={(e) =>
                          updateFormData("income", e.target.value)
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
                        htmlFor="jobRole"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Company Website
                      </Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        value={formData.jobRole}
                        onChange={(e) =>
                          updateFormData("jobRole", e.target.value)
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
                        htmlFor="status"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Lead Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          updateFormData("status", value)
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
                        value={formData.source}
                        onValueChange={(value) =>
                          updateFormData("source", value)
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
                        value={formData.address}
                        onChange={(e) =>
                          updateFormData("address", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.address ? "border-red-500" : ""
                        }`}
                        placeholder="Lead's Address"
                      />
                      <ErrorMessage error={errors.address} />
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
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.income ? "border-red-500" : ""
                        }`}
                        placeholder="Lead description"
                      />
                      <ErrorMessage error={errors.description} />
                    </div>
                  </div>
                  <div
                    className={`${
                      activeTab == "Deals" ? "grid" : "hidden"
                    } p-3 grid-cols-1 md:grid-cols-2 gap-4`}
                  >
                    <div>
                      <Label
                        htmlFor="dealName"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Deal Name
                      </Label>
                      <Input
                        id="dealName"
                        value={formData.dealName}
                        onChange={(e) =>
                          updateFormData("dealName", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.dealName ? "border-red-500" : ""
                        }`}
                        placeholder="Full name of the deal"
                      />
                      <ErrorMessage error={errors.dealName} />
                    </div>

                    <div>
                      <Label
                        htmlFor="dealPhone"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="dealPhone"
                        type="text"
                        value={formData.dealPhone}
                        onChange={(e) =>
                          updateFormData("dealPhone", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.dealPhone ? "border-red-500" : ""
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      <ErrorMessage error={errors.dealPhone} />
                    </div>

                    <div>
                      <Label
                        htmlFor="dealTitle"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Deal Title
                      </Label>
                      <Input
                        id="dealTitle"
                        type="text"
                        value={formData.dealTitle}
                        onChange={(e) =>
                          updateFormData("dealTitle", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.dealTitle ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., CRM Subscription - 1 Year"
                      />
                      <ErrorMessage error={errors.dealTitle} />
                    </div>

                    <div>
                      <Label
                        htmlFor="dealStatus"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Deal Status
                      </Label>
                      <Select
                        value={formData.dealStatus}
                        onValueChange={(value) =>
                          updateFormData("dealStatus", value)
                        }
                        className={errors.dealStatus ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.dealStatus ? "border-red-500" : ""
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
                      <Label htmlFor="statusDescription"
                      className="mb-2 text-slate-700 dark:text-slate-300">
                        Status Description
                      </Label>
                      <textarea
                      id="statusDescription"
                        type="text"
                        value={formData.statusDescription}
                        onChange={(e) =>
                          updateFormData("dealAmount", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 w-full pl-1 border-white dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.statusDescription ? "border-red-500" : ""
                        }`}
                        placeholder="Enter the insights gathered during this stage"/>
                    </div>
                    <div>
                      <Label  htmlFor="dealType"
                        className="mb-2 text-slate-700 dark:text-slate-300">
                          Deal Type
                      </Label>
                      <Select
                        value={formData.dealType}
                        onValueChange={(value) =>
                          updateFormData("dealType", value)
                        }
                        className={errors.dealType ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.dealStatus ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Deal Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="existing">
                           Existing
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage error={errors.dealType} />
                    </div>
                     <div>
                      <Label  htmlFor="dealType"
                        className="mb-2 text-slate-700 dark:text-slate-300">
                          Deal Priority
                      </Label>
                      <Select
                        value={formData.dealPriority}
                        onValueChange={(value) =>
                          updateFormData("dealPriority", value)
                        }
                        className={errors.dealPriority ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.dealStatus ? "border-red-500" : ""
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
                      <ErrorMessage error={errors.dealPriority} />
                    </div>
                    <div>
                      <Label
                        htmlFor="dealAmount"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Deal Amount / Value
                      </Label>
                      <Input
                        id="dealAmount"
                        type="number"
                        value={formData.dealAmount}
                        onChange={(e) =>
                          updateFormData("dealAmount", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.dealAmount ? "border-red-500" : ""
                        }`}
                        placeholder="₹50000"
                      />
                      <ErrorMessage error={errors.dealAmount} />
                    </div>

                    <div>
                      <Label
                        htmlFor="expectedCloseDate"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Expected Close Date
                      </Label>
                      <Input
                        id="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) =>
                          updateFormData("expectedCloseDate", e.target.value)
                        }
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                          errors.expectedCloseDate ? "border-red-500" : ""
                        }`}
                        placeholder="YYYY-MM-DD"
                      />
                      <ErrorMessage error={errors.expectedCloseDate} />
                    </div>
                  </div>
                </>
                <div className="flex justify-between pt-6">
                  <Button
                    disabled={loading}
                    onClick={handleSubmit}
                    className={`${
                      loading
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    }  cursor-pointer text-white`}
                  >
                    {loading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Add {activeTab}
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
          <div className="grid grid-cols-1 gap-6">
            {mockLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Deals" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {mockDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
