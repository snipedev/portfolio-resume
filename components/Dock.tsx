import { User, Briefcase, FolderTree, ShieldCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Dock({ onOpen }: { onOpen: (id: string) => void }) {
  const items = [
    { id: "about", icon: <User />, label: "About" },
    { id: "experience", icon: <Briefcase />, label: "Experience" },
    { id: "projects", icon: <FolderTree />, label: "Projects" },
    { id: "leadership", icon: <ShieldCheck />, label: "Leadership" },
    { id: "contact", icon: <Mail />, label: "Contact" },
  ];
  return (
    <nav className="dock">
      {items.map((it) => (
        <motion.button
          key={it.id}
          onClick={() => onOpen(it.id)}
          title={it.label}
          className="group size-12 grid place-items-center rounded-xl bg-white/5 hover:bg-white/10 border border-border transition hover:-translate-y-0.5"
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        >
          <span className="text-white/75 group-hover:text-white transition">
            {it.icon}
          </span>
        </motion.button>
      ))}
    </nav>
  );
}
