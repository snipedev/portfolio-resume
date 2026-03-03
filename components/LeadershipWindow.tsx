import Window from "./Window";
import leadership from "@/data/leadership.json";

type LeadershipData = {
  principles: string[];
  playbooks: Array<{
    name: string;
    steps: string[];
  }>;
};

export default function LeadershipWindow({
  onClose,
}: {
  onClose?: () => void;
}) {
  const { principles, playbooks } = leadership as LeadershipData;

  return (
    <Window title="Leadership OS" onClose={onClose}>
      <div className="space-y-6">
        <ul className="list-disc ml-6 text-sm text-white/80 space-y-2">
          {principles.map((principle, i) => (
            <li key={i}>{principle}</li>
          ))}
        </ul>

        <div className="grid gap-4 md:grid-cols-3">
          {playbooks.map((playbook) => (
            <section key={playbook.name} className="window p-3">
              <h4 className="text-sm font-semibold text-white/90">
                {playbook.name}
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-white/70">
                {playbook.steps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Window>
  );
}
