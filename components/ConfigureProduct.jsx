"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ConfigureProduct() {
  const [isConfig, setIsConfig] = useState(true);
  return (
    <div>
      <div>
        <div className="flex gap-4">
          <Label>Is your product configurable?</Label>
          <div className="flex items-center space-x-2 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-white/20 rounded-lg px-4 py-2">
            <Switch
              checked={isConfig === true}
              onCheckedChange={() => setIsConfig(!isConfig)}
            />
            <span className="hidden sm:inline">
              {isConfig ? "Configurable" : "Non-configurable"}
            </span>
            <span className="sm:hidden">
              {isConfig ? "Configurable" : "Non-configurable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
