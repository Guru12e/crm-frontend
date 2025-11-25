import { useState, useMemo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export function ProductConfigCard({
  product,
  productIndex,
  dealIndex,
  dealConfig,
  setDealConfig,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen((prevState) => !prevState);

  const totalConfiguredPrice = useMemo(() => {
    const basePrice = parseFloat(product?.price) || 0;

    const currentProductConfig = dealConfig?.[dealIndex]?.[productIndex] || {};

    const optionsPrice = Object.values(currentProductConfig).reduce(
      (sum, configValue) => sum + (configValue.price || 0),
      0
    );
    return basePrice + optionsPrice;
  }, [dealConfig, productIndex, product?.price, dealIndex]);

  if (!product) {
    return null;
  }

  return (
    <Card
      onClick={onToggle}
      className={`${
        isOpen ? "max-h-[1000px]" : "h-14"
      } p-4 mx-4 flex flex-col justify-start cursor-pointer items-start gap-4 mb-6 bg-white/10 dark:bg-gray-200/10 border-0 backdrop-blur-sm transition-all duration-500 overflow-hidden`}
    >
      <CardTitle className="mb-2 flex justify-between w-full text-base font-semibold">
        <div className="flex items-center">
          <ChevronDown
            className={`inline mr-2 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
          {product.name}
        </div>
        <span>
          Total Price: {product.currency || "$"}
          {totalConfiguredPrice.toFixed(2)} {product.billing_cycle || ""}
        </span>
      </CardTitle>

      <CardContent className={`p-2 w-full flex flex-col gap-4`}>
        {!product.isConfigurable ? (
          <p className="text-slate-500">This product is not configurable.</p>
        ) : !product.config || Object.keys(product.config).length === 0 ? (
          <p className="text-slate-500">
            No configuration options available for this product.
          </p>
        ) : (
          <div className="w-full">
            {Object.entries(product.config).map(([category, options]) => {
              const selectedOptionPrice =
                dealConfig[dealIndex][productIndex]?.[category]?.price ?? 0;

              return (
                <Table key={category} className="mb-6 table-auto w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Options</TableHead>
                      <TableHead>Selection</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{category}</TableCell>
                      <TableCell>{options.length}</TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => {
                            const updatedDealConfig = [...dealConfig];
                            while (updatedDealConfig.length <= dealIndex) {
                              updatedDealConfig.push([]);
                              while (
                                updatedDealConfig[dealIndex].length <=
                                productIndex
                              ) {
                                updatedDealConfig[dealIndex].push({});
                              }
                            }
                            if (!updatedDealConfig[dealIndex][productIndex]) {
                              updatedDealConfig[dealIndex][productIndex] = {};
                            }
                            updatedDealConfig[dealIndex][productIndex] = {
                              [category]: {
                                option: value,
                                price:
                                  options.find((opt) => opt.name === value)
                                    ?.additionalCost || 0,
                              },
                            };
                            console.log(dealConfig);
                            console.log(updatedDealConfig);
                            console.log(dealConfig[dealIndex]?.[productIndex]);
                            console.log(
                              dealConfig[dealIndex]?.[productIndex]?.[category]
                            );
                            console.log(
                              dealConfig[dealIndex]?.[productIndex]?.[category]
                                .option
                            );
                            console.log(
                              dealConfig[dealIndex]?.[productIndex]?.[category]
                                .price
                            );

                            setDealConfig(updatedDealConfig);
                          }}
                        >
                          <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue
                              value={
                                dealConfig[dealIndex]?.[productIndex]?.[
                                  category
                                ]?.option ||
                                product.config?.[category]?.find(
                                  (opt) => opt.isDefault
                                )?.name ||
                                " Select an option"
                              }
                              placeholder={
                                dealConfig[dealIndex]?.[productIndex]?.[
                                  category
                                ]?.option ||
                                product.config?.[category]?.find(
                                  (opt) => opt.isDefault
                                )?.name ||
                                " Select an option"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel> {category} Options </SelectLabel>
                              {options.map((option) => (
                                <SelectItem key={option.id} value={option.name}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {product.currency || "$"}
                        {selectedOptionPrice.toFixed(2) ||
                          dealConfig[dealIndex]?.[productIndex]?.[category]
                            ?.price}
                        {product.billing_cycle || ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
