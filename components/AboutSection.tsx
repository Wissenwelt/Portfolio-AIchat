"use client";

import { motion } from "framer-motion";
import {  BrainCircuit, Rocket, Users } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 px-2 overflow-hidden"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-100/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-primary-100/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent text-center"
        >
          About Me
        </motion.h2>

        {/* "Passionate..." box with reduced height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          // Reduced padding from p-6 to p-4, and smaller icon to reduce box height
          className="p-2 mb-12 w-full bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl shadow-lg border border-primary-100 flex items-center justify-center space-x-4"
        >
          
          <p className="text-secondary-600">
            Passionate about building scalable AI solutions that solve real-world problems.{" "}
            
          </p>
        </motion.div>

        {/* Two-column grid (left: Intro + Stats, right: Core Expertise) */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-secondary-600 text-lg leading-relaxed bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-primary-50">
              I am a{" "}
              <span className="text-primary-600 font-semibold">
                Data Scientist
              </span>{" "}
              with a proven track record in developing cutting-edge AI solutions.
              With expertise in <span className="highlight-text">NLP</span>,{" "}
              <span className="highlight-text">LLMs</span>,{" "}
              <span className="highlight-text">Generative AI</span>, and deep
              learning, I build machine learning models that drive business
              value.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-primary-50 flex items-center space-x-3"
              >
                <Users className="w-10 h-10 text-accent-500" />
                <div>
                  <p className="text-xl font-bold text-primary-600">30+</p>
                  <p className="text-sm text-secondary-500">Projects Delivered</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-primary-50 flex items-center space-x-3"
              >
                <Rocket className="w-8 h-8 text-accent-500" />
                <div>
                  <p className="text-xl font-bold text-primary-600">10+</p>
                  <p className="text-sm text-secondary-500">Years Experience</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative group p-8 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-primary-50">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h3 className="flex items-center text-xl font-semibold mb-4 text-primary-600">
                  <BrainCircuit className="w-6 h-6 mr-2 text-accent-500" />
                  Core Expertise
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "NLP",
                    "LLMs",
                    "Generative AI",
                    "Deep Learning",
                    "Machine Learning",
                    "Team Leadership",
                  ].map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 bg-white rounded-lg shadow-sm text-secondary-600 border border-primary-50 hover:border-accent-300 transition-all"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
