"use client";
import { supabase } from "@/utils/supabase/client";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { set } from "lodash";
export default function PricingPage() {
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("Deals")
      .select("*")
      .eq("user_email", userEmail);
    const activeStatuses = ["New", "Negotiation", "Proposal Sent", "Contacted"];

    const filteredDeals = data.filter((deal) =>
      activeStatuses.includes(deal.status)
    );

    if (error) {
      console.error("Error fetching deals:", error);
    } else {
      setDealsData(filteredDeals);
    }

    const { data: productsData, error: productsError } = await supabase
      .from("Users")
      .select("products")
      .eq("email", userEmail);
    if (productsError) {
      console.error("Error fetching products:", productsError);
    }
    if (productsData && productsData.length > 0) {
      setProducts(productsData[0].products || []);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUserEmail(userObj.email);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [userEmail]);

  console.log(dealsData);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pricing Page</h1>
      <p className="text-md">
        Manage your on-going deals and pricing strategies here.
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Active Deals</h2>
        {dealsData.length === 0 ? (
          <Card
            className="shadow-sm rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 w-full flex flex-col items-center justify-center p-10 text-center"
            style={{ minHeight: "30vh" }}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Active Deals Found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your new deals will appear here once they are active.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dealsData.map((deal) => (
              <Card
                key={deal.id}
                className="shadow-sm rounded-lg bg-white dark:bg-slate-800 p-4 border border-slate-200/80 dark:border-white/20"
              >
                <CardHeader className="pb-2">
                  {deal.name} {" - "} {deal.title}
                </CardHeader>
                <CardDescription className="text-sm">
                  Amount:{" "}
                  {deal.value !== null ? (
                    <>
                      {products.find((p) => p.name === deal.product)
                        ?.currency || "$"}
                      {deal.value} {""}
                      {products.find((p) => p.name === deal.product)
                        ?.billingCycle || "per month"}
                    </>
                  ) : (
                    <>Deal Value Not Set</>
                  )}
                  <br />
                  Status: {deal.status} <br />
                  Expected Close Date: {deal.expected_close_date}
                  Product: {deal.product} <br />
                  Contact: {deal.contact_name} <br />
                  Created At: {new Date(deal.created_at).toLocaleDateString()}
                </CardDescription>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
