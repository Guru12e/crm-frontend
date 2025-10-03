"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    manager: "",
    skills: [],
    training: [],
  });
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) redirect("/");

    const sessionJSON = JSON.parse(localStorage.getItem("session"));
    setUserEmail("arsha.tajdeen23@gmail.com");
    // setUserEmail(sessionJSON.user.email);
  }, []);

  const fetchEmployees = async () => {
    console.log("userEmail", userEmail);
    const { data: company_data, error: company_error } = await supabase
      .from("HRMS")
      .select("*")
      .eq("user_email", userEmail);

    setUserData(company_data[0]);

    const { data, error } = await supabase
      .from("Employees")
      .select("*")
      .eq("company_id", company_data[0]?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
    } else {
      setEmployees(data || []);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchEmployees();
    }
  }, [userEmail]);

  const addEmployee = async () => {
    try {
      const newData = {
        id: Date.now(),
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        role: newEmployee.role,
        department: newEmployee.department,
        manager: newEmployee.manager,
        access: newEmployee.access || "Employee",
        skills: newEmployee.skills || [],
        created_at: new Date().toISOString(),
        company_id: userData?.id || null,
      };

      const { data, error } = await supabase.from("Employees").insert(newData);

      if (error) {
        toast.error(`Error adding employee: ${error.message}`);
      } else {
        toast.success("Employee added successfully!");
        setNewEmployee({
          name: "",
          email: "",
          phone: "",
          role: "",
          department: "",
          manager: "",
          skills: [],
          training: [],
        });
        fetchEmployees();
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error("Server error adding employee.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 text-white">Add Employee</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
              />
              <Input
                placeholder="Role"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
              />
              <Input
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, department: e.target.value })
                }
              />
              <Input
                placeholder="Manager"
                value={newEmployee.manager}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, manager: e.target.value })
                }
              />
              <Textarea
                placeholder="Skills (comma separated)"
                value={newEmployee.skills.join(", ")}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
              <Button
                onClick={addEmployee}
                className="w-full bg-blue-600 text-white"
              >
                Save Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-5 flex flex-col transition-transform hover:shadow-md duration-200"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-lg font-semibold text-white">
                {emp.name?.charAt(0) || "E"}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {emp.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {emp.role} | {emp.department}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
              <p>Manager: {emp.manager || "-"}</p>
              <p>Email: {emp.email}</p>
              <p>Phone: {emp.phone}</p>
            </div>

            {emp.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {emp.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Trainings Completed
              </p>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                  style={{
                    width: `${
                      emp.training?.length
                        ? Math.min((emp.training.length / 10) * 100, 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {emp.training?.length || 0} / 10
              </p>
            </div> */}

            <div className="flex justify-end gap-2 mt-auto">
              <Button variant="outline" size="sm" className="text-sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="text-sm">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
