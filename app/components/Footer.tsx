"use client";
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // Importing from Font Awesome subset

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/30 bg-background/50 backdrop-blur-sm transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-12 md:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        
        {/* Copyright Text */}
        <p>© 2026 Designed and developed by Sehar Ajmal</p>
        
        <div className="flex gap-6 text-sm font-medium">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors flex items-center gap-1.5 group"
          >
            <FaGithub className="h-4 w-4 transition-transform group-hover:scale-110" /> 
            GitHub
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors flex items-center gap-1.5 group"
          >
            <FaLinkedin className="h-4 w-4 transition-transform group-hover:scale-110" /> 
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}