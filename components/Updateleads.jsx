"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  Sheet,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
};

export default function leads(lead_id) {
  const [LeadsData, setLeadsData] = useState({});
  const [errors, setErrors] = useState({ newProduct: {} });

  const handleLeadChange = (field, value) => {
    setLeadsData((prev) => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    const fetchLeadData = async () => {
      const { data, error } = await supabase
        .from("Leads")
        .select("*")
        .eq("id", lead_id.lead_id)
        .single();

      if (error) {
        console.error("Error fetching lead data:", error);
      } else {
        setLeadsData(data);
      }
    };

    fetchLeadData();
  }, [lead_id]);

  console.log("LeadsData:", LeadsData);
  const handleUpdateDB = async () => {
    const dataToUpdate = {
      name: LeadsData.name,
      email: LeadsData.email,
      number: LeadsData.phone,
      age: LeadsData.age,
      linkedIn: LeadsData.linkedIn,
      industry: LeadsData.industry,
      company: LeadsData.company,
      income: LeadsData.income,
      website: LeadsData.website,
      status: LeadsData.status,
      source: LeadsData.source,
      address: LeadsData.address,
      description: LeadsData.description,
    };
    const { data: LeadDetails, error: LeadDetailsError } = await supabase
      .from("Leads")
      .select("*")
      .eq("id", lead_id.lead_id)
      .single();
    console.log(LeadDetails);
    console.log("Lead data:", LeadsData);
    const noChanges =
      LeadDetails.name === LeadsData.name &&
      LeadDetails.email === LeadsData.email &&
      LeadDetails.number === LeadsData.number &&
      LeadDetails.age === LeadsData.age &&
      LeadDetails.linkedIn === LeadsData.linkedIn &&
      LeadDetails.industry === LeadsData.industry &&
      LeadDetails.company === LeadsData.company &&
      LeadDetails.income === LeadsData.income &&
      LeadDetails.website === LeadsData.website &&
      LeadDetails.status === LeadsData.status &&
      LeadDetails.source === LeadsData.source &&
      LeadDetails.address === LeadsData.address &&
      LeadDetails.description === LeadsData.description;

    if (noChanges) {
      toast.info("No changes detected.", { position: "top-right" });
      return;
    } else {
      const { error } = await supabase
        .from("Leads")
        .update(dataToUpdate)
        .eq("id", lead_id.lead_id);

      if (error) {
        console.error("Error updating database:", error);
        toast.error("Error updating database!", { position: "top-right" });
      } else {
        toast.success(
          "Data updated permanently. All changes made are permanent.",
          { position: "top-right" }
        );
        window.location.reload();
        localStorage.removeItem("companyDataCache");
      }
    }
  };
  return (
    <div className="flex flex-col overflow-y-scroll">
      <div className="py-4 md:py-6 w-full mx-auto space-y-6 bg-slate-50 dark:bg-slate-900">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div>
          <Label className={"mb-4"} htmlFor="leadName">
            Lead Name
          </Label>
          <Input
            id="leadName"
            placeholder="Lead Name"
            value={LeadsData.name || ""}
            onChange={(e) => handleLeadChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="leadEmail">
            Lead email
          </Label>
          <Input
            id="leadEmail"
            placeholder="Lead email"
            value={LeadsData.email || ""}
            onChange={(e) => handleLeadChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="leadNumber">
            Phone Number
          </Label>
          <Input
            id="leadNumber"
            placeholder="Lead's Phone Number"
            value={LeadsData.number || ""}
            onChange={(e) => handleLeadChange("phone", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="age">
            Lead age
          </Label>
          <Input
            id="age"
            placeholder="Lead age"
            value={LeadsData.age || ""}
            onChange={(e) => handleLeadChange("age", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="linkedIn">
            LinkedIn
          </Label>
          <Input
            id="linkedIn"
            placeholder="LinkedIn profile URL"
            value={LeadsData.linkedIn || ""}
            onChange={(e) => handleLeadChange("linkedIn", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="leadIndustry">
            Lead industry
          </Label>
          <Input
            id="leadIndustry"
            placeholder="Lead industry"
            value={LeadsData.industry || ""}
            onChange={(e) => handleLeadChange("industry", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="company">
            Lead Company
          </Label>
          <Input
            id="company"
            placeholder="LeadCompany"
            value={LeadsData.company || ""}
            onChange={(e) => handleLeadChange("company", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="income">
            Lead income
          </Label>
          <Input
            id="income"
            placeholder="Lead income"
            value={LeadsData.income || ""}
            onChange={(e) => handleLeadChange("income", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="website">
            Lead website
          </Label>
          <Input
            id="website"
            placeholder="Lead website"
            value={LeadsData.website || ""}
            onChange={(e) => handleLeadChange("website", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="status">
            Lead status
          </Label>
          <Input
            id="status"
            placeholder="Your Lead status"
            value={LeadsData.status || ""}
            onChange={(e) => handleLeadChange("status", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="leadSource">
            Lead source
          </Label>
          <Input
            id="leadSource"
            placeholder="Your Lead source"
            value={LeadsData.source || ""}
            onChange={(e) => handleLeadChange("source", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="leadAddress">
            Lead address
          </Label>
          <Input
            id="leadAddress"
            placeholder="Your Lead address"
            value={LeadsData.address || ""}
            onChange={(e) => handleLeadChange("address", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="description">
            Lead description
          </Label>
          <Input
            id="description"
            placeholder="Lead description"
            value={LeadsData.description || ""}
            onChange={(e) => handleLeadChange("description", e.target.value)}
          />
        </div>
        <Button
          onClick={handleUpdateDB}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Update Lead Data
        </Button>
      </div>
    </div>
  );
}
