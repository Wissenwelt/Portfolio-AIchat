"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Code, Rocket, BrainCircuit, GitBranch, Cloud, Database } from "lucide-react";

export default function HomeSection() {
  // State for random “particles” with explicit type
  const [particles, setParticles] = useState<{ left: number; top: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate random particle positions
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setParticles(generatedParticles);
  }, []);

  // Floating animation variant
  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Tech stack data
  const techStack = [
    { name: "LLMs", icon: <BrainCircuit className="w-5 h-5" /> },
    { name: "Python", icon: <Code className="w-5 h-5" /> },
    { name: "AWS", icon: <Cloud className="w-5 h-5" /> },
    { name: "NLP", icon: <GitBranch className="w-5 h-5" /> },
    { name: "MLOps", icon: <Database className="w-5 h-5" /> },
    { name: "AI", icon: <Rocket className="w-5 h-5" /> },
  ];

  return (
    <section
      id="home"
      className="
        relative 
        min-h-screen 
        flex 
        flex-col 
        justify-center 
        items-center 
        pt-0
        md:pt-0 
        overflow-hidden
      "
      suppressHydrationWarning
    >
      {/* Background accent circles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute -top-24 -left-16 w-80 h-80 bg-accent-100/20 rounded-full blur-[120px] animate-float"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-1/4 left-1/4 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-accent-100/20 rounded-full blur-[100px] animate-float"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-primary-100/15 rounded-full blur-[80px] animate-float-delayed"
        />

        {/* Floating particles */}
        {particles.map((particle, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: particle.scale }}
            variants={floatingVariants}
            animate="float"
            className="absolute w-2 h-2 bg-accent-500/30 rounded-full"
            style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 max-w-7xl w-full px-4 relative z-10">
        {/* Profile image and title */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative group flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-spin-slow opacity-30 blur-[60px] group-hover:opacity-50 transition-opacity" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/MyImage.jpg"
            alt="Profile"
            className="w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 rounded-full object-cover shadow-2xl border-4 border-primary-100/50 hover:border-accent-300/70 transition-all duration-500 group-hover:scale-105"
          />
          {/* Senior Data Scientist text below the image */}
          <div className="absolute -inset-4 rounded-full border-2 border-accent-500/30 animate-border-rotate opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        {/* Hero text content with integrated tech stack badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center md:text-left space-y-4 flex-1 mt-8 md:mt-0 md:ml-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-6 h-40 sm:h-56 md:h-60 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl shadow-lg border border-primary-100 flex flex-col items-start justify-center"
          >
            <motion.h2
              whileHover={{ scale: 1.05 }}
              className="text-3xl sm:text-4xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
            >
              Hello! I&apos;m Vijendra Singh
            </motion.h2>
            <span className="text-primary-600 text-md font-medium mt-3">
              Senior Data Scientist & AI Architect
            </span>
            <span className="text-primary-600 text-sm font-medium mt-3">
              Transforming Data Into Intelligent Solutions: Bridging advanced GenAI techniques & business.
            </span>
            {/* Tech stack badges inserted inside the same box with increased spacing */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-secondary-600 border border-primary-100 hover:border-accent-300 transition-all"
                >
                  {tech.icon}
                  <span className="text-xs sm:text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
      >
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 sm:h-16 bg-gradient-to-b from-primary-500 to-transparent"
        />
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs sm:text-sm text-secondary-500 font-medium tracking-wide"
        >
          Explore My Journey
        </motion.span>
      </motion.div>
    </section>
  );
}
