"use client";
import { supabase } from "../../../../utils/supabase/client";
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
import {
  Table,
  TableBody,
  TableCaption,
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
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown } from "lucide-react";

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
  const [dealsData, setDealsData] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dealsToShow, setDealsToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configFormData, setConfigFormData] = useState({});
  const [open, setOpen] = useState([]);

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
    if (searchTerm.trim() === "") {
      setSearchSuggestions([]);
      return;
    }
    const suggestions = dealsData.filter(
      (deal) =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchSuggestions(suggestions);
  }, [searchTerm, dealsData]);

  useEffect(() => {
    let result = [...dealsData];
    if (selectedProduct) {
      result = result.filter((deal) =>
        deal.products?.includes(selectedProduct)
      );
    }
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

  const handleReset = (dealId) => {
    const originalDeal = dealsData.find((d) => d.id === dealId);
    if (originalDeal) {
      const updatedDeals = dealsToShow.map((d) =>
        d.id === dealId ? originalDeal : d
      );
      setDealsToShow(updatedDeals);
      toast.info("Changes have been reset.");
    }
  };

  const handleApprove = async (dealId) => {
    const dealToApprove = dealsToShow.find((d) => d.id === dealId);
    if (!dealToApprove) return;
    const grandTotal = calculateGrandTotal(dealToApprove);
    const { error } = await supabase
      .from("Deals")
      .update({ price: grandTotal.toFixed(2) })
      .eq("id", dealId);
    if (error) toast.error("Failed to approve deal.");
    else
      toast.success(
        `Deal approved with a final price of $${grandTotal.toFixed(2)}.`
      );
  };

  const handleGeneratePrice = (dealId) =>
    toast.info("Price generation feature coming soon!");
  const handleGenerateQuote = (dealId) =>
    toast.info("Quote generation feature coming soon!");

  const handleSaveConfiguration = (dealId, productName, optionValues) => {
    const deal = dealsToShow.find((d) => d.id === dealId);
    const product = products.find((p) => p.name === productName);
    const configSummary = optionValues;
    const config = deal.configurations || [];
    for (let i = 0; i < deal.products.length; i++) {
      if (deal.products[i] === productName) {
        config[i] = configSummary;
        break;
      } else {
        config.push(config[i] || null);
      }
    }
  };

  const calculateGrandTotal = (deal) => {
    if (!deal.products || deal.products.length === 0) return 0;
    return deal.products.reduce((total, productName, index) => {
      const productDetails = products.find((p) => p.name === productName);
      if (!productDetails) return total;
      const originalPrice = parseFloat(productDetails.price || 0);
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

      <div className="w-full mt-6 rounded-2xl p-6 flex flex-col md:flex-row gap-4 justify-between backdrop-blur-sm bg-white/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20">
        <div className="relative flex-grow md:max-w-md">
          <Input
            placeholder="Search deals by name or title..."
            value={searchTerm}
            type="text"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
          />
          {searchTerm.trim() !== "" && showSuggestions && (
            <div className="absolute z-100 top-[110%] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg flex flex-col items-start w-full">
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

      <div className="mt-6">
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
                            className={`bg-transparent hover:bg-gray-500 cursor-pointer text-gray-700 hover:text-white border border-gray-700 hover:border-transparent dark:border-gray-200 dark:text-gray-100`}
                          >
                            Configure Product
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6 md:min-w-[85vw] min-w-screen">
                          <SheetHeader>
                            <SheetTitle className="mb-4 text-lg font-bold">
                              Configure Products for {deal.name}
                            </SheetTitle>
                          </SheetHeader>
                          {!deal.products || deal.products.length === 0 ? (
                            <p>This deal has no products assigned.</p>
                          ) : (
                            deal.products.map((productName, index) => {
                              const product = products.find(
                                (p) => p.name === productName
                              );
                              const price = {};
                              for (const product1 in deal.products) {
                                const product_check = products.find(
                                  (p) => p.name === product1
                                );
                                price[product1] = product_check.price;
                              }

                              return (
                                <Card
                                  key={`${deal.id}-config-${index}`}
                                  onClick={() => {
                                    if (open.includes(productName)) {
                                      setOpen(
                                        open.filter((o) => o !== productName)
                                      );
                                    } else {
                                      setOpen([...open, productName]);
                                    }
                                  }}
                                  className={`${
                                    open.includes(productName)
                                      ? "max-h-full"
                                      : "h-14"
                                  } p-4 mx-4 flex flex-col justify-start cursor-pointer items-start gap-4 mb-6 bg-white/10 dark:bg-gray-200/10 border-0 backdrop-blur-sm transition-all duration-300 `}
                                >
                                  <CardTitle className="mb-2 flex justify-between w-full">
                                    <div className="flex items-center">
                                      <ChevronDown
                                        className={`inline mr-2 ${
                                          open.includes(productName)
                                            ? "rotate-180"
                                            : "rotate-0"
                                        } transition-transform cursor-pointer`}
                                      />
                                      {productName}
                                    </div>
                                    <span>
                                      {product
                                        ? `Base Price: ${
                                            price[productName] || "$"
                                          }${product.price || 0}
                                          ${product.billing_cycle || ""}`
                                        : "N/A"}
                                    </span>
                                  </CardTitle>
                                  <CardContent className="p-2 w-full">
                                    {product.isConfigurable === false ? (
                                      <p className="text-slate-500">
                                        This product is not configurable.
                                      </p>
                                    ) : !product.configuration ? (
                                      <p className="text-slate-500">
                                        No configuration options available for
                                        this product. To configure, please
                                        configure the product in the Configure
                                        Product Section. Or{" "}
                                        <Link
                                          href="/revenueengine/configureproducts"
                                          className="text-blue-500 underline"
                                        >
                                          click here
                                        </Link>
                                        .
                                      </p>
                                    ) : (
                                      <ConfigureProduct
                                        userEmail={userEmail}
                                        product={product}
                                        config={product.configuration}
                                      />
                                    )}
                                  </CardContent>
                                </Card>
                              );
                            })
                          )}
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
                          const originalPrice = productDetails?.price || 0;
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
                                    }${parseFloat(originalPrice).toFixed(2)}`
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                <Input
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
                                  value={deal.discount?.[index] || "0%"}
                                  readOnly
                                  className="w-24 bg-slate-100 dark:bg-slate-700"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={deal.quantity?.[index] || 1}
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
                                <Button
                                  onClick={() => handleGeneratePrice(deal.id)}
                                  className={
                                    "bg-transparent hover:bg-blue-500/10 text-blue-700 hover:text-white border border-blue-700 hover:border-transparent"
                                  }
                                >
                                  Suggest Price
                                </Button>
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
                      onClick={() => handleSave(deal.id)}
                    >
                      Save Changes
                    </Button>
                    {/* <Button
                      variant="destructive"
                      onClick={() => handleReset(deal.id)}
                    >
                      Reset
                    </Button> */}
                    <Button
                      onClick={() => handleApprove(deal.id)}
                      className="bg-transparent hover:bg-green-100 text-green-700 hover:text-white border border-green-700 hover:border-transparent"
                    >
                      Approve & Set Final Price
                    </Button>
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
