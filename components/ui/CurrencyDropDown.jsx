"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { currencies as allCurrenciesData } from "country-data-list";

const CurrencyDropdown = ({
  value,
  onValueChange,
  placeholder = "Select a currency",
}) => {
  const sortedCurrencies = useMemo(() => {
    const filtered = allCurrenciesData.all.filter(
      (curr) => curr.code && curr.name && curr.symbol
    );
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} className="bg-white" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          {sortedCurrencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{currency.code}</span>
                <span className="text-sm text-muted-foreground">
                  {currency.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export { CurrencyDropdown };
