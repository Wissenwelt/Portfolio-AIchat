"use client";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ExperienceSection from "@/components/ExperienceSection";
import HomeSection from "@/components/HomeSection";
import SkillsSection from "@/components/SkillsSection";

export default function HomePage() {
  return (
    <>
      <HomeSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
