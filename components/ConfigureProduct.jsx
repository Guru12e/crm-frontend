  "use client";
  import React, { useEffect, useState } from "react";
  import { Button } from "./ui/button";
  import { Label } from "./ui/label";
  import { Switch } from "./ui/switch";
  import { Input } from "./ui/input";
  import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
  import {
    ChevronDown,
    ClipboardListIcon,
    Cog,
    Edit,
    Trash2,
  } from "lucide-react";
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "./ui/table";
  import { supabase } from "@/utils/supabase/client";
  import { toast } from "react-toastify";

  export default function ConfigureProduct({ userEmail, product, config }) {
    const [configuration, setConfiguration] = useState({});
    const [newCategoryName, setNewCategoryName] = useState("");
    const [componentChange, setComponentChange] = useState({});
    const [newComponent, setNewComponent] = useState({
      name: "",
      description: "",
      additionalCost: "",
      isDefault: false,
    });
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
      if (config) {
        setConfiguration(config);
      }
    }, [config]);

    const handleAddCategory = () => {
      if (newCategoryName.trim() === "") return;
      setConfiguration((prevConfig) => ({
        ...prevConfig,
        [newCategoryName.trim()]: [],
      }));
      setNewCategoryName("");
    };

    const handleAddComponent = (category) => {
      console.log(category, newComponent);
      if (newComponent.name.trim() === "") return;
      setConfiguration((prevConfig) => ({
        ...prevConfig,
        [category]: [...(prevConfig[category] || []), newComponent],
      }));
      setNewComponent({
        name: "",
        description: "",
        additionalCost: "",
        isDefault: false,
      });
    };

    const removeCategory = (cat) => {
      const newConfig = { ...configuration };
      delete newConfig[cat];
      setConfiguration(newConfig);
    };
    const [open, setOpen] = useState([]);

    const handleSaveConfiguration = async (productId, config) => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", userEmail)
        .single();
      const { data: updatedData, error: updateError } = await supabase
        .from("Users")
        .update({
          ...data,
          products: data.products.map((p) =>
            p.id === productId ? { ...p, config } : p
          ),
        })
        .eq("email", userEmail);
      if (updateError) {
        console.error("Error updating configuration:", updateError);
        toast.error("Failed to save configuration. Please try again.");
      } else {
        toast.success("Configuration saved successfully!");
      }
    };

    return (
      <div className=" px-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-t border-gray-300 dark:border-gray-700 py-4 gap-2 w-full">
          <h1 className="text-2xl font-bold">Product Configuration Settings</h1>
          <Button
            className="bg-gradient-to-r from-sky-700 to-teal-500 dark:from-sky-500 to:teal-700 text-white cursor-pointer w-full md:w-auto  "
            onClick={() => {
              handleSaveConfiguration(product.id, configuration);
            }}
          >
            Save Changes
          </Button>
        </div>
        <Card className="bg-cyan-300/20 dark:bg-cyan-600/30 mb-6 border-0 backdrop-blur-sm ">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <ClipboardListIcon className="h-5 w-5 mr-2" />
              Add Component Category
            </CardTitle>
            <CardContent
              className={"flex flex-col lg:flex-row gap-4 lg:items-center mt-4"}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <Label htmlFor="categoryName" className="sr-only">
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  onClick={handleAddCategory}
                  className={
                    "border border-green-500 text-green-500 hover:bg-green-800/20 bg-transparent cursor-pointer"
                  }
                >
                  Add Category
                </Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
        {Object.keys(configuration).map((category) => (
          <Card
            key={category}
            className={`${
              open.includes(category) ? "max-h-full" : "h-14"
            } p-0 flex flex-col justify-start items-start gap-4 mb-6 bg-white/10 dark:bg-gray-200/10 border-0 backdrop-blur-sm transition-all duration-300 w-full`}
          >
            <CardHeader
              className="w-full pt-2 px-4 cursor-pointer"
              onClick={() =>
                setOpen(
                  open.includes(category)
                    ? open.filter((c) => c !== category)
                    : [...open, category]
                )
              }
            >
              <div className="flex items-center justify-between min-w-full gap-4 mt-2">
                <div className="flex items-center gap-2 ">
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      open.includes(category) ? "rotate-180" : "rotate-0"
                    } `}
                  />
                  {category}
                </div>

                <Button
                  className=" h-6 bg-transparent text-red-500 border border-red-500 hover:bg-red-800/20 "
                  onClick={() => removeCategory(category)}
                >
                  <Trash2 className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:flex">Delete Category</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2 w-full">
              <div onClick={(e) => e.stopPropagation()}>
                {open.includes(category) && (
                  <div className="w-full mt-4 overflow-x-auto">
                    <Table className="table-fixed w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left p-2 xs:text-xs md:text-base w-1/8">
                            Component Name
                          </TableHead>
                          <TableHead className="text-left p-2 xs:text-xs md:text-base w-1/8">
                            Description
                          </TableHead>
                          <TableHead className="text-left p-2 xs:text-xs md:text-base w-1/8">
                            Is Default
                          </TableHead>
                          <TableHead className="text-left p-2 xs:text-xs md:text-base w-1/8">
                            Additional Cost
                          </TableHead>
                          <TableHead className="text-left p-2 xs:text-xs md:text-base w-[10%]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(configuration[category] || []).map((component, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{component.name}</TableCell>
                            <TableCell>{component.description}</TableCell>
                            <TableCell>
                              {component.isDefault ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              {component.isDefault
                                ? "-"
                                : `$${component.additionalCost.toFixed(2)}`}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  className="h-6 bg-transparent text-red-500 border border-red-500 hover:bg-red-800/20 cursor-pointer"
                                  onClick={() => {
                                    const newConfig = { ...configuration };
                                    newConfig[category] = newConfig[
                                      category
                                    ].filter((_, i) => i !== idx);
                                    setConfiguration(newConfig);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="h-6 bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-800/20 cursor-pointer"
                                      onClick={() => {
                                        setComponentChange(component);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Component</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="componentName">
                                          Component Name
                                        </Label>
                                        <Input
                                          id="componentName"
                                          defaultValue={component.name}
                                          onChange={(e) => {
                                            setComponentChange({
                                              ...componentChange,
                                              name: e.target.value,
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="componentDescription">
                                          Description
                                        </Label>
                                        <Input
                                          id="componentDescription"
                                          defaultValue={component.description}
                                          onChange={(e) => {
                                            setComponentChange({
                                              ...componentChange,
                                              description: e.target.value,
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="componentIsDefault">
                                          Is Default
                                        </Label>
                                        <Switch
                                          checked={
                                            componentChange.isDefault === true
                                          }
                                          onCheckedChange={(val) => {
                                            setComponentChange((prev) => ({
                                              ...prev,
                                              isDefault: val,
                                            }));
                                          }}
                                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-sky-500 data-[state=checked]:to-teal-700"
                                        />
                                      </div>
                                      {!componentChange.isDefault ? (
                                        <div className="grid gap-2">
                                          <Label htmlFor="componentAdditionalCost">
                                            Additional Cost
                                          </Label>
                                          <Input
                                            id="componentAdditionalCost"
                                            type="number"
                                            value={component.additionalCost}
                                            onChange={(e) => {
                                              setComponentChange({
                                                ...componentChange,
                                                additionalCost: parseFloat(
                                                  e.target.value
                                                ),
                                              });
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="text-gray-500 italic"></div>
                                      )}
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        className="bg-transparent text-green-500 border border-green-500 hover:bg-green-800/20 cursor-pointer"
                                        onClick={() => {
                                          const newConfig = { ...configuration };
                                          newConfig[category][idx] =
                                            componentChange;
                                          setConfiguration(newConfig);
                                        }}
                                      >
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <Input
                              placeholder="Component Name"
                              value={newComponent.name}
                              onChange={(e) =>
                                setNewComponent((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Description"
                              value={newComponent.description}
                              onChange={(e) =>
                                setNewComponent((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <Switch
                                checked={isDefault}
                                onCheckedChange={(val) => {
                                  setIsDefault(val);
                                  setNewComponent((prev) => ({
                                    ...prev,
                                    isDefault: val,
                                  }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-sky-500 data-[state=checked]:to-teal-700"
                              />
                              <span className="ml-2">
                                {isDefault ? "Yes" : "No"}
                              </span>
                            </div>
                          </TableCell>
                          {isDefault ? (
                            <TableCell>
                              <span className="text-gray-500 italic">0</span>
                            </TableCell>
                          ) : (
                            <TableCell>
                              <Input
                                placeholder="Additional Cost"
                                value={newComponent.additionalCost}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) =>
                                  setNewComponent((prev) => ({
                                    ...prev,
                                    additionalCost: parseFloat(e.target.value),
                                  }))
                                }
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <Button
                              className="h-6 bg-transparent text-green-500 border border-green-500 hover:bg-green-800/20 cursor-pointer"
                              onClick={() => handleAddComponent(category)}
                            >
                              <Cog className="h-4 w-4 mr-2" />
                              Add
                              <span className="hidden lg:inline"> Component</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
