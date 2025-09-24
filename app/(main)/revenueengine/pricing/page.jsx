"use client";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { set } from "lodash";
import { Search } from "lucide-react";
export default function PricingPage() {
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [suggestion, setSuggestion] = useState(true);

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
    if (searchTerm.trim() === "") {
      return;
    } else {
      const deals = dealsData.filter((deal) =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeals(deals);
    }
  }, [searchTerm]);

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
    }, 1000);
    return () => clearInterval(intervalId);
  }, [userEmail]);

  console.log(dealsData);

  return (
    <div className="w-full min-h-[70vh] relative">
      <h1 className="text-2xl font-bold mb-4">Pricing Page</h1>
      <p className="text-md">
        Manage your on-going deals and pricing strategies here.
      </p>
      <div className="mt-6">
        <div className="w-full mt-6 bg-white rounded-2xl p-6 flex gap-4 justify-between">
          <div className="relative flex w-1/2">
            {" "}
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="   Search deals..."
              value={searchTerm}
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" w-full max-w-sm "
            />
            {searchTerm.trim() !== "" && suggestion === true && (
              <div className="absolute z-10 top-[120%] p-2 bg-white border border-slate-200 rounded-md shadow-md flex flex-col items-start w-full">
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <button
                      key={deal.id}
                      value={deal.name}
                      onClick={() => {
                        setSearchTerm(deal.name);
                        setSuggestion(false);
                      }}
                    >
                      {deal.name}
                    </button>
                  ))
                ) : (
                  <div>No deals found.</div>
                )}
              </div>
            )}
          </div>

          <Select>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a product</SelectLabel>
                {products?.map((product, index) => (
                  <SelectItem key={index} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
