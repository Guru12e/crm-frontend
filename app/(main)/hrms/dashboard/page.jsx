"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Users, ChartPie, Activity, Search, Bell } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const activityData = [
  { date: "Mon", value: 40 },
  { date: "Tue", value: 55 },
  { date: "Wed", value: 70 },
  { date: "Thu", value: 60 },
  { date: "Fri", value: 85 },
  { date: "Sat", value: 50 },
  { date: "Sun", value: 30 },
];

const attendanceData = [
  { name: "Jan", present: 20, absent: 1 },
  { name: "Feb", present: 18, absent: 2 },
  { name: "Mar", present: 22, absent: 0 },
  { name: "Apr", present: 20, absent: 1 },
  { name: "May", present: 19, absent: 2 },
];

const taskDistribution = [
  { name: "Development", value: 45 },
  { name: "Design", value: 20 },
  { name: "QA", value: 15 },
  { name: "PM", value: 10 },
  { name: "Other", value: 10 },
];
const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];

const employees = [
  { id: 1, name: "Anita Raj", role: "Frontend Developer", status: "Active" },
  { id: 2, name: "Vikram Singh", role: "Backend Developer", status: "Active" },
  { id: 3, name: "Sana Kapoor", role: "Product Designer", status: "On Leave" },
  { id: 4, name: "Rahul Mehra", role: "QA Engineer", status: "Active" },
];

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Avatar>
              <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                G
              </div>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">Guru Vijay</h3>
              <p className="text-xs text-muted-foreground">HR Manager</p>
            </div>
          </div>

          <Separator className="my-3" />

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50">
              <Users size={16} />
              <span className="text-sm">Employees</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50">
              <ChartPie size={16} />
              <span className="text-sm">Analytics</span>
            </button>
            <button className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50">
              <Activity size={16} />
              <span className="text-sm">Activity</span>
            </button>
          </nav>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Team capacity</CardTitle>
                <CardDescription className="text-xs">
                  Some quick stats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">
                      Active members
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-muted-foreground">On leave</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main area */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-full">
                <Input
                  placeholder="Search employees, projects..."
                  className="pl-10"
                />
                <div className="absolute ml-3 mt-2 pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="px-3 py-2">
                <Bell />
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <p className="text-sm font-medium">Guru Vijay</p>
                  <p className="text-xs text-muted-foreground">Mumbai, IN</p>
                </div>
                <Avatar>
                  <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    G
                  </div>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="text-2xl font-bold">128</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <Users />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Avg Productivity
                    </p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <ChartPie />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Open Positions
                    </p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <Activity />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      This Month Attrition
                    </p>
                    <p className="text-2xl font-bold">2.1%</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <Users />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Productivity Area */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Productivity</CardTitle>
                <CardDescription>
                  Active work value for the week
                </CardDescription>
              </CardHeader>
              <CardContent style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#4F46E5"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4F46E5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#colorUv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task distribution pie */}
            <Card>
              <CardHeader>
                <CardTitle>Task distribution</CardTitle>
                <CardDescription>
                  How tasks are split across teams
                </CardDescription>
              </CardHeader>
              <CardContent style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {taskDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance bar + Employee table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Monthly attendance</CardTitle>
                <CardDescription>
                  This year's monthly present vs absent
                </CardDescription>
              </CardHeader>
              <CardContent style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" stackId="a" />
                    <Bar dataKey="absent" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent employees</CardTitle>
                <CardDescription>
                  Newest members added to the org
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell className="font-medium">
                            {emp.name}
                          </TableCell>
                          <TableCell>{emp.role}</TableCell>
                          <TableCell>{emp.status}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm">View</Button>
                              <Button size="sm" variant="ghost">
                                Message
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-4">
            <Button>Export CSV</Button>
            <Button variant="outline">Create Report</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
