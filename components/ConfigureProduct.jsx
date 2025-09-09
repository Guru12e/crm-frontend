"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function ConfigureProduct() {
  const [isConfig, setIsConfig] = useState(true);
  return (
    <div>
      <div>
        <h1>Customise Your Product Configuration Settings Here</h1>
        <div className="flex gap-4">
          <Label>Is your product configurable?</Label>
        </div>
      </div>
    </div>
  );
}
