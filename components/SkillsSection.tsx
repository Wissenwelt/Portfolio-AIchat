"use client";

import { motion } from "framer-motion";
import { Code2, BrainCircuit, Cloud, Database, GitBranch, Rocket } from "lucide-react";

const skillCategories = [
  {
    title: "Core Technologies",
    icon: <Code2 className="w-6 h-6" />,
    items: ["Python", "R", "SQL", "HTML", "CSS", "JavaScript"]
  },
  {
    title: "AI/ML Expertise",
    icon: <BrainCircuit className="w-6 h-6" />,
    items: ["Machine Learning", "Deep Learning", "NLP", "LLM", "Generative AI", "MLOps"]
  },
  {
    title: "Frameworks & Libraries",
    icon: <Rocket className="w-6 h-6" />,
    items: ["TensorFlow", "Keras", "PyTorch", "scikit-learn", "Pandas", "Numpy", "Langchain", "Huggingface", "Next.js", "React", "Node.js"]
  },
  {
    title: "Cloud & DevOps",
    icon: <Cloud className="w-6 h-6" />,
    items: ["MS Azure", "AWS", "AWS SageMaker", "Azure DevOps", "Docker", "Kubernetes"]
  },
  {
    title: "Data & Tools",
    icon: <Database className="w-6 h-6" />,
    items: ["Postgres", "Airflow", "Github", "Data Analytics", "Data Visualization", "Data Mining"]
  },
  {
    title: "Leadership",
    icon: <GitBranch className="w-6 h-6" />,
    items: ["Team Leadership", "Project Management", "Mentorship"]
  }
];

export default function SkillsSection() {
  return (
    <section id="skills" className="relative py-20 px-4 overflow-hidden" suppressHydrationWarning>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-100/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary-100/15 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
        >
          Technical Arsenal
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-primary-50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-600">{category.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-3">
                {category.items.map((skill, skillIndex) => (
                  <motion.li
                    key={skill}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.1 + skillIndex * 0.05 }}
                    className="text-sm"
                  >
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-full px-4 py-2 border border-primary-100 hover:border-accent-300 transition-all cursor-default hover:scale-[1.02]">
                      {skill}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
