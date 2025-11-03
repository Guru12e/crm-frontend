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
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

const SkeletonCard = () => (
  <div className="mb-6 border border-teal-200/30 rounded-2xl p-4 animate-pulse bg-white/40 backdrop-blur-md shadow-sm">
    <div className="h-6 bg-teal-100 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-teal-100 rounded w-1/2 mb-6"></div>
    <div className="space-y-2">
      <div className="h-8 bg-teal-100 rounded"></div>
      <div className="h-8 bg-teal-100 rounded"></div>
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

  // ─── All your logic kept identical ───────────────────────────────
  const fetchData = async (email) => {
    /* unchanged */
  };
  useEffect(() => {
    /* unchanged */
  }, []);
  useEffect(() => {
    /* unchanged */
  }, [userEmail]);
  useEffect(() => {
    /* unchanged */
  }, [searchTerm, dealsData]);
  useEffect(() => {
    /* unchanged */
  }, [searchTerm, showSuggestions, dealsData, selectedProduct]);
  const handleChange = (dealId, field, productIndex, value) => {
    /* unchanged */
  };
  const handleIntentChange = async (dealId, intentScore, index) => {
    /* unchanged */
  };
  const handleSave = async (dealId) => {
    /* unchanged */
  };
  const handleApprove = async (dealId) => {
    /* unchanged */
  };
  const calculateOriginalPrice = (productName, dealId, dealConfig) => {
    /* unchanged */
  };
  const handleGeneratePrice = async (dealId, productIndex) => {
    /* unchanged */
  };
  const handleGenerateQuote = (dealId) =>
    toast.info("Quote generation feature coming soon!");
  const handleSaveConfiguration = async (dealId, currentConfig) => {
    /* unchanged */
  };
  const calculateGrandTotal = (deal) => {
    /* unchanged */
  };
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9FDF9] via-[#C8F4EE] to-[#B2E8F7] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-start  bg-gradient-to-r from-[#25C2A0] via-[#266d61] to-[#235d76] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(70,200,248,0.25)]">
              Pricing Dashboard
            </h1>
            <p className="text-gray-600">
              Manage ongoing deals and optimize pricing strategies efficiently.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="w-full relative z-[50] rounded-2xl p-6 flex flex-col md:flex-row gap-4 justify-between backdrop-blur-md bg-white/70 border border-teal-100 shadow-sm">
          <div className="relative flex-grow md:max-w-md">
            <Input
              placeholder="Search deals by name or title..."
              value={searchTerm || ""}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className="rounded-xl border border-teal-200 focus:ring-2 focus:ring-[#25C2A0]"
            />
            {showSuggestions && (
              <div className="absolute top-[110%] p-2 bg-white border border-teal-100 rounded-md shadow-lg flex flex-col items-start w-full">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((deal) => (
                    <button
                      key={deal.id}
                      className="w-full text-left p-2 rounded-lg hover:bg-teal-50 transition"
                      onClick={() => {
                        setSearchTerm(deal.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {deal.name} -{" "}
                      <span className="text-gray-500">
                        {deal.title || "No Title"}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No deals found.</div>
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
              <SelectTrigger className="w-full md:w-[180px] border-teal-200 focus:ring-2 focus:ring-[#2AD4B7]">
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md">
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
              className={`border-teal-400 text-teal-700 hover:bg-teal-50 rounded-lg ${
                searchTerm || selectedProduct ? "opacity-100" : "hidden"
              }`}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Deals Section */}
        <div className="mt-8">
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
                  className="mb-6 rounded-2xl overflow-hidden backdrop-blur-md bg-white/75 border border-teal-100 shadow-sm hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {deal.name}
                        </h2>
                        <p className="text-gray-600">
                          {deal.title || "No Title"} –{" "}
                          <span className="font-semibold text-[#25C2A0]">
                            {deal.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          onClick={() =>
                            toast.info("Quote generation coming soon!")
                          }
                          className="border-[#25C2A0] text-[#25C2A0] hover:bg-[#25C2A0]/10"
                        >
                          Generate Quote
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-teal-50">
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
                              originalPrice *
                              quantity *
                              (1 - userDiscount / 100);

                            return (
                              <TableRow key={`${deal.id}-${index}`}>
                                <TableCell className="font-semibold text-gray-800">
                                  {productName}
                                </TableCell>
                                <TableCell className="text-gray-700">
                                  {productDetails
                                    ? `$${originalPrice.toFixed(2)}`
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Input
                                    disabled={deal.finalPrice}
                                    value={deal.user_discount?.[index] || "0"}
                                    onChange={(e) =>
                                      handleChange(
                                        deal.id,
                                        "user_discount",
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className="w-24 border-teal-200"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    disabled
                                    value={deal.discount?.[index] || "0%"}
                                    readOnly
                                    className="w-24 bg-teal-50"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={quantity}
                                    disabled={deal.finalPrice}
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
                                    className="w-20 border-teal-200"
                                  />
                                </TableCell>
                                <TableCell className="font-semibold text-gray-800">
                                  {productDetails
                                    ? `$${finalPrice.toFixed(2)}`
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      handleGeneratePrice(deal.id, index)
                                    }
                                    className="border border-[#25C2A0] text-[#25C2A0] hover:bg-[#25C2A0]/10"
                                  >
                                    Suggest Price
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#E9FDF9] to-[#C8F4EE] p-4 rounded-b-2xl">
                    <div className="text-lg font-bold text-gray-800">
                      Grand Total: ${grandTotal.toFixed(2)}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSave(deal.id)}
                        disabled={deal.finalPrice}
                        className="border-teal-400 text-teal-700 hover:bg-teal-50"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => handleApprove(deal.id)}
                        disabled={deal.finalPrice}
                        className="bg-[#25C2A0] text-white hover:bg-[#1e9b81]"
                      >
                        Approve & Finalize
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              No active deals match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
