import staticProjects from "@/data/projects.json";
import profile from "@/data/profile.json";

export type PortfolioProject = {
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

export type ProjectsPayload = {
  projects: PortfolioProject[];
  meta: {
    source: "github" | "fallback";
    username?: string;
    fetchedAt: string;
    reason?: "missing-username" | "github-fetch-failed" | "no-curated-repos";
  };
};

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  archived: boolean;
  fork: boolean;
  updated_at: string;
  pushed_at: string;
  private?: boolean;
};

export function getFallbackProjects(): PortfolioProject[] {
  return staticProjects as PortfolioProject[];
}

function parseRepoListEnv(
  name: "GITHUB_FEATURED_REPOS" | "GITHUB_EXCLUDED_REPOS",
): Set<string> {
  const value = process.env[name]?.trim();
  if (!value) {
    return new Set();
  }

  return new Set(
    value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function parseGitHubUsername(): string | null {
  const envUsername = process.env.GITHUB_USERNAME?.trim();
  if (envUsername) {
    return envUsername;
  }

  const profileGitHub = profile.links?.github?.trim();
  if (
    !profileGitHub ||
    profileGitHub.includes("<") ||
    profileGitHub.includes(">")
  ) {
    return null;
  }

  try {
    const url = new URL(profileGitHub);
    if (!url.hostname.includes("github.com")) {
      return null;
    }

    const firstPathSegment = url.pathname.split("/").filter(Boolean)[0];
    return firstPathSegment || null;
  } catch {
    return null;
  }
}

function buildCategory(repo: GitHubRepo): string {
  if (
    repo.topics?.includes("systems") ||
    repo.topics?.includes("kafka") ||
    repo.topics?.includes("microservices")
  ) {
    return "Systems Design";
  }
  if (
    repo.topics?.includes("nextjs") ||
    repo.topics?.includes("react") ||
    repo.topics?.includes("frontend")
  ) {
    return "Web Platform";
  }
  if (
    repo.topics?.includes("devops") ||
    repo.topics?.includes("kubernetes") ||
    repo.topics?.includes("terraform")
  ) {
    return "Infrastructure";
  }
  return repo.language ? `${repo.language} Project` : "Software Project";
}

function normalizeTopic(topic: string): string {
  return topic
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function cleanSummary(description: string | null): string {
  const fallback =
    "Repository showcasing engineering work and implementation details.";
  const value = description?.trim();
  if (!value) {
    return fallback;
  }

  if (value.length <= 170) {
    return value;
  }

  return `${value.slice(0, 167).trimEnd()}...`;
}

function buildHighlights(repo: GitHubRepo): string[] {
  const topicHighlights = (repo.topics ?? []).slice(0, 3).map(normalizeTopic);

  if (topicHighlights.length > 0) {
    return topicHighlights;
  }

  return [
    `Updated ${new Date(repo.updated_at).toLocaleDateString("en-IN")}`,
    `${repo.stargazers_count} stars on GitHub`,
  ];
}

function buildStack(repo: GitHubRepo): string[] {
  const stack = new Set<string>();
  if (repo.language) {
    stack.add(repo.language);
  }
  for (const topic of repo.topics ?? []) {
    if (stack.size >= 5) {
      break;
    }
    stack.add(normalizeTopic(topic));
  }

  return Array.from(stack).slice(0, 6);
}

function mapRepoToProject(repo: GitHubRepo): PortfolioProject {
  const summary = cleanSummary(repo.description);

  return {
    name: repo.name,
    category: buildCategory(repo),
    summary,
    highlights: buildHighlights(repo),
    links: {
      repo: repo.html_url,
      demo:
        repo.homepage && repo.homepage.startsWith("http")
          ? repo.homepage
          : undefined,
    },
    stack: buildStack(repo),
  };
}

function computeRepoScore(repo: GitHubRepo): number {
  const topicWeight = Math.min((repo.topics?.length ?? 0) * 2, 10);
  const starsWeight = Math.min(repo.stargazers_count, 40);
  const homepageWeight = repo.homepage?.startsWith("http") ? 12 : 0;
  const hasDescriptionWeight = repo.description ? 8 : 0;
  const freshnessDays = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const freshnessWeight = Math.max(0, 20 - Math.min(freshnessDays, 20));

  return (
    topicWeight +
    starsWeight +
    homepageWeight +
    hasDescriptionWeight +
    freshnessWeight
  );
}

export async function getProjectsPayload(): Promise<ProjectsPayload> {
  const username = parseGitHubUsername();
  if (!username) {
    return {
      projects: getFallbackProjects(),
      meta: {
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        reason: "missing-username",
      },
    };
  }

  const featuredRepos = parseRepoListEnv("GITHUB_FEATURED_REPOS");
  const excludedRepos = parseRepoListEnv("GITHUB_EXCLUDED_REPOS");

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-os",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    {
      headers,
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    return {
      projects: getFallbackProjects(),
      meta: {
        source: "fallback",
        username,
        fetchedAt: new Date().toISOString(),
        reason: "github-fetch-failed",
      },
    };
  }

  const repos = (await response.json()) as GitHubRepo[];
  const curatedRepos = repos
    .filter((repo) => !repo.archived && !repo.fork && !repo.private)
    .filter((repo) => !excludedRepos.has(repo.name.toLowerCase()))
    .sort((left, right) => {
      const leftFeatured = featuredRepos.has(left.name.toLowerCase()) ? 1 : 0;
      const rightFeatured = featuredRepos.has(right.name.toLowerCase()) ? 1 : 0;
      if (leftFeatured !== rightFeatured) {
        return rightFeatured - leftFeatured;
      }

      return computeRepoScore(right) - computeRepoScore(left);
    })
    .slice(0, 8);

  const mapped = curatedRepos
    .map(mapRepoToProject)
    .filter((project) => project.name && project.summary);

  if (mapped.length === 0) {
    return {
      projects: getFallbackProjects(),
      meta: {
        source: "fallback",
        username,
        fetchedAt: new Date().toISOString(),
        reason: "no-curated-repos",
      },
    };
  }

  return {
    projects: mapped,
    meta: {
      source: "github",
      username,
      fetchedAt: new Date().toISOString(),
    },
  };
}
