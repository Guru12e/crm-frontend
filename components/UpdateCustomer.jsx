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

export default function UpdateCustomer(customer_id, onChange) {
  const today = new Date().toISOString().split("T")[0];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CustomerData, setCustomerData] = useState({});
  const [messages, setMessages] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
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
      setMessages(data.messages || []);
      setPurchaseHistory(data.purchaseHistory || []);
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
          <Label
            htmlFor="status"
            className="mb-2 text-slate-700 dark:text-slate-300"
          >
            Customer Status
          </Label>
          <Select
            value={CustomerData.status}
            onValueChange={(value) => handleCustomerChange("status", value)}
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
      <Card className="bg-transparent text-gray-600 border-0">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>

        <CardContent>
          <Card className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
            <CardContent>
              {purchaseHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Purchase Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Products Purchased
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {purchaseHistory.map((purchase, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">
                            {purchase.purchase_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">
                            {purchase.price}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                            {purchase.product}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                  <BookmarkPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    No purchase history yet. Products purchased by{" "}
                    {CustomerData.name} will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Card className="bg-transparent text-gray-600 border-0">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Latest Messages</CardTitle>
        </CardHeader>

        <CardContent>
          {messages && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.slice(-5).map((msg, idx) => (
                <Card
                  key={idx}
                  className={`rounded-xl shadow-sm border ${
                    msg.type === "customer"
                      ? "border-blue-400 bg-blue-50 dark:bg-slate-800/50"
                      : "border-green-400 bg-green-50 dark:bg-slate-800/50"
                  }`}
                >
                  <CardContent className="p-3">
                    {/* Sender Type */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          msg.type === "customer"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {msg.type === "customer" ? "Customer" : "Assistant"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Message Content */}
                    <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <p className="text-sm">No messages found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
