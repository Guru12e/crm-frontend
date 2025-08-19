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
import { set } from "lodash";
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
};

export default function Deals(deal_id) {
  const [loading, setLoading] = useState(false);
  const [DealsData, setDealsData] = useState({});
  const [errors, setErrors] = useState({ newProduct: {} });

  const handleDealChange = (field, value) => {
    setDealsData((prev) => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    const fetchDealData = async () => {
      const { data, error } = await supabase
        .from("Deals")
        .select("*")
        .eq("id", deal_id.deal_id)
        .single();

      if (error) {
        console.error("Error fetching deal data:", error);
      } else {
        setDealsData(data);
      }
    };

    fetchDealData();
  }, [deal_id]);

  console.log("DealsData:", DealsData);
  const handleUpdateDB = async () => {
    setLoading(true);
    const dataToUpdate = {
      name: DealsData.name,
      email: DealsData.email,
      number: DealsData.number,
      age: DealsData.age,
      linkedIn: DealsData.linkedIn,
      industry: DealsData.industry,
      company: DealsData.company,
      income: DealsData.income,
      website: DealsData.website,
      status: DealsData.status,
      source: DealsData.source,
      address: DealsData.address,
      description: DealsData.description,
    };
    const { data: dealDetails, error: dealDetailsError } = await supabase
      .from("Deals")
      .select("*")
      .eq("id", deal_id.deal_id)
      .single();
    console.log(dealDetails);
    console.log("deal data:", DealsData);
    const noChanges =
      dealDetails.name === DealsData.name &&
      dealDetails.email === DealsData.email &&
      dealDetails.number === DealsData.number &&
      dealDetails.age === DealsData.age &&
      dealDetails.linkedIn === DealsData.linkedIn &&
      dealDetails.industry === DealsData.industry &&
      dealDetails.company === DealsData.company &&
      dealDetails.income === DealsData.income &&
      dealDetails.website === DealsData.website &&
      dealDetails.status === DealsData.status &&
      dealDetails.source === DealsData.source &&
      dealDetails.address === DealsData.address &&
      dealDetails.description === DealsData.description;

    if (noChanges) {
      toast.info("No changes detected.", { position: "top-right" });
      return;
    } else {
      const { error } = await supabase
        .from("Deals")
        .update(dataToUpdate)
        .eq("id", deal_id.deal_id);

      if (error) {
        console.error("Error updating database:", error);
        toast.error("Error updating database!", { position: "top-right" });
      } else {
        toast.success(
          "Data updated permanently. All changes made are permanent.",
          { position: "top-right" }
        );
        localStorage.removeItem("companyDataCache");
        setLoading(false);
        window.location.reload();
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
          <Label className={"mb-4"} htmlFor="dealName">
            deal Name
          </Label>
          <Input
            id="dealName"
            placeholder="deal Name"
            value={DealsData.name || ""}
            onChange={(e) => handleDealChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="dealEmail">
            deal email
          </Label>
          <Input
            id="dealEmail"
            placeholder="deal email"
            value={DealsData.email || ""}
            onChange={(e) => handleDealChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="dealNumber">
            Phone Number
          </Label>
          <Input
            id="dealNumber"
            placeholder="deal's Phone Number"
            value={DealsData.number || ""}
            onChange={(e) => handleDealChange("number", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="age">
            deal age
          </Label>
          <Input
            id="age"
            placeholder="deal age"
            value={DealsData.age || ""}
            onChange={(e) => handleDealChange("age", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="linkedIn">
            LinkedIn
          </Label>
          <Input
            id="linkedIn"
            placeholder="LinkedIn profile URL"
            value={DealsData.linkedIn || ""}
            onChange={(e) => handleDealChange("linkedIn", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="dealIndustry">
            deal industry
          </Label>
          <Input
            id="dealIndustry"
            placeholder="deal industry"
            value={DealsData.industry || ""}
            onChange={(e) => handleDealChange("industry", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="company">
            deal Company
          </Label>
          <Input
            id="company"
            placeholder="dealCompany"
            value={DealsData.company || ""}
            onChange={(e) => handleDealChange("company", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="income">
            deal income
          </Label>
          <Input
            id="income"
            placeholder="deal income"
            value={DealsData.income || ""}
            onChange={(e) => handleDealChange("income", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="website">
            deal website
          </Label>
          <Input
            id="website"
            placeholder="deal website"
            value={DealsData.website || ""}
            onChange={(e) => handleDealChange("website", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="status">
            deal status
          </Label>
          <Input
            id="status"
            placeholder="Your deal status"
            value={DealsData.status || ""}
            onChange={(e) => handleDealChange("status", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="Dealsource">
            deal source
          </Label>
          <Input
            id="Dealsource"
            placeholder="Your deal source"
            value={DealsData.source || ""}
            onChange={(e) => handleDealChange("source", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="dealAddress">
            deal address
          </Label>
          <Input
            id="dealAddress"
            placeholder="Your deal address"
            value={DealsData.address || ""}
            onChange={(e) => handleDealChange("address", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4"} htmlFor="description">
            deal description
          </Label>
          <Textarea
            id="description"
            placeholder="deal description"
            value={DealsData.description || ""}
            onChange={(e) => handleDealChange("description", e.target.value)}
          />
        </div>
        <Button
          onClick={handleUpdateDB}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Update deal Data
        </Button>
      </div>
    </div>
  );
}
