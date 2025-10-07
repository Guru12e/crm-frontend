"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { Bell, CheckCircle, Info, Megaphone } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState("");

  // Get employee email from local storage
  useEffect(() => {
    const employeeJSON = JSON.parse(localStorage.getItem("employee"));
    if (employeeJSON?.email) {
      setEmployeeEmail(employeeJSON.email);
    }
  }, []);

  // Fetch notifications from Supabase Employees table
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!employeeEmail) return;

      const { data, error } = await supabase
        .from("Employees")
        .select("notifications")
        .eq("email", employeeEmail)
        .single();

      if (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
        return;
      }

      setNotifications(data?.notifications || []);
    };

    fetchNotifications();
  }, [employeeEmail]);

  // Mark notification as read
  const markAsRead = async (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, status: "read" } : n
    );
    setNotifications(updated);

    const { error } = await supabase
      .from("Employees")
      .update({ notifications: updated })
      .eq("email", employeeEmail);

    if (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to mark as read");
    } else {
      toast.success("Notification marked as read");
    }
  };

  // Icon by type
  const getIcon = (type) => {
    switch (type) {
      case "leave":
        return <Bell className="w-5 h-5 text-blue-500" />;
      case "announcement":
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-sm backdrop-blur-md border rounded-2xl border-slate-200/50 dark:bg-transparent dark:border-white/20 mb-6 ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          Notifications
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent>
        <ScrollArea className="h-[70vh] pr-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border rounded-xl transition-all ${
                    n.status === "unread"
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getIcon(n.type)}
                      <div>
                        <h3 className="font-medium text-gray-900">{n.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {n.message}
                        </p>
                      </div>
                    </div>
                    {n.status === "unread" && (
                      <Badge
                        variant="outline"
                        className="bg-indigo-100 text-indigo-700"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                    <span>{new Date(n.date).toLocaleDateString()}</span>
                    {n.status === "unread" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(n.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
              <Bell className="w-10 h-10 mb-2 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
