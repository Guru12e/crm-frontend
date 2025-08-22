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
  ChevronDown,
  Activity,
  BookmarkPlus,
  X,
  ArrowRightToLine,
  Delete,
  Check,
  SquareCheckBig,
  SquareCheck,
  Edit,
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
  const today = new Date().toISOString().split("T")[0];
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [LeadsData, setLeadsData] = useState({});
  const [openActivities, setOpenActivities] = useState([]);
  const [closedActivities, setClosedActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [stageHistory, setStageHistory] = useState([]);
  const [errors, setErrors] = useState({ newProduct: {} });
  const handleLeadChange = (field, value) => {
    setLeadsData((prev) => ({ ...prev, [field]: value }));
  };
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
      setOpenActivities(
        typeof data.open_activities === "string"
          ? JSON.parse(data.open_activities || "[]")
          : data.open_activities || []
      );
      setClosedActivities(
        typeof data.closed_activities === "string"
          ? JSON.parse(data.closed_activities || "[]")
          : data.closed_activities || []
      );
      setStageHistory(
        typeof data.stage_history === "string"
          ? JSON.parse(data.stage_history || "[]")
          : data.stage_history || []
      );
    }
  };
  useEffect(() => {
    fetchLeadData();
  }, [lead_id]);

  console.log("LeadsData:", LeadsData);

  const [activitiesFormData, setActivitiesFormData] = useState({
    title: "",
    description: "",
    date: "",
  });
  const updateActivitiesFormData = (field, value) => {
    setActivitiesFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleUpdateActivity = async () => {
    setLoading(true);
    const { title, description, date } = activitiesFormData;
    const { error } = await supabase
      .from("Leads")
      .update({
        open_activities: [
          ...openActivities,
          {
            title,
            description,
            date,
            id: Date.now(),
            category: selectedActivity,
          },
        ],
      })
      .eq("id", lead_id.lead_id);
    if (error) {
      console.error("Error updating activity:", error);
      toast.error("Error updating activity!", { position: "top-right" });
    } else {
      await fetchLeadData();
      setActivitiesFormData({ title: "", description: "", date: "" });
      toast.success("Activity updated successfully!", {
        position: "top-right",
        zIndex: 9999,
      });
    }
  };
  const handleRemoveActivity = async (activityId) => {
    setLoading(true);
    const { error } = await supabase
      .from("Leads")
      .update({
        open_activities: openActivities.filter(
          (activity) => activity.id !== activityId
        ),
      })
      .eq("id", lead_id.lead_id);
    if (error) {
      console.error("Error removing activity:", error);
      toast.error("Error removing activity!", { position: "top-right" });
    } else {
      await fetchLeadData();
      toast.success("Activity removed successfully!", {
        position: "top-right",
        zIndex: 9999,
      });
    }
  };
  const handleEditActivity = (activityId, field, value) => {
    setOpenActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId ? { ...activity, [field]: value } : activity
      )
    );
  };
  const handleFinishEditActivity = async (activityId) => {
    setLoading(true);
    const updatedActivities = openActivities;

    const { error } = await supabase
      .from("Leads")
      .update({ open_activities: updatedActivities })
      .eq("id", lead_id.lead_id);

    if (error) {
      toast.error("Error updating activity!", {
        position: "top-right",
        zIndex: 9999,
      });
      console.error("Error updating activity:", error);
    } else {
      toast.success("Activity updated successfully!", {
        position: "top-right",
        zIndex: 9999,
      });
      setOpenActivities(updatedActivities);
    }

    setLoading(false);
  };
  const handleCloseActivity = async (activityId) => {
    setLoading(true);
    const update = openActivities.find(
      (activity) => activity.id === activityId
    );
    update.closed_at = today;
    const { error } = await supabase
      .from("Leads")
      .update({
        open_activities: openActivities.filter(
          (activity) => activity.id !== activityId
        ),
        closed_activities: [
          ...closedActivities,
          {
            ...update,
          },
        ],
      })
      .eq("id", lead_id.lead_id);
    if (error) {
      console.error("Error closing activity:", error);
      toast.error("Error closing activity!", { position: "top-right" });
    } else {
      await fetchLeadData();
      toast.success("Activity closed successfully!", {
        position: "top-right",
        zIndex: 9999,
      });
    }
  };
  const handleUpdateDB = async () => {
    setLoading(true);
    const dataToUpdate = {
      name: LeadsData.name,
      email: LeadsData.email,
      number: LeadsData.number,
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
      LeadDetails.description === LeadsData.description &&
      LeadDetails.open_activities === openActivities;

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
        localStorage.removeItem("companyDataCache");
        setLoading(false);
        fetchLeadData();
      }
    }
  };
  console.log("Helloo", openActivities);
  const Activities = ["Meeting", "Email", "Call", "Product Demo", "Task"];
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
          <Label className={"mb-4 text-gray-600"} htmlFor="leadName">
            Lead Name
          </Label>
          <Input
            className="bg-white"
            id="leadName"
            placeholder="Lead Name"
            value={LeadsData.name || ""}
            onChange={(e) => handleLeadChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="leadEmail">
            Lead email
          </Label>
          <Input
            className="bg-white"
            id="leadEmail"
            placeholder="Lead email"
            value={LeadsData.email || ""}
            onChange={(e) => handleLeadChange("email", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="leadNumber">
            Phone Number
          </Label>
          <Input
            className="bg-white"
            id="leadNumber"
            placeholder="Lead's Phone Number"
            value={LeadsData.number || ""}
            onChange={(e) => handleLeadChange("number", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="age">
            Lead age
          </Label>
          <Input
            className="bg-white"
            id="age"
            placeholder="Lead age"
            value={LeadsData.age || ""}
            onChange={(e) => handleLeadChange("age", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="linkedIn">
            LinkedIn
          </Label>
          <Input
            className="bg-white"
            id="linkedIn"
            placeholder="LinkedIn profile URL"
            value={LeadsData.linkedIn || ""}
            onChange={(e) => handleLeadChange("linkedIn", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="leadIndustry">
            Lead industry
          </Label>
          <Input
            className="bg-white"
            id="leadIndustry"
            placeholder="Lead industry"
            value={LeadsData.industry || ""}
            onChange={(e) => handleLeadChange("industry", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="company">
            Lead Company
          </Label>
          <Input
            className="bg-white"
            id="company"
            placeholder="LeadCompany"
            value={LeadsData.company || ""}
            onChange={(e) => handleLeadChange("company", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="income">
            Lead income
          </Label>
          <Input
            className="bg-white"
            id="income"
            placeholder="Lead income"
            value={LeadsData.income || ""}
            onChange={(e) => handleLeadChange("income", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="website">
            Lead website
          </Label>
          <Input
            className="bg-white"
            id="website"
            placeholder="Lead website"
            value={LeadsData.website || ""}
            onChange={(e) => handleLeadChange("website", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="status">
            Lead status
          </Label>
          <Input
            className="bg-white"
            id="status"
            placeholder="Your Lead status"
            value={LeadsData.status || ""}
            onChange={(e) => handleLeadChange("status", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="leadSource">
            Lead source
          </Label>
          <Input
            className="bg-white"
            id="leadSource"
            placeholder="Your Lead source"
            value={LeadsData.source || ""}
            onChange={(e) => handleLeadChange("source", e.target.value)}
          />
        </div>
        <div>
          <Label className={"mb-4 text-gray-600"} htmlFor="leadAddress">
            Lead address
          </Label>
          <Input
            className="bg-white"
            id="leadAddress"
            placeholder="Your Lead address"
            value={LeadsData.address || ""}
            onChange={(e) => handleLeadChange("address", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Label className={"mb-4 text-gray-600"} htmlFor="description">
            Lead description
          </Label>
          <Textarea
            className="bg-white"
            id="description"
            placeholder="Lead description"
            value={LeadsData.description || ""}
            onChange={(e) => handleLeadChange("description", e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Card className="bg-transparent text-gray-600 border-0">
            <CardHeader className={`flex items-center justify-between`}>
              <CardTitle>Open Activities</CardTitle>
              <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
                className="z-10 h-screen w-screen items-center"
              >
                <Select
                  className="fixed z-0"
                  value={selectedActivity}
                  onValueChange={(val) => {
                    setSelectedActivity(val);
                    setIsOpen(true);
                  }}
                >
                  <SelectTrigger>Add Activity</SelectTrigger>
                  <SelectContent className="flex flex-col">
                    {Activities.map((activity) => (
                      <SelectItem
                        key={activity}
                        value={activity}
                        className="relative cursor-pointer border-b border-gray-600 last:border-0"
                      >
                        {activity}
                        {"\n"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DialogContent className="h-[80vh] md:h-[60vh] w-[90vw] md:w-[50vw]  p-4">
                  <DialogHeader>
                    <DialogTitle className="border-b-2 border-b-gray-200 mb-4 py-2 pb-2">
                      {selectedActivity} Details
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mx-5 gap-5 space-y-3">
                    <div>
                      <Label
                        className={"mb-4 text-gray-600 space-b-2"}
                        htmlFor="Title"
                      >
                        Title
                      </Label>
                      <Input
                        className="bg-white"
                        id="Title"
                        placeholder="Activity Title"
                        value={activitiesFormData.title}
                        onChange={(e) =>
                          updateActivitiesFormData("title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label
                        className={"mb-4 text-gray-600 space-y-2"}
                        htmlFor="Date"
                      >
                        Date
                      </Label>
                      <Input
                        className="bg-white"
                        id="Date"
                        type="date"
                        placeholder="Activity Date"
                        value={activitiesFormData.date}
                        onChange={(e) =>
                          updateActivitiesFormData("date", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label
                        className={"mb-4 text-gray-600 space-y-2"}
                        htmlFor="description"
                      >
                        Description
                      </Label>
                      <Textarea
                        className="bg-white"
                        id="Description"
                        placeholder="Activity Description"
                        value={activitiesFormData.description}
                        onChange={(e) =>
                          updateActivitiesFormData(
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() =>
                        setActivitiesFormData({
                          title: "",
                          description: "",
                          date: "",
                        })
                      }
                      className="mt-4 border-red-600 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <X />
                      Clear Fields
                    </Button>
                    <Button
                      onClick={handleUpdateActivity}
                      className="mt-4 border-green-500 bg-white text-green-500 hover:bg-green-50 hover:text-green-700"
                    >
                      <ArrowRightToLine />
                      Update Activity
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Card className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-md text-gray-600 ">
                    Current Activities
                  </CardTitle>
                  <CardContent className="">
                    {openActivities.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {openActivities.map((activity, idx) => (
                          <Card
                            key={activity.id}
                            className="shadow-md rounded-2xl border border-purple-500 dark:border-slate-700 bg-white dark:bg-slate-800"
                          >
                            {/* Header: Title + Category */}
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 break-words">
                                <Input
                                  value={activity.title}
                                  onChange={(e) =>
                                    handleEditActivity(
                                      activity.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                              </CardTitle>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="space-y-4">
                              {/* Info Row: Date + Category (responsive) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                    Date
                                  </Label>
                                  <Input
                                    type="date"
                                    className="font-medium text-slate-900 dark:text-slate-100 text-sm"
                                    value={activity.date}
                                    onChange={(e) =>
                                      handleEditActivity(
                                        activity.id,
                                        "date",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                    Category
                                  </Label>
                                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                    {activity.category}
                                  </p>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <Textarea
                                  className="text-slate-500 dark:text-slate-400 text-xs"
                                  value={activity.description}
                                  onChange={(e) =>
                                    handleEditActivity(
                                      activity.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                  <Dialog
                                    open={activityToDelete === activity.id}
                                    onOpenChange={() =>
                                      setActivityToDelete(null)
                                    }
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        className="border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 hover:text-red-700"
                                        onClick={() =>
                                          setActivityToDelete(activity.id)
                                        }
                                      >
                                        <Delete />
                                        Delete Activity
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-full max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Delete Activity
                                        </DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete this
                                          activity?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button
                                          className="border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 hover:text-red-700"
                                          variant="outline"
                                          onClick={() => {
                                            handleRemoveActivity(activity.id);
                                            setActivityToDelete(null);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                        <Button
                                          className="border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                          variant="ghost"
                                          onClick={() => {
                                            setActivityToDelete(null);
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    className="border-2 border-blue-500 bg-white text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => {
                                      handleFinishEditActivity(activity.id);
                                    }}
                                  >
                                    <Edit />
                                    Update Activity
                                  </Button>
                                  <Button
                                    className="border-2 border-green-500 bg-white text-green-500 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => {
                                      handleCloseActivity(activity.id);
                                    }}
                                  >
                                    <SquareCheckBig />
                                    Close Activity
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {openActivities.length === 0 && (
                      <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                        <BookmarkPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">
                          No activities added yet. Add your first activity above
                          to get started.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>
          <Card className="bg-transparent text-gray-600 border-0">
            <CardHeader className={`flex items-center justify-between`}>
              <CardTitle>Closed Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
                <CardHeader>
                  <CardContent className="">
                    {closedActivities.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {closedActivities.map((activity, idx) => (
                          <Card
                            key={activity.id}
                            className="shadow-md rounded-2xl border border-purple-500 dark:border-slate-700 bg-white dark:bg-slate-800"
                          >
                            {/* Header: Title + Category */}
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 break-words">
                                <Label>{activity.title}</Label>
                              </CardTitle>
                            </CardHeader>

                            {/* Content */}
                            <CardContent className="space-y-4">
                              {/* Info Row: Date + Category (responsive) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                    Start Date
                                  </Label>
                                  <Label className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                    {activity.date}
                                  </Label>
                                </div>
                                <div>
                                  <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                    Closed At
                                  </Label>
                                  <Label className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                    {activity.closed_at}
                                  </Label>
                                </div>
                                <div>
                                  <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                    Category
                                  </Label>
                                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                    {activity.category}
                                  </p>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <Label className="text-slate-500 dark:text-slate-400 text-xs">
                                  Description
                                </Label>
                                <Label className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                  {activity.description}
                                </Label>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {closedActivities.length === 0 && (
                      <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                        <BookmarkPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">
                          No activities closed yet. Close your first activity to
                          get started.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>
        </div>
        <Button
          onClick={handleUpdateDB}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Update Lead Data
        </Button>
      </div>
      <Card className="bg-transparent text-gray-600 border-0">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Stage History</CardTitle>
        </CardHeader>

        <CardContent>
          <Card className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
            <CardContent>
              {stageHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Old Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          New Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {stageHistory.map((stage, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">
                            {stage.old_status}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">
                            {stage.new_status}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                            {stage.start_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                            {stage.end_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 break-words max-w-xs">
                            {stage.state_description}
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
                    No stage history yet. Progress through stages to see
                    history.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
