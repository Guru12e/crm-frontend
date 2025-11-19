"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetDescription,
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

  const [data, setData] = useState({
    // HEADER SECTION (mock)
    headerTitle: "Your Company Name",
    headerSubtitle: "Your Company Tagline",
    headerAddress: "123 Business Street, City, Country",
    headerPhone: "+1 (000) 000-0000",
    headerEmail: "info@company.com",

    // COMPANY INFO
    title: "My Company Name",
    address: "Street Address",
    city: "City, ST ZIP",
    phone: "(000) 000-0000",
    email: "company@email.com",

    // CUSTOMER INFO
    customerName: "Customer Name",
    customerAddress: "Customer Address",
    customerEmail: "customer@email.com",

    // DESCRIPTION
    description: "Write your description of work here...",

    // ITEM TABLE
    products: ["Product A", "Product B"],
    quantity: [1, 2],
    value: [100, 150],

    // FOOTER SECTION
    footerNote: "Thank you for choosing our services.",
    footerDisclaimer: "This quotation is valid for 30 days.",
  });

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    let y = 10;
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER BACKGROUND =====
    doc.setFillColor(224, 240, 255); // light blue
    doc.rect(5, 5, pageWidth - 10, 45, "F");

    // ===== HEADER TEXT =====
    doc.setFontSize(20);
    doc.text(data.headerTitle, 10, y + 5);

    doc.setFontSize(14);
    doc.text(data.headerSubtitle, 10, y + 15);

    doc.setFontSize(10);
    doc.text(data.headerAddress, 10, y + 25);
    doc.text(`Phone: ${data.headerPhone}`, 10, y + 30);
    doc.text(`Email: ${data.headerEmail}`, 10, y + 35);

    y = 55; // move below header section

    // ===== QUOTATION TITLE =====
    doc.setFontSize(22);
    doc.text("QUOTATION", 10, y);
    y += 12;

    // ===== COMPANY INFO =====
    doc.setFontSize(12);
    doc.text(data.title, 10, y);
    y += 6;
    doc.text(data.address, 10, y);
    y += 6;
    doc.text(data.city, 10, y);
    y += 6;
    doc.text(`Phone: ${data.phone}`, 10, y);
    y += 6;
    doc.text(`Email: ${data.email}`, 10, y);
    y += 10;

    // ===== CUSTOMER INFO =====
    doc.text(`Customer: ${data.customerName}`, 10, y);
    y += 6;
    doc.text(data.customerAddress, 10, y);
    y += 6;
    doc.text(data.customerEmail, 10, y);
    y += 12;

    // ===== DESCRIPTION =====
    doc.text("Description of Work:", 10, y);
    y += 6;
    doc.text(doc.splitTextToSize(data.description, 180), 10, y);
    y += 20;

    // ===== ITEMS =====
    doc.text("Itemized Costs:", 10, y);
    y += 8;

    data.products.forEach((item, i) => {
      doc.text(
        `${item} | Qty: ${data.quantity[i]} | Price: $${
          data.value[i]
        } | Total: $${data.quantity[i] * data.value[i]}`,
        10,
        y
      );
      y += 6;
    });

    const total = data.products.reduce(
      (sum, _, i) => sum + data.quantity[i] * data.value[i],
      0
    );

    y += 12;
    doc.text(`TOTAL: $${total}`, 10, y);
    y += 20;

    // ===== FOOTER BACKGROUND =====
    doc.setFillColor(255, 245, 204); // light yellow
    doc.rect(5, y - 5, pageWidth - 10, 25, "F");

    // ===== FOOTER TEXT =====
    doc.setFontSize(11);
    doc.text(data.footerNote, 10, y + 2);

    doc.setFontSize(9);
    doc.text(data.footerDisclaimer, 10, y + 10);

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
            Create Editable Template
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-10 text-sm max-w-5xl mx-auto">
          {/* HEADER SECTION (highlighted) */}
          <section className="border rounded-md bg-blue-50 p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-2">HEADER (Brand Area)</h3>
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
          </section>

          {/* COMPANY INFO */}
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

          {/* CUSTOMER INFO */}
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

          {/* DESCRIPTION */}
          <section className="border p-4 rounded-md">
            <h3 className="font-semibold">DESCRIPTION OF WORK</h3>
            <Textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              className="h-24 mt-3"
            />
          </section>

          {/* PRODUCTS */}
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

          {/* FOOTER SECTION (highlighted) */}
          <section className="border rounded-md bg-yellow-50 p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-2">FOOTER</h3>
            <Input
              value={data.footerNote}
              onChange={(e) => update("footerNote", e.target.value)}
            />
            <Textarea
              value={data.footerDisclaimer}
              onChange={(e) => update("footerDisclaimer", e.target.value)}
              className="mt-2"
            />
          </section>
        </div>

        {/* ACTION BUTTONS */}
        <SheetFooter className="mt-10 flex justify-center gap-4">
          {/* PREVIEW BUTTON */}
          <Dialog open={openPreview} onOpenChange={setOpenPreview}>
            <DialogTrigger asChild>
              <Button className="bg-gray-200 text-black px-6">Preview</Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Template Preview</DialogTitle>
              </DialogHeader>

              {/* PREVIEW CONTENT */}
              <div className="space-y-6 p-4 text-sm">
                {/* HEADER */}
                <div className="border bg-blue-50 p-4 rounded">
                  <h2 className="text-xl font-bold">{data.headerTitle}</h2>
                  <p>{data.headerSubtitle}</p>
                  <p>{data.headerAddress}</p>
                  <p>{data.headerPhone}</p>
                  <p>{data.headerEmail}</p>
                </div>

                <h2 className="text-2xl font-bold text-center">QUOTATION</h2>

                {/* COMPANY */}
                <div className="border p-4">
                  <h3 className="font-semibold">COMPANY INFO</h3>
                  <p>{data.title}</p>
                  <p>{data.address}</p>
                  <p>{data.city}</p>
                  <p>{data.phone}</p>
                  <p>{data.email}</p>
                </div>

                {/* CUSTOMER */}
                <div className="border p-4">
                  <h3 className="font-semibold">CUSTOMER INFO</h3>
                  <p>{data.customerName}</p>
                  <p>{data.customerAddress}</p>
                  <p>{data.customerEmail}</p>
                </div>

                {/* DESCRIPTION */}
                <div className="border p-4">
                  <h3 className="font-semibold">DESCRIPTION</h3>
                  <p>{data.description}</p>
                </div>

                {/* TABLE */}
                <div className="border p-4">
                  <h3 className="font-semibold">ITEMIZED COSTS</h3>
                  {data.products.map((p, i) => (
                    <p key={i}>
                      {p} — Qty: {data.quantity[i]} — Price: ${data.value[i]} —
                      Total: ${data.quantity[i] * data.value[i]}
                    </p>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="border bg-yellow-50 p-4 rounded">
                  <p>{data.footerNote}</p>
                  <p className="text-xs">{data.footerDisclaimer}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* DOWNLOAD BUTTON */}
          <Button
            className="bg-green-600 text-white px-8 py-3 text-lg"
            onClick={handlePDFDownload}
          >
            Download PDF
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
