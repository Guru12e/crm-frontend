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

export default function ConfigureProduct({ product, config }) {
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

  return (
    <div className=" px-10">
      <div className="flex items-center justify-between mb-6 border-t border-gray-300 dark:border-gray-700 py-4">
        <h1 className="text-2xl font-bold">Product Configuration Settings</h1>
        <Button className="bg-gradient-to-r from-sky-700 to-teal-500 dark:from-sky-500 to:teal-700 text-white">
          Save Changes
        </Button>
      </div>
      <Card className="bg-cyan-300/20 dark:bg-cyan-600/30 mb-6 border-0 backdrop-blur-sm ">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <ClipboardListIcon className="h-5 w-5 mr-2" />
            Add Component Category
          </CardTitle>
          <CardContent>
            <div className="flex space-x-2">
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
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Category
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2 w-full">
            <div onClick={(e) => e.stopPropagation()}>
              {open.includes(category) && (
                <div className="w-full mt-4 overflow-x-auto">
                  <table className="min-w-full border-collapse divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Component Name</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Is Default</th>
                        <th className="text-left p-2">Additional Cost</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(configuration[category] || []).map((component, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{component.name}</td>
                          <td className="p-2">{component.description}</td>
                          <td className="p-2">
                            {component.isDefault ? "Yes" : "No"}
                          </td>
                          <td className="p-2">
                            {component.isDefault
                              ? "-"
                              : `$${component.additionalCost.toFixed(2)}`}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                className=" h-6 bg-transparent text-red-500 border border-red-500 hover:bg-red-800/20 cursor-pointer"
                                onClick={() => {
                                  const newConfig = { ...configuration };
                                  newConfig[category] = newConfig[
                                    category
                                  ].filter((_, i) => i !== idx);
                                  setConfiguration(newConfig);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Component
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className=" h-6 bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-800/20 cursor-pointer"
                                    onClick={() => {
                                      setComponentChange(component);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Component
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
                                        className={
                                          " data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-sky-500 data-[state=checked]:to-teal-700"
                                        }
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
                                      className=" bg-transparent text-green-500 border border-green-500 hover:bg-green-800/20 cursor-pointer"
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
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t">
                        <td className="p-2">
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
                        </td>
                        <td className="p-2">
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
                        </td>
                        <td className="p-2">
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
                              className={
                                " data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-sky-500 data-[state=checked]:to-teal-700"
                              }
                            />
                            <span className="ml-2">
                              {isDefault ? "Yes" : "No"}
                            </span>
                          </div>
                        </td>
                        {isDefault ? (
                          <td className="p-2">
                            <span className="text-gray-500 italic">0</span>
                          </td>
                        ) : (
                          <td className="p-2">
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
                          </td>
                        )}
                        <td className="p-2">
                          <Button
                            className={` h-6 bg-transparent text-green-500 border border-green-500 hover:bg-green-800/20 cursor-pointer`}
                            onClick={() => handleAddComponent(category)}
                          >
                            <Cog className="h-4 w-4 mr-2" />
                            Add Component
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
