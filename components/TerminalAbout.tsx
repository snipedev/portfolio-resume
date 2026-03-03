import Window from "./Window";
import profile from "@/data/profile.json";

export default function TerminalAbout({ onClose }: { onClose?: () => void }) {
  return (
    <Window title=">_ whoami" onClose={onClose}>
      <pre className="text-white/80 text-sm leading-7 whitespace-pre-wrap">
        {`> whoami\n  ${profile.name} — ${profile.title}.\n\n> location\n  ${profile.location}\n\n> mission\n  ${profile.headline}\n\n> bio\n  ${profile.bio}`}
      </pre>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {profile.quickStats.map((stat) => (
          <div key={stat.label} className="window p-3">
            <p className="text-xs text-white/55 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-xl font-semibold text-white/95 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </Window>
  );
}
