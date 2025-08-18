"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import UpdateCompanyDetails from "@/components/UpdateCompanyDetails";

export default function OurProspects() {
  const [result, setResult] = useState("");
  const [companyData_1, setCompanyData] = useState({});
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
  console.log("Company data set:", companyData_1);

  const handleClick = async () => {
    console.log("In click");
    console.log("Inclick:", companyData_1);
    if (!companyData_1) return;

    const res = await fetch("/api/ICP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        description: companyData_1,
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
    <div className="">
      <h1 className="text-2xl font-bold">ICP Page</h1>
      <UpdateCompanyDetails />
    </div>
  );
}
