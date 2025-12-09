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
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// A compact skeleton for loading state
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

// Helper to deep-clone
const clone = (v) => JSON.parse(JSON.stringify(v));

export default function PricingDetailsPage() {
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
  const [pricingEditorState, setPricingEditorState] = useState(null); // { dealId, productIndex, data }

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
    } else {
      setDealsToShow(result);
      setDealConfig(result.map((deal) => deal.configuration || []));
    }
  }, [searchTerm, showSuggestions, dealsData, selectedProduct]);

  // --- Pricing logic -------------------------------------------------
  // pricingDetails is a JSON object stored on the deal for overrides & advanced pricing
  // Structure (per product index):
  // {
  //   contract_price: number | null,
  //   flat_fee: number,
  //   tiers: [{min, max, price}],
  //   volume: [{min, max, price}],
  //   features: [{name, price}],
  //   subscription: {cycle: 'monthly'|'yearly', price: number},
  //   setup_fee: number,
  //   cost: number,
  //   markup_pct: number,
  //   bundle_discount_pct: number
  // }

  const getPricingDetailsFor = (deal, index) => {
    try {
      const pd = deal.pricing_details ? JSON.parse(deal.pricing_details) : {};
      return pd[index] || {};
    } catch (e) {
      return {};
    }
  };

  const calculateOriginalPrice = (
    productName,
    deal,
    dealIndex,
    productIndex
  ) => {
    // base product price from catalog
    const product = products.find((p) => p.name === productName);
    let base = parseFloat(product?.price || 0);

    // add configuration prices if present in deal
    const config = (deal.configuration || [])[productIndex] || {};
    if (config) {
      for (const category in config) {
        base += parseFloat(config[category]?.price || 0);
      }
    }

    // advanced pricing details
    const pricing = getPricingDetailsFor(deal, productIndex);

    // Contract override (highest priority)
    if (pricing && pricing.contract_price)
      return parseFloat(pricing.contract_price);

    // Apply tiered/volume feature prices if present
    // We'll not change base here — these are used in final calc
    return base;
  };

  function priceFromTiers(qty, tiers) {
    if (!tiers || tiers.length === 0) return null;
    // assume tiers are sorted asc by min
    for (const t of tiers) {
      const min = Number(t.min || 0);
      const max =
        t.max === null || t.max === undefined ? Infinity : Number(t.max);
      if (qty >= min && qty <= max) return Number(t.price);
    }
    return null;
  }

  const calculateLinePrice = (deal, productName, productIndex) => {
    const productDetails = products.find((p) => p.name === productName) || {};
    const pricing = getPricingDetailsFor(deal, productIndex);
    const originalBase = calculateOriginalPrice(
      productName,
      deal,
      null,
      productIndex
    );
    const qty = parseInt(deal.quantity?.[productIndex] || 1, 10);

    // 1) Contract override
    if (pricing && pricing.contract_price) {
      const unit = Number(pricing.contract_price);
      const line = unit * qty + Number(pricing.setup_fee || 0);
      return { unitPrice: unit, subtotal: line };
    }

    // 2) Tiered pricing
    if (pricing && pricing.tiers && pricing.tiers.length) {
      const tierPrice = priceFromTiers(qty, pricing.tiers);
      if (tierPrice !== null) {
        const unit = tierPrice;
        const subtotal = unit * qty + Number(pricing.setup_fee || 0);
        return { unitPrice: unit, subtotal };
      }
    }

    // 3) Volume pricing (same as tiers here)
    if (pricing && pricing.volume && pricing.volume.length) {
      const volPrice = priceFromTiers(qty, pricing.volume);
      if (volPrice !== null) {
        const unit = volPrice;
        const subtotal = unit * qty + Number(pricing.setup_fee || 0);
        return { unitPrice: unit, subtotal };
      }
    }

    // 4) Cost + markup
    if (pricing && pricing.cost && pricing.markup_pct !== undefined) {
      const unit =
        Number(pricing.cost) * (1 + Number(pricing.markup_pct) / 100);
      const subtotal = unit * qty + Number(pricing.setup_fee || 0);
      return { unitPrice: unit, subtotal };
    }

    // 5) Feature/configuration based add-ons
    let unit = originalBase;
    if (pricing && pricing.features && pricing.features.length) {
      for (const f of pricing.features) {
        unit += Number(f.price || 0);
      }
    }

    // 6) Flat fee (override per product but applies once)
    const flat = Number(pricing?.flat_fee || 0);
    const subtotal = unit * qty + flat + Number(pricing.setup_fee || 0);

    return { unitPrice: unit, subtotal };
  };

  const calculateGrandTotal = (deal) => {
    if (!deal.products || deal.products.length === 0) return 0;

    let total = 0;
    for (let index = 0; index < deal.products.length; index++) {
      const productName = deal.products[index];
      const productDetails = products.find((p) => p.name === productName);
      if (!productDetails) continue;

      const originalPrice = calculateOriginalPrice(
        productName,
        deal,
        null,
        index
      );

      const qty = parseInt(deal.quantity?.[index] || 1, 10);
      const pricing = getPricingDetailsFor(deal, index);

      // base computation (unitPrice & subtotal may be overriden by advanced pricing)
      const { unitPrice, subtotal } = calculateLinePrice(
        deal,
        productName,
        index
      );

      // discount (user_discount is percentage applied on the product subtotal)
      const discountStr = String(deal.user_discount?.[index] || "0");
      const discountValue = parseFloat(discountStr.replace("%", ""));
      const discount = isNaN(discountValue) ? 0 : discountValue;

      let lineTotal = subtotal * (1 - discount / 100);

      // bundle discount as percent
      if (pricing && pricing.bundle_discount_pct) {
        lineTotal = lineTotal * (1 - Number(pricing.bundle_discount_pct) / 100);
      }

      // subscription handling: if subscription price exists, we add subscription price (choose monthly or yearly conversion handled in UI)
      if (pricing && pricing.subscription && pricing.subscription.price) {
        // We'll add subscription.price * (12 if yearly not requested) depending on cycle
        const cycle = pricing.subscription.cycle || "monthly";
        const subPrice = Number(pricing.subscription.price || 0);
        if (cycle === "monthly") {
          // assume subscription charge is monthly recurring — add one period to quote
          lineTotal += subPrice;
        } else {
          // yearly -> add annual amount
          lineTotal += subPrice;
        }
      }

      total += lineTotal;
    }

    return total;
  };

  // ---- Handlers -----------------------------------------------------
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
    const { quantity, discount, user_discount, pricing_details } = dealToSave;

    // ensure pricing_details is JSON string
    const payload = {
      quantity,
      discount,
      user_discount,
      pricing_details:
        typeof pricing_details === "string"
          ? pricing_details
          : JSON.stringify(pricing_details || []),
    };

    const { error } = await supabase
      .from("Deals")
      .update(payload)
      .eq("id", dealId);
    if (error) toast.error("Failed to save deal.");
    else toast.success(`Deal "${dealToSave.name}" saved successfully!`);

    fetchData(userEmail);
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

    fetchData(userEmail);
  };

  // this triggers the ML suggestion endpoint (left intact but non-blocking)
  const handleGeneratePrice = async (dealId, productIndex) => {
    const deal = dealsToShow.find((d) => d.id === dealId);
    const intentScore = deal.intent_score;
    if (!intentScore) {
      setIntentScore("");
      triggerRef.current[dealId]?.click?.();
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

      // Save suggestion to the deal's discount array for the product index
      const deal = dealsToShow.find((d) => d.id === dealId);
      if (!deal) return;
      const updated = clone(dealsToShow);
      const idx = updated.findIndex((d) => d.id === dealId);
      updated[idx].discount = updated[idx].discount || [];
      while (updated[idx].discount.length <= productIndex)
        updated[idx].discount.push("0%");
      updated[idx].discount[productIndex] = `${suggestedDiscount}%`;

      // push to DB suggestion
      await supabase
        .from("Deals")
        .update({ discount: updated[idx].discount })
        .eq("id", dealId);
      toast.success("Suggested discount saved to deal.");
      fetchData(userEmail);
    } catch (error) {
      toast.error("Failed to fetch or save suggested price.");
    }
  };

  // Pricing editor modal open
  const openPricingEditor = (deal, productIndex) => {
    const current = getPricingDetailsFor(deal, productIndex);
    setPricingEditorState({
      dealId: deal.id,
      productIndex,
      data: clone(current),
      deal,
    });
  };

  const closePricingEditor = () => setPricingEditorState(null);

  const savePricingEditor = async () => {
    if (!pricingEditorState) return;
    const { dealId, productIndex, data } = pricingEditorState;

    // Update local dealsToShow
    const updated = clone(dealsToShow);
    const dealIdx = updated.findIndex((d) => d.id === dealId);
    if (dealIdx === -1) return;
    // ensure pricing_details array exists
    const pd = updated[dealIdx].pricing_details
      ? JSON.parse(updated[dealIdx].pricing_details)
      : [];
    pd[productIndex] = data;
    updated[dealIdx].pricing_details = JSON.stringify(pd);
    setDealsToShow(updated);

    // persist to DB
    const { error } = await supabase
      .from("Deals")
      .update({ pricing_details: JSON.stringify(pd) })
      .eq("id", dealId);
    if (error) {
      toast.error("Failed to save pricing details.");
    } else {
      toast.success("Pricing details saved.");
      fetchData(userEmail);
    }
    closePricingEditor();
  };

  // helpers for editor
  const setEditorField = (key, value) => {
    setPricingEditorState((s) => ({ ...s, data: { ...s.data, [key]: value } }));
  };

  const setEditorNested = (key, index, value) => {
    setPricingEditorState((s) => {
      const copy = clone(s.data || {});
      copy[key] = copy[key] || [];
      copy[key][index] = value;
      return { ...s, data: copy };
    });
  };

  // ------------------------------------------------------------------
  return (
    <div className="w-full min-h-[70vh] relative p-4">
      <h1 className="text-3xl font-bold mb-2">Pricing Details</h1>
      <p className="text-slate-500 mb-8">
        Manage pricing, discounts, and quantities for your deals.
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        View Pricing Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogTitle>Pricing Details - {deal.name}</DialogTitle>
                      <DialogDescription>
                        Adjust quantities, costs, and discounts below.
                      </DialogDescription>

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
                              <TableHead className="text-center">
                                Labour Cost
                              </TableHead>
                              <TableHead className="text-center">
                                Material Cost
                              </TableHead>
                              <TableHead className="text-center">
                                Tax (%)
                              </TableHead>
                              <TableHead className="text-right">
                                Final Price
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

                              const quantity = parseInt(
                                deal.quantity?.[index] || 1,
                                10
                              );
                              const discount =
                                parseFloat(
                                  (deal.user_discount?.[index] || "0").replace(
                                    "%",
                                    ""
                                  )
                                ) || 0;
                              const labourCost = parseFloat(
                                deal.labour_cost?.[index] || 0
                              );
                              const materialCost = parseFloat(
                                deal.material_cost?.[index] || 0
                              );
                              const taxRate = parseFloat(
                                deal.tax_rate?.[index] || 0
                              );

                              const finalPrice =
                                (originalPrice *
                                  quantity *
                                  (1 - discount / 100) +
                                  labourCost +
                                  materialCost) *
                                (1 + taxRate / 100);

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
                                    <Input
                                      type="number"
                                      title="Discount (%)"
                                      value={deal.user_discount?.[index] || 0}
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
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Input
                                      type="number"
                                      min="1"
                                      title="Quantity"
                                      value={quantity}
                                      onChange={(e) =>
                                        handleChange(
                                          deal.id,
                                          "quantity",
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="w-20 text-center"
                                    />
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Input
                                      type="number"
                                      min="0"
                                      title="Labour Cost"
                                      value={labourCost}
                                      onChange={(e) =>
                                        handleChange(
                                          deal.id,
                                          "labour_cost",
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="w-24 text-center"
                                    />
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Input
                                      type="number"
                                      min="0"
                                      title="Material Cost"
                                      value={materialCost}
                                      onChange={(e) =>
                                        handleChange(
                                          deal.id,
                                          "material_cost",
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="w-24 text-center"
                                    />
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      title="Tax (%)"
                                      value={taxRate}
                                      onChange={(e) =>
                                        handleChange(
                                          deal.id,
                                          "tax_rate",
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="w-20 text-center"
                                    />
                                  </TableCell>

                                  <TableCell className="text-right font-bold">
                                    {productDetails
                                      ? `${
                                          productDetails.currency || "$"
                                        }${finalPrice.toFixed(2)}`
                                      : "N/A"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}

                      <DialogFooter>
                        <Button onClick={() => handleSave(deal.id)}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

      {/* Pricing Editor Modal */}
      <Dialog
        open={!!pricingEditorState}
        onOpenChange={(open) => {
          if (!open) closePricingEditor();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogTitle>Pricing Editor</DialogTitle>
          <DialogDescription>
            Configure advanced pricing rules for the selected product.
          </DialogDescription>

          {pricingEditorState ? (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contract Price (overrides all)
                </label>
                <Input
                  value={pricingEditorState.data.contract_price || ""}
                  onChange={(e) =>
                    setEditorField(
                      "contract_price",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="e.g. 1200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Flat Fee (one-time)
                </label>
                <Input
                  value={pricingEditorState.data.flat_fee || ""}
                  onChange={(e) =>
                    setEditorField(
                      "flat_fee",
                      e.target.value ? Number(e.target.value) : 0
                    )
                  }
                  placeholder="e.g. 200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Setup Fee (one-time)
                </label>
                <Input
                  value={pricingEditorState.data.setup_fee || ""}
                  onChange={(e) =>
                    setEditorField(
                      "setup_fee",
                      e.target.value ? Number(e.target.value) : 0
                    )
                  }
                  placeholder="e.g. 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiered Pricing
                </label>
                {(pricingEditorState.data.tiers || []).map((t, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <Input
                      value={t.min}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.tiers[i].min = Number(e.target.value);
                        setPricingEditorState((s) => ({
                          ...s,
                          data: copy.data || copy,
                        }));
                      }}
                      placeholder="min"
                      className="w-24"
                    />
                    <Input
                      value={t.max}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.tiers[i].max =
                          e.target.value === "" ? null : Number(e.target.value);
                        setPricingEditorState((s) => ({
                          ...s,
                          data: copy.data || copy,
                        }));
                      }}
                      placeholder="max (empty=+inf)"
                      className="w-28"
                    />
                    <Input
                      value={t.price}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.tiers[i].price = Number(e.target.value);
                        setPricingEditorState((s) => ({
                          ...s,
                          data: copy.data || copy,
                        }));
                      }}
                      placeholder="price"
                      className="w-28"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const copy = clone(pricingEditorState.data);
                        copy.tiers.splice(i, 1);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  onClick={() => {
                    const copy = clone(pricingEditorState.data || {});
                    copy.tiers = copy.tiers || [];
                    copy.tiers.push({ min: 1, max: null, price: 0 });
                    setPricingEditorState((s) => ({ ...s, data: copy }));
                  }}
                >
                  Add Tier
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Volume Pricing (alternative to tiers)
                </label>
                {(pricingEditorState.data.volume || []).map((t, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <Input
                      value={t.min}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.volume[i].min = Number(e.target.value);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                      placeholder="min"
                      className="w-24"
                    />
                    <Input
                      value={t.max}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.volume[i].max =
                          e.target.value === "" ? null : Number(e.target.value);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                      placeholder="max"
                      className="w-28"
                    />
                    <Input
                      value={t.price}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.volume[i].price = Number(e.target.value);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                      placeholder="price"
                      className="w-28"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const copy = clone(pricingEditorState.data);
                        copy.volume.splice(i, 1);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  onClick={() => {
                    const copy = clone(pricingEditorState.data || {});
                    copy.volume = copy.volume || [];
                    copy.volume.push({ min: 1, max: null, price: 0 });
                    setPricingEditorState((s) => ({ ...s, data: copy }));
                  }}
                >
                  Add Volume Rule
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Features / Add-ons
                </label>
                {(pricingEditorState.data.features || []).map((f, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <Input
                      value={f.name}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.features[i].name = e.target.value;
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                      placeholder="Feature name"
                      className="flex-1"
                    />
                    <Input
                      value={f.price}
                      onChange={(e) => {
                        const copy = clone(pricingEditorState.data);
                        copy.features[i].price = Number(e.target.value);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                      placeholder="price"
                      className="w-28"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const copy = clone(pricingEditorState.data);
                        copy.features.splice(i, 1);
                        setPricingEditorState((s) => ({ ...s, data: copy }));
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  onClick={() => {
                    const copy = clone(pricingEditorState.data || {});
                    copy.features = copy.features || [];
                    copy.features.push({ name: "", price: 0 });
                    setPricingEditorState((s) => ({ ...s, data: copy }));
                  }}
                >
                  Add Feature
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subscription (optional)
                </label>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(v) =>
                      setEditorField("subscription", {
                        ...(pricingEditorState.data.subscription || {}),
                        cycle: v,
                      })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue
                        placeholder={
                          pricingEditorState.data.subscription?.cycle || "Cycle"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={pricingEditorState.data.subscription?.price || ""}
                    onChange={(e) =>
                      setEditorField("subscription", {
                        ...(pricingEditorState.data.subscription || {}),
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="Price"
                    className="w-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cost + Markup
                </label>
                <div className="flex gap-2">
                  <Input
                    value={pricingEditorState.data.cost || ""}
                    onChange={(e) =>
                      setEditorField("cost", Number(e.target.value || 0))
                    }
                    placeholder="Base cost"
                    className="w-32"
                  />
                  <Input
                    value={pricingEditorState.data.markup_pct || ""}
                    onChange={(e) =>
                      setEditorField("markup_pct", Number(e.target.value || 0))
                    }
                    placeholder="Markup %"
                    className="w-32"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bundle Discount (%)
                </label>
                <Input
                  value={pricingEditorState.data.bundle_discount_pct || ""}
                  onChange={(e) =>
                    setEditorField(
                      "bundle_discount_pct",
                      Number(e.target.value || 0)
                    )
                  }
                  placeholder="e.g. 10"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closePricingEditor}>
                  Cancel
                </Button>
                <Button onClick={savePricingEditor}>Save Pricing</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
