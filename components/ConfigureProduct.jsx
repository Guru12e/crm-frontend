import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function ConfigureProduct() {
  const [isConfig, setIsConfig] = useState(true);
  return (
    <div>
      <div>
        <h1>Customise Your Product Configuration Settings Here</h1>
        <div className="flex gap-4">
          <Label>Is your product configurable?</Label>
          <Button></Button>
        </div>
      </div>
    </div>
  );
}
