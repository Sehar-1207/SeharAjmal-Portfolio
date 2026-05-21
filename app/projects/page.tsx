"use client";
import React, { useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";

const localProjects = [
  {
    id: 1,
    title: "Flutter Frontend",
    description: "A responsive and modern cross-platform mobile application interface built using Flutter.",
    category: "Frontend",
    tags: ["Flutter", "Dart", "UI/UX"],
    codeLink: "https://github.com/Sehar-1207/Resume-Builder.git",
  },
  {
    id: 2,
    title: "Resume Builder",
    description: "An interactive web application designed to help users build, customize, and export professional resumes.",
    category: "Frontend",
    tags: ["React", "TypeScript", "Tailwind"],
    codeLink: "https://github.com/Sehar-1207/Resume-Builder.git",
  },
  {
    id: 3,
    title: "RecipeCorner",
    description: "A decoupled food exploration platform featuring dynamic recipe management and rich user interactions.",
    category: "Full-Stack",
    tags: ["React", "ASP.NET Core", "JWT"],
    codeLink: "https://github.com/Sehar-1207/Resume-Builder.git",
  },
  {
    id: 4,
    title: "Ledger API",
    description: "Audited double-entry accounting REST API powering an internal fintech ecosystem infrastructure.",
    category: "Backend",
    tags: ["ASP.NET Core", "PostgreSQL", "Docker"],
    codeLink: "https://github.com/Sehar-1207/Resume-Builder.git",
  },
];

const categories = ["All", "Frontend", "Backend", "Full-Stack", "Automation"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = localProjects.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

  return (
    <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Selected <span className="text-primary">projects</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            A small slice of recent work. Use the filters below to narrow by category.
          </p>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        {/* Category Filters Grid Layout */}
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

        {/* Project Dynamic Grid Container */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card/30 backdrop-blur-md overflow-hidden min-h-[380px] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card hover:shadow-xl"
            >
              {/* Graphic Header Thumbnail Wrapper */}
              <div className="relative h-44 w-full bg-gradient-to-br from-accent/5 to-muted/20 border-b border-border/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <FaCode className="h-12 w-12 text-muted-foreground/30 transform transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/40" />
                
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-accent/20 border border-accent/30 text-primary">
                  {project.category}
                </span>
              </div>

              {/* Central Information Blocks */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tags Section */}
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

              {/* Interactive Footer Navigation Bar Links */}
              <div className="px-6 pb-6 pt-2 border-t border-border/20 flex items-center justify-between">
                <a
                  href={project.codeLink}
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

        {/* Empty Search Fallback Template */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No projects found matching the selected category filter yet!
          </div>
        )}

      </div>
    </main>
  );
}