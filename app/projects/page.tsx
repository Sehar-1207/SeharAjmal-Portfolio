"use client";
import React, { useState, useMemo } from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import local from "../../public/assets/project/projects.json";
import Image from "next/image";

export default function ProjectsPage() {
  const categories = useMemo(() => {
    const allCategories = ["All", ...new Set(local.map((p) => p.category))];
    return allCategories;
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = local.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

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
                className={`cursor-pointer px-5 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  isActive
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
      key={project.title}
      className="group flex flex-col justify-between rounded-3xl border border-border bg-card/30 backdrop-blur-md overflow-hidden min-h-[380px] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card hover:shadow-xl"
    >
      {/* Graphic Header Thumbnail */}
      <div className="relative h-44 w-full bg-muted/20 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        
        <Image 
          src={project.img} 
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
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
          {project.tags.map((tag) => (
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
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group/link"
        >
          View Code 
          <FaExternalLinkAlt className="h-2.5 w-2.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
        <FaGithub className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
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