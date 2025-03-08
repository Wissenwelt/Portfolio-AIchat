"use client";

import { Linkedin, Instagram, Twitter, Github, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer
      suppressHydrationWarning
      className="bg-gradient-to-r from-primary-500 to-accent-500 py-6 border-t border-gray-700"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center px-4">
        <p className="text-sm text-white text-center">
          © {new Date().getFullYear()} Vijendra Singh Malik. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4">
          <a
            href="https://www.linkedin.com/in/vijendramalik/"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white hover:text-gray-300 transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/_vijendrasinghmalik?igsh=NTR5YnBwZ2F2a3g3&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white hover:text-gray-300 transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/vijendrasmalik?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white hover:text-gray-300 transition-colors"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://medium.com/@malikvijendrasingh"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white hover:text-gray-300 transition-colors"
          >
            <BookOpen className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/Wissenwelt"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline text-white hover:text-gray-300 transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
