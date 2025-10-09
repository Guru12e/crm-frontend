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
    setUserEmail("arsha.tajdeen23@gmail.com");
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
                    <strong>Employee:</strong> {leave.employee_name}
                  </p>
                  <p>
                    <strong>From:</strong> {leave.start_date}
                  </p>
                  <p>
                    <strong>To:</strong> {leave.end_date}
                  </p>
                  <p>
                    <strong>Reason:</strong> {leave.reason}
                  </p>
                  <div className="mt-2 space-x-2">
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
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
