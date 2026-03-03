"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function Window({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <motion.section
      className="window p-4 md:p-5"
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <header className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-neon/90" />
          <h3 className="text-sm font-semibold tracking-wide text-white/85">
            {title}
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md border border-border p-1 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label={`Close ${title}`}
          >
            <X size={14} />
          </button>
        )}
      </header>
      <div className="pt-4">{children}</div>
    </motion.section>
  );
}
