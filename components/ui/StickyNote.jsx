"use client";

import * as React from "react";
import { FaThumbtack, FaPaperPlane } from "react-icons/fa6";
import { clsx } from "clsx";

const cornerColorVariants = {
  "bg-blue-200": "border-l-blue-300 border-t-blue-300",
  "bg-yellow-200": "border-l-yellow-300 border-t-yellow-300",
  "bg-pink-200": "border-l-pink-300 border-t-pink-300",
  "bg-green-200": "border-l-green-300 border-t-green-300",
  "bg-purple-200": "border-l-purple-300 border-t-purple-300",
};

const StickyNote = React.forwardRef(
  (
    {
      className,
      children,
      color = "bg-blue-200",
      rotation = "-rotate-3",
      ...props
    },
    ref
  ) => {
    const [over, setOver] = React.useState(false);

    return (
      <div
        ref={ref}
        className={clsx(
          "relative w-64 h-48 p-6 shadow-lg text-slate-800",
          "transition-all duration-150 ease-in-out",
          "hover:scale-105 hover:rotate-0 hover:shadow-xl hover:z-10",
          "font-marker bg-paper",
          color,
          rotation,
          className
        )}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        {...props}
      >
        <div className="absolute top-2.5 left-2.5 flex gap-2 text-slate-400">
          <FaThumbtack
            size={20}
            className="transform group-hover:rotate-12 transition-transform"
          />
        </div>

        <div className="absolute top-2.5 right-2.5 text-slate-400">
          <FaPaperPlane size={20} />
        </div>

        <div className="h-full break-words mt-5 text-xl leading-relaxed underline decoration-slate-800/40 decoration-2 dark:decoration-white/40 text-slate-800 dark:text-white">
          {children}
        </div>

        <div
          className={clsx(
            "absolute bottom-0 right-0 w-5 h-5 border-l-16 border-t-16 border-b-16 border-r-16 ",

            "border-l-blue-300 border-t-blue-300 dark:border-l-blue-700 dark:border-t-blue-700",
            "transition-all duration-700 ease-in-out transform",
            over
              ? "translate-x-2 translate-y-2 opacity-0 scale-75"
              : "translate-x-0 translate-y-0 opacity-100 scale-100"
          )}
        />
      </div>
    );
  }
);

StickyNote.displayName = "StickyNote";

export { StickyNote };
