"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Upload, Plus, Trash2, Package, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastContainer, toast } from "react-toastify";
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
import { fetchData } from "next-auth/client/_utils";
import { set } from "lodash";
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  );
};
export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
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

  useEffect(() => {
    if (!userEmail) return;

    const cachedData = localStorage.getItem("companyDataCache");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setCompanyData(parsed);
        setProducts(Array.isArray(parsed.products) ? parsed.products : []);
        console.log("Loaded from cache:", parsed);
      } catch (error) {
        console.error("Failed to parse cached data:", error);
        localStorage.removeItem("companyDataCache");
      }
      return;
    }

    fetchData();
  }, [userEmail]);

  // ✅ Log whenever state changes (no stale logs!)
  useEffect(() => {
    if (companyData && Object.keys(companyData).length > 0) {
      console.log("Company data updated:", companyData);
    }
  }, [companyData]);

  const handleCompanyChange = (field, value) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
    setCompanyData((prev) => ({ ...prev, products: updatedProducts }));
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

  const addProduct = () => {
    if (!validateNewProduct()) return;

    const productToAdd = { ...newProduct, id: Date.now().toString() };
    setProducts([...products, productToAdd]);
    setNewProduct({ name: "", category: "", price: "", description: "" });
    setErrors({ newProduct: {} });
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSaveChanges = () => {
    setLoading(true);
    localStorage.setItem(
      "companyDataCache",
      JSON.stringify({ ...companyData, products })
    );
    toast.info(
      "Changes saved locally. Don't clear browser history or the changes will be lost!",
      {
        position: "top-right",
      }
    );
    setLoading(false);
  };

  const handleUpdateDB = async () => {
    setLoading(true);
    const dataToUpdate = {
      companyName: companyData.companyName,
      companyDescription: companyData.companyDescription,
      companyWebsite: companyData.companyWebsite,
      products: products,
    };
    const { data: companyDetails, error: companyDetailsError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", userEmail)
      .single();
    console.log(companyDetails);
    console.log("Company data:", companyData);
    const noChanges =
      companyDetails.companyName === companyData.companyName &&
      companyDetails.companyDescription === companyData.companyDescription &&
      companyDetails.companyWebsite === companyData.companyWebsite &&
      isEqual(companyDetails.products, companyData.products);

    if (noChanges) {
      toast.info("No changes detected.", { position: "top-right" });
      setLoading(false);
      return;
    } else {
      if (icpData) {
        const { error } = await supabase
          .from("ICP")
          .delete()
          .eq("user_email", userEmail);

        if (error) {
          console.error("Error deleting ICP data:", error);
        }
      }
      const res = await fetch("/api/ICP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          description: companyData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setResult(data.output);
      }

      const { error } = await supabase
        .from("Users")
        .update(dataToUpdate)
        .eq("email", userEmail);

      if (error) {
        console.error("Error updating database:", error);
        toast.error("Error updating database!", { position: "top-right" });
      } else {
        toast.success(
          "Data updated permanently. All changes made are permanent.",
          { position: "top-right" }
        );
        localStorage.removeItem("companyDataCache");
      }
      setLoading(false);
      await fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col sm:flex-row sm:justify-left sm:items-center">
        <Sheet>
          <div className="flex justify-between items-center w-screen">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Pricing and Inventory
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Manage pricing and inventory with comprehensive filtering
              </p>
            </div>
            <SheetTrigger as Child>
              <Label className="bg-gradient-to-r px-3 py-2 rounded-xl from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full ">
                Add New Product
              </Label>
            </SheetTrigger>
          </div>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Product</SheetTitle>
              <SheetDescription>
                <>
                  <div className="p-3 flex flex-col gap-4">
                    <div>
                      <Label className="mb-2 text-slate-700 dark:text-slate-300">
                        Product Name
                      </Label>
                      <Input
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`bg-white/70 dark:bg-slate-800/50 w-[50vh] ${
                          errors.newProduct.name
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        placeholder="Enter product name"
                      />
                      <ErrorMessage error={errors.newProduct.name} />
                    </div>
                    <div>
                      <Label className="mb-2 text-slate-700 dark:text-slate-300">
                        Category
                      </Label>
                      <Input
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className={`bg-white/70 dark:bg-slate-800/50 w-[50vh] ${
                          errors.newProduct.category
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        placeholder="e.g., Analytics, Automation"
                      />
                      <ErrorMessage error={errors.newProduct.category} />
                    </div>
                    <div>
                      <Label className="mb-2 text-slate-700 dark:text-slate-300">
                        Price (Optional)
                      </Label>
                      <Input
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="bg-white/70 dark:bg-slate-800/50 w-[50vh] border-slate-200 dark:border-slate-700"
                        placeholder="e.g., $99/month"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 text-slate-700 dark:text-slate-300">
                        Stock
                      </Label>
                      <Input
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            stock: e.target.value,
                          }))
                        }
                        className="bg-white/70 dark:bg-slate-800/50 w-[50vh] border-slate-200 dark:border-slate-700"
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="mb-2 text-slate-700 dark:text-slate-300">
                        Description
                      </Label>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className={`bg-white/70 dark:bg-slate-800/50 min-h-24 ${
                          errors.newProduct.description
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        placeholder="Brief description"
                      />
                      <ErrorMessage error={errors.newProduct.description} />
                    </div>
                    <Button
                      disabled={loading}
                      onClick={addProduct}
                      className={`${
                        loading
                          ? "bg-gray-400 hover:bg-gray-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      }  cursor-pointer text-white`}
                    >
                      {loading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Add Product
                    </Button>
                  </div>
                </>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-gray-50 min-h-screen p-8">
        <div className="bg-white shadow-lg rounded-2xl mt-10 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Available Products
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500">No products available</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                    <th className="border-b p-3 text-left">Name</th>
                    <th className="border-b p-3 text-center">Stock</th>
                    <th className="border-b p-3 text-center">Price</th>
                    <th className="border-b p-3 text-center">Category</th>
                    <th className="border-b p-3 text-center">Description</th>
                    <th className="border-b p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr
                      key={p.id || idx}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].name = e.target.value;
                            setProducts(updated);
                          }}
                          className="border rounded-lg p-1 w-full focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].stock = e.target.value;
                            setProducts(updated);
                          }}
                          className="border rounded-lg p-1 w-20 text-center focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="text"
                          value={
                            Array.isArray(p.price) ? p.price.join("-") : p.price
                          }
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].price = e.target.value.includes("-")
                              ? e.target.value.split("-").map(Number)
                              : Number(e.target.value);
                            setProducts(updated);
                          }}
                          className="border rounded-lg p-1 w-24 text-center focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="text"
                          value={p.category}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].category = e.target.value;
                            setProducts(updated);
                          }}
                          className="border rounded-lg p-1 w-full text-center focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="text"
                          value={p.description}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[idx].description = e.target.value;
                            setProducts(updated);
                          }}
                          className="border rounded-lg p-1 w-full text-center focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removeProduct(idx)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center mx-auto transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Global Save Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleSaveChanges} variant="secondary">
            <Save className="mr-2 w-4 h-4" /> Save Changes Locally
          </Button>
          <Button onClick={handleUpdateDB}>
            <Upload className="mr-2 w-4 h-4" /> Update Database
          </Button>
        </div>
      </div>
    </div>
  );
}
