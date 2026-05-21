"use client";
import React from "react";
import { FileText, Download, Eye, ExternalLink } from "lucide-react";

export default function ResumePage() {
  const resumePath = "/Sehar-Ajmal-Resume.pdf"; 

  return (
    <main className="grid-bg min-h-[calc(100vh-4rem)] px-6 py-6 sm:px-12 md:px-24 flex items-center justify-center">
      <div className="mx-auto max-w-3xl w-full flex flex-col items-center space-y-5">
        
        {/* Header Title Section */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Resume
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            My experience, on paper
          </h1>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="w-full rounded-3xl border border-border bg-card/40 backdrop-blur-md p-8 md:p-12 text-center shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-60 group-hover:bg-primary/20 transition-all duration-300" />
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-primary shadow-sm animate-float">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Download or View My Resume
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Click below to inspect my latest CV directly inside your web browser or grab a physical copy in standard PDF format.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md mx-auto">
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3.5 font-semibold text-foreground hover:bg-muted hover:text-primary hover:border-primary/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              <Eye className="h-4 w-4 shrink-0" />
              View in Browser
            </a>
            <a
              href={resumePath}
              download="Sehar-Ajmal-Resume.pdf"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-all duration-200 hover:opacity-95 hover:shadow-[0_0_20px_-5px_color-mix(in_oklch,var(--color-primary)_50%,transparent)] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 shrink-0" />
              Download CV
            </a>

          </div>
        </div>

      </div>
    </main>
  );
}