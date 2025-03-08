"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  // Initialize state: false on both server and client.
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handler checks window.scrollY and updates isScrolled.
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position (in case page is loaded scrolled)
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      suppressHydrationWarning
      className={`fixed top-0 left-0 right-0 flex justify-between items-center 
      bg-neutral-50/95 backdrop-blur-xl transition-all duration-300 
      ${isScrolled ? "shadow-lg py-3" : "shadow-sm py-4"} 
      border-b border-primary-100/30 px-6 z-50`}
    >
      {/* Logo Section with Hover Animation */}
      <div className="flex items-center group">
        <div className="transition-all duration-300 group-hover:scale-105">
          <Image
            src="/logo.svg"
            alt="VSM Logo"
            width={55}
            height={55}
            className="transition-transform duration-300 hover:rotate-[-8deg]"
          />
        </div>
        <span
          className="ml-3 font-bold text-md bg-gradient-to-r from-primary-600 to-accent-500 
          bg-clip-text text-transparent transition-all duration-500 hover:tracking-wider"
        >
          Welcome! Engage with Archie (AI) for smart, witty conversation.
        </span>
      </div>

      {/* Navigation Links with Animated Underline */}
      <nav className="flex space-x-8">
        {["Home", "About", "Skills", "Experience", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="relative px-2 py-1.5 text-secondary-600 hover:text-primary-500 
              transition-all duration-300 group"
          >
            {item}
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-400 
              transition-all duration-300 group-hover:w-full"
            ></span>
          </a>
        ))}
      </nav>
    </header>
  );
}
