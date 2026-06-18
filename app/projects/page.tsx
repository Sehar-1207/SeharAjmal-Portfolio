"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FaGithub, FaTimes, FaSearchPlus } from "react-icons/fa";
import { getProjects } from "../service/projectService";
import { Project } from "@/app/admin/projects/typeProject"; 
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveProjects() {
      try {
        const res = await getProjects();
        
        if (res && res.success && Array.isArray(res.data)) {
          const mappedProjects: Project[] = res.data.map((p: any) => {
            return {
              id: p._id || p.id,
              title: p.title || "Untitled Project",
              desc: p.description || p.desc || p.projectDescription || "",
              tags: Array.isArray(p.tags) ? p.tags : [],
              img: p.image?.url || p.img || p.imageUrl || "",
              publicId: p.image?.publicId || p.publicId || "",
              repo: p.githubLink || p.repo || p.github || "",
              projectLink: p.projectLink || p.liveLink || p.link || "",
              category: p.category || "uncategorized",
              order: p.order ?? 0,
              created_at: p.created_at || p.createdAt || "",
            };
          });

          mappedProjects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setProjects(mappedProjects);
        } else {
          console.error("Backend response structure mismatch or success flag missing:", res);
        }
      } catch (err: any) {
        console.error("Error loading portfolio projects:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveProjects();
  }, []);

  const categories = useMemo(() => {
    const rawCategories = projects.map((p) => p.category);
    return ["All", ...new Set(rawCategories)];
  }, [projects]);

  const filteredProjects = projects.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

  const formatCategoryLabel = (cat: string) => {
    if (!cat) return "";
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <main className="grid-bg min-h-screen px-6 py-16 flex items-center justify-center">
        <p className="text-muted-foreground text-xs tracking-widest animate-pulse font-mono">
          FETCHING PORTFOLIO ENTRIES...
        </p>
      </main>
    );
  }

  return (
    <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl space-y-12">

        {/* Title Area */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
           <span className="text-primary">Projects</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A showcase of live developments pulled straight from the server database.
          </p>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-card/40 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {category === "All" ? "All" : formatCategoryLabel(category)}
              </button>
            );
          })}
        </div>

        {/* Grid Matrix Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.title}
              className="group flex flex-col justify-between rounded-[32px] border border-border bg-[#edf9f9]/40 dark:bg-card/30 backdrop-blur-md overflow-hidden min-h-[460px] transition-all duration-300 hover:shadow-xl hover:bg-white dark:hover:bg-card hover:border-primary/40"
            >
              {/* Image Header Section */}
              <div 
                onClick={() => project.img && setSelectedImage(project.img)}
                className={`relative h-56 w-full bg-slate-100 dark:bg-muted/10 border-b border-border/40 overflow-hidden flex items-center justify-center group/img ${project.img ? 'cursor-pointer' : ''}`}
              >
                {project.img ? (
                  <>
                    <Image
                      src={project.img}
                      alt={project.title}
                      fill
                      unoptimized={true}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    
                    {/* Magnifying Glass Hover Layer */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]">
                      <div className="bg-slate-900/90 text-white rounded-full p-3.5 shadow-xl border border-white/10">
                        <FaSearchPlus className="h-5 w-5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-medium text-xs font-mono uppercase tracking-wider">
                    No Assets Loaded
                  </div>
                )}
              </div>

              {/* Title & Technical Content Block */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  
                  {/* Row containing Title ONLY (Removed duplicate badge container entirely) */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-extrabold text-[#092a35] dark:text-foreground tracking-tight group-hover:text-primary transition-colors capitalize">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-slate-500 dark:text-muted-foreground text-sm font-medium leading-relaxed line-clamp-3">
                    {project.desc || "MERN stack project"}
                  </p>
                </div>

                {/* Tech Stack Tags Loop */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-xl bg-[#edf9f9] dark:bg-primary/10 text-[#1da1a1] dark:text-primary border border-[#d6f2f2] dark:border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions Row */}
              <div className="mx-6 pb-6 pt-4 border-t border-border/60 dark:border-border/40 flex items-center justify-between min-h-[56px]">
                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-muted-foreground hover:text-slate-800 dark:hover:text-foreground transition-colors group/link"
                  >
                    <FaGithub className="h-5 w-5 text-slate-400 dark:text-muted-foreground/60 group-hover/link:text-slate-800 dark:group-hover/link:text-foreground transition-colors" />
                    Source Code
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground/40 italic">Private Repository</span>
                )}
                
                {/* This is the ONLY badge element remaining on the entire card layout */}
                <span className="text-xs font-bold text-[#1da1a1] dark:text-primary bg-[#edf9f9] dark:bg-primary/10 px-3 py-1.5 rounded-xl border border-[#d6f2f2] dark:border-primary/20 shadow-sm uppercase tracking-wider">
                  {formatCategoryLabel(project.category) || "Full Stack"}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Empty Search Filter Alert */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-card/10 text-muted-foreground text-sm">
            No projects found matching the selected category filter!
          </div>
        )}
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-xl p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Project Showcase Fullscreen View" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </main>
  );
}