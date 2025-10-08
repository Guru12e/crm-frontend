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
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";

export default function TimeOffPage() {
  const [features, setFeatures] = useState([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState();
  const [employee, setEmployee] = useState(null);
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [duration, setDuration] = useState("");

  const [type, setType] = useState(null);

  // 🔹 Get employee details from localStorage
  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    const userType = localStorage.getItem("type");
    setEmployee(emp);
    setType(userType);
  }, []);

  // 🔹 Fetch employee's leaves and applied leaves
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

      data?.leave.forEach((feature) => {
        const startDate = new Date(feature.start);
        const endDate = new Date(feature.end);
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          formattedFeatures.push({
            id: feature.id || Math.random().toString(36).substring(2, 9),
            name: feature.reason || feature.title,
            startAt: new Date(d),
            endAt: new Date(d),
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

      data?.apply_leave.forEach((feature) => {
        const startDate = new Date(feature.start);
        const endDate = new Date(feature.end);
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          formattedFeatures.push({
            id: feature.id || Math.random().toString(36).substring(2, 9),
            name: feature.reason || feature.title,
            startAt: new Date(d),
            endAt: new Date(d),
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

      console.log(formattedFeatures);

      setFeatures(formattedFeatures);
      setAppliedLeaves(data?.apply_leave || []);
    };

    fetchLeaves();
  }, [employee]);

  // 🔹 Apply Leave Function (for employee)
  const handleApplyLeave = async () => {
    if (!date?.from || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
      applied_at: new Date().toISOString(),
      department: empData.department || "",
      manager: empData.manager || "",
      employee_id: empData.id,
      email: employee.email,
    };

    const { data: company, error: companyError } = await supabase
      .from("HRMS")
      .select("*")
      .eq("id", company.companyId)
      .single();

    if (companyError) {
      console.error("Error fetching company:", companyError);
      return;
    }

    const updatedApplyLeave = [...(company.apply_leave || []), newLeave];

    const { error: companyUpdateError } = await supabase
      .from("HRMS")
      .update({ apply_leave: updatedApplyLeave })
      .eq("id", company.id)
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
    setOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-center gap-6">
        {/* Admin Add Leave */}
        {type === "admin" && (
          <Sheet onOpenChange={setOpen} open={open}>
            <SheetTrigger asChild>
              <Button>Add Leave</Button>
            </SheetTrigger>
            <SheetContent className="w-max px-5">
              <SheetHeader>
                <SheetTitle>Add Leave</SheetTitle>
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
                <Button onClick={handleAddLeave}>Confirm</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}

        {/* Employee Apply Leave */}
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white md:ml-5">
              Apply Time-Off
            </Button>
          </SheetTrigger>
          <SheetContent className="w-max px-5">
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
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <Label className="text-sm font-medium">Leave Type</Label>
                <Toggle
                  pressed={isHalfDay}
                  onPressedChange={setIsHalfDay}
                  className={`transition-all duration-200 ${
                    isHalfDay
                      ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {isHalfDay ? "Half Day" : "Full Day"}
                </Toggle>
              </div>
              {isHalfDay && (
                <div className="grid gap-3">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="Enter Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
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
              <Button onClick={handleApplyLeave}>Confirm</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg mt-2">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Timeoff Requests
        </h2>

        {/* Leave items */}
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
                {/* Reason */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {leave.reason}
                </h3>

                {/* Leave Type */}
                {leave.type && (
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                    Type: {leave.type}
                  </p>
                )}

                {/* Dates */}
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                  {new Date(leave.start).toLocaleDateString()} -{" "}
                  {new Date(leave.end).toLocaleDateString()}
                </p>

                {/* Status */}
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

      {/* Calendar showing leaves */}
      <CalendarComponent feature={features} />
    </div>
  );
}
