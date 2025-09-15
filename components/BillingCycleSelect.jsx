import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 1. Define the options as an array of objects
const billingCycles = [
  { value: "/month", label: "/month" },
  { value: "/year", label: "/year" },
  { value: "one-time", label: "One-time" },
  { value: "/kg", label: "/kg" },
  { value: "/g", label: "/g" },
  { value: "/lb", label: "/lb" },
  { value: "/unit", label: "/unit" },
  { value: "/GB", label: "/GB" },
  { value: "/TB", label: "/TB" },
  { value: "/API call", label: "/API call" },
  { value: "/request", label: "/request" },
  { value: "/minute", label: "/minute" },
  { value: "/second", label: "/second" },
  { value: "/piece", label: "/piece" },
  { value: "/session", label: "/session" },
  { value: "/transaction", label: "/transaction" },
  { value: "/item", label: "/item" },
  { value: "/event", label: "/event" },
  { value: "/call", label: "/call" },
  { value: "/visit", label: "/visit" },
  { value: "/lead", label: "/lead" },
  { value: "/campaign", label: "/campaign" },
  { value: "/meter", label: "/meter" },
  { value: "/km", label: "/km" },
  { value: "/hour", label: "/hour" },
  { value: "/day", label: "/day" },
  { value: "/week", label: "/week" },
  { value: "/liter", label: "/liter" },
  { value: "/user", label: "/user" },
  { value: "/device", label: "/device" },
  { value: "/project", label: "/project" },
  { value: "/subscription", label: "/subscription" },
  { value: "/team", label: "/team" },
  { value: "/license", label: "/license" },
  { value: "/seat", label: "/seat" },
  { value: "/month/user", label: "/month/user" },
  { value: "/year/user", label: "/year/user" },
  { value: "/token", label: "/token" },
];

export function BillingCycleSelect({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false);

  // Find the label for the currently selected value
  const selectedLabel = billingCycles.find(
    (cycle) => cycle.value === value
  )?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-1/2 justify-between bg-white/70 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white",
            className
          )}
        >
          {selectedLabel || "Select billing cycle..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search billing cycle..." />
          <CommandList>
            <CommandEmpty>No billing cycle found.</CommandEmpty>
            <CommandGroup>
              {billingCycles.map((cycle) => (
                <CommandItem
                  key={cycle.value}
                  value={cycle.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cycle.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cycle.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
