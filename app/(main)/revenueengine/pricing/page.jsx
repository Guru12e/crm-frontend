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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function PricingPage() {
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [suggestion, setSuggestion] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      const dealbytitle = dealsData.filter((deal) =>
        deal.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      dealbytitle.forEach((deal) => {
        if (!deals.map((d) => d.id).includes(deal.id)) {
          deals.push(deal);
        }
      });
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

  const [dealsToShow, setDealsToShow] = useState([]);

  useEffect(() => {
    const filteredDeals = dealsData;
    if (selectedProduct !== null) {
      const filteredByProduct = filteredDeals.filter((deal) =>
        deal.products?.some((product) => product.name === selectedProduct.name)
      );
      if (searchTerm.trim() !== "") {
        const filteredBySearch = filteredByProduct.filter(
          (deal) =>
            deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDealsToShow(filteredBySearch);
      } else {
        setDealsToShow(filteredByProduct);
      }
    } else {
      if (searchTerm.trim() !== "") {
        const filteredBySearch = filteredDeals.filter(
          (deal) =>
            deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDealsToShow(filteredBySearch);
      } else {
        setDealsToShow(filteredDeals);
      }
    }
  }, [searchTerm, suggestion, dealsData, selectedProduct]);

  return (
    <div className="w-full min-h-[70vh] relative">
      <h1 className="text-2xl font-bold mb-4">Pricing Page</h1>
      <p className="text-md">
        Manage your on-going deals and pricing strategies here.
      </p>
      <div className="mt-6">
        <div className="w-full mt-6 rounded-2xl p-6 flex gap-4 justify-between backdrop-blur-sm bg-white/70 hover:shadow-lg dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-1000 group">
          <div className="relative flex w-1/2">
            <Input
              placeholder="   Search deals..."
              value={searchTerm}
              type="text"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSuggestion(true);
              }}
              className=" w-full max-w-sm "
            />
            {searchTerm.trim() !== "" && suggestion === true && (
              <div className="absolute z-10 top-[120%] p-2 bg-white border border-slate-200 rounded-md shadow-md flex flex-col items-start w-full">
                {filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <button
                      key={deal.id}
                      value={[deal.name, deal.title]}
                      onClick={() => {
                        setSearchTerm(deal.name);
                        setSuggestion(false);
                      }}
                    >
                      {deal.name}
                      {" - "}
                      {deal.title || "No Title"}
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
                  <SelectItem
                    key={index}
                    value={product.name}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 ">
        {dealsToShow.length > 0 ? (
          <div className="grid grid-cols-1 w-full gap-4">
            {dealsToShow.map((deal) => (
              <Card
                key={deal.id}
                className=" backdrop-blur-sm bg-white/70 hover:shadow-lg dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-1000 group"
              >
                <CardHeader className="font-bold text-lg mb-2">
                  {deal.name}
                  {" - "} {deal.title || "No Title"}
                </CardHeader>
                <CardContent className={`grid xs:grid-cols-1 md:grid-cols-2 `}>
                  <div className="flex gap-2">
                    <span className="font-semibold">Amount:</span>{" "}
                    {deal.amount || " Deal Value not set"}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Status:</span> {deal.status}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">
                      Associated Products: ({deal.products?.length || 0})
                    </span>
                    {deal.products && deal.products.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {deal.products.map((product) => (
                          <li key={product.id}>{product.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No associated products</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Closing Date:</span>{" "}
                    {deal.closeDate.split("T")[0] || " Not set"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className=" backdrop-blur-sm bg-white/70 hover:shadow-lg dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-1000 group">
            <CardContent>
              <CardHeader className="font-bold text-lg mb-2">
                No Deals Found
              </CardHeader>
              <div>No deals to display.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
