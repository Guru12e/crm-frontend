"use client";

import TemplateCreator from "@/components/TemplateCreator";
import { supabase } from "../../../../utils/supabase/client";
import { useEffect, useRef, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ProductConfigCard } from "@/components/ProductConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import QuotePreview from "@/components/QuotePreview";
import { DollarSign, Settings, FileText } from "lucide-react";

const SkeletonCard = () => (
  <div className="mb-6 border border-slate-200/50 dark:border-white/20 rounded-lg p-4 animate-pulse">
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
    <div className="mt-6 p-4 flex flex-col items-end gap-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="flex gap-2 flex-wrap justify-end">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export default function PricingPage() {
  const triggerRef = useRef({});
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dealsToShow, setDealsToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [intentScore, setIntentScore] = useState("");
  const [dealConfig, setDealConfig] = useState([]);

  const fetchData = async (email) => {
    if (!email) return;
    setIsLoading(true);

    const { data: deals, error: dealsError } = await supabase
      .from("Deals")
      .select("*")
      .eq("user_email", email);

    if (dealsError) {
      console.error("Error fetching deals:", dealsError);
      toast.error("Failed to fetch deals.");
      setIsLoading(false);
      return;
    }

    const activeStatuses = [
      "New",
      "Negotiation",
      "Proposal Sent",
      "Contacted",
      "On-hold",
    ];
    const activeDeals = deals.filter((deal) =>
      activeStatuses.includes(deal.status)
    );

    setDealsData(activeDeals);
    setDealsToShow(activeDeals);

    const { data: productsData, error: productsError } = await supabase
      .from("Users")
      .select("products")
      .eq("email", email)
      .single();

    if (productsError) {
      console.error("Error fetching products:", productsError);
      toast.error("Failed to fetch products.");
    } else if (productsData) {
      setProducts(productsData.products || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUserEmail(userObj.email);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchData(userEmail);

      const channel = supabase
        .channel("deals-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Deals",
            filter: `user_email=eq.${userEmail}`,
          },
          (payload) => {
            console.log("Real-time change received!", payload);
            toast.info("Deals have been updated.");
            fetchData(userEmail);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userEmail]);

  useEffect(() => {
    if (searchTerm === null || searchTerm.trim() === "") {
      setShowSuggestions(false);
      setSearchSuggestions([]);
      return;
    }

    const suggestions = dealsData.filter(
      (deal) =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchSuggestions(suggestions);
    setShowSuggestions(true);
  }, [searchTerm, dealsData]);

  useEffect(() => {
    let result = [...dealsData];
    if (selectedProduct) {
      result = result.filter((deal) =>
        deal.products?.includes(selectedProduct)
      );
    }

    if (searchTerm) {
      const trimmedSearch = searchTerm.trim().toLowerCase();
      if (trimmedSearch) {
        if (!showSuggestions) {
          result = result.filter(
            (deal) =>
              deal.name.toLowerCase().includes(trimmedSearch) ||
              deal.title?.toLowerCase().includes(trimmedSearch)
          );
        }
      }
      setDealsToShow(result);
      setDealConfig(result.map((deal) => deal.configuration || []));
    }
  }, [searchTerm, showSuggestions, dealsData, selectedProduct]);

  const handleChange = (dealId, field, productIndex, value) => {
    const updatedDeals = dealsToShow.map((deal) => {
      if (deal.id === dealId) {
        const newFieldArray = [...(deal[field] || [])];
        while (newFieldArray.length <= productIndex) {
          newFieldArray.push(field === "quantity" ? 1 : "0%");
        }
        newFieldArray[productIndex] = value;
        return { ...deal, [field]: newFieldArray };
      }
      return deal;
    });
    setDealsToShow(updatedDeals);
  };

  const handleIntentChange = async (dealId, intentScore, index) => {
    const { data, error } = await supabase
      .from("Deals")
      .update({
        intent_score: intentScore,
      })
      .eq("id", dealId);
    if (error) {
      console.error("Error updating intent score:", error);
      toast.error("Failed to update intent score.");
    }
    setIntentScore("");
    fetchData(userEmail);
    handleGeneratePrice(dealId, index);
  };

  const handleSave = async (dealId) => {
    const dealToSave = dealsToShow.find((d) => d.id === dealId);
    if (!dealToSave) return;
    const { quantity, discount, user_discount } = dealToSave;
    const { error } = await supabase
      .from("Deals")
      .update({ quantity, discount, user_discount })
      .eq("id", dealId);
    if (error) toast.error("Failed to save deal.");
    else toast.success(`Deal "${dealToSave.name}" saved successfully!`);
  };

  const handleApprove = async (dealId) => {
    const dealToApprove = dealsToShow.find((d) => d.id === dealId);
    if (!dealToApprove) return;
    const grandTotal = calculateGrandTotal(dealToApprove);
    const { error } = await supabase
      .from("Deals")
      .update({ finalPrice: grandTotal.toFixed(2) })
      .eq("id", dealId);
    if (error) toast.error("Failed to approve deal.");
    else
      toast.success(
        `Deal approved with a final price of $${grandTotal.toFixed(2)}.`
      );
  };

  const calculateOriginalPrice = (productName, dealId, dealConfig) => {
    const product = products.find((p) => p.name === productName);
    let price = parseFloat(product?.price || 0);
    const dealIndex = dealsToShow.findIndex((d) => d.id === dealId);
    const productIndex = dealsToShow[dealIndex]?.products.findIndex(
      (p) => p === productName
    );
    if (!dealConfig[dealIndex] || !dealConfig[dealIndex][productIndex]) {
      return price;
    }
    const config = dealConfig[dealIndex][productIndex];
    for (const category in config) {
      price += parseFloat(config[category]?.price || 0);
    }
    return price;
  };
  const handleGeneratePrice = async (dealId, productIndex) => {
    const deal = dealsToShow.find((d) => d.id === dealId);
    const intentScore = deal.intent_score;
    if (!intentScore) {
      setIntentScore("");
      triggerRef.current[dealId]?.click();
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/get_discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent_score: intentScore }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const suggestedDiscount = data.suggested_discount;

      await fetch("http://127.0.0.1:5000/update_discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId,
          product_index: productIndex,
          discount_value: suggestedDiscount,
        }),
      });
    } catch (error) {
      toast.error("Failed to fetch or save suggested price:", error);
      toast.error("Could not get or save the price suggestion.");
    }
    fetchData(userEmail);
  };

  const handleGenerateQuote = (dealId) =>
    toast.info("Quote generation feature coming soon!");

  const handleSaveConfiguration = async (dealId, currentConfig) => {
    const dealIndex = dealsToShow.findIndex((d) => d.id === dealId);
    console.log(
      "Saving configuration for deal:",
      dealId,
      currentConfig[dealIndex]
    );
    console.log(typeof currentConfig[dealIndex]);
    const { error } = await supabase
      .from("Deals")
      .update({ configuration: currentConfig[dealIndex] })
      .eq("id", dealId);
    if (error) {
      console.error("Error saving configurations:", error);
      toast.error("Failed to save configurations.");
    } else {
      toast.success("Configurations saved successfully.");
      fetchData(userEmail);
    }
  };

  const calculateGrandTotal = (deal) => {
    if (!deal.products || deal.products.length === 0) return 0;
    return deal.products.reduce((total, productName, index) => {
      const productDetails = products.find((p) => p.name === productName);
      if (!productDetails) return total;
      const originalPrice = calculateOriginalPrice(
        productName,
        deal.id,
        dealConfig
      );
      const quantity = parseInt(deal.quantity?.[index] || 1, 10);
      const discountStr = String(deal.user_discount?.[index] || "0");
      const discountValue = parseFloat(discountStr.replace("%", ""));
      const discount = isNaN(discountValue) ? 0 : discountValue;
      const finalPrice = originalPrice * quantity * (1 - discount / 100);
      return total + finalPrice;
    }, 0);
  };

  return (
    <div className="w-full min-h-[70vh] relative p-4">
      <h1 className="text-3xl font-bold mb-2">Pricing Manager</h1>
      <p className="text-slate-500 mb-8">
        Manage your deals, configure products, and generate quotes.
      </p>

      <div className="w-full mb-8 relative z-[50] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-grow w-full md:max-w-md">
          <Input
            placeholder="Search deals..."
            value={searchTerm ? searchTerm : ""}
            type="text"
            className="w-full"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
          />
          {showSuggestions && (
            <div className="absolute top-[110%] z-50 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg flex flex-col items-start w-full">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((deal) => (
                  <button
                    key={deal.id}
                    className="w-full text-left p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => {
                      setSearchTerm(deal.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {deal.name} -{" "}
                    <span className="text-slate-500">
                      {deal.title || "No Title"}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-2 text-slate-500">No deals found.</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select
            onValueChange={(value) =>
              setSelectedProduct(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Products</SelectLabel>
                <SelectItem value="all">All Products</SelectItem>
                {products?.map((product, index) => (
                  <SelectItem key={index} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <TemplateCreator />

          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedProduct(null);
            }}
            variant="outline"
            className={`${
              searchTerm !== "" ||
              (selectedProduct !== null && selectedProduct !== "all")
                ? "opacity-100"
                : "hidden"
            }`}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : dealsToShow.length > 0 ? (
          dealsToShow.map((deal) => {
            const grandTotal = calculateGrandTotal(deal);
            return (
              <Card
                key={deal.id}
                className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-800"
              >
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        {deal.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {deal.title || "No Title"} •{" "}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {deal.status}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Grand Total</div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {products[0]?.currency || "$"}
                        {grandTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Pricing Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800">
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            Pricing Details
                          </h3>
                          <p className="text-sm text-slate-500">
                            View and manage pricing, discounts, and quantities
                            for this deal.
                          </p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogTitle>Pricing Details - {deal.name}</DialogTitle>
                        <DialogDescription>
                          Adjust quantities and discounts below.
                        </DialogDescription>
                        <div className="mt-4">
                          {!deal.products || deal.products.length === 0 ? (
                            <p>This deal has no products assigned.</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-right">
                                    Original Price
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Discount (%)
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Quantity
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Final Price
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {deal.products.map((productName, index) => {
                                  const productDetails = products.find(
                                    (p) => p.name === productName
                                  );
                                  const originalPrice = calculateOriginalPrice(
                                    productName,
                                    deal.id,
                                    dealConfig
                                  );
                                  const quantity = deal.quantity?.[index] || 1;
                                  const discountStr = String(
                                    deal.user_discount?.[index] || "0"
                                  );
                                  const userDiscount =
                                    parseFloat(discountStr.replace("%", "")) ||
                                    0;
                                  const finalPrice =
                                    originalPrice *
                                    quantity *
                                    (1 - userDiscount / 100);

                                  return (
                                    <TableRow key={`${deal.id}-${index}`}>
                                      <TableCell className="font-medium">
                                        {productName}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {productDetails
                                          ? `${
                                              productDetails.currency || "$"
                                            }${originalPrice.toFixed(2)}`
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <Input
                                            disabled={
                                              deal.finalPrice > 0 &&
                                              deal.finalPrice !== null &&
                                              deal.finalPrice !== undefined
                                            }
                                            value={
                                              deal.user_discount?.[index] || "0"
                                            }
                                            onChange={(e) =>
                                              handleChange(
                                                deal.id,
                                                "user_discount",
                                                index,
                                                e.target.value
                                              )
                                            }
                                            className="w-20 text-center"
                                          />
                                          <Input
                                            disabled
                                            value={
                                              deal.discount?.[index] || "0%"
                                            }
                                            className="w-20 text-center bg-slate-100 dark:bg-slate-700"
                                            title="ML Suggestion"
                                          />
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Input
                                          value={deal.quantity?.[index] || 1}
                                          disabled={
                                            deal.finalPrice > 0 &&
                                            deal.finalPrice !== null &&
                                            deal.finalPrice !== undefined
                                          }
                                          type="number"
                                          min="1"
                                          onChange={(e) =>
                                            handleChange(
                                              deal.id,
                                              "quantity",
                                              index,
                                              e.target.value
                                            )
                                          }
                                          className="w-20 mx-auto text-center"
                                        />
                                      </TableCell>
                                      <TableCell className="text-right font-bold">
                                        {productDetails
                                          ? `${
                                              productDetails.currency || "$"
                                            }${finalPrice.toFixed(2)}`
                                          : "N/A"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleGeneratePrice(
                                                deal.id,
                                                index
                                              )
                                            }
                                            disabled={
                                              deal.finalPrice > 0 &&
                                              deal.finalPrice !== null &&
                                              deal.finalPrice !== undefined
                                            }
                                          >
                                            Suggest
                                          </Button>
                                          {/* Hidden Trigger for Intent Score Dialog */}
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                ref={(element) => {
                                                  triggerRef.current[deal.id] =
                                                    element;
                                                }}
                                                className="hidden"
                                              >
                                                Hidden
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogTitle>
                                                Missing Intent Score
                                              </DialogTitle>
                                              <DialogDescription>
                                                Enter intent score (1-100) for{" "}
                                                {deal.name}
                                              </DialogDescription>
                                              <Input
                                                value={intentScore}
                                                onChange={(e) =>
                                                  setIntentScore(e.target.value)
                                                }
                                                placeholder="Score"
                                              />
                                              <DialogFooter>
                                                <Button
                                                  onClick={() =>
                                                    handleIntentChange(
                                                      deal.id,
                                                      intentScore,
                                                      index
                                                    )
                                                  }
                                                >
                                                  Submit
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleSave(deal.id)}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Card 2: Configure Product */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <div className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800">
                          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            Configure Product
                          </h3>
                          <p className="text-sm text-slate-500">
                            Customize product options, features, and
                            configurations.
                          </p>
                        </div>
                      </SheetTrigger>
                      <SheetContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6 md:min-w-[85vw] min-w-screen overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle className="mb-4 text-lg font-bold">
                            Configure Products for {deal.name}
                          </SheetTitle>
                        </SheetHeader>
                        {!deal.products || deal.products.length === 0 ? (
                          <p>This deal has no products assigned.</p>
                        ) : (
                          deal.products.map((productName, productIndex) => {
                            const product = products.find(
                              (p) => p.name === productName
                            );
                            return (
                              <ProductConfigCard
                                key={`${deal.id}-${productIndex}`}
                                product={product}
                                productIndex={productIndex}
                                dealIndex={dealsToShow.findIndex(
                                  (d) => d.id === deal.id
                                )}
                                index={productIndex}
                                dealConfig={dealConfig}
                                setDealConfig={setDealConfig}
                              />
                            );
                          })
                        )}
                        <SheetFooter className="w-full justify-center items-center mt-6">
                          <Button
                            type="submit"
                            className="bg-transparent hover:bg-blue-500/10 text-blue-700 border border-blue-700 w-xl"
                            onClick={() => {
                              handleSaveConfiguration(deal.id, dealConfig);
                            }}
                          >
                            Save Configurations
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>

                    {/* Card 3: Preview Quote */}
                    <QuotePreview dealId={deal.id}>
                      <div className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-800 h-full">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          Preview Quote
                        </h3>
                        <p className="text-sm text-slate-500">
                          Generate and preview the final quote PDF for this
                          deal.
                        </p>
                      </div>
                    </QuotePreview>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSave(deal.id)}
                    disabled={
                      deal.finalPrice > 0 &&
                      deal.finalPrice !== null &&
                      deal.finalPrice !== undefined
                    }
                  >
                    Save Draft
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          deal.finalPrice > 0 &&
                          deal.finalPrice !== null &&
                          deal.finalPrice !== undefined
                        }
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve Deal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">
                          Confirm Approval
                        </h2>
                        <p>
                          Are you sure you want to approve this deal? After you
                          confirm, the details cannot be changed.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => handleApprove(deal.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Confirm Approval
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 text-lg">
              No active deals match your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("");
                setSelectedProduct(null);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
