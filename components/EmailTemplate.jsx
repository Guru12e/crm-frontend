"use client";

import React, { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog_1"; // ShadCN Dialog
import {
  X,
  Minus,
  Maximize2,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";

// Toolbar button
const ToolbarButton = ({ children, onClick }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
  >
    {children}
  </button>
);

// Dropdown
const Dropdown = ({ options, onChange, value }) => (
  <div className="relative inline-block">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-transparent border border-gray-300 dark:border-gray-500 rounded px-2 py-1 pr-6 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
      <ChevronDown size={16} />
    </div>
  </div>
);

export default function ComposeDialog({ open, onOpenChange }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [subject, setSubject] = useState("");
  const [recipients, setRecipients] = useState({ to: "", cc: "", bcc: "" });
  const [fontSize, setFontSize] = useState("14px");

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleRecipientChange = (field, value) => {
    setRecipients((prev) => ({ ...prev, [field]: value }));
  };

  // FIX: wrap selection with span to persist styles
  const applyStyle = useCallback((command, value = null) => {
    if (!editorRef.current) return;
    if (command === "fontSize") {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = value;
      range.surroundContents(span);
    } else {
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  }, []);

  const handleFileAttach = () => fileInputRef.current?.click();
  const handleFileChange = (e) =>
    console.log(
      "Attached:",
      Array.from(e.target.files).map((f) => f.name)
    );

  // If minimized → show only a bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 bg-gray-800 text-white px-4 py-2 rounded-t-md shadow-lg flex items-center justify-between w-72">
        <span className="truncate text-sm">New Message</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="hover:opacity-75"
          >
            <Maximize2 size={16} />
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:opacity-75"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`fixed bottom-0 right-0 p-0 shadow-2xl rounded-t-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
          isMaximized
            ? "w-full h-full md:w-3/5 md:h-4/5"
            : "w-full md:w-[550px] h-[60vh] md:h-auto"
        }`}
        hideClose
      >
        {/* Header */}
        <DialogHeader className="bg-gray-600 dark:bg-gray-900 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
          <Label className="text-sm">New Message</Label>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Maximize2 size={16} />
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded"
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 py-1">
              <label className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                To
              </label>
              <input
                type="email"
                value={recipients.to}
                onChange={(e) => handleRecipientChange("to", e.target.value)}
                className="flex-grow focus:outline-none text-sm bg-transparent"
              />
            </div>
            <div className="flex items-center py-1">
              <label className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-grow focus:outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          <div
            ref={editorRef}
            contentEditable="true"
            className="flex-grow p-4 focus:outline-none overflow-y-auto text-sm"
            aria-label="Email body"
            style={{ fontSize }}
          ></div>

          {/* Footer / Toolbar */}
          <footer className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center space-x-1">
              <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm">
                Send
              </button>
              <div className="flex items-center ml-2 space-x-1">
                <Dropdown
                  options={[
                    { value: "12px", label: "Small" },
                    { value: "14px", label: "Normal" },
                    { value: "18px", label: "Large" },
                  ]}
                  onChange={(size) => {
                    setFontSize(size);
                    applyStyle("fontSize", size);
                  }}
                  value={fontSize}
                />
                <ToolbarButton onClick={() => applyStyle("bold")}>
                  <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={() => applyStyle("italic")}>
                  <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={() => applyStyle("underline")}>
                  <Underline size={18} />
                </ToolbarButton>
                <ToolbarButton onClick={handleFileAttach}>
                  <Paperclip size={18} />
                </ToolbarButton>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full">
              <Trash2 size={18} />
            </button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
