"use client";

import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("resumes")
          .select("file_url")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code !== "PGRST116") { 
            console.error("Error fetching latest resume:", error.message);
          }
        } else if (data) {
          setResumeUrl(data.file_url);
        }
      } catch (err) {
        console.error("Unexpected error fetching resume asset:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResume();
  }, []);

  return (
    <main className="grid-bg min-h-[calc(100vh-3rem)] flex-grow flex items-center justify-center p-4 sm:p-6 md:p-9">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4 sm:space-y-5">
        
        <div className="text-center space-y-1.5 px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
            Resume
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            My experience, on paper
          </h1>
          <div className="mx-auto h-1 w-12 sm:w-16 bg-primary rounded-full mt-2" />
        </div>

        {/* Card Frame */}
        <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-border bg-card/40 backdrop-blur-md p-6 sm:p-10 text-center shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

          {/* Centered Status Icon Box */}
          <div className="relative mx-auto mb-5 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-accent/10 border border-accent/20 text-primary shadow-sm">
            {loading ? (
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary/70" />
            ) : (
              <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">
            Download or View My Resume
          </h2>

          <p className="text-muted-foreground text-xs sm:text-sm max-w-xs mx-auto mt-2 leading-relaxed px-1">
            {loading 
              ? "Retrieving latest cloud storage configurations..." 
              : !resumeUrl 
              ? "No resume has been uploaded yet. Check back soon!" 
              : "Inspect my latest CV directly inside your web browser or save a local copy."
            }
          </p>

          {/* Action Interface Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8 w-full">
            
            {/* View Link Component - Uses standard secure target anchor for cleaner mobile context switching */}
            <a
              href={resumeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!resumeUrl || loading) e.preventDefault(); }}
              className={`w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all duration-200 active:scale-[0.98] ${
                (loading || !resumeUrl) ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <Eye className="h-4 w-4 shrink-0" />
              View
            </a>

            {/* Download Link Component */}
            <a
              href={resumeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { if (!resumeUrl || loading) e.preventDefault(); }}
              className={`w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-95 active:scale-[0.98] ${
                (loading || !resumeUrl) ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              <Download className="h-4 w-4 shrink-0" />
              Download
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}