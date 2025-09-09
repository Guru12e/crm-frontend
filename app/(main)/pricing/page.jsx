"use client";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Save,
  Upload,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  Wrench,
  FlagOff,
  Edit,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import isEqual from "lodash/isEqual";
import "react-toastify/dist/ReactToastify.css";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { add, set } from "lodash";
import ConfigureProduct from "@/components/ConfigureProduct";

export default function PricingPage() {
  const [discontinue, setDiscontinue] = useState(false);
  const [reinstate, setReinstate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [config, setConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);
  const today = new Date();
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    features: [
      {
        name: "",
        configurations: [""],
      },
    ],
  });
  const [errors, setErrors] = useState({ newProduct: {} });
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem("session");
      if (rawSession) {
        const session = JSON.parse(rawSession);
        setUserEmail(session?.user?.email || null);
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage:", error);
    }
  }, []);
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("products, email")
        .eq("email", userEmail)
        .single();

      if (error) throw error;

      setCompanyData(data);
      setProducts(
        typeof data.products === "string"
          ? JSON.parse(data.products || "[]")
          : data.products || []
      );

      console.log("Fetched company data:", data);
    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
      stock: 0,
    };
    setProducts(updatedProducts);
    setCompanyData((prev) => ({ ...prev, products: updatedProducts }));
    const handleUpdate = async () => {
      const { error } = await supabase
        .from("Users")
        .update({ ...companyData, products: updatedProducts })
        .eq("email", userEmail);
      if (error) {
        toast.error("Failed to update products. Please try again.", {
          position: "top-right",
        });
        console.error("Error updating products:", error);
      } else {
        toast.success("Products updated successfully!", {
          position: "top-right",
        });
      }
    };
    handleUpdate();
  };

  const validateNewProduct = () => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = "Product name is required.";
    if (!newProduct.description.trim())
      newErrors.description = "Description is required.";
    if (!newProduct.category.trim())
      newErrors.category = "Category is required.";
    setErrors({ newProduct: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = async () => {
    if (!validateNewProduct()) return;

    const productToAdd = { ...newProduct, id: Date.now().toString() };
    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      category: "",
      basePrice: "",
      lowestBasePrice: "",
      HighestBasePrice: "",
      description: "",
      stock: "",
      isActive: true,
      isConfigurable: false,
      configurations: {},
    });
    setErrors({ newProduct: {} });
    const { error } = await supabase
      .from("Users")
      .update({ ...companyData, products: [...products, productToAdd] })
      .eq("email", userEmail)
      .select("*")
      .single();
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("Users")
      .update(companyData)
      .eq("email", userEmail);
    if (error) {
      toast.error("Failed to update products. Please try again.", {
        position: "top-right",
      });
      console.error("Error updating products:", error);
    } else {
      toast.success("Products updated successfully!", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row justify-between w-full gap-6 items-center ">
        <div>
          <h1 className="text-3xl font-bold text-start ">
            Configure Your Products.
          </h1>
          <p className="text-start text-slate-800 text-md">
            {" "}
            Make sure to have the right plan for your needs.
          </p>
        </div>
        <Button className="bg-gradient-to-r px-3 py-2 rounded-xl from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white w-full md:w-auto cursor-pointer">
          Add New Product
        </Button>
      </div>
      <div className="mt-10">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6"
          >
            <CardHeader className="flex justify-between items-center font-semibold">
              {product.name}
              <Badge
                className={product.isActive ? "bg-green-500" : "bg-red-500"}
              >
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 gap-4">
                <Label>
                  Stock:
                  {product.stock ? (
                    <span>{product.stock}</span>
                  ) : (
                    <span className="text-red-500">
                      Out of stock!!! Please update the stock.
                    </span>
                  )}
                </Label>
                <Label className="mt-2">Category: {product.category}</Label>
                <Label className="mt-2">Price: ${product.price}</Label>
              </div>
            </CardContent>
            <CardFooter>
              <div
                className={`flex justify-end flex-col md:flex-row w-full ${
                  product.isActive ? "flex" : "hidden"
                }`}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-transparent border-2 border-blue-500 hover:bg-blue-200 hover:border-blue-600 text-blue-500 cursor-pointer"
                      onClick={() => {
                        setEdit(true);
                        setEdit(false);
                      }}
                    >
                      {edit && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Edit />
                      Edit Basic Product Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-sm dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/20 mb-6">
                    <DialogTitle>Edit Product Information</DialogTitle>
                    <DialogDescription asChild>
                      <div className="flex flex-col gap-4 py-4">
                        <div className=" flex flex-col gap-3">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={product.name}
                            onChange={(e) =>
                              handleProductChange(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="description">
                            Product Description
                          </Label>
                          <Input
                            id="description"
                            value={product.description}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="stock">Product Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={product.stock}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="category">Product Category</Label>
                          <Input
                            id="category"
                            value={product.category}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </DialogDescription>

                    <DialogFooter>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => {
                          setEdit(false);
                        }}
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      className="bg-transparent border-2 border-gray-500 hover:bg-gray-200 hover:border-gray-600 text-gray-500 mt-2 md:mt-0 md:ml-2 cursor-pointer"
                      onClick={() => {
                        setConfig(true);
                        setConfig(false);
                      }}
                    >
                      {config && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Wrench />
                      Edit Product Configuration Info
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-[425px]">
                    <SheetHeader>
                      <SheetTitle>
                        Customise Your Product Configuration Settings Here
                      </SheetTitle>
                      <SheetDescription>
                        Configure the settings as per your product's design.
                      </SheetDescription>
                    </SheetHeader>
                    <ConfigureProduct />
                  </SheetContent>
                </Sheet>
                <Button
                  className="bg-transparent border-2 border-red-500 hover:bg-red-200 hover:border-red-600 text-red-500 mt-2 md:mt-0 md:ml-2 cursor-pointer"
                  onClick={() => {
                    setDiscontinue(true);
                    handleProductChange(index, "isActive", false);
                    setDiscontinue(false);
                  }}
                >
                  {discontinue && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <FlagOff />
                  Discontinue Product
                </Button>
              </div>
              <div
                className={`flex justify-end w-full ${
                  !product.isActive ? "flex" : "hidden"
                }`}
              >
                <Button
                  className="bg-transparent border-2 cursor-pointer border-green-500 hover:bg-green-200 hover:border-green-600 text-green-500"
                  onClick={() => {
                    setReinstate(true);
                    setNewProduct({
                      ...product,
                      isActive: true,
                      name: product.name + "-" + today.getFullYear(),
                    });
                    addProduct();
                    handleUpdate();
                    setReinstate(false);
                  }}
                >
                  {reinstate && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Package />
                  Reinstate Product
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
