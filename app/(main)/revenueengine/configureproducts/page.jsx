"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Package, Settings } from "lucide-react";

export default function ConfigureProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .order("name");
    if (error) return console.error(error);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("Products")
      .update(productData)
      .eq("id", editing.id);

    if (error) {
      toast.error("Error updating product");
    } else {
      toast.success("Product updated successfully!", {
        style: {
          background: "#25C2A0",
          color: "white",
        },
      });
      fetchProducts();
      setEditing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9FDF9] via-[#C8F4EE] to-[#B2E8F7] p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-start bg-gradient-to-r from-[#25C2A0] via-[#266d61] to-[#235d76] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(70,200,248,0.25)]">
              Configure Products
            </h1>
            <p className="text-gray-500">
              Manage and configure your products efficiently
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-[#25C2A0] text-[#25C2A0] font-semibold py-2 px-4 rounded-b-lg text-sm bg-white backdrop-blur-sm"
          >
            Total Products: {products.length}
          </Badge>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="shadow-lg border border-[#25C2A0]/20 bg-white/60 backdrop-blur-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="font-semibold text-[#1e7e68]">
                    {product.name}
                  </span>
                  <Package className="w-5 h-5 text-[#25C2A0]" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                <p className="text-gray-700">
                  <span className="font-medium">Price:</span> ₹{product.price}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Stock:</span> {product.stock}
                </p>

                {/* Edit Product Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-2 bg-gradient-to-r from-[#25C2A0] to-[#2AD4B7] text-black/70 font-medium hover:opacity-90 cursor-pointer"
                      onClick={() => {
                        setEditing(product);
                        setProductData({
                          name: product.name,
                          price: product.price,
                          category: product.category,
                          stock: product.stock,
                        });
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Product
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="p-6 space-y-6 max-w-md bg-white/95 backdrop-blur-md border border-[#25C2A0]/30 shadow-lg rounded-lg">
                    <SheetHeader className="-mx-6 -mt-6 bg-gradient-to-r from-[#A3E3DB] to-[#25C2A0] px-6 py-3 rounded-t-lg shadow-sm">
                      <SheetTitle className="text-white font-semibold">
                        Edit Product – {product.name}
                      </SheetTitle>
                    </SheetHeader>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Input
                          value={productData.name}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <Input
                          type="number"
                          value={productData.price}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <Input
                          value={productData.category}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              category: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Stock
                        </label>
                        <Input
                          type="number"
                          value={productData.stock}
                          onChange={(e) =>
                            setProductData({
                              ...productData,
                              stock: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleUpdate}
                      className="w-full bg-gradient-to-r from-[#25C2A0] to-[#2AD4B7] text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all"
                    >
                      Save Product
                    </Button>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
