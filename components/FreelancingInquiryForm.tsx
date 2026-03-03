"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import freelancing from "@/data/freelancing.json";

export default function FreelancingInquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectDescription: "",
    servicesInterested: [] as string[],
    budgetRange: "",
    timeline: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const serviceOptions = freelancing.services.map((s) => s.title);
  const budgetRanges = [
    "$5k - $10k",
    "$10k - $25k",
    "$25k - $50k",
    "$50k - $100k",
    "$100k+",
  ];
  const timelineOptions = [
    "ASAP (1-2 weeks)",
    "1-2 months",
    "2-3 months",
    "3-6 months",
    "Flexible",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesInterested: prev.servicesInterested.includes(service)
        ? prev.servicesInterested.filter((s) => s !== service)
        : [...prev.servicesInterested, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/freelancing/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Inquiry submitted successfully!");
        setFormData({
          name: "",
          email: "",
          company: "",
          projectDescription: "",
          servicesInterested: [],
          budgetRange: "",
          timeline: "",
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to submit inquiry");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "Unable to submit via form (Supabase connection issue). Please email: anuragmishra.dev@gmail.com",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white/90 mb-3">
          Tell me about your project
        </h3>
        <p className="text-xs text-white/60 mb-4">
          Fill out the form below and I'll get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 transition focus:border-neon/50 focus:outline-none focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 transition focus:border-neon/50 focus:outline-none focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 transition focus:border-neon/50 focus:outline-none focus:bg-white/10"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Project Description *
          </label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            required
            placeholder="Tell me about your project, goals, and challenges..."
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/40 transition focus:border-neon/50 focus:outline-none focus:bg-white/10 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-2">
            Services Interested In
          </label>
          <div className="space-y-2">
            {serviceOptions.map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.servicesInterested.includes(service)}
                  onChange={() => handleCheckbox(service)}
                  className="w-3.5 h-3.5 rounded border border-white/20 bg-white/5 text-neon accent-neon cursor-pointer"
                />
                <span className="text-xs text-white/70">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Budget Range
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition focus:border-neon/50 focus:outline-none focus:bg-white/10 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-white">
              Select budget range...
            </option>
            {budgetRanges.map((range) => (
              <option
                key={range}
                value={range}
                className="bg-gray-900 text-white"
              >
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Timeline
          </label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition focus:border-neon/50 focus:outline-none focus:bg-white/10 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-white">
              Select timeline...
            </option>
            {timelineOptions.map((time) => (
              <option
                key={time}
                value={time}
                className="bg-gray-900 text-white"
              >
                {time}
              </option>
            ))}
          </select>
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
            <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
            <p className="text-xs text-green-300">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-neon/40 bg-neon/20 px-4 py-2.5 text-xs font-medium text-neon transition hover:bg-neon/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 rounded-full border border-neon/50 border-t-neon animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={14} />
              Submit Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
