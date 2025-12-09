"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const router = useRouter();

  const HandleEmployeeLogout = () => {
    localStorage.clear();
    if (type === "admin") {
      signOut({ callbackUrl: "/" });
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const type = localStorage.getItem("type");
      if (type === "employee") {
        setType("employee");
        const employeeData = JSON.parse(localStorage.getItem("employee"));
        setUser(employeeData || null);

        return;
      } else {
        setType("admin");
      }

      const res = await fetch("/api/getUserEmail", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem("session", JSON.stringify(data));
        setUser(data.user || null);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar asChild className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-r bg-teal-400 text-black">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} alt="@user" />
            <AvatarFallback className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/30 dark:border-slate-700/50"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* {type === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/prospects/our-prospects"
                className="w-full cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Company Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
          </>
        )} */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <button
            onClick={HandleEmployeeLogout}
            className="w-full cursor-pointer"
          >
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
