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
} from "recharts";
import { supabase } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default function EmployeeDashboard() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [attendanceDict, setAttendanceDict] = useState({});
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    if (!emp) return;
    setEmployee(emp);

    if (emp?.email) {
      fetchAttendance(emp.email);
      fetchTasks(emp.email);
    }
  }, []);

  const fetchAttendance = async (email) => {
    const { data, error } = await supabase
      .from("Employees")
      .select("attendance", "notifications")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    const attendance = data?.attendance || {};
    setAttendanceDict(attendance);
    localStorage.setItem("attendanceDict", JSON.stringify(attendance));
    const today = new Date().toISOString().split("T")[0];
    if (attendance[today]) {
      const workedHours = attendance[today];
      setHour(Math.floor(workedHours));
      setMinute(Math.round((workedHours - Math.floor(workedHours)) * 60));
      setAttendanceMarked(true);
    } else {
      setHour(0);
      setMinute(0);
      setAttendanceMarked(false);
    }
    generateWeeklyChart(attendance);
  };

  const fetchTasks = async (email) => {
    const { data, error } = await supabase
      .from("Employees")
      .select("tasks")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    setMyTasks(data?.tasks || []);
  };

  const HandleStartWork = async () => {
    if (!employee?.email) {
      toast.error("Employee data not found");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date();

    if (!isWorking) {
      setStartTime(currentTime);
      setIsWorking(true);
      localStorage.setItem("isWorking", "true");
      localStorage.setItem("startTime", currentTime.toISOString());
      toast.info("Work started");
    } else {
      if (!startTime) return;

      const endTime = new Date();
      const hoursWorked = (endTime - new Date(startTime)) / (1000 * 60 * 60);
      const existingHours = attendanceDict[today] || 0;
      const totalHours = existingHours + hoursWorked;

      setIsWorking(false);
      localStorage.removeItem("isWorking");
      localStorage.removeItem("startTime");
      setHour(Math.floor(totalHours));
      setMinute(Math.round((totalHours - Math.floor(totalHours)) * 60));

      const updatedAttendance = {
        ...attendanceDict,
        [today]: Number(totalHours.toFixed(2)),
      };

      setAttendanceDict(updatedAttendance);
      localStorage.setItem("attendanceDict", JSON.stringify(updatedAttendance));

      const { error } = await supabase
        .from("Employees")
        .update({ attendance: updatedAttendance })
        .eq("email", employee.email);

      if (error) {
        console.error("Error saving attendance:", error);
        toast.error("Failed to update attendance");
      } else {
        if (!attendanceMarked) {
          setAttendanceMarked(true);
          toast.success("Attendance marked for today!");
        } else {
          toast.success("Working hours updated!");
        }
      }
    }
  };

  useEffect(() => {
    let timer;

    const updateTimer = () => {
      setMinute((prevMinute) => {
        if (prevMinute === 59) {
          setHour((prevHour) => prevHour + 1);
          return 0;
        }
        return prevMinute + 1;
      });
    };

    if (isWorking) {
      timer = setInterval(updateTimer, 60000);
    }

    return () => clearInterval(timer);
  }, [isWorking]);

  useEffect(() => {
    const storedAttendance = JSON.parse(localStorage.getItem("attendanceDict"));
    const storedIsWorking = localStorage.getItem("isWorking") === "true";
    const storedStartTime = localStorage.getItem("startTime");
    const today = new Date().toISOString().split("T")[0];

    if (storedAttendance) {
      setAttendanceDict(storedAttendance);
      if (storedAttendance[today]) {
        const workedHours = storedAttendance[today];
        setHour(Math.floor(workedHours));
        setMinute(Math.round((workedHours - Math.floor(workedHours)) * 60));
        setAttendanceMarked(true);
      }
    }

    if (storedIsWorking && storedStartTime) {
      setIsWorking(true);
      setStartTime(new Date(storedStartTime));

      const elapsed =
        (new Date() - new Date(storedStartTime)) / (1000 * 60 * 60);
      const totalElapsed = (storedAttendance?.[today] || 0) + elapsed;

      setHour(Math.floor(totalElapsed));
      setMinute(Math.round((totalElapsed - Math.floor(totalElapsed)) * 60));
    }

    if (employee?.email) fetchAttendance(employee.email);
  }, [employee]);

  const generateWeeklyChart = (attendanceObj) => {
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const hours = attendanceObj[formattedDate] || 0;
      weekData.push({ date: dayName, hours });
    }

    setChartData(weekData);
  };

  const totalHours = Object.values(attendanceDict).reduce(
    (sum, h) => sum + h,
    0
  );
  const completedTasks = myTasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-700 to-teal-500 flex items-center justify-center text-white text-lg">
                <span>{employee?.name?.[0] || "E"}</span>
              </div>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {employee?.name || "Employee"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {employee?.role || "Employee Role"}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total hours worked
                  </p>
                  <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Tasks done</p>
                  <p className="text-lg font-semibold">{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="col-span-12 md:col-span-8 lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full">
              <Input
                placeholder="Search tasks, docs or teammates"
                className="pl-10"
              />
              <div className="absolute left-3 top-2 pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost">
                <Bell />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card
              className={
                "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
              }
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Tasks due</p>
                    <p className="text-2xl font-bold">{myTasks.length}</p>
                  </div>
                  <div className="p-2 rounded-md backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
                    <CalendarDays />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
              }
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Completed tasks
                    </p>
                    <p className="text-2xl font-bold">{completedTasks}</p>
                  </div>
                  <div className="p-2 rounded-md backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
                    <CheckSquare />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
              }
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Hours logged
                    </p>
                    <p className="text-2xl font-bold">
                      {totalHours.toFixed(1)}h
                    </p>
                  </div>
                  <div className="p-2 rounded-md backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
                    <Clock />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
              }
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Focus score</p>
                    <p className="text-2xl font-bold">76%</p>
                  </div>
                  <div className="p-2 rounded-md backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
                    <PieChart />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="mb-6 lg:col-span-2 backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
              <CardHeader>
                <CardTitle>Weekly Productivity</CardTitle>
                <CardDescription>Hours worked (Past 7 days)</CardDescription>
              </CardHeader>
              <CardContent style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#grad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mb-6 backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white">
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
                    <Button onClick={HandleStartWork}>
                      {isWorking ? "Stop Work" : "Start Work"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card
            className={
              "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
            }
          >
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTasks.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>
                        {t.due_date
                          ? new Date(t.due_date).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{t.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
