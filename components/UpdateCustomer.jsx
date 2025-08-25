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
  Calendar,
  Phone,
  Mail,
  Presentation,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  UserPlus,
  X,
  ArrowRightToLine,
  BookmarkPlus,
  Delete,
  Edit,
  SquareCheckBig,
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
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

export default function Customer(customer_id) {
  const today = new Date().toISOString().split("T")[0];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CustomerData, setCustomerData] = useState({});
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState({ newProduct: {} });

  const handleCustomerChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };
  const fetchCustomerData = async () => {
    const { data, error } = await supabase
      .from("Customers")
      .select("*")
      .eq("id", customer_id.customer_id)
      .single();

    if (error) {
      console.error("Error fetching customer data:", error);
    } else {
      setCustomerData(data);
    }
  };
  useEffect(() => {
    fetchCustomerData();
  }, [customer_id]);

  console.log("CustomerData:", CustomerData);

  const iconMap = {
    meeting: Calendar,
    call: Phone,
    email: Mail,
    demo: Presentation,
    closed: CheckCircle2,
    open: XCircle,
    stage: ArrowRightLeft,
    customer: UserPlus,
  };

  const colorMap = {
    open: "text-blue-500",
    closed: "text-green-500",
    stage: "text-purple-500",
    customer: "text-orange-500",
  };

  const handleUpdateDB = async () => {
    setLoading(true);
    const dataToUpdate = {
      name: CustomerData.name,
      email: CustomerData.email,
      number: CustomerData.number,
      linkedIn: CustomerData.linkedIn,
      location: CustomerData.location,
      website: CustomerData.website,
      industry: CustomerData.industry,
      address: CustomerData.address,
      price: CustomerData.price,
      issues: CustomerData.issues,
      status: CustomerData.status,
      created_at: CustomerData.created_at,
    };
    const { data: customerDetails, error: customerDetailsError } =
      await supabase
        .from("Customers")
        .select("*")
        .eq("id", customer_id.customer_id)
        .single();
    console.log(customerDetails);
    console.log("customer data:", CustomerData);
    const noChanges =
      customerDetails.name === CustomerData.name &&
      customerDetails.email === CustomerData.email &&
      customerDetails.number === CustomerData.number &&
      customerDetails.linkedIn === CustomerData.linkedIn &&
      customerDetails.address === CustomerData.address &&
      customerDetails.location === CustomerData.location &&
      customerDetails.website === CustomerData.website &&
      customerDetails.industry === CustomerData.industry &&
      customerDetails.status === CustomerData.status &&
      customerDetails.price === CustomerData.price &&
      customerDetails.issues === CustomerData.issues &&
      customerDetails.created_at === CustomerData.created_at;

    if (noChanges) {
      toast.info("No changes detected.", { position: "top-right" });
      return;
    } else {
      const { error } = await supabase
        .from("Customers")
        .update(dataToUpdate)
        .eq("id", customer_id.customer_id);

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
        fetchCustomerData();
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div>
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
      </div>
      <div className="py-4  md:py-6 w-full mx-auto space-y-6 bg-slate-50 dark:bg-slate-900 p-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="customerName">
            Customer Name
          </Label>
          <Input
            className="bg-white"
            id="customerName"
            placeholder="Customer Name"
            value={CustomerData.name || ""}
            onChange={(e) => handleCustomerChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="customerEmail">
            Customer email
          </Label>
          <Input
            className="bg-white"
            id="customerEmail"
            placeholder="Customer email"
            value={CustomerData.email || ""}
            onChange={(e) => handleCustomerChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="customerNumber">
            Phone Number
          </Label>
          <Input
            className="bg-white"
            id="customerNumber"
            placeholder="Customer's Phone Number"
            value={CustomerData.number || ""}
            onChange={(e) => handleCustomerChange("number", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="linkedIn">
            Customer linkedIn
          </Label>
          <Input
            className="bg-white"
            id="linkedIn"
            placeholder="Customer linkedIn"
            value={CustomerData.linkedIn || ""}
            onChange={(e) => handleCustomerChange("linkedIn", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="location">
            Customer location
          </Label>
          <Input
            className="bg-white"
            id="location"
            placeholder="Customer location"
            value={CustomerData.location || ""}
            onChange={(e) => handleCustomerChange("location", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="website">
            Customer website
          </Label>
          <Input
            className="bg-white"
            id="website"
            placeholder="Customer website"
            value={CustomerData.website || ""}
            onChange={(e) => handleCustomerChange("website", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="industry">
            Customer Industry
          </Label>
          <Input
            className="bg-white"
            id="industry"
            placeholder="Customer Industry"
            value={CustomerData.industry || ""}
            onChange={(e) => handleCustomerChange("industry", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="status">
            Customer status
          </Label>
          <Input
            className="bg-white"
            id="status"
            placeholder="Customer status"
            value={CustomerData.status || ""}
            onChange={(e) => handleCustomerChange("status", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="address">
            Customer address
          </Label>
          <Input
            className="bg-white"
            id="address"
            placeholder="Customer address"
            value={CustomerData.address || ""}
            onChange={(e) => handleCustomerChange("address", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="price">
            Customer price
          </Label>
          <Input
            className="bg-white"
            id="price"
            placeholder="Customer price"
            value={CustomerData.price || ""}
            onChange={(e) => handleCustomerChange("price", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="issues">
            Customer issues
          </Label>
          <Input
            className="bg-white"
            id="issues"
            placeholder="Customer issues"
            value={CustomerData.issues || ""}
            onChange={(e) => handleCustomerChange("issues", e.target.value)}
          />
        </div>
      </div>
      <div className="py-4  md:py-6 w-full mx-auto space-y-6 bg-slate-50 dark:bg-slate-900 p-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={handleUpdateDB}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Update Customer Data
        </Button>
      </div>
    </div>
  );
}
