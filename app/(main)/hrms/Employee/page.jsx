"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function HRMSDashboard() {
  const [tab, setTab] = useState("employees");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HRMS Dashboard</h1>
          <p className="text-gray-500">
            Manage employees, payroll, and training with comprehensive filtering
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Upload Employee CSV
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Add New Employee
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Employees</p>
            <h2 className="text-2xl font-bold">120</h2>
            <p className="text-green-500">+5 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Leaves</p>
            <h2 className="text-2xl font-bold">12</h2>
            <p className="text-green-500">20 approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Payroll</p>
            <h2 className="text-2xl font-bold">₹25,40,000</h2>
            <p className="text-green-500">3 pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500">Training</p>
            <h2 className="text-2xl font-bold">4 Programs</h2>
            <p className="text-green-500">30 certifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mx-auto mb-6">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search employees..." className="w-1/3" />
            <select className="border rounded-md p-2">
              <option>All Status</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">Arsha Fahima</h3>
                <p className="text-gray-500">Software Engineer</p>
                <p className="text-sm">KK Nagar</p>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                  Active
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">Priya K</h3>
                <p className="text-gray-500">HR Manager</p>
                <p className="text-sm">Chennai</p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">
                  On Leave
                </span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search payroll records..." className="w-1/3" />
            <select className="border rounded-md p-2">
              <option>All</option>
              <option>Processed</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">Arsha Fahima</h3>
                <p>Net Salary: ₹65,000</p>
                <p>
                  Status: <span className="text-green-600">Processed</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">Priya K</h3>
                <p>Net Salary: ₹80,000</p>
                <p>
                  Status: <span className="text-red-600">Pending</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training">
          <div className="flex items-center justify-between mb-4">
            <Input placeholder="Search training..." className="w-1/3" />
            <select className="border rounded-md p-2">
              <option>All</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">React Training</h3>
                <p>Completion: 75%</p>
                <p>Status: Ongoing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold">Leadership Skills</h3>
                <p>Completion: 100%</p>
                <p>Status: Certified</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
