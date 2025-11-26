"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";

export default function TemplateCreator() {
  const [openPreview, setOpenPreview] = useState(false);

  // ---------------------------
  // Past template storage
  // ---------------------------
  const [pastTemplates, setPastTemplates] = useState([]);

  // ---------------------------
  // Template Data State (added headerImage/footerImage and quote details)
  // ---------------------------
  const [data, setData] = useState({
    headerTitle: "Your Company Name",
    headerSubtitle: "Your Company Tagline",
    headerAddress: "123 Business Street, City, Country",
    headerPhone: "+1 (000) 000-0000",
    headerEmail: "info@company.com",

    // Header/footer images (base64 data URLs)
    headerImage: "",
    footerImage: "",

    title: "My Company Name",
    address: "Street Address",
    city: "City, ST ZIP",
    phone: "(000) 000-0000",
    email: "company@email.com",

    // Quote details
    quoteNumber: "70",
    quoteDate: "6/11/2025",
    validUntil: "2/15/2025",

    customerName: "Customer Name",
    customerAddress: "Customer Address",
    customerEmail: "customer@email.com",

    description: "Write your description of work here...",

    products: ["Product A", "Product B"],
    quantity: [1, 2],
    value: [100, 150],

    footerNote: "Thank you for choosing our services.",
    footerDisclaimer: "This quotation is valid for 30 days.",
  });

  // ---------------------------
  // Initialize past templates + restore last edited
  // ---------------------------
  useEffect(() => {
    try {
      const savedPast = JSON.parse(localStorage.getItem("pastTemplates")) || [];
      setPastTemplates(savedPast);

      const lastAuto = JSON.parse(localStorage.getItem("lastEditedTemplate"));
      if (lastAuto && lastAuto.data) {
        setData(lastAuto.data);
      }
    } catch (err) {
      // If parsing fails, ensure defaults remain
      console.error("Failed to load templates from localStorage", err);
    }
  }, []);

  // ---------------------------
  // update helper
  // ---------------------------
  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------------------
  // Image upload handler (converts to base64)
  // ---------------------------
  const handleImageUpload = (e, key) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result is a data URL (base64)
      update(key, reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------
  // AUTO-SAVE on every change (stores lastEditedTemplate)
  // ---------------------------
  useEffect(() => {
    try {
      const auto = {
        id: "autosave",
        timestamp: new Date().toISOString(),
        data: { ...data },
      };
      localStorage.setItem("lastEditedTemplate", JSON.stringify(auto));
    } catch (err) {
      console.error("Auto-save failed", err);
    }
  }, [data]);

  // ---------------------------
  // Save Template (manual)
  // ---------------------------
  const saveTemplate = () => {
    try {
      const newTemplate = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: { ...data },
      };

      // Prepend to past templates
      const updated = [newTemplate, ...pastTemplates];
      setPastTemplates(updated);
      localStorage.setItem("pastTemplates", JSON.stringify(updated));

      // Also update lastEditedTemplate to the same snapshot
      localStorage.setItem(
        "lastEditedTemplate",
        JSON.stringify({
          id: newTemplate.id,
          timestamp: newTemplate.timestamp,
          data: { ...data },
        })
      );
    } catch (err) {
      console.error("Save template failed", err);
    }
  };

  // ---------------------------
  // Helper: detect image format for jsPDF addImage
  // ---------------------------
  const getImageFormat = (dataUrl) => {
    if (!dataUrl || typeof dataUrl !== "string") return "PNG";
    const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
    if (!mimeMatch) return "PNG";
    const mime = mimeMatch[1].toLowerCase();
    if (mime === "image/jpeg" || mime === "image/jpg") return "JPEG";
    if (mime === "image/png") return "PNG";
    if (mime === "image/webp") return "WEBP";
    return "PNG";
  };

  // ---------------------------
  // Calculate total amount
  // ---------------------------
  const calculateTotal = () => {
    return (data.products || []).reduce((sum, _, i) => {
      const qty = Number((data.quantity && data.quantity[i]) || 0);
      const val = Number((data.value && data.value[i]) || 0);
      return sum + qty * val;
    }, 0);
  };

  // ---------------------------
  // PDF DOWNLOAD + Save Template
  // ---------------------------
  const handlePDFDownload = () => {
    // ensure template is saved
    saveTemplate();

    // Create jsPDF in default units (mm)
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 10;

    // HEADER
    if (data.headerImage) {
      try {
        const format = getImageFormat(data.headerImage);
        const info = doc.getImageProperties(data.headerImage);

        // calculate height correctly BEFORE adding image
        let headerHeight = (info.height * pageWidth) / info.width;
        const maxHeader = pageHeight * 0.2;
        if (headerHeight > maxHeader) headerHeight = maxHeader;

        // now add image with fixed height (NO OVERLAP)
        doc.addImage(data.headerImage, format, 0, 0, pageWidth, headerHeight);

        y = headerHeight + 10; // push content below image safely
      } catch (err) {
        console.warn("Failed to add header image:", err);
      }
    } else {
      // No header image — render header text
      y = 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(String(data.headerTitle || ""), 10, y + 5);

      doc.setFontSize(14);
      doc.text(String(data.headerSubtitle || ""), 10, y + 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(String(data.headerAddress || ""), 10, y + 25);
      doc.text(`Phone: ${String(data.headerPhone || "")}`, 10, y + 30);
      doc.text(`Email: ${String(data.headerEmail || "")}`, 10, y + 35);

      y = 55;
    }

    // QUOTATION title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("QUOTATION", 10, y);
    y += 12;

    // Company info (left side)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(String(data.title || ""), 10, y);
    y += 6;
    doc.text(String(data.address || ""), 10, y);
    y += 6;
    doc.text(String(data.city || ""), 10, y);
    y += 6;
    doc.text(`Phone: ${String(data.phone || "")}`, 10, y);
    y += 6;
    doc.text(`Email: ${String(data.email || "")}`, 10, y);
    y += 10;

    // Quote details table (right side)
    const quoteDetailsX = pageWidth - 70;
    let quoteY = y - 25;

    // Draw table border
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(quoteDetailsX - 5, quoteY - 5, 65, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("QUOTE #", quoteDetailsX, quoteY);
    doc.text("DATE", quoteDetailsX, quoteY + 6);
    doc.text("VALID UNTIL", quoteDetailsX, quoteY + 12);

    doc.setFont("helvetica", "normal");
    doc.text(String(data.quoteNumber || "70"), quoteDetailsX + 25, quoteY);
    doc.text(
      String(data.quoteDate || "6/11/2025"),
      quoteDetailsX + 25,
      quoteY + 6
    );
    doc.text(
      String(data.validUntil || "2/15/2025"),
      quoteDetailsX + 25,
      quoteY + 12
    );

    // Customer info
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER INFO", 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${String(data.customerName || "")}`, 10, y);
    y += 6;
    doc.text(`Address: ${String(data.customerAddress || "")}`, 10, y);
    y += 6;
    doc.text(`Email: ${String(data.customerEmail || "")}`, 10, y);
    y += 12;

    // Description
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION OF WORK:", 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(
      String(data.description || ""),
      pageWidth - 20
    );
    doc.text(descriptionLines, 10, y);
    y += descriptionLines.length * 6 + 6;

    // Itemized Costs
    doc.setFont("helvetica", "bold");
    doc.text("ITEMIZED COSTS:", 10, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    (data.products || []).forEach((item, i) => {
      const qty = Number((data.quantity && data.quantity[i]) || 0);
      const val = Number((data.value && data.value[i]) || 0);
      const line = `${String(item)} | Qty: ${qty} | Price: $${val} | Total: $${(
        qty * val
      ).toFixed(2)}`;
      const wrapped = doc.splitTextToSize(line, pageWidth - 20);
      doc.text(wrapped, 10, y);
      y += wrapped.length * 6;

      // Add page if near bottom (respect footer banner area)
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 10;
      }
    });

    // Total
    const total = calculateTotal();
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 10, y);
    doc.setFont("helvetica", "normal");
    y += 16;

    // Footer note/disclaimer placement
    if (data.footerImage) {
      try {
        const format = getImageFormat(data.footerImage);
        const info = doc.getImageProperties(data.footerImage);

        let footerHeight = (info.height * pageWidth) / info.width;
        const maxFooter = pageHeight * 0.2;
        if (footerHeight > maxFooter) footerHeight = maxFooter;

        const finalPage = doc.getNumberOfPages();
        doc.setPage(finalPage);

        // add clean fixed-height footer image
        doc.addImage(
          data.footerImage,
          format,
          0,
          pageHeight - footerHeight,
          pageWidth,
          footerHeight
        );
      } catch (err) {
        console.warn("Failed to add footer image:", err);
      }
    } else {
      // No footer image: place notes near bottom of page
      if (y > pageHeight - 40) {
        doc.addPage();
        y = 10;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(String(data.footerNote || ""), 10, y + 2);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const disclaimerLines = doc.splitTextToSize(
        String(data.footerDisclaimer || ""),
        pageWidth - 20
      );
      doc.text(disclaimerLines, 10, y + 4);
    }

    // FOOTER IMAGE (full-width, auto-height)
    if (data.footerImage) {
      try {
        const format = getImageFormat(data.footerImage);
        const info = doc.getImageProperties(data.footerImage);
        let footerHeight = (info.height * pageWidth) / info.width;
        const maxFooter = pageHeight * 0.2;
        if (footerHeight > maxFooter) footerHeight = maxFooter;

        const finalPage = doc.getNumberOfPages();
        doc.setPage(finalPage);
        // addImage with height 0 lets it compute; but we compute footerHeight and pass it explicitly
        doc.addImage(
          data.footerImage,
          format,
          0,
          pageHeight - footerHeight,
          pageWidth,
          footerHeight
        );
      } catch (err) {
        console.warn("Failed to add footer image to PDF:", err);
      }
    }

    doc.save("quotation_template.pdf");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-50 border-blue-600 text-blue-700 hover:bg-blue-100"
        >
          Create Template
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-screen h-screen max-w-none overflow-y-auto p-10 bg-white"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            Customize your Template
          </SheetTitle>
        </SheetHeader>

        {/** -------------------------------------------------
         * TOP BAR: Past Templates (LEFT)  | Save Template (RIGHT)
         * Layout choice A as requested
         ---------------------------------------------------- */}
        <div className="flex items-center justify-between mt-4 mb-6">
          {/* Left: Past Templates */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-200 text-black px-6">
                Past Templates
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Past Templates</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {pastTemplates.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No templates saved yet.
                  </p>
                )}

                {pastTemplates.map((t) => (
                  <div
                    key={t.id}
                    className="border p-3 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setData(t.data);
                      // Optionally close dialog if desired; keeping simple
                    }}
                  >
                    <p className="font-semibold">Template from:</p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {/* Right: Save button */}
          <div>
            <Button
              className="bg-blue-200 text-black px-6"
              onClick={saveTemplate}
            >
              Save Template
            </Button>
          </div>
        </div>

        {/** -------------------------------------------------
         * TEMPLATE FIELDS
         ---------------------------------------------------- */}
        <div className="mt-8 space-y-10 text-sm max-w-5xl mx-auto">
          {/** HEADER */}
          <section className="border rounded-md bg-blue-50 p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-2">HEADER (Brand Area)</h3>

            {/* If headerImage exists we hide the text inputs (behavior B) */}
            {!data.headerImage && (
              <>
                <Input
                  placeholder="Header Title"
                  value={data.headerTitle}
                  onChange={(e) => update("headerTitle", e.target.value)}
                />
                <Input
                  placeholder="Header Subtitle"
                  value={data.headerSubtitle}
                  onChange={(e) => update("headerSubtitle", e.target.value)}
                  className="mt-2"
                />
                <Input
                  placeholder="Header Address"
                  value={data.headerAddress}
                  onChange={(e) => update("headerAddress", e.target.value)}
                  className="mt-2"
                />
                <Input
                  placeholder="Header Phone"
                  value={data.headerPhone}
                  onChange={(e) => update("headerPhone", e.target.value)}
                  className="mt-2"
                />
                <Input
                  placeholder="Header Email"
                  value={data.headerEmail}
                  onChange={(e) => update("headerEmail", e.target.value)}
                  className="mt-2"
                />
              </>
            )}

            {/* Header Image Upload (always available) */}
            <div className="mt-3 cursor-pointer">
              <label className="font-semibold block mb-2">
                Header Image (banner)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "headerImage")}
                className="mb-2"
              />
              {data.headerImage && (
                <div className="flex gap-2 items-start">
                  <img
                    src={data.headerImage}
                    alt="Header Preview"
                    className="mt-2 h-20 w-full object-contain border"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => update("headerImage", "")}
                    className="text-sm ml-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/** COMPANY INFO */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">COMPANY INFO</h3>
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Company Name"
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                placeholder="Address"
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
              />
              <Input
                placeholder="City, ST ZIP"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input
                placeholder="Email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </section>

          {/** QUOTE DETAILS */}
          <section className="border p-4 rounded-md bg-green-50">
            <h3 className="font-semibold">QUOTE DETAILS</h3>
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Quote Number"
                value={data.quoteNumber}
                onChange={(e) => update("quoteNumber", e.target.value)}
              />
              <Input
                placeholder="Quote Date"
                value={data.quoteDate}
                onChange={(e) => update("quoteDate", e.target.value)}
              />
              <Input
                placeholder="Valid Until"
                value={data.validUntil}
                onChange={(e) => update("validUntil", e.target.value)}
              />
            </div>
          </section>

          {/** CUSTOMER INFO */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">CUSTOMER INFO</h3>
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Customer Name"
                value={data.customerName}
                onChange={(e) => update("customerName", e.target.value)}
              />
              <Input
                placeholder="Customer Address"
                value={data.customerAddress}
                onChange={(e) => update("customerAddress", e.target.value)}
              />
              <Input
                placeholder="Customer Email"
                value={data.customerEmail}
                onChange={(e) => update("customerEmail", e.target.value)}
              />
            </div>
          </section>

          {/** DESCRIPTION */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">DESCRIPTION OF WORK</h3>
            <Textarea
              placeholder="Description of work..."
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              className="h-24 mt-3"
            />
          </section>

          {/** ITEMIZED COSTS */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">ITEMIZED COSTS</h3>

            <div className="mt-4 space-y-4">
              {data.products.map((p, i) => (
                <div key={i} className="grid grid-cols-4 gap-3">
                  <Input
                    placeholder="Product Name"
                    value={p}
                    onChange={(e) => {
                      const arr = [...data.products];
                      arr[i] = e.target.value;
                      update("products", arr);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={data.quantity[i]}
                    onChange={(e) => {
                      const arr = [...data.quantity];
                      arr[i] = Number(e.target.value);
                      update("quantity", arr);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={data.value[i]}
                    onChange={(e) => {
                      const arr = [...data.value];
                      arr[i] = Number(e.target.value);
                      update("value", arr);
                    }}
                  />
                  <div className="font-bold flex items-center justify-end">
                    ${(data.quantity[i] * data.value[i]).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/** FOOTER */}
          <section className="border rounded-md bg-yellow-50 p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-2">FOOTER</h3>

            {/* If footerImage exists we hide footer text (consistent with B) */}
            {!data.footerImage && (
              <>
                <Input
                  placeholder="Footer Note"
                  value={data.footerNote}
                  onChange={(e) => update("footerNote", e.target.value)}
                />
                <Textarea
                  placeholder="Footer Disclaimer"
                  value={data.footerDisclaimer}
                  onChange={(e) => update("footerDisclaimer", e.target.value)}
                  className="mt-2"
                />
              </>
            )}

            {/* Footer Image Upload (always available) */}
            <div className="mt-3">
              <label className="font-semibold block mb-2">
                Footer Image (banner)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "footerImage")}
                className="mb-2"
              />
              {data.footerImage && (
                <div className="flex gap-2 items-start">
                  <img
                    src={data.footerImage}
                    alt="Footer Preview"
                    className="mt-2 h-20 w-full object-contain border"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => update("footerImage", "")}
                    className="text-sm ml-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
        {/** FOOTER BUTTONS */}
        <SheetFooter className="mt-10 flex flex-col items-center gap-6">
          <div className="flex justify-center gap-4">
            <Dialog open={openPreview} onOpenChange={setOpenPreview}>
              <DialogTrigger asChild>
                <Button className="bg-gray-200 text-black px-6">Preview</Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Template Preview (Exact PDF Look)</DialogTitle>
                </DialogHeader>

                <div
                  className="space-y-6 p-4 text-sm bg-white"
                  style={{ width: "210mm" }}
                >
                  {/* Header Preview - FIXED: Remove fixed height */}
                  {data.headerImage ? (
                    <img
                      src={data.headerImage}
                      alt="Header Preview"
                      className="w-full object-contain border mb-3" // REMOVED: h-24
                    />
                  ) : (
                    <div className="border p-4 rounded bg-blue-50">
                      <h2 className="text-xl font-bold">{data.headerTitle}</h2>
                      <p className="text-lg">{data.headerSubtitle}</p>
                      <p>{data.headerAddress}</p>
                      <p>Phone: {data.headerPhone}</p>
                      <p>Email: {data.headerEmail}</p>
                    </div>
                  )}

                  {/* QUOTATION Title */}
                  <h2 className="text-2xl font-bold text-center border-b pb-2">
                    QUOTATION
                  </h2>

                  {/* Company Info and Quote Details Side by Side */}
                  <div className="flex justify-between items-start">
                    {/* Company Info (Left) */}
                    <div className="border p-4 rounded flex-1 mr-4">
                      <h3 className="font-semibold mb-2">COMPANY INFO</h3>
                      <p className="font-medium">{data.title}</p>
                      <p>{data.address}</p>
                      <p>{data.city}</p>
                      <p>Phone: {data.phone}</p>
                      <p>Email: {data.email}</p>
                    </div>

                    {/* Quote Details Table (Right) */}
                    <div className="border border-gray-300 p-3 rounded text-xs w-64">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="font-semibold pr-2 py-1">QUOTE #</td>
                            <td className="py-1">{data.quoteNumber || "70"}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-2 py-1">DATE</td>
                            <td className="py-1">
                              {data.quoteDate || "6/11/2025"}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold pr-2 py-1">
                              VALID UNTIL
                            </td>
                            <td className="py-1">
                              {data.validUntil || "2/15/2025"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2 bg-gray-100 px-2 py-1">
                      CUSTOMER INFO
                    </h3>
                    <p className="font-medium">{data.customerName}</p>
                    <p>{data.customerAddress}</p>
                    <p>{data.customerEmail}</p>
                  </div>

                  {/* Description */}
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2 bg-gray-100 px-2 py-1">
                      DESCRIPTION OF WORK
                    </h3>
                    <p className="whitespace-pre-wrap">{data.description}</p>
                  </div>

                  {/* Itemized Costs */}
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2 bg-gray-100 px-2 py-1">
                      ITEMIZED COSTS
                    </h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
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
                        {data.products.map((p, i) => (
                          <tr key={i}>
                            <td className="border border-gray-300 px-2 py-1">
                              {p}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-center">
                              {data.quantity[i]}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-right">
                              ${data.value[i]}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 text-right">
                              ${(data.quantity[i] * data.value[i]).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Total */}
                    <div className="flex justify-between mt-4 pt-2 border-t border-gray-300 font-bold">
                      <span>TOTAL QUOTE</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Footer Preview - FIXED: Remove fixed height */}
                  <div className="border p-4 rounded bg-yellow-50">
                    {data.footerImage ? (
                      <img
                        src={data.footerImage}
                        alt="Footer Preview"
                        className="w-full object-contain border" // REMOVED: h-20
                      />
                    ) : (
                      <>
                        <p className="font-bold text-center">
                          {data.footerNote}
                        </p>
                        <p className="text-xs text-center mt-2">
                          {data.footerDisclaimer}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              className="bg-green-600 text-white px-8 py-3 text-lg"
              onClick={handlePDFDownload}
            >
              Download PDF
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
