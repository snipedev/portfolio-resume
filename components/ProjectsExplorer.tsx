"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import projects from "@/data/projects.json";
import Window from "./Window";

type Project = {
  name: string;
  category: string;
  summary: string;
  highlights?: string[];
  links?: {
    repo?: string;
    demo?: string;
  };
  stack: string[];
};

type ProjectsPayload = {
  projects?: Project[];
  meta?: {
    source?: "github" | "fallback";
    username?: string;
    fetchedAt?: string;
    reason?: "missing-username" | "github-fetch-failed" | "no-curated-repos";
  };
};

function isValidExternalUrl(url?: string) {
  return Boolean(
    url?.startsWith("http") && !url.includes("<") && !url.includes(">"),
  );
}

export default function ProjectsExplorer({
  onClose,
}: {
  onClose?: () => void;
}) {
  const fallbackProjects = projects as Project[];
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"github" | "fallback">("fallback");
  const [sourceUsername, setSourceUsername] = useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = useState<
    "missing-username" | "github-fetch-failed" | "no-curated-repos" | null
  >(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ProjectsPayload;
        if (isMounted) {
          setSource(payload.meta?.source ?? "fallback");
          setSourceUsername(payload.meta?.username ?? null);
          setFallbackReason(payload.meta?.reason ?? null);
        }

        if (isMounted && payload.projects && payload.projects.length > 0) {
          setProjectList(payload.projects);
        }
      } catch {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Window title="Projects" onClose={onClose}>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <p className="text-white/55">
          {loading
            ? "Fetching latest repositories from GitHub…"
            : source === "github"
              ? `Live from GitHub${sourceUsername ? ` · @${sourceUsername}` : ""}`
              : "Using curated fallback projects"}
        </p>
        <span className="rounded-md border border-border bg-white/5 px-2 py-1 text-white/60">
          {source === "github" ? "Live" : "Fallback"}
        </span>
      </div>

      {!loading && source === "fallback" && (
        <p className="mb-3 text-xs text-amber-300/80">
          {fallbackReason === "missing-username" &&
            "GitHub username is not configured. Set GITHUB_USERNAME in .env.local or update data/profile.json links.github."}
          {fallbackReason === "github-fetch-failed" &&
            "GitHub API request failed (rate limit, token, or network). Showing fallback projects."}
          {fallbackReason === "no-curated-repos" &&
            "No eligible public repositories found after filters. Showing fallback projects."}
        </p>
      )}

      {projectList.length === 0 ? (
        <p className="text-sm text-white/65">No projects available yet.</p>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {projectList.map((project) => (
            <motion.article
              key={project.name}
              className="window p-4 space-y-3 transition hover:-translate-y-0.5"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileHover={{ y: -2 }}
            >
              <div>
                <p className="text-[11px] uppercase tracking-wide text-neon/80">
                  {project.category}
                </p>
                <h4 className="font-semibold text-white/95 mt-1 text-base">
                  {project.name}
                </h4>
              </div>
              <p className="text-white/70 text-sm leading-6">
                {project.summary}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <ul className="text-xs text-white/75 space-y-1.5">
                  {project.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-neon/80" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-white/5 px-2 py-1 text-[11px] text-white/65"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                {isValidExternalUrl(project.links?.repo) && (
                  <a
                    href={project.links?.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-border bg-white/5 px-2.5 py-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    Repository
                  </a>
                )}
                {isValidExternalUrl(project.links?.demo) && (
                  <a
                    href={project.links?.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-neon/40 bg-neon/10 px-2.5 py-1.5 text-neon transition hover:bg-neon/20"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </Window>
  );
}
