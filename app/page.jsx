"use client";
import OnBoarding from "@/components/OnBoarding";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status !== 200) {
        return;
      }
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      redirect("/home");
    };

    getUser();
  }, []);

  return <OnBoarding />;
}
