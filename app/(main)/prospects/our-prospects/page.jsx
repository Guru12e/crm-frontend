"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import UpdateCompanyDetails from "@/components/UpdateCompanyDetails";

export default function OurProspects() {
  const [result, setResult] = useState("");
  const [companyData, setCompanyData] = useState({});
  const rawSession = localStorage.getItem("session");
  const session = JSON.parse(rawSession);
  const userEmail = session.user.email;
  console.log("userEmail:", userEmail);

  useEffect(() => {
    const fetchData = async () => {
      if (!rawSession) return;

      if (!userEmail) return;

      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", userEmail);

      if (error) {
        console.error(error);
      } else {
        console.log("In else");
        setCompanyData(data[0]);
      }
    };

    fetchData();
  }, []);
  console.log("Company data set:", companyData);

  const handleClick = async () => {
    console.log("In click");
    console.log("Inclick:", companyData);
    if (!companyData) return;

    const res = await fetch("/api/ICP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        description: companyData,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setResult(data.output);
    }
    console.log(result);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ICP Page</h1>
      <UpdateCompanyDetails />
    </div>
  );
}
