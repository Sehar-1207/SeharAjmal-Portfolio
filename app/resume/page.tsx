"use client";

import React from "react";
import { FileText, Download, Eye } from "lucide-react";

export default function ResumePage() {
  const resumePath = "/resume.pdf";

  const handleViewResume = () => {
    const newTab = window.open("", "_blank");

    if (newTab) {
      newTab.location.href = resumePath;
    }
  };

  return (
    <main className="grid-bg flex-grow flex items-center justify-center sm:p-3 md:p-9">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-7">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Resume
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            My experience, on paper
          </h1>

          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="w-full max-w-md rounded-3xl border border-border bg-card/40 backdrop-blur-md p-6 sm:p-10 text-center shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-60" />

          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-primary shadow-sm">
            <FileText className="h-8 w-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Download or View My Resume
          </h2>

          <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2 leading-relaxed">
            Click below to inspect my latest CV directly inside your web browser
            or grab a physical copy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full">
            {/* View Button */}
            <button
              type="button"
              onClick={handleViewResume}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 font-semibold text-foreground hover:bg-muted transition-all duration-200 active:scale-[0.98]"
            >
              <Eye className="h-4 w-4" />
              View
            </button>

            {/* Download Button */}
            <a
              href={resumePath}
              download="Sehar-Ajmal-Resume.pdf"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all duration-200 hover:opacity-95 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}