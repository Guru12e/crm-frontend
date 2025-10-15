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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
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
import {
  Search,
  PlusCircle,
  CheckSquare,
  Clock,
  ListChecks,
  ListTodo,
  Trash2,
} from "lucide-react";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dueDateOpen, setDueDateOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "In-progress",
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
    };
    getSession();
  }, []);

  // Fetch employee data (tasks + todo list)
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!userEmail) return;

      const { data, error } = await supabase
        .from("Employees")
        .select("tasks, todo_list")
        .eq("email", userEmail)
        .single();

      if (error) {
        console.error("Error fetching employee data:", error);
        return;
      }

      if (data?.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
      else setTasks([]);

      if (data?.todo_list && Array.isArray(data.todo_list))
        setTodoList(data.todo_list);
      else setTodoList([]);
    };

    fetchEmployeeData();
  }, [userEmail]);

  const filteredTasks = tasks.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      t.name?.toLowerCase()?.includes(search.toLowerCase())
  );

  const handleAddTask = async () => {
    if (!newTask.name.trim()) return;
    setLoading(true);

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    const { error } = await supabase
      .from("Employees")
      .update({ tasks: updatedTasks })
      .eq("email", userEmail);

    if (error) console.error("Error adding task:", error);

    setNewTask({
      name: "",
      description: "",
      dueDate: "",
      status: "In-progress",
      priority: "Medium",
    });
    setLoading(false);
  };

  const handleMarkCompleted = async (taskIndex) => {
    console.log("Marking task as completed:", taskIndex);
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

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    const updatedTodoList = [...todoList, { text: newTodo, completed: false }];
    setTodoList(updatedTodoList);
    setNewTodo("");

    const { error } = await supabase
      .from("Employees")
      .update({ todo_list: updatedTodoList })
      .eq("email", userEmail);

    if (error) console.error("Error adding todo:", error);
  };

  const handleToggleTodo = async (index) => {
    const updatedTodoList = todoList.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoList(updatedTodoList);

    const { error } = await supabase
      .from("Employees")
      .update({ todo_list: updatedTodoList })
      .eq("email", userEmail);

    if (error) console.error("Error updating todo:", error);
  };

  // ✅ Delete to-do item
  const handleDeleteTodo = async (index) => {
    const updatedTodoList = todoList.filter((_, i) => i !== index);
    setTodoList(updatedTodoList);

    const { error } = await supabase
      .from("Employees")
      .update({ todo_list: updatedTodoList })
      .eq("email", userEmail);

    if (error) console.error("Error deleting todo:", error);
  };
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your assigned tasks
          </p>
        </div>

        {/* --- Add Task Sheet --- */}
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
                    {newTask.priority}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
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
                    onSelect={(date) =>
                      setNewTask({
                        ...newTask,
                        dueDate: date?.toISOString(),
                      })
                    }
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

      {/* --- TASK SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          //   {
          //     label: "Open Tasks",
          //     count: tasks.filter((t) => t.status === "Open").length,
          //     icon: <Clock className="text-slate-500" />,
          //   },
          {
            label: "In Progress",
            count: tasks.filter((t) => t.status === "In-progress").length,
            icon: <Clock className="text-blue-500" />,
          },
          {
            label: "Completed",
            count: tasks.filter((t) => t.status === "Completed").length,
            icon: <CheckSquare className="text-green-500" />,
          },
        ].map((card, i) => (
          <Card
            key={i}
            className="backdrop-blur-sm border border-slate-200/50 dark:border-white/20 bg-white"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold">{card.count}</p>
              </div>
              {card.icon}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- TASK LIST TABLE --- */}
      <Card className="backdrop-blur-sm border border-slate-200/50 dark:border-white/20 bg-white">
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
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleMarkCompleted(index)}
                        className="border border-green-600 text-green-600 bg-white hover:bg-green-50"
                      >
                        <CheckSquare size={14} />
                        Done
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- PERSONAL TO-DO LIST --- */}
      <Card className="backdrop-blur-sm border border-slate-200/50 dark:border-white/20 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo size={20} />
            Personal To-Do List
          </CardTitle>
          <CardDescription>
            Manage your own to-do items here (not part of assigned tasks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new to-do..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button onClick={handleAddTodo} className="bg-blue-600 text-white">
              Add
            </Button>
          </div>
          {todoList.length === 0 ? (
            <p className="text-muted-foreground text-sm">No to-dos yet.</p>
          ) : (
            <ul className="space-y-2">
              {todoList.map((todo, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-md border ${
                    todo.completed ? "bg-green-50" : "bg-slate-50"
                  }`}
                >
                  <div
                    onClick={() => handleToggleTodo(index)}
                    className={`flex-1 cursor-pointer ${
                      todo.completed
                        ? "line-through text-green-600"
                        : "text-slate-800"
                    }`}
                  >
                    {todo.text}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
