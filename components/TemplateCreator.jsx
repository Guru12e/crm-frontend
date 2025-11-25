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
  // Template Data State (added headerImage/footerImage)
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
  // PDF DOWNLOAD + Save Template (Option C: full width, keep aspect ratio)
  // Behavior chosen:
  // - If headerImage exists: show header IMAGE only (hide header text)
  // - If footerImage exists: show footer IMAGE only (hide footer text)
  // - If no images: render header/footer text as before
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

    // Company info
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

    // Customer info
    doc.text(`Customer: ${String(data.customerName || "")}`, 10, y);
    y += 6;
    doc.text(String(data.customerAddress || ""), 10, y);
    y += 6;
    doc.text(String(data.customerEmail || ""), 10, y);
    y += 12;

    // Description
    doc.setFont("helvetica", "bold");
    doc.text("Description of Work:", 10, y);
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
    doc.text("Itemized Costs:", 10, y);
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
    const total = (data.products || []).reduce((sum, _, i) => {
      const qty = Number((data.quantity && data.quantity[i]) || 0);
      const val = Number((data.value && data.value[i]) || 0);
      return sum + qty * val;
    }, 0);

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
                  value={data.headerTitle}
                  onChange={(e) => update("headerTitle", e.target.value)}
                />
                <Input
                  value={data.headerSubtitle}
                  onChange={(e) => update("headerSubtitle", e.target.value)}
                  className="mt-2"
                />
                <Input
                  value={data.headerAddress}
                  onChange={(e) => update("headerAddress", e.target.value)}
                  className="mt-2"
                />
                <Input
                  value={data.headerPhone}
                  onChange={(e) => update("headerPhone", e.target.value)}
                  className="mt-2"
                />
                <Input
                  value={data.headerEmail}
                  onChange={(e) => update("headerEmail", e.target.value)}
                  className="mt-2"
                />
              </>
            )}

            {/* Header Image Upload (always available) */}
            <div className="mt-3">
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
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                value={data.address}
                onChange={(e) => update("address", e.target.value)}
              />
              <Input
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <Input
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </section>

          {/** CUSTOMER INFO */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">CUSTOMER INFO</h3>
            <div className="mt-3 space-y-2">
              <Input
                value={data.customerName}
                onChange={(e) => update("customerName", e.target.value)}
              />
              <Input
                value={data.customerAddress}
                onChange={(e) => update("customerAddress", e.target.value)}
              />
              <Input
                value={data.customerEmail}
                onChange={(e) => update("customerEmail", e.target.value)}
              />
            </div>
          </section>

          {/** DESCRIPTION */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">DESCRIPTION OF WORK</h3>
            <Textarea
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
                    value={p}
                    onChange={(e) => {
                      const arr = [...data.products];
                      arr[i] = e.target.value;
                      update("products", arr);
                    }}
                  />
                  <Input
                    type="number"
                    value={data.quantity[i]}
                    onChange={(e) => {
                      const arr = [...data.quantity];
                      arr[i] = Number(e.target.value);
                      update("quantity", arr);
                    }}
                  />
                  <Input
                    type="number"
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
                  value={data.footerNote}
                  onChange={(e) => update("footerNote", e.target.value)}
                />
                <Textarea
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
                  <DialogTitle>Template Preview</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 p-4 text-sm">
                  {/* Header Preview */}
                  {data.headerImage ? (
                    // If headerImage exists, show only the image (behavior B)
                    <img
                      src={data.headerImage}
                      alt="Header Preview"
                      className="w-full h-24 object-contain border mb-3"
                    />
                  ) : (
                    // No header image: show header text block
                    <div className="border p-4 rounded">
                      <h2 className="text-xl font-bold">{data.headerTitle}</h2>
                      <p>{data.headerSubtitle}</p>
                      <p>{data.headerAddress}</p>
                      <p>{data.headerPhone}</p>
                      <p>{data.headerEmail}</p>
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-center">QUOTATION</h2>

                  <div className="border p-4">
                    <h3 className="font-semibold">COMPANY INFO</h3>
                    <p>{data.title}</p>
                    <p>{data.address}</p>
                    <p>{data.city}</p>
                    <p>{data.phone}</p>
                    <p>{data.email}</p>
                  </div>

                  <div className="border p-4">
                    <h3 className="font-semibold">CUSTOMER INFO</h3>
                    <p>{data.customerName}</p>
                    <p>{data.customerAddress}</p>
                    <p>{data.customerEmail}</p>
                  </div>

                  <div className="border p-4">
                    <h3 className="font-semibold">DESCRIPTION</h3>
                    <p>{data.description}</p>
                  </div>

                  <div className="border p-4">
                    <h3 className="font-semibold">ITEMIZED COSTS</h3>
                    {data.products.map((p, i) => (
                      <p key={i}>
                        {p} — Qty: {data.quantity[i]} — Price: ${data.value[i]}{" "}
                        — Total: $
                        {(data.quantity[i] * data.value[i]).toFixed(2)}
                      </p>
                    ))}
                  </div>

                  <div className="border p-4 rounded">
                    {/* Footer Preview */}
                    {data.footerImage ? (
                      // If footerImage exists, show only image (behavior B)
                      <img
                        src={data.footerImage}
                        alt="Footer Preview"
                        className="w-full h-20 object-contain border mb-3"
                      />
                    ) : (
                      <>
                        <p className="font-bold">{data.footerNote}</p>
                        <p className="text-xs">{data.footerDisclaimer}</p>
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
