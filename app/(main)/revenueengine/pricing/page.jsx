"use client";
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
import { toast, ToastContainer } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { ProductConfigCard } from "@/components/ProductConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function QuotePreview() {
  const [open, setOpen] = useState(false);

  const handlePreview = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button onClick={handlePreview}>Preview</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="scale-100 w-[900px] sm:max-w-[1000px]"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-center">
              QUOTATION
            </SheetTitle>
            <SheetDescription className="text-center text-gray-500 ">
              Preview your quote before sending
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 text-sm w-[750px] mx-auto">
            {/* Company Info */}
            <div className="flex justify-between">
              <div>
                <p className="font-bold">[Company Name]</p>
                <p>[Street Address]</p>
                <p>[City, ST ZIP]</p>
                <p>Phone: (000) 000-0000</p>
                <p>Email: company@email.com</p>
              </div>

              <div className="text-right text-sm">
                <table className="border border-gray-300 text-xs w-[250px] mx-auto">
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        QUOTE #
                      </td>
                      <td className="border px-2 py-1">2034</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">DATE</td>
                      <td className="border px-2 py-1">2/1/2025</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 font-semibold">
                        VALID UNTIL
                      </td>
                      <td className="border px-2 py-1">2/15/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                CUSTOMER INFO
              </h3>
              <div className="p-2">
                <p>[Customer Name]</p>
                <p>[Customer Address]</p>
                <p>[Customer Email]</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                DESCRIPTION OF WORK
              </h3>
              <div className="p-2 h-20 border-t">
                Provide project details here...
              </div>
            </div>

            {/* Itemized Costs */}
            <div>
              <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                ITEMIZED COSTS
              </h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-left">ITEM</th>
                    <th className="border px-2 py-1">QTY</th>
                    <th className="border px-2 py-1">UNIT PRICE</th>
                    <th className="border px-2 py-1">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-2 py-1">Service Fee</td>
                    <td className="border px-2 py-1 text-center">1</td>
                    <td className="border px-2 py-1 text-right">200.00</td>
                    <td className="border px-2 py-1 text-right">200.00</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Labor: 5 hrs @ $75/hr</td>
                    <td className="border px-2 py-1 text-center">5</td>
                    <td className="border px-2 py-1 text-right">75.00</td>
                    <td className="border px-2 py-1 text-right">375.00</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">Parts (tax included)</td>
                    <td className="border px-2 py-1 text-center">7</td>
                    <td className="border px-2 py-1 text-right">12.35</td>
                    <td className="border px-2 py-1 text-right">86.45</td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1">New client discount</td>
                    <td className="border px-2 py-1 text-center">-</td>
                    <td className="border px-2 py-1 text-right">-50.00</td>
                    <td className="border px-2 py-1 text-right">-50.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Total */}

              <div className="border flex justify-between border-b px-2 py-1">
                <span>SUBTOTAL</span>
                <span>$611.45</span>
              </div>
              <div className="border flex justify-between border-b px-2 py-1 font-semibold bg-gray-100">
                <span>TOTAL QUOTE</span>
                <span>$611.45</span>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              This quotation is an estimate. Payment is due prior to delivery of
              services.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

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
    <div className="w-full min-h-[70vh] relative">
      <h1 className="text-2xl font-bold mb-4">Pricing Page</h1>
      <p className="text-md">
        Manage your on-going deals and pricing strategies here.
      </p>

      <div className="w-full mt-6 relative z-[50] rounded-2xl p-6 flex flex-col md:flex-row gap-4 justify-between backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
        <div className="relative  flex-grow md:max-w-md">
          <Input
            placeholder="Search deals by name or title..."
            value={searchTerm ? searchTerm : ""}
            type="text"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
          />
          {showSuggestions && (
            <div className="absolute top-[110%] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg flex flex-col items-start w-full">
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

        <div className="flex gap-4">
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
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedProduct(null);
            }}
            variant="outline"
            className={`bg-white/20 dark:bg-slate-800/50 border-gray text-black font-normal ${
              searchTerm !== "" ||
              (selectedProduct !== null && selectedProduct !== "all")
                ? "opacity-100"
                : "hidden"
            }`}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="mt-6 -z-[30]">
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
                className="mb-6 z-0 overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border-slate-200/50 dark:border-white/20"
              >
                <CardHeader>
                  <CardTitle className={"flex justify-between items-center"}>
                    <CardDescription className={"flex flex-col"}>
                      <span className="text-black dark:text-white text-2xl">
                        {deal.name}
                      </span>
                      <span className="font-semibold">
                        {deal.title || "No Title"} - Status: {deal.status}
                      </span>
                    </CardDescription>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() => handleGenerateQuote(deal.id)}
                      >
                        Generate Quote
                      </Button>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            disabled={
                              deal.finalPrice > 0 &&
                              deal.finalPrice !== null &&
                              deal.finalPrice !== undefined
                            }
                            className={`bg-transparent hover:bg-gray-500 cursor-pointer text-gray-700 hover:text-white border border-gray-700 hover:border-transparent dark:border-gray-200 dark:text-gray-100`}
                          >
                            Configure Product
                          </Button>
                        </SheetTrigger>
                        <QuotePreview />
                        <SheetContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6 md:min-w-[85vw] min-w-screen">
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
                              const price = {};

                              for (const product1 of deal.products) {
                                const product_check = products.find(
                                  (p) => p.name === product1
                                );
                                price[product1] = product_check?.price ?? 0;
                              }
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
                          <SheetFooter className="w-full justify-center items-center">
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
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!deal.products || deal.products.length === 0 ? (
                    <p>This deal has no products assigned.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Original Price</TableHead>
                          <TableHead>Discount (%)</TableHead>
                          <TableHead>ML Suggestion</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Final Price</TableHead>
                          <TableHead>Actions</TableHead>
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
                            parseFloat(discountStr.replace("%", "")) || 0;
                          const finalPrice =
                            originalPrice * quantity * (1 - userDiscount / 100);

                          return (
                            <TableRow key={`${deal.id}-${index}`}>
                              <TableCell className="font-medium">
                                {productName}
                              </TableCell>
                              <TableCell>
                                {productDetails
                                  ? `${
                                      productDetails.currency || "$"
                                    }${calculateOriginalPrice(
                                      productName,
                                      deal.id,
                                      dealConfig
                                    ).toFixed(2)}`
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Input
                                  disabled={
                                    deal.finalPrice > 0 &&
                                    deal.finalPrice !== null &&
                                    deal.finalPrice !== undefined
                                  }
                                  value={deal.user_discount?.[index] || "0"}
                                  onChange={(e) =>
                                    handleChange(
                                      deal.id,
                                      "user_discount",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  disabled={
                                    deal.finalPrice > 0 &&
                                    deal.finalPrice !== null &&
                                    deal.finalPrice !== undefined
                                  }
                                  value={deal.discount?.[index] || "0%"}
                                  readOnly
                                  className="w-24 bg-slate-100 dark:bg-slate-700"
                                />
                              </TableCell>
                              <TableCell>
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
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                {productDetails
                                  ? `${
                                      productDetails.currency || "$"
                                    }${finalPrice.toFixed(2)}`
                                  : "N/A"}
                              </TableCell>
                              <TableCell className={`flex gap-2`}>
                                <div className="w-full relative">
                                  <Button
                                    onClick={() => {
                                      handleGeneratePrice(deal.id, index);
                                    }}
                                    className={
                                      "bg-transparent hover:bg-blue-500/10 text-blue-700 hover:text-white border border-blue-700 hover:border-transparent"
                                    }
                                    disabled={
                                      deal.finalPrice > 0 &&
                                      deal.finalPrice !== null &&
                                      deal.finalPrice !== undefined
                                    }
                                  >
                                    Suggest Price
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        ref={(element) => {
                                          triggerRef.current[deal.id] = element;
                                        }}
                                        className="hidden"
                                      >
                                        Hidden trigger
                                      </Button>
                                    </DialogTrigger>

                                    <DialogContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6 md:min-w-[50vw] min-w-screen">
                                      <DialogTitle>
                                        Missing Deal Intent Score for{" "}
                                        {deal.name}
                                      </DialogTitle>
                                      <DialogDescription className={`flex`}>
                                        <Label>
                                          Enter the Intent score of the deal to
                                          generate the Discount Suggestion:
                                        </Label>
                                        <Input
                                          value={intentScore || ""}
                                          placeholder="Enter a value between 1- 100"
                                          onChange={(e) =>
                                            setIntentScore(e.target.value)
                                          }
                                        />
                                      </DialogDescription>
                                      <DialogFooter>
                                        <Button
                                          onClick={() => {
                                            handleIntentChange(
                                              deal.id,
                                              intentScore,
                                              index
                                            );
                                          }}
                                          variant="outline"
                                        >
                                          Generate Price
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
                </CardContent>
                <CardFooter className="flex flex-col items-end gap-4 bg-slate-50 dark:bg-slate-900/50 p-4">
                  <div className="text-lg font-bold">
                    Grand Total: {products[0]?.currency || "$"}
                    {grandTotal.toFixed(2)}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      disabled={
                        deal.finalPrice > 0 &&
                        deal.finalPrice !== null &&
                        deal.finalPrice !== undefined
                      }
                      onClick={() => handleSave(deal.id)}
                    >
                      Save Changes
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          disabled={
                            deal.finalPrice > 0 &&
                            deal.finalPrice !== null &&
                            deal.finalPrice !== undefined
                          }
                          className="bg-transparent cursor-pointer hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-700 hover:border-transparent"
                        >
                          Approve & Set Final Price
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6 md:min-w-[50vw] min-w-screen">
                        <div className="p-4">
                          <h2 className="text-lg font-bold mb-4">
                            Confirm Approval
                          </h2>
                          <p>
                            Are you sure you want to approve this deal? After
                            you confirm the details of the deal cannot be
                            changed anymore.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => handleApprove(deal.id)}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            Confirm
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">
              No active deals match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
