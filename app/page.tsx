"use client";
import { useState } from "react";
import Image from "next/image";
import Dock from "@/components/Dock";
import CommandPalette from "@/components/CommandPalette";
import TerminalAbout from "@/components/TerminalAbout";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import LeadershipWindow from "@/components/LeadershipWindow";
import ContactPanel from "@/components/ContactPanel";
import profile from "@/data/profile.json";

export default function Home() {
  const [open, setOpen] = useState<string | null>("about");

  return (
    <main className="min-h-dvh subtle-grid p-5 md:p-8">
      <CommandPalette onOpen={setOpen} />

      <section className="window mx-auto mb-6 max-w-6xl p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="relative mt-0.5 h-12 w-12 overflow-hidden rounded-full border border-border bg-white/5">
              <Image
                src={profile.avatar || "/avatar.jpg"}
                alt={`${profile.name} avatar`}
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="text-neon text-xs uppercase tracking-[0.2em]">
                Engineering Portfolio
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-white/95 md:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {profile.title} · {profile.location}
              </p>
              <p className="mt-2 text-sm text-white/75">{profile.headline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setOpen("projects")}
              className="rounded-lg border border-border bg-white/5 px-3 py-1.5 text-white/80 transition hover:bg-white/10"
            >
              View Projects
            </button>
            <button
              onClick={() => setOpen("experience")}
              className="rounded-lg border border-border bg-white/5 px-3 py-1.5 text-white/80 transition hover:bg-white/10"
            >
              View Experience
            </button>
            <button
              onClick={() => setOpen("contact")}
              className="rounded-lg border border-neon/40 bg-neon/10 px-3 py-1.5 text-neon transition hover:bg-neon/20"
            >
              Contact
            </button>
          </div>
        </div>
      </section>

      {/* Windows */}
      <div className="mx-auto grid max-w-6xl gap-6 pb-24">
        {open === "about" && <TerminalAbout onClose={() => setOpen(null)} />}
        {open === "experience" && (
          <ExperienceTimeline onClose={() => setOpen(null)} />
        )}
        {open === "projects" && (
          <ProjectsExplorer onClose={() => setOpen(null)} />
        )}
        {open === "leadership" && (
          <LeadershipWindow onClose={() => setOpen(null)} />
        )}
        {open === "contact" && <ContactPanel onClose={() => setOpen(null)} />}
      </div>

      <Dock onOpen={setOpen} />
    </main>
  );
}
