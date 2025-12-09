"use client";

import TemplateCreator from "@/components/TemplateCreator";

export default function PricingPage() {
  return (
    <div className="w-full min-h-[70vh] relative p-4">
      <h1 className="text-3xl font-bold mb-2">Pricing Manager</h1>
      <p className="text-slate-500 mb-8">
        Create and manage quote templates for your deals.
      </p>

      <div className="w-full mb-8 rounded-xl p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm min-h-[400px]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-3">Quote Templates</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Create professional quote templates with customizable headers, product details, and branding.
            Save templates for reuse across multiple deals.
          </p>
        </div>
        
        <TemplateCreator />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">📋 Pricing Details</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage pricing, discounts, and quantities for your deals
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">⚙️ Configure Products</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customize product options and configurations for each deal
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-2">📄 Preview Quote</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generate and preview professional quote PDFs
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Use the sidebar to navigate to Pricing Details, Configure Products, or Preview Quote pages
        </p>
      </div>
    </div>
  );
}
