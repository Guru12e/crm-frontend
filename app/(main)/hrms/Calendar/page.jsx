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

export default function HRMSDashboard() {
  const [features, setFeatures] = useState([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [date, setDate] = useState();
  const [userData, setUserData] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    setType(localStorage.getItem("type"));
    const fetchUserData = async (company_id) => {
      const { data, error } = await supabase
        .from("HRMS")
        .select("user_email")
        .eq("id", company_id)
        .single();

      if (error) {
        console.log("Error fetching user data:", error);
        return;
      }

      if (data) {
        setUserData(data.user_email);
      }
    };

    if (type === "employee") {
      fetchUserData(JSON.parse(localStorage.getItem("employee"))?.company_id);
    } else {
      const rawSession = localStorage.getItem("session");
      const userData = rawSession ? JSON.parse(rawSession) : null;
      setUserData(userData.user?.email);
    }
  }, []);

  useEffect(() => {
    const fetchLeaves = async () => {
      const { data, error } = await supabase
        .from("HRMS")
        .select("*")
        .eq("user_email", userData);

      if (error) {
        console.log("Error fetching leaves:", error);
        return;
      }

      if (data && data.length > 0) {
        const formattedFeatures = [];
        (data[0].leave || []).forEach((feature) => {
          const startDate = new Date(feature.start);
          const endDate = new Date(feature.end);
          for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
          ) {
            formattedFeatures.push({
              id: feature.id,
              name: feature.title,
              startAt: new Date(d),
              endAt: new Date(d),
              status: {
                id: 1,
                name: "Leave",
                color: "#A8E4A0",
              },
            });
          }
        });

        setFeatures(formattedFeatures);
      }
    };
    fetchLeaves();
  }, [userData]);

  const HandleLeave = async () => {
    if (date?.from && reason) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date.from < today) {
        toast.error("You can't apply leave for past date");
        return;
      }

      const newFeature = {
        id: Math.random().toString(36).substring(2, 9),
        title: reason,
        start: date.from,
        end: date.to || date.from,
        allDay: true,
      };

      const { data: newFeatureData, error } = await supabase
        .from("HRMS")
        .select("*")
        .eq("user_email", userData);

      if (newFeatureData && newFeatureData.length > 0) {
        const existingLeaves = newFeatureData[0].leave || [];
        if (existingLeaves.find((leave) => leave.title === newFeature.title)) {
          toast.error("Leave already exists");
          return;
        }
        const { data: updatedData, error: updateError } = await supabase
          .from("HRMS")
          .update({
            leave: [...existingLeaves, newFeature],
          })
          .eq("user_email", userData);

        if (updatedData) {
          return;
        }
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from("HRMS")
          .insert({
            user_email: userData,
            leave: [newFeature],
          });
        if (insertData) {
          return;
        }
      }

      setFeatures((prev) => [...prev, newFeature]);
      setOpen(false);
      setReason("");
      setDate(undefined);
      toast.success("Leave applied successfully");
    } else {
      toast.error("Please fill all the fields");
    }
  };

  const HandleApplyLeave = async () => {
    if (date?.from && reason) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date.from < today) {
        toast.error("You can't apply leave for past date");
        return;
      }

      const { data: employee, error: employee_error } = await supabase
        .from("Employees")
        .select("*")
        .eq("email", "jhon@gmail.com");

      if (employee_error) {
        console.error("Error fetching employee:", employee_error);
        return;
      }

      const newFeature = {
        employee_id: employee[0]?.id,
        status: "Pending",
        reason: reason,
        start: date.from,
        end: date.to || date.from,
        applied_at: new Date().toISOString(),
        department: employee[0]?.department || "",
        manager: employee[0]?.manager || "",
        email: "jhon@gmail.com",
      };

      const { data: company, error: company_error } = await supabase
        .from("HRMS")
        .select("*")
        .eq("id", employee[0]?.company_id)
        .single();
      if (company_error) {
        console.error("Error fetching company:", company_error);
        return;
      }

      if (company && company.apply_leave) {
        const { data: updatedData, error: updateError } = await supabase
          .from("HRMS")
          .update({
            apply_leave: [...company.apply_leave, newFeature],
          })
          .eq("id", employee[0]?.company_id);
        if (updateError) {
          console.error("Error updating apply_leave:", updateError);
          return;
        }
        setOpen(false);
        setReason("");
        setDate(undefined);
        toast.success("Leave applied successfully");
      } else if (company) {
        const { data: updatedData, error: updateError } = await supabase
          .from("HRMS")
          .update({
            apply_leave: [newFeature],
          })
          .eq("id", employee[0]?.company_id);
        if (updateError) {
          console.error("Error updating apply_leave:", updateError);
          return;
        }
        setOpen(false);
        setReason("");
        setDate(undefined);
        toast.success("Leave applied successfully");
      }
    } else {
      toast.error("Please fill all the fields");
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end items-center gap-6">
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
                    required
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button onClick={HandleLeave}>Confirm</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button>Apply Leave</Button>
          </SheetTrigger>
          <SheetContent className="w-max px-5">
            <SheetHeader>
              <SheetTitle>Apply Leave</SheetTitle>
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
                  required
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            <SheetFooter>
              <Button onClick={HandleApplyLeave}>Confirm</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <CalendarComponent feature={features} />
    </div>
  );
}
