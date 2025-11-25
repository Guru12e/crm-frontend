"use client";

import { useState } from "react";
import { supabase } from "../utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function QuotePreview({ dealId }) {
  const [open, setOpen] = useState(false);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setOpen(true);
    await fetchDeal();
  };

  async function fetchDeal() {
    if (!dealId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("Deals")
      .select("*")
      .eq("id", dealId)
      .single();

    if (error) {
      console.error("Error fetching deal:", error);
    } else {
      setDeal(data);
    }
    setLoading(false);
  }

  return (
    <div>
      <Button onClick={handlePreview}>Preview</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="scale-100 w-[900px] sm:max-w-[1000px]"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-center">
              QUOTATION
            </SheetTitle>
            <SheetDescription className="text-center text-gray-500 ">
              Preview your quote before sending
            </SheetDescription>
          </SheetHeader>

          {!deal ? (
            <p className="text-center mt-10 text-gray-500">
              {loading ? "Loading..." : "No data"}
            </p>
          ) : (
            <div className="mt-6 space-y-6 text-sm w-[800px] mx-auto">
              {/* Company Info */}
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{deal.title || "[Company Name]"}</p>
                  <p>{deal.address || "[Street Address]"}</p>
                  <p>{deal.city || "[City, ST ZIP]"}</p>
                  <p>Phone: {deal.number || "(000) 000-0000"}</p>
                  <p>Email: {deal.email || "company@email.com"}</p>
                </div>

                <div className="text-right text-sm">
                  <table className="border border-gray-300 text-xs w-[250px] mx-auto">
                    <tbody>
                      <tr>
                        <td className="border px-2 py-1 font-semibold">
                          QUOTE #
                        </td>
                        <td className="border px-2 py-1">{deal.id}</td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1 font-semibold">DATE</td>
                        <td className="border px-2 py-1">
                          {new Date(deal.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="border px-2 py-1 font-semibold">
                          VALID UNTIL
                        </td>
                        <td className="border px-2 py-1">2/15/2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                  CUSTOMER INFO
                </h3>
                <div className="p-2">
                  <p>{deal.name || "[Customer Name]"}</p>
                  <p>{deal.address || "[Customer Address]"}</p>
                  <p>{deal.user_email || "[Customer Email]"}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                  DESCRIPTION OF WORK
                </h3>
                <div className="p-2 h-20 border-t">
                  {deal.description || "Provide project details here..."}
                </div>
              </div>

              {/* Itemized Costs */}
              <div>
                <h3 className="font-semibold bg-gray-100 px-2 py-1 border">
                  ITEMIZED COSTS
                </h3>

                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">ITEM</th>
                      <th className="border px-2 py-1">QTY</th>
                      <th className="border px-2 py-1">UNIT PRICE</th>
                      <th className="border px-2 py-1">AMOUNT</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deal.products?.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-2 py-1">{item}</td>
                        <td className="border px-2 py-1 text-center">
                          {deal.quantity?.[index] || 1}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {deal.value?.[index] || "0.00"}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {(
                            Number(deal.value?.[index]) *
                            Number(deal.quantity?.[index])
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="border flex justify-between border-b px-2 py-1">
                  <span>SUBTOTAL</span>
                  <span>
                    {deal.finalPrice
                      ? `$${deal.finalPrice}`
                      : "$" +
                        deal.products
                          ?.reduce((sum, _, i) => {
                            return (
                              sum +
                              Number(deal.value?.[i] || 0) *
                                Number(deal.quantity?.[i] || 1)
                            );
                          }, 0)
                          .toFixed(2)}
                  </span>
                </div>

                <div className="border flex justify-between border-b px-2 py-1 font-semibold bg-gray-100">
                  <span>TOTAL QUOTE</span>
                  <span>
                    {deal.finalPrice
                      ? `$${deal.finalPrice}`
                      : "$" +
                        deal.products
                          ?.reduce((sum, _, i) => {
                            return (
                              sum +
                              Number(deal.value?.[i] || 0) *
                                Number(deal.quantity?.[i] || 1)
                            );
                          }, 0)
                          .toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                This quotation is an estimate. Payment is due prior to delivery
                of services.
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
