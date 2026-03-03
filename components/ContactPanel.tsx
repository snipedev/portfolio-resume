import Window from "./Window";
import profile from "@/data/profile.json";
import { FileText, Github, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

function hasHttpUrl(value: string) {
  return (
    value.startsWith("http") && !value.includes("<") && !value.includes(">")
  );
}

function getPhoneNumber(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("<") || trimmed.includes(">")) {
    return null;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    return null;
  }

  return { display: trimmed, href: `tel:${digits}` };
}

export default function ContactPanel({ onClose }: { onClose?: () => void }) {
  const links = profile.links;
  const phone = getPhoneNumber(profile.contactnumber);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Window title="Contact" onClose={onClose}>
      <motion.div
        className="space-y-3 text-sm"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex items-start gap-2"
          variants={rowVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ x: 2 }}
        >
          <Mail size={16} className="mt-0.5 text-white/60" />
          <p>
            Email:{" "}
            {profile.email.includes("<") ? (
              <span className="text-white/55">
                Add your email in data/profile.json
              </span>
            ) : (
              <a
                className="text-neon hover:underline"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            )}
          </p>
        </motion.div>

        <motion.div
          className="flex items-start gap-2"
          variants={rowVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ x: 2 }}
        >
          <Phone size={16} className="mt-0.5 text-white/60" />
          <p>
            Contact number:{" "}
            {!phone ? (
              <span className="text-white/55">
                Add your phone number in data/profile.json
              </span>
            ) : (
              <a className="text-neon hover:underline" href={phone.href}>
                {phone.display}
              </a>
            )}
          </p>
        </motion.div>

        <motion.div
          className="flex items-start gap-2"
          variants={rowVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ x: 2 }}
        >
          <Linkedin size={16} className="mt-0.5 text-white/60" />
          <p>
            LinkedIn:{" "}
            {hasHttpUrl(links.linkedin) ? (
              <a
                className="text-neon hover:underline"
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {links.linkedin}
              </a>
            ) : (
              <span className="text-white/55">
                Add your LinkedIn URL in data/profile.json
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          className="flex items-start gap-2"
          variants={rowVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ x: 2 }}
        >
          <Github size={16} className="mt-0.5 text-white/60" />
          <p>
            GitHub:{" "}
            {hasHttpUrl(links.github) ? (
              <a
                className="text-neon hover:underline"
                href={links.github}
                target="_blank"
                rel="noreferrer"
              >
                {links.github}
              </a>
            ) : (
              <span className="text-white/55">
                Add your GitHub URL in data/profile.json
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          className="flex items-start gap-2"
          variants={rowVariants}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ x: 2 }}
        >
          <FileText size={16} className="mt-0.5 text-white/60" />
          <p>
            Resume:{" "}
            <a
              className="text-neon hover:underline"
              href={links.resume}
              target="_blank"
              rel="noreferrer"
            >
              Open resume
            </a>
          </p>
        </motion.div>
      </motion.div>
    </Window>
  );
}
