"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { getProjects } from "@/app/service/projectService";
import { Project } from "@/app/admin/projects/typeProject";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch from live database service layer on initialization
  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        setLoading(true);
        // FIX: Destructure according to unified `{ success, data, error }` server layout
        const result = await getProjects();
        
        if (result?.success && Array.isArray(result.data)) {
          // Map MongoDB variant structures securely if needed (e.g. tracking MongoDB _id property fallbacks)
          const mappedProjects: Project[] = result.data.map((p: any) => ({
            id: p._id || p.id,
            title: p.title || "",
            desc: p.desc || "",
            img: p.img || "",
            category: p.category || "Uncategorized", // Safe default assignment
            tags: Array.isArray(p.tags) ? p.tags : [],
            repo: p.repo || ""
          }));
          setProjects(mappedProjects);
        } else {
          console.error("Backend failed to load items safely:", result?.error);
        }
      } catch (err: any) {
        console.error("Error loading portfolio projects:", err.message || err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveProjects();
  }, []);

  // Compute dynamic categories based on live loaded database elements
  // FIX: Protect runtime iteration from crash if a project document property lacks an explicit category value
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      projects.map((p) => p.category || "Uncategorized")
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [projects]);

  const filteredProjects = projects.filter((project) =>
    activeCategory === "All" ? true : (project.category || "Uncategorized") === activeCategory
  );

  // Clean, unobtrusive loading skeleton that retains your spacing alignment layout
  if (loading) {
    return (
      <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24 flex items-center justify-center">
        <p className="text-muted-foreground text-xs tracking-widest animate-pulse font-mono">
          FETCHING PORTFOLIO ENTRIES...
        </p>
      </main>
    );
  }

  return (
    <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl space-y-12">

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Selected <span className="text-primary">projects</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A small slice of recent work. Use the filters below to narrow by category.
          </p>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-card/40 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.title}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card/30 backdrop-blur-md overflow-hidden min-h-[380px] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card hover:shadow-xl"
            >
              {/* Graphic Header Thumbnail */}
              <div className="relative h-44 w-full bg-muted/20 border-b border-border/40 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                {project.img ? (
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    unoptimized={true} // Forces Next.js to skip image-optimization engine constraints completely
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => {
                      console.error("Failed to load image from URL:", project.img);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/10 text-muted-foreground/40 text-xs">
                    No Assets Loaded
                  </div>
                )}

                <span className="absolute top-3 right-3 z-20 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border text-primary">
                  {project.category}
                </span>
              </div>

              {/* Project Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {project.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/50 border border-border/50 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer / Links */}
              <div className="px-6 pb-6 pt-2 border-t border-border/20 flex items-center justify-between">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex gap-1.5 text-xs font-bold text-primary hover:underline group/link"
                  >
                    <FaGithub className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                    View Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No projects found matching the selected category filter yet!
          </div>
        )}
      </div>
    </main>
  );
}