"use client";

import { supabase } from "@/utils/supabase/client";
import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";

const LeaveApproval = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [leavePending, setLeavePending] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) redirect("/");

    const sessionJSON = JSON.parse(localStorage.getItem("session"));
    setUserEmail(sessionJSON?.user?.email);
  }, []);

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      if (userEmail) {
        const { data, error } = await supabase
          .from("HRMS")
          .select("apply_leave")
          .eq("user_email", userEmail)
          .single();

        if (error) {
          console.error("Error fetching leave data:", error);
          return;
        }

        console.log("leavePending", data);
        setLeavePending(data.apply_leave || []);
      }
    };

    fetchPendingLeaves();
  }, [userEmail]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const HandleApproveLeave = async (leave) => {
    const { data, error } = await supabase
      .from("HRMS")
      .update({
        apply_leave: leavePending.filter((l) => l.id !== leave.id),
      })
      .eq("user_email", userEmail);

    if (error) {
      console.error("Error updating leave status:", error);
      return;
    }

    const { data: employeeData, error: employeeError } = await supabase
      .from("Employees")
      .select("*")
      .eq("id", leave.employee_id)
      .single();

    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      return;
    }

    const updatedLeaves = employeeData.apply_leave.map((l) => {
      if (l.id === leave.id) {
        return { ...l, status: "approved" };
      }
      return l;
    });

    const { data: updateEmployeeData, error: updateEmployeeError } =
      await supabase
        .from("Employees")
        .update({ apply_leave: updatedLeaves })
        .eq("id", leave.employee_id);

    if (updateEmployeeError) {
      console.error(
        "Error updating employee leave status:",
        updateEmployeeError
      );
      return;
    }

    const { data: notifyData, error: notifyError } = await supabase
      .from("Employees")
      .update({
        notifications: [
          ...(employeeData.notifications || []),
          {
            id: leave.id,
            date: leave.date,
            type: "leave",
            title: "Leave Approved",
            status: "unread",
            message: `Your leave request from ${formatDate(
              leave.start
            )} to ${formatDate(leave.end)} was approved.`,
          },
        ],
      })
      .eq("id", leave.employee_id);

    if (notifyError) {
      console.error("Error creating notification:", notifyError);
      return;
    }
  };

  const HandleRejectLeave = async () => {
    const { data, error } = await supabase
      .from("HRMS")
      .update({
        apply_leave: leavePending.filter((l) => l.id !== leave.id),
      })
      .eq("user_email", userEmail);

    if (error) {
      console.error("Error updating leave status:", error);
      return;
    }

    const { data: employeeData, error: employeeError } = await supabase
      .from("Employee")
      .select("*")
      .eq("id", leave.employee_id)
      .single();

    if (employeeError) {
      console.error("Error fetching employee data:", employeeError);
      return;
    }

    const updatedLeaves = employeeData.leaves.map((l) => {
      if (l.id === leave.id) {
        return { ...l, status: "rejected" };
      }
      return l;
    });

    const { data: updateEmployeeData, error: updateEmployeeError } =
      await supabase
        .from("Employees")
        .update({ leaves: updatedLeaves })
        .eq("id", leave.employee_id);
    if (updateEmployeeError) {
      console.error(
        "Error updating employee leave status:",
        updateEmployeeError
      );
      return;
    }

    const { data: notifyData, error: notifyError } = await supabase
      .from("Employees")
      .update({
        notifications: [
          ...(employeeData.notifications || []),
          {
            id: leave.id,
            date: leave.date,
            type: "leave",
            title: "Leave Rejected",
            status: "unread",
            message: `Your leave request from ${formatDate(
              leave.start
            )} to ${formatDate(leave.end)} was rejected.`,
          },
        ],
      })
      .eq("id", leave.employee_id);

    if (notifyError) {
      console.error("Error creating notification:", notifyError);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Coffee className="w-8 h-8 text-blue-600" />
              Leave Approval
            </h1>
            <p className="text-gray-500">
              Manage leave requests and approvals efficiently
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Pending Leave Requests
          </h2>
          {leavePending.length > 0 ? (
            <ul className="space-y-4">
              {leavePending.map((leave, index) => (
                <li key={index} className="border p-4 rounded-lg">
                  <p>
                    <strong>Employee:</strong> {leave.name}
                  </p>
                  <p>
                    <strong>From:</strong> {formatDate(leave.start)}
                  </p>
                  <p>
                    <strong>To:</strong> {formatDate(leave.end)}
                  </p>
                  <p>
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                  <p>
                    <strong>Half Day:</strong> {leave.half_day ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {leave.start_time ? formatDate(leave.start_time) : "N/A"}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {leave.end_time ? formatDate(leave.end_time) : "N/A"}
                  </p>
                  <div className="mt-2 space-x-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => HandleApproveLeave(leave)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => HandleRejectLeave(leave)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending leave requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApproval;
