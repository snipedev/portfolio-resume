import Window from "./Window";
import experience from "@/data/experience.json";
import { motion } from "framer-motion";

type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  impact: string[];
  stack: string[];
};

export default function ExperienceTimeline({
  onClose,
}: {
  onClose?: () => void;
}) {
  const items = experience as ExperienceItem[];

  return (
    <Window title="Experience" onClose={onClose}>
      <motion.ol
        className="space-y-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {items.map((it, i) => (
          <motion.li
            key={i}
            className="pl-4 border-l border-border"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="text-white/90 font-medium">
              {it.role} · {it.company}
            </div>
            <div className="text-white/50 text-xs">{it.period}</div>
            <ul className="list-disc ml-5 text-sm text-white/80 mt-2 space-y-1">
              {it.impact.map((point, j) => (
                <li key={j}>{point}</li>
              ))}
            </ul>
            <p className="text-xs text-white/55 mt-3">
              Tech: {it.stack.join(" · ")}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </Window>
  );
}
