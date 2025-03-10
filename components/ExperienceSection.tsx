"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const experiences = [
  {
    id: 1,
    role: "Senior Data Scientist and AI Architect",
    company: "Self Employed (Remote)",
    period: "08.2023 - till date",
    details: `• Created an AI platform for custom AI courses using AI agents.
• Developed a research tool leveraging multiple LLMs (Claude, Gemini, Deepseek, GPT, and LLaMA).
• Currently developing a tool to create web applications on Next.js via chat prompts.
• Integrated databases (NeonTech PostgreSQL via Drizzle ORM, S3 via Redshift) and vector DB with Pinecone.
• Conducting online tutoring in AI, Deep Learning, and Agent-based systems.`
  },
  {
  id: 2,
  role: "Senior Data Scientist",
  company: "Impulsive Web, Noida, India",
  period: "04.2021 - 04.2023",
  details: `• Led development of an AI-powered chatbot using ChatGPT 3.5 API, increasing customer engagement by 40% and streamlining solar energy production calculations and cost analysis.
• Implemented an end-to-end predictive maintenance solution using XGBoost, reducing equipment downtime by 30% and optimizing maintenance schedules across industrial facilities.
• Leveraged generative AI techniques to fine-tune chatbot responses, resulting in a 25% improvement in user satisfaction and a 15% increase in solar panel installation conversions.
• Spearheaded cross-functional team collaboration, integrating real-time data inputs and achieving 50% faster model deployment for both the chatbot and predictive maintenance systems.
• Coordinated with stakeholders to define project requirements and deliverables, enhancing project alignment with business goals.`
},
  {
    id: 3,
    role: "Data Scientist",
    company: "Blue Horse Analytics LLC, Sacramento, CA, USA",
    period: "07.2020 - 12.2020",
    details: `• Implemented a BERT-based sentiment analysis model, boosting customer satisfaction by 25%.
• Developed ML models to predict load delivery delays, reducing late deliveries by 30%.
• Led integration of AI-driven insights into business operations.`
  },
  {
    id: 4,
    role: "Data Scientist",
    company: "Trinity Software Inc., South Salem, NY, USA",
    period: "08.2019 - 06.2020",
    details: `• Implemented RFM analysis, increasing targeted intervention effectiveness by 35%.
• Developed a predictive analytics model for student dropout prevention with 85% accuracy.
• Created interactive dashboards for real-time student engagement analysis.`
  }
];

export default function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="experience"
      className="relative py-16 px-4 bg-gray-50 overflow-hidden"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 left-1/5 w-48 h-48 bg-accent-100/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-1/4 right-1/5 w-64 h-64 bg-primary-100/15 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
        >
          Experience
        </motion.h2>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-primary-50 hover:shadow-2xl transition-shadow"
            >
              <button
                onClick={() => toggleExpand(exp.id)}
                className="w-full text-left focus:outline-none"
                aria-expanded={expandedId === exp.id}
                aria-controls={`experience-details-${exp.id}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-600">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{exp.period}</span>
                    <motion.span
                      animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl text-gray-500"
                    >
                      &#9660;
                    </motion.span>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === exp.id && (
                  <motion.div
                    id={`experience-details-${exp.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="text-gray-700 whitespace-pre-wrap border-t pt-4">
                      {exp.details}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
