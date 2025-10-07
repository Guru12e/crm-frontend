"use client";
import React, { useEffect, useState } from "react";
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
import {
  CalendarDays,
  PieChart,
  Clock,
  CheckSquare,
  Bell,
  Search,
  Timer,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const productivityData = [
  { date: "Mon", hours: 6 },
  { date: "Tue", hours: 7.5 },
  { date: "Wed", hours: 8 },
  { date: "Thu", hours: 6.5 },
  { date: "Fri", hours: 7 },
  { date: "Sat", hours: 3 },
  { date: "Sun", hours: 0 },
];

const myAttendance = [
  { name: "Week 1", present: 5, absent: 0 },
  { name: "Week 2", present: 4, absent: 1 },
  { name: "Week 3", present: 5, absent: 0 },
  { name: "Week 4", present: 5, absent: 0 },
];

const focusDistribution = [
  { name: "Coding", value: 60 },
  { name: "Meetings", value: 20 },
  { name: "Reviews", value: 10 },
  { name: "Learning", value: 10 },
];

const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#10B981"];

const myTasks = [
  {
    id: 1,
    title: "Implement search refinement",
    due: "Oct 6",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Fix profile image upload bug",
    due: "Oct 8",
    status: "Open",
  },
  { id: 3, title: "Code review: feature/x", due: "Oct 9", status: "Review" },
];

export default function EmployeeDashboard() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const HandleStartWork = () => {};

  useEffect(() => {
    const timer = setInterval(() => {
      setMinute((prevMinute) => {
        if (prevMinute === 59) {
          setHour((prevHour) => prevHour + 1);
          return 0;
        }
        return prevMinute + 1;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="w-full mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar>
              <div className="h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg">
                <span>G</span>
              </div>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Guru Vijay</h2>
              <p className="text-sm text-muted-foreground">
                Frontend Developer
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    This month hours
                  </p>
                  <p className="text-2xl font-bold">128h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Avg focus</p>
                  <p className="text-lg font-semibold">76%</p>
                </div>
              </div>
              <Button className="w-full">Log time</Button>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Button variant="outline" className="w-full mb-2">
              Request Time Off
            </Button>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full">
              <div className="relative w-full">
                <Input
                  placeholder="Search your tasks, docs or teammates"
                  className="pl-10"
                />
                <div className="absolute left-3 top-2 pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost">
                <Bell />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Tasks due</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <CalendarDays />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Completed this week
                    </p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <CheckSquare />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Hours logged
                    </p>
                    <p className="text-2xl font-bold">34h</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <Clock />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Focus score</p>
                    <p className="text-2xl font-bold">76%</p>
                  </div>
                  <div className="p-2 rounded-md bg-slate-100">
                    <PieChart />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly productivity</CardTitle>
                <CardDescription>Hours worked per day</CardDescription>
              </CardHeader>
              <CardContent style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={productivityData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="personalGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                      dataKey="hours"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#personalGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Working Time</CardTitle>
                <CardDescription>Today's Working time</CardDescription>
              </CardHeader>
              <CardContent style={{ height: 220 }}>
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Timer size={48} className="mb-4 text-slate-800" />
                    <p className="text-3xl font-bold">
                      {hour}h {minute}m
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Working time today
                    </p>
                    <Button onClick={HandleStartWork}>Start Work</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>My tasks</CardTitle>
                <CardDescription>Tasks assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[260px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myTasks.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">
                            {t.title}
                          </TableCell>
                          <TableCell>{t.due}</TableCell>
                          <TableCell>{t.status}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm">Open</Button>
                              <Button size="sm" variant="ghost">
                                Mark done
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

            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>Your recent weeks</CardDescription>
              </CardHeader>
              <CardContent style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={myAttendance}>
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
          </div>

          <div className="mt-6 flex gap-4">
            <Button>Download my report</Button>
            <Button variant="outline">Request feedback</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
