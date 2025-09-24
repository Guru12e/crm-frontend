"use client";
import { supabase } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
export default function PricingPage() {
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

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
    }, 1000);
    return () => clearInterval(intervalId);
  }, [userEmail]);

  console.log(dealsData);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pricing Page</h1>
      <p className="text-md">
        Manage your on-going deals and pricing strategies here.
      </p>
      <div className="mt-6 relative h-40">
        <Command className="rounded-lg">
          <div className="w-full h-20 mt-6 overflow-visible bg-white rounded-2xl p-6 flex gap-4 justify-between relative">
            <div className="relative w-full max-w-sm">
              <CommandInput
                placeholder="Search deals..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="w-full"
              />

              {/* 🔑 Dropdown under input only */}
              {searchTerm !== "" && (
                <CommandList
                  className="
              absolute top-full left-0 mt-1
              w-full max-h-40 overflow-y-auto 
              bg-white rounded-md shadow border z-50
            "
                >
                  <CommandEmpty>No results found.</CommandEmpty>
                  {dealsData.map((deal) => (
                    <CommandItem key={deal.id} value={deal.name}>
                      {deal.name}
                    </CommandItem>
                  ))}
                </CommandList>
              )}
            </div>

            <Select>
              <SelectTrigger className="w-full max-w-sm">
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
        </Command>
      </div>
    </div>
  );
}
