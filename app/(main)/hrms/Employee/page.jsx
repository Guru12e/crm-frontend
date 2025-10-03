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
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null); // Employee being edited
  const [editedEmployee, setEditedEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    manager: "",
    skills: [],
    training: [],
  });
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

  function generatePassword(length = 12) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  const addEmployee = async () => {
    try {
      const generatedPassword = generatePassword(12);
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
        password: generatedPassword,
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

  const saveEditedEmployee = async () => {
    try {
      // Fetch the current HRMS row
      const { data: hrmsRow } = await supabase
        .from("HRMS")
        .select("employees")
        .eq("id", editingEmployee.hrms_id)
        .single();

      if (!hrmsRow) return toast.error("Error: HRMS row not found");

      // Update the employee in the JSON array
      const updatedEmployees = hrmsRow.employees.map((emp) =>
        emp.email === editingEmployee.email ? editedEmployee : emp
      );

      const { error } = await supabase
        .from("HRMS")
        .update({ employees: updatedEmployees })
        .eq("id", editingEmployee.hrms_id);

      if (error) {
        console.error("Error updating employee:", error);
        toast.error("Error updating employee.");
      } else {
        toast.success("Employee updated successfully!");
        setEditingEmployee(null);
        fetchEmployees();
      }
    } catch (err) {
      console.error("Server error:", err);
      toast.error("Server error updating employee.");
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
          <Card key={index} className="shadow-sm rounded-xl p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {emp.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {emp.role} | {emp.department}
                </p>
              </div>
              {/* Edit Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingEmployee(emp);
                      setEditedEmployee({ ...emp });
                    }}
                  >
                    Edit
                  </Button>
                </SheetTrigger>
                <SheetContent className=" p-6 space-y-6 overflow-y-auto min-h-[80vh] md:min-w-[85vw] min-w-screen">
                  <SheetHeader>
                    <SheetTitle>Edit Employee</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-3 mt-2 grid grid-cols-3 gap-6">
                    <Input
                      placeholder="Full Name"
                      value={editedEmployee.name}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          name: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={editedEmployee.email}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          email: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Phone"
                      value={editedEmployee.phone}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          phone: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Role"
                      value={editedEmployee.role}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          role: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Department"
                      value={editedEmployee.department}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          department: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Manager"
                      value={editedEmployee.manager}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          manager: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="Skills (comma separated)"
                      value={editedEmployee.skills?.join(", ")}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                    />
                    <Textarea
                      className="col-span-2"
                      placeholder="Training (comma separated)"
                      value={editedEmployee.training?.join(", ")}
                      onChange={(e) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          training: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={saveEditedEmployee}
                    className="w-full bg-blue-600 text-white"
                  >
                    Save Changes
                  </Button>
                </SheetContent>
              </Sheet>
            </div>

            {/* Contact */}
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
              <p>Manager: {emp.manager || "-"}</p>
              <p>Email: {emp.email}</p>
              <p>Phone: {emp.phone}</p>
              <p>
                <span className="font-semibold">Password:</span>{" "}
                <span>{emp.password}</span>
              </p>
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

            {/* Trainings */}
            {emp.training?.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Trainings: {emp.training.join(", ")}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
