"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  PlusCircle,
  CheckSquare,
  Clock,
  ListChecks,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "Open",
    priority: "Medium",
  });

  useEffect(() => {
    const getSession = () => {
      const sessionJSON = JSON.parse(localStorage.getItem("employee"));
      if (sessionJSON?.email) {
        setSession(sessionJSON);
        setUserEmail(sessionJSON.email);
      } else {
        redirect("/");
      }
      console.log(sessionJSON?.email);
    };

    getSession();
  }, []);

  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      if (!userEmail) return;

      const { data, error } = await supabase
        .from("Employees")
        .select("tasks")
        .eq("email", userEmail)
        .single();

      console.log(data, data?.tasks);
      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }

      if (data?.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else {
        setTasks([]);
      }
    };

    fetchEmployeeTasks();
  }, [userEmail]);

  const filteredTasks = tasks.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      t.name?.toLowerCase()?.includes(search.toLowerCase())
  );

  const handleAddTask = async () => {
    if (!newTask.name.trim()) return;

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    const { error } = await supabase
      .from("Employees")
      .update({ tasks: updatedTasks })
      .eq("email", userEmail);

    if (error) {
      console.error("Error adding task:", error);
    }

    setNewTask({
      name: "",
      description: "",
      dueDate: "",
      status: "Open",
      priority: "Medium",
    });
  };

  const handleMarkCompleted = async (taskIndex) => {
    const updatedTasks = tasks.map((t, i) =>
      i === taskIndex ? { ...t, status: "Completed" } : t
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from("Employees")
      .update({ tasks: updatedTasks })
      .eq("email", userEmail);

    if (error) console.error("Error updating task status:", error);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your assigned tasks
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2 bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white md:ml-5">
              <PlusCircle size={18} />
              Add Task
            </Button>
          </SheetTrigger>
          <SheetContent className="p-4 space-y-6 overflow-y-auto min-h-[80vh] backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6">
            <SheetHeader>
              <SheetTitle>Add New Task</SheetTitle>
              <SheetDescription>
                Create a new task and assign a due date.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 mt-3">
              <Input
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full min-h-[100px] resize-none"
              />
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority">
                    {newTask.priority && (
                      <span
                        className={
                          newTask.priority === "High"
                            ? "text-red-500"
                            : newTask.priority === "Medium"
                            ? "text-yellow-500"
                            : newTask.priority === "Low"
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {newTask.priority}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High" className="text-red-600">
                    High
                  </SelectItem>
                  <SelectItem value="Medium" className="text-yellow-500">
                    Medium
                  </SelectItem>
                  <SelectItem value="Low" className="text-green-600">
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={newTask.status}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status">
                    {newTask.status && (
                      <span
                        className={
                          newTask.status === "Pending"
                            ? "text-red-500"
                            : newTask.status === "In Progress"
                            ? "text-blue-500"
                            : newTask.status === "Completed"
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {newTask.status}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending" className="text-red-500">
                    Pending
                  </SelectItem>
                  <SelectItem value="In Progress" className="text-blue-500">
                    In Progress
                  </SelectItem>
                  <SelectItem value="Completed" className="text-green-600">
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>

              <Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start text-left"
                  >
                    {newTask.dueDate
                      ? new Date(newTask.dueDate).toLocaleDateString()
                      : "Select Due Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      newTask.dueDate ? new Date(newTask.dueDate) : undefined
                    }
                    onSelect={(date) => {
                      setNewTask({
                        ...newTask,
                        dueDate: date?.toISOString(),
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleAddTask}
                className=" bg-green-600 hover:bg-green-700 text-white"
              >
                Save Task
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className={
            "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
          }
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Open Tasks</p>
              <p className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "Open").length}
              </p>
            </div>
            <Clock className="text-slate-500" />
          </CardContent>
        </Card>
        <Card
          className={
            "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
          }
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "In Progress").length}
              </p>
            </div>
            <Clock className="text-blue-500" />
          </CardContent>
        </Card>
        <Card
          className={
            "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
          }
        >
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {tasks.filter((t) => t.status === "Completed").length}
              </p>
            </div>
            <CheckSquare className="text-green-500" />
          </CardContent>
        </Card>
      </div>

      <Card
        className={
          "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white p-4"
        }
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2">
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3 top-2 text-slate-400">
              <Search size={16} />
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {["All", "Open", "In Progress", "Review", "Completed"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="text-sm text-black-600 bg-white dark:bg-sky-800/50  hover:bg-green-50 hover:text-green-70"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card
        className={
          "backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 bg-white"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={20} />
            Task List
          </CardTitle>
          <CardDescription>
            All your assigned tasks with status and due dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-10"
                  >
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "Review"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {task.status !== "Completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkCompleted(index)}
                            className="flex items-center gap-1 border border-green-600 text-green-600 bg-white hover:bg-green-50 hover:text-green-70"
                          >
                            <CheckSquare size={14} />
                            Done
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
