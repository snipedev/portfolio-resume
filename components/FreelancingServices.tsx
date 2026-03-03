"use client";

import { Mail, Check } from "lucide-react";
import Window from "@/components/Window";
import FreelancingInquiryForm from "@/components/FreelancingInquiryForm";
import freelancing from "@/data/freelancing.json";

export default function FreelancingServices({
  onClose,
}: {
  onClose?: () => void;
}) {
  return (
    <Window title="Freelancing Services" onClose={onClose}>
      <div className="space-y-6">
        {/* Headline */}
        <div>
          <h2 className="text-lg font-semibold text-neon">
            {freelancing.headline}
          </h2>
          <p className="mt-2 text-sm text-white/70">{freelancing.intro}</p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {freelancing.services.map((service, idx) => (
            <div
              key={idx}
              className="group rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-neon/50 hover:bg-white/10"
            >
              <h3 className="text-sm font-semibold text-white/90">
                {service.title}
              </h3>
              <p className="mt-2 text-xs text-white/60">
                {service.description}
              </p>

              {/* Highlights */}
              <div className="mt-3 space-y-1">
                {service.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-white/50"
                  >
                    <Check size={12} className="text-neon/70" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="mt-3 flex flex-wrap gap-1">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-neon/10 px-2 py-0.5 text-xs text-neon/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Experience & Availability */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white/90">Experience</h4>
            <p className="mt-2 text-xs text-white/70">
              {freelancing.workExperience}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-semibold text-white/90">
              Availability
            </h4>
            <p className="mt-2 text-xs text-white/70">
              {freelancing.availability}
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="rounded-lg border border-neon/30 bg-neon/5 p-4">
          <FreelancingInquiryForm />
        </div>

        {/* Alternative Contact */}
        <div className="text-center">
          <p className="text-xs text-white/60 mb-3">Prefer direct email?</p>
          <a
            href={`mailto:${freelancing.cta.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
          >
            <Mail size={14} />
            {freelancing.cta.email}
          </a>
        </div>

        {/* Testimonial-style note */}
        <div className="rounded-lg border-l-2 border-neon/50 bg-white/5 p-4 text-xs text-white/70">
          <p className="italic">
            "I focus on building systems that solve real problems. If you need a
            partner who understands both the technical challenges and business
            goals, let's talk."
          </p>
        </div>
      </div>
    </Window>
  );
}
