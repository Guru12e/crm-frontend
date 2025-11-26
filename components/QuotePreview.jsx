"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { supabase } from "../utils/supabase/client";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function QuotePreview({ dealId }) {
  const [open, setOpen] = useState(false);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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

  /* IMPROVED PDF DOWNLOAD HANDLER */
  const handleDownloadPDF = async () => {
    if (!deal) {
      toast.error("No deal data available");
      return;
    }

    setGeneratingPDF(true);

    try {
      const element = document.getElementById("quote-pdf-content");
      if (!element) {
        toast.error("PDF content not found");
        setGeneratingPDF(false);
        return;
      }

      // Add loading state
      toast.info("Generating PDF, please wait...");

      // Force a reflow to ensure content is properly rendered
      element.style.display = "block";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Check if content fits on one page, otherwise add multiple pages
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      // Save the PDF
      pdf.save(`Quote-${dealId}-${new Date().getTime()}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Alternative PDF generation method as fallback
  const handleDownloadPDFAlternative = async () => {
    if (!deal) {
      toast.error("No deal data available");
      return;
    }

    setGeneratingPDF(true);

    try {
      toast.info("Generating PDF using alternative method...");

      const pdf = new jsPDF("p", "mm", "a4");
      let yPosition = 20;

      // Add company info
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("QUOTATION", 105, yPosition, { align: "center" });
      yPosition += 20;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      // Company details
      pdf.text(`Company: ${deal.title || "[Company Name]"}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Address: ${deal.address || "[Street Address]"}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`City: ${deal.city || "[City, ST ZIP]"}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Phone: ${deal.number || "(000) 000-0000"}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Email: ${deal.email || "company@email.com"}`, 20, yPosition);
      yPosition += 15;

      // Quote details table
      pdf.text(`Quote #: ${deal.id}`, 150, yPosition - 15);
      pdf.text(
        `Date: ${new Date(deal.created_at).toLocaleDateString()}`,
        150,
        yPosition - 9
      );
      pdf.text(`Valid Until: 2/15/2025`, 150, yPosition - 3);

      // Customer info
      pdf.setFont("helvetica", "bold");
      pdf.text("CUSTOMER INFO", 20, yPosition);
      yPosition += 8;
      pdf.setFont("helvetica", "normal");
      pdf.text(`Name: ${deal.name || "[Customer Name]"}`, 20, yPosition);
      yPosition += 6;
      pdf.text(
        `Address: ${deal.address || "[Customer Address]"}`,
        20,
        yPosition
      );
      yPosition += 6;
      pdf.text(
        `Email: ${deal.user_email || "[Customer Email]"}`,
        20,
        yPosition
      );
      yPosition += 15;

      // Description
      pdf.setFont("helvetica", "bold");
      pdf.text("DESCRIPTION OF WORK", 20, yPosition);
      yPosition += 8;
      pdf.setFont("helvetica", "normal");
      const description = deal.description || "Provide project details here...";
      const splitDescription = pdf.splitTextToSize(description, 170);
      pdf.text(splitDescription, 20, yPosition);
      yPosition += splitDescription.length * 6 + 10;

      // Itemized costs table header
      pdf.setFont("helvetica", "bold");
      pdf.text("ITEMIZED COSTS", 20, yPosition);
      yPosition += 10;

      // Table headers
      pdf.text("ITEM", 20, yPosition);
      pdf.text("QTY", 120, yPosition);
      pdf.text("UNIT PRICE", 140, yPosition);
      pdf.text("AMOUNT", 170, yPosition);
      yPosition += 6;

      // Draw line
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // Table rows
      pdf.setFont("helvetica", "normal");
      let subtotal = 0;

      if (deal.products && deal.products.length > 0) {
        deal.products.forEach((item, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }

          const quantity = deal.quantity?.[index] || 1;
          const unitPrice = Number(deal.value?.[index]) || 0;
          const amount = quantity * unitPrice;
          subtotal += amount;

          pdf.text(item, 20, yPosition);
          pdf.text(quantity.toString(), 120, yPosition);
          pdf.text(`$${unitPrice.toFixed(2)}`, 140, yPosition);
          pdf.text(`$${amount.toFixed(2)}`, 170, yPosition);
          yPosition += 8;
        });
      }

      yPosition += 5;
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // Totals
      pdf.text("SUBTOTAL:", 140, yPosition);
      pdf.text(`$${subtotal.toFixed(2)}`, 170, yPosition);
      yPosition += 8;

      pdf.setFont("helvetica", "bold");
      pdf.text("TOTAL QUOTE:", 140, yPosition);
      pdf.text(`$${subtotal.toFixed(2)}`, 170, yPosition);

      // Footer note
      yPosition += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text(
        "This quotation is an estimate. Payment is due prior to delivery of services.",
        105,
        yPosition,
        { align: "center" }
      );

      pdf.save(`Quote-${dealId}-simple.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating alternative PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePreview}>Preview</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="scale-100 w-[900px] sm:max-w-[1000px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-center">
              QUOTATION
            </SheetTitle>
            <SheetDescription className="text-center text-gray-500">
              Preview your quote before sending
            </SheetDescription>
          </SheetHeader>

          {!deal ? (
            <p className="text-center mt-10 text-gray-500">
              {loading ? "Loading..." : "No data"}
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {/* PDF Content */}
              <div
                id="quote-pdf-content"
                className="space-y-6 text-sm w-[800px] mx-auto p-6 bg-white border border-gray-200"
                style={{ display: "block" }}
              >
                {/* Company Info */}
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-lg">
                      {deal.title || "[Company Name]"}
                    </p>
                    <p>{deal.address || "[Street Address]"}</p>
                    <p>{deal.city || "[City, ST ZIP]"}</p>
                    <p>Phone: {deal.number || "(000) 000-0000"}</p>
                    <p>Email: {deal.email || "company@email.com"}</p>
                  </div>

                  <div className="text-right text-sm">
                    <table className="border border-gray-300 text-xs w-[250px] mx-auto">
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1 font-semibold bg-gray-100">
                            QUOTE #
                          </td>
                          <td className="border px-2 py-1">{deal.id}</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1 font-semibold bg-gray-100">
                            DATE
                          </td>
                          <td className="border px-2 py-1">
                            {new Date(deal.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1 font-semibold bg-gray-100">
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
                  <h3 className="font-semibold bg-gray-100 px-2 py-1 border border-gray-300">
                    CUSTOMER INFO
                  </h3>
                  <div className="p-2 border border-gray-300 border-t-0">
                    <p className="font-medium">
                      {deal.name || "[Customer Name]"}
                    </p>
                    <p>{deal.address || "[Customer Address]"}</p>
                    <p>{deal.user_email || "[Customer Email]"}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold bg-gray-100 px-2 py-1 border border-gray-300">
                    DESCRIPTION OF WORK
                  </h3>
                  <div className="p-2 min-h-20 border border-gray-300 border-t-0">
                    {deal.description || "Provide project details here..."}
                  </div>
                </div>

                {/* Itemized Cost Table */}
                <div>
                  <h3 className="font-semibold bg-gray-100 px-2 py-1 border border-gray-300">
                    ITEMIZED COSTS
                  </h3>

                  <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-2 py-1 text-left">
                          ITEM
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          QTY
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          UNIT PRICE
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          AMOUNT
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {deal.products?.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-2 py-1">
                            {item}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            {deal.quantity?.[index] || 1}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            ${deal.value?.[index] || "0.00"}
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-right">
                            $
                            {(
                              Number(deal.value?.[index] || 0) *
                              Number(deal.quantity?.[index] || 1)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* TOTALS */}
                  <div className="border border-gray-300 border-t-0 flex justify-between px-2 py-1">
                    <span>SUBTOTAL</span>
                    <span>
                      {deal.finalPrice
                        ? `$${deal.finalPrice}`
                        : "$" +
                          (
                            deal.products?.reduce((sum, _, i) => {
                              return (
                                sum +
                                Number(deal.value?.[i] || 0) *
                                  Number(deal.quantity?.[i] || 1)
                              );
                            }, 0) || 0
                          ).toFixed(2)}
                    </span>
                  </div>

                  <div className="border border-gray-300 border-t-0 flex justify-between px-2 py-1 font-semibold bg-gray-100">
                    <span>TOTAL QUOTE</span>
                    <span>
                      {deal.finalPrice
                        ? `$${deal.finalPrice}`
                        : "$" +
                          (
                            deal.products?.reduce((sum, _, i) => {
                              return (
                                sum +
                                Number(deal.value?.[i] || 0) *
                                  Number(deal.quantity?.[i] || 1)
                              );
                            }, 0) || 0
                          ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  This quotation is an estimate. Payment is due prior to
                  delivery of services.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 w-[800px] mx-auto">
                <Button
                  className="w-full bg-transparent hover:bg-green-500/10 text-green-700 border border-green-700 hover:border-transparent dark:border-green-200 dark:text-green-100"
                  onClick={() => setOpen(false)}
                >
                  Close Preview
                </Button>

                {/* PDF DOWNLOAD BUTTONS */}
                {/* <Button
                  className="w-full bg-transparent hover:bg-blue-500/10 text-blue-700 border border-blue-700 hover:border-transparent dark:border-blue-200 dark:text-blue-100"
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                >
                  {generatingPDF
                    ? "Generating PDF..."
                    : "Download Quote as PDF (Image)"}
                </Button> */}

                <Button
                  className="w-full bg-transparent hover:bg-purple-500/10 text-purple-700 border border-purple-700 hover:border-transparent dark:border-purple-200 dark:text-purple-100"
                  onClick={handleDownloadPDFAlternative}
                  disabled={generatingPDF}
                >
                  {generatingPDF
                    ? "Generating PDF..."
                    : "Download Quote as PDF"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default QuotePreview;
