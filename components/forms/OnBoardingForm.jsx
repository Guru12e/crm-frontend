"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PhoneInput from "../PhoneInput";
import { CurrencyDropdown } from "../ui/CurrencyDropDown";

export default function OnBoardingForm({ session }) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: session.user.email || "",
    role: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    companySize: "",
    products: [],
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    currency: "",
    billingCycle: "one-time",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    newProduct: {
      name: "",
      description: "",
      category: "",
      price: "",
    },
  });

  const sections = [
    { id: 1, title: "Personal Details", fields: 6 },
    { id: 2, title: "Company Details", fields: 3 },
    { id: 3, title: "Product Details", fields: 0 },
  ];

  const progress = (currentSection / sections.length) * 100;

  const validateSection = (sectionId) => {
    let isValid = true;
    const newErrors = { ...errors };

    // if (sectionId === 1) {
    //   if (!formData.name.trim()) {
    //     newErrors.name = "Name is required";
    //     isValid = false;
    //   } else {
    //     newErrors.name = "";
    //   }

    //   if (!formData.email.trim()) {
    //     newErrors.email = "Email is required";
    //     isValid = false;
    //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //     newErrors.email = "Invalid email format";
    //     isValid = false;
    //   } else {
    //     newErrors.email = "";
    //   }

    //   if (!formData.role) {
    //     newErrors.role = "Role is required";
    //     isValid = false;
    //   } else {
    //     newErrors.role = "";
    //   }

    //   if (!formData.phone.trim()) {
    //     newErrors.phone = "Phone number is required";
    //     isValid = false;
    //   } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
    //     newErrors.phone = "Invalid phone number format";
    //     isValid = false;
    //   } else {
    //     newErrors.phone = "";
    //   }

    //   if (!formData.companyName.trim()) {
    //     newErrors.companyName = "Company name is required";
    //     isValid = false;
    //   } else {
    //     newErrors.companyName = "";
    //   }

    //   if (!formData.companyWebsite.trim()) {
    //     newErrors.companyWebsite = "Website is required";
    //     isValid = false;
    //   } else if (
    //     !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(formData.companyWebsite)
    //   ) {
    //     newErrors.companyWebsite = "Invalid URL format";
    //     isValid = false;
    //   } else {
    //     newErrors.companyWebsite = "";
    //   }
    // }

    // if (sectionId === 2) {
    //   if (!formData.companyDescription.trim()) {
    //     newErrors.companyDescription = "Company description is required";
    //     isValid = false;
    //   } else {
    //     newErrors.companyDescription = "";
    //   }

    //   if (!formData.industry) {
    //     newErrors.industry = "Industry is required";
    //     isValid = false;
    //   } else {
    //     newErrors.industry = "";
    //   }

    //   if (!formData.companySize) {
    //     newErrors.companySize = "Company size is required";
    //     isValid = false;
    //   } else {
    //     newErrors.companySize = "";
    //   }
    // }

    // if (sectionId === 3) {
    //   if (formData.products.length === 0) {
    //     newErrors.newProduct.name = "At least one product is required";
    //     isValid = false;
    //   } else {
    //     newErrors.newProduct.name = "";
    //   }

    //   if (
    //     newProduct.name ||
    //     newProduct.description ||
    //     newProduct.category ||
    //     newProduct.price
    //   ) {
    //     if (!newProduct.name.trim()) {
    //       newErrors.newProduct.name = "Product name is required";
    //       isValid = false;
    //     } else {
    //       newErrors.newProduct.name = "";
    //     }

    //     if (!newProduct.description.trim()) {
    //       newErrors.newProduct.description = "Description is required";
    //       isValid = false;
    //     } else {
    //       newErrors.newProduct.description = "";
    //     }

    //     if (!newProduct.category.trim()) {
    //       newErrors.newProduct.category = "Category is required";
    //       isValid = false;
    //     } else {
    //       newErrors.newProduct.category = "";
    //     }

    //     if (
    //       newProduct.price &&
    //       !/^\$?\d+(\.\d{2})?(\/month)?$/.test(newProduct.price)
    //     ) {
    //       newErrors.newProduct.price =
    //         "Invalid price format (e.g., $99, $99.00, or $99/month)";
    //       isValid = false;
    //     } else {
    //       newErrors.newProduct.price = "";
    //     }
    //   }
    // }

    setErrors(newErrors);
    return isValid;
  };

  const addProduct = () => {
    const productErrors = {
      name: !newProduct.name.trim() ? "Product name is required" : "",
      description: !newProduct.description.trim()
        ? "Description is required"
        : "",
      category: !newProduct.category.trim() ? "Category is required" : "",
      price:
        newProduct.price &&
        !/^\$?\d+(\.\d{2})?(\/month)?$/.test(newProduct.price)
          ? "Invalid price format (e.g., $99, $99.00, or $99/month)"
          : "",
    };

    setErrors((prev) => ({
      ...prev,
      newProduct: productErrors,
    }));

    if (Object.values(productErrors).every((error) => !error)) {
      const product = {
        id: Date.now(),
        ...newProduct,
      };
      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, product],
      }));
      setNewProduct({ name: "", description: "", price: "", category: "" });
      setErrors((prev) => ({
        ...prev,
        newProduct: { name: "", description: "", price: "", category: "" },
      }));
    }
  };

  const removeProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const handleNext = async () => {
    if (validateSection(currentSection)) {
      if (currentSection < sections.length) {
        setCurrentSection(currentSection + 1);
      } else {
        try {
          setLoading(true);
          const response = await fetch("/api/addUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.status === 200) {
            localStorage.setItem("user", JSON.stringify(formData));
            router.push("/home");
          } else {
            setLoading(false);
            toast.error("Failed to create your account. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
        } catch (error) {
          toast.error("An error occurred while creating your account.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const ErrorMessage = ({ error }) =>
    error && (
      <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-200 to-sky-200 dark:from-sky-900 dark:to-teal-800">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-sky-400/10 dark:from-teal-400/20 dark:to-sky-400/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-sky-400/10 to-teal-400/10 dark:from-sky-400/20 dark:to-teal-400/20 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-teal-400/10 dark:from-cyan-400/20 dark:to-teal-400/20 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100,100,100,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Complete Your Setup
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Let's get your GTM engine configured
            </p>
          </div>

          <div className="mb-8">
            <Progress
              value={progress}
              className="h-2 bg-slate-200 dark:bg-slate-700"
            />
            <div className="flex justify-between mt-4">
              {sections.map((section) => (
                <div key={section.id} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      currentSection >= section.id
                        ? "bg-gradient-to-r from-sky-700 to-teal-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {section.id}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {section.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white text-xl">
                {sections[currentSection - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentSection === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Your full name"
                    />
                    <ErrorMessage error={errors.name} />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="your@email.com"
                    />
                    <ErrorMessage error={errors.email} />
                  </div>
                  <div>
                    <Label
                      htmlFor="role"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Role in Company
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => updateFormData("role", value)}
                      className={errors.role ? "border-red-500" : ""}
                    >
                      <SelectTrigger
                        className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                          errors.role ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="CMO">CMO</SelectItem>
                        <SelectItem value="Sales Manager">
                          Sales Manager
                        </SelectItem>
                        <SelectItem value="Marketing Manager">
                          Marketing Manager
                        </SelectItem>
                        <SelectItem value="Sales Representative">
                          Sales Representative
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage error={errors.role} />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Contact Number
                    </Label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => updateFormData("phone", value)}
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Enter phone number"
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    <ErrorMessage error={errors.phone} />
                  </div>
                  <div>
                    <Label
                      htmlFor="companyName"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        updateFormData("companyName", e.target.value)
                      }
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                      placeholder="Your company name"
                    />
                    <ErrorMessage error={errors.companyName} />
                  </div>
                  <div>
                    <Label
                      htmlFor="companyWebsite"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Company Website
                    </Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={(e) =>
                        updateFormData("companyWebsite", e.target.value)
                      }
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                        errors.companyWebsite ? "border-red-500" : ""
                      }`}
                      placeholder="https://yourcompany.com"
                    />
                    <ErrorMessage error={errors.companyWebsite} />
                  </div>
                </div>
              )}

              {currentSection === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="companyDescription"
                      className="mb-2 text-slate-700 dark:text-slate-300"
                    >
                      Company Description
                    </Label>
                    <Textarea
                      id="companyDescription"
                      value={formData.companyDescription}
                      onChange={(e) =>
                        updateFormData("companyDescription", e.target.value)
                      }
                      className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 min-h-24 ${
                        errors.companyDescription ? "border-red-500" : ""
                      }`}
                      placeholder="Tell us about your company..."
                    />
                    <ErrorMessage error={errors.companyDescription} />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label
                        htmlFor="industry"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          updateFormData("industry", value)
                        }
                        className={errors.industry ? "border-red-500" : ""}
                      >
                        <SelectTrigger
                          className={`bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.industry ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <ErrorMessage error={errors.industry} />
                    </div>
                    <div>
                      <Label
                        htmlFor="companySize"
                        className="mb-2 text-slate-700 dark:text-slate-300"
                      >
                        Company Size
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) =>
                          updateFormData("companySize", value)
                        }
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">
                            51-200 employees
                          </SelectItem>
                          <SelectItem value="201-1000">
                            201-1000 employees
                          </SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentSection === 3 && (
                <div className="space-y-6">
                  {errors.newProduct.name && !newProduct.name && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mb-4">
                      <AlertCircle className="w-4 h-4" />
                      {errors.newProduct.name}
                    </div>
                  )}
                  <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/20">
                    <div className="flex items-center mb-4">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Add Product or Service
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
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
                          className={`bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.newProduct.name ? "border-red-500" : ""
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
                          className={`bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                            errors.newProduct.category ? "border-red-500" : ""
                          }`}
                          placeholder="e.g., Analytics, Automation"
                        />
                        <ErrorMessage error={errors.newProduct.category} />
                      </div>
                      <div>
                        <Label className="mb-2 text-slate-700 dark:text-slate-300">
                          Base Price
                        </Label>
                        <div className="flex gap-2 ">
                          <CurrencyDropdown
                            value={newProduct.currency}
                            onValueChange={(value) =>
                              setNewProduct((prev) => ({
                                ...prev,
                                currency: value,
                              }))
                            }
                          />
                          <Input
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            className={`bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white ${
                              errors.newProduct.price ? "border-red-500" : ""
                            }`}
                            placeholder="e.g., 99 or 99.99"
                          />
                          <Select className="mt-2">
                            <SelectTrigger className="bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white w-full">
                              <SelectValue
                                placeholder="Select billing cycle"
                                value={newProduct.billingCycle}
                                onValueChange={(value) =>
                                  setNewProduct((prev) => ({
                                    ...prev,
                                    billingCycle: value,
                                  }))
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="/month">/month</SelectItem>
                              <SelectItem value="/year">/year</SelectItem>
                              <SelectItem value="one-time">One-time</SelectItem>
                              <SelectItem value="/kg">/kg</SelectItem>
                              <SelectItem value="/g">/g</SelectItem>
                              <SelectItem value="/lb">/lb</SelectItem>
                              <SelectItem value="/unit">/unit</SelectItem>
                              <SelectItem value="/GB">/GB</SelectItem>
                              <SelectItem value="/TB">/TB</SelectItem>
                              <SelectItem value="/API call">
                                /API call
                              </SelectItem>
                              <SelectItem value="/request">/request</SelectItem>
                              <SelectItem value="/minute">/minute</SelectItem>
                              <SelectItem value="/second">/second</SelectItem>
                              <SelectItem value="/piece">/piece</SelectItem>
                              <SelectItem value="/session">/session</SelectItem>
                              <SelectItem value="/transaction">
                                /transaction
                              </SelectItem>
                              <SelectItem value="/item">/item</SelectItem>
                              <SelectItem value="/event">/event</SelectItem>
                              <SelectItem value="/call">/call</SelectItem>
                              <SelectItem value="/visit">/visit</SelectItem>
                              <SelectItem value="/lead">/lead</SelectItem>
                              <SelectItem value="/campaign">
                                /campaign
                              </SelectItem>
                              <SelectItem value="/meter">/meter</SelectItem>
                              <SelectItem value="/km">/km</SelectItem>
                              <SelectItem value="/hour">/hour</SelectItem>
                              <SelectItem value="/day">/day</SelectItem>
                              <SelectItem value="/week">/week</SelectItem>
                              <SelectItem value="/liter">/liter</SelectItem>
                              <SelectItem value="/user">/user</SelectItem>
                              <SelectItem value="/device">/device</SelectItem>
                              <SelectItem value="/project">/project</SelectItem>
                              <SelectItem value="/subscription">
                                /subscription
                              </SelectItem>
                              <SelectItem value="/team">/team</SelectItem>
                              <SelectItem value="/license">/license</SelectItem>
                              <SelectItem value="/seat">/seat</SelectItem>
                              <SelectItem value="/month/user">
                                /month/user
                              </SelectItem>
                              <SelectItem value="/year/user">
                                /year/user
                              </SelectItem>
                              <SelectItem value="/token">/token</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <ErrorMessage error={errors.newProduct.price} />
                      </div>
                      <div>
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
                          className={`bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white min-h-24 ${
                            errors.newProduct.description
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Brief description"
                        />
                        <ErrorMessage error={errors.newProduct.description} />
                      </div>
                    </div>
                    <Button
                      onClick={addProduct}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  {formData.products.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Your Products & Services
                      </h4>
                      {formData.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/30"
                        >
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h5 className="font-medium text-slate-900 dark:text-white">
                                {product.name}
                              </h5>
                              <div className="flex gap-2">
                                {product.category && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                    {product.category}
                                  </span>
                                )}
                                {product.price && (
                                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                    {product.currency} {product.price} {}
                                    {product.billingCycle}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {product.description}
                            </p>
                          </div>
                          <Button
                            onClick={() => removeProduct(product.id)}
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 w-full sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.products.length === 0 && (
                    <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">
                        No products added yet. Add your first product above to
                        get started.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentSection === 1}
                  className="bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white hover:bg-white/70 dark:hover:bg-slate-800/70"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className={`${
                    loading
                      ? "bg-purple-400 hover:bg-purple-500"
                      : "bg-gradient-to-r from-sky-700 to-teal-500 hover:from-sky-600 hover:to-teal-600"
                  }  cursor-pointer text-white`}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {currentSection === sections.length
                    ? "Complete Setup"
                    : "Save & Continue"}
                  {currentSection < sections.length && (
                    <ChevronRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
