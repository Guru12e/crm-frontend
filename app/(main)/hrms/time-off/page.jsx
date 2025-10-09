"use client";

import CalendarComponent from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function TimeOffPage() {
  const [features, setFeatures] = useState([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState();
  const [employee, setEmployee] = useState(null);
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    const userType = localStorage.getItem("type");
    setEmployee(emp);
    setType(userType);
  }, []);
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!employee?.email) return;

      const { data, error } = await supabase
        .from("Employees")
        .select("leave, apply_leave")
        .eq("email", employee.email)
        .single();

      if (error) {
        console.log("Error fetching leaves:", error);
        return;
      }

      const formattedFeatures = [];

      if (data?.leave) {
        data?.leave.forEach((feature) => {
          const startDate = new Date(feature.start).toISOString().split("T")[0];
          const endDate = new Date(feature.end).toISOString().split("T")[0];
          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            formattedFeatures.push({
              id: feature.id || Math.random().toString(36).substring(2, 9),
              name: feature.reason || feature.title,
              startAt: new Date(d).toISOString().split("T")[0],
              endAt: new Date(d).toISOString().split("T")[0],
              holiday: true,
              status: {
                id: 1,
                name: feature.status || "Leave",
                color:
                  feature.status === "Approved"
                    ? "#A8E4A0"
                    : feature.status === "Pending"
                    ? "#F9E79F"
                    : "#E6B0AA",
              },
            });
          }
        });
      }

      if (data?.apply_leave) {
        data?.apply_leave.forEach((feature) => {
          const startDate = new Date(feature.start).toISOString().split("T")[0];
          const endDate = new Date(feature.end).toISOString().split("T")[0];
          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            formattedFeatures.push({
              id: feature.id || Math.random().toString(36).substring(2, 9),
              name: feature.reason || feature.title,
              startAt: new Date(d).toISOString().split("T")[0],
              endAt: new Date(d).toISOString().split("T")[0],
              holiday: false,
              status: {
                id: 1,
                name: feature.status || "Leave",
                color:
                  feature.status === "Approved"
                    ? "#A8E4A0"
                    : feature.status === "Pending"
                    ? "#F9E79F"
                    : "#E6B0AA",
              },
            });
          }
        });
      }

      setFeatures(formattedFeatures);
      setAppliedLeaves(data?.apply_leave || []);
    };

    fetchLeaves();
  }, [employee]);

  const handleApplyLeave = async () => {
    if (!date?.from || !reason) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const companyId =
      employee?.company_id || JSON.parse(localStorage.getItem("company_id"));
    if (!companyId) {
      toast.error("Company ID not found. Please re-login.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (date.from < today) {
      toast.error("You can't apply for a past date");
      return;
    }

    const { data: empData, error: empError } = await supabase
      .from("Employees")
      .select("apply_leave, department, manager, id")
      .eq("email", employee.email)
      .single();

    if (empError) {
      console.error("Error fetching employee:", empError);
      return;
    }

    const newLeave = {
      id: Math.random().toString(36).substring(2, 9),
      reason,
      start: date.from,
      end: date.to || date.from,
      status: "Pending",
      applied_at: new Date().toISOString().split("T")[0],
      department: empData.department || "",
      manager: empData.manager || "",
      employee_id: empData.id,
      email: employee.email,
      name: employee.name,
      type: isHalfDay ? "Half Day" : "Full Day",
      start_time: isHalfDay ? startTime : null,
      end_time: isHalfDay ? endTime : null,
    };

    const { data: company, error: companyError } = await supabase
      .from("HRMS")
      .select("*")
      .eq("id", companyId)
      .single();

    if (companyError || !company) {
      console.error("Error fetching company:", companyError);
      return;
    }

    const updatedApplyLeave = [...(company.apply_leave || []), newLeave];

    const { error: companyUpdateError } = await supabase
      .from("HRMS")
      .update({ apply_leave: updatedApplyLeave })
      .eq("id", companyId)
      .single();

    if (companyUpdateError) {
      console.error("Error updating company leave:", companyUpdateError);
      toast.error("Error adding leave to company, try again");
      return;
    }

    const updatedApply = [...(empData.apply_leave || []), newLeave];

    const { error: updateError } = await supabase
      .from("Employees")
      .update({ apply_leave: updatedApply })
      .eq("email", employee.email);

    if (updateError) {
      console.error("Error applying leave:", updateError);
      toast.error("Failed to apply leave");
      return;
    }

    toast.success("Leave applied successfully");
    setReason("");
    setDate(undefined);
    setIsHalfDay(false);
    setStartTime("");
    setEndTime("");
    setOpen(false);
    setLoading(false);
  };
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="w-full">
      <div className="flex justify-end items-center gap-6">
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white md:ml-5">
              Apply Time-Off
            </Button>
          </SheetTrigger>
          <SheetContent className="w-max px-5 overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Apply Time-Off</SheetTitle>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="sheet-date">Date</Label>
                <Calendar
                  id="sheet-date"
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-2"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-white/70 backdrop-blur-sm p-4 shadow-sm">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-800">
                    Leave Type
                  </Label>
                  <p className="text-xs text-gray-500">
                    {isHalfDay ? "Half Day Leave" : "Full Day Leave"}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">Full</span>
                  <Switch checked={isHalfDay} onCheckedChange={setIsHalfDay} />
                  <span className="text-xs text-gray-600">Half</span>
                </div>
              </div>

              {isHalfDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label
                      htmlFor="start-time"
                      className="text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn(
                        "rounded-md border bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                      )}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="end-time"
                      className="text-sm font-medium text-gray-700"
                    >
                      End Time
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={cn(
                        "rounded-md border bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                      )}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="sheet-reason">Reason</Label>
                <Textarea
                  id="sheet-reason"
                  placeholder="Enter Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            <SheetFooter>
              <Button onClick={handleApplyLeave}>Request Time-Off</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg mt-2">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Timeoff Requests
        </h2>

        {appliedLeaves.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No leave requests yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedLeaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {leave.reason}
                </h3>

                {leave.type && (
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                    Type: {leave.type}
                  </p>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                  {new Date(leave.start).toLocaleDateString()} -{" "}
                  {new Date(leave.end).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium w-max ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : leave.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                      : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                  }`}
                >
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <CalendarComponent feature={features} />
    </div>
  );
}
