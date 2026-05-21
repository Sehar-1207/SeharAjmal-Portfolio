"use client";
import React from "react";
import Image from "next/image";
import { FaReact, FaJsSquare, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaJira, FaDatabase } from "react-icons/fa";
import { SiDotnet, SiSharp, SiExpress, SiMongodb, SiFirebase, SiPostman, SiN8N, SiFlutter, SiTailwindcss } from "react-icons/si";
import { HiSparkles } from "react-icons/hi2";
import { Layers, Wrench } from "lucide-react";
import ve1 from '../assets/ve1.png';

const skillCategories = [
  {
    title: "Frontend & Mobile",
    skills: [
      { name: "React.js", icon: FaReact, color: "text-cyan-400", hoverBorder: "hover:border-cyan-400/30" },
      { name: "Flutter", icon: SiFlutter, color: "text-sky-400", hoverBorder: "hover:border-sky-400/30" },
      { name: "JavaScript", icon: FaJsSquare, color: "text-yellow-400", hoverBorder: "hover:border-yellow-400/30" },
      { name: "HTML5", icon: FaHtml5, color: "text-orange-500", hoverBorder: "hover:border-orange-500/30" },
      { name: "CSS3", icon: FaCss3Alt, color: "text-blue-400", hoverBorder: "hover:border-blue-400/30" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-sky-400", hoverBorder: "hover:border-sky-400/30" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "ASP.NET Core", icon: SiDotnet, color: "text-purple-500", hoverBorder: "hover:border-purple-500/30" },
      { name: "C#", icon: SiSharp, color: "text-green-600", hoverBorder: "hover:border-green-600/30" },
      { name: "Node.js", icon: FaNodeJs, color: "text-green-500", hoverBorder: "hover:border-green-500/30" },
      { name: "Python", icon: FaPython, color: "text-yellow-500", hoverBorder: "hover:border-yellow-500/30" },
      { name: "Express", icon: SiExpress, color: "text-neutral-400 dark:text-neutral-100", hoverBorder: "hover:border-neutral-400/30" },
    ],
  },
  {
    title: "Database",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "text-green-500", hoverBorder: "hover:border-green-500/30" },
      { name: "SQL Server", icon: FaDatabase, color: "text-red-500", hoverBorder: "hover:border-red-500/30" },
      { name: "Firebase", icon: SiFirebase, color: "text-amber-500", hoverBorder: "hover:border-amber-500/30" },
      { name: "Vector Database", icon: Layers, color: "text-indigo-400", hoverBorder: "hover:border-indigo-400/30" },
    ],
  },
  {
    title: "Automation & Tools",
    skills: [
      { name: "n8n", icon: SiN8N, color: "text-red-400", hoverBorder: "hover:border-red-400/30" },
      { name: "Git", icon: FaGitAlt, color: "text-orange-600", hoverBorder: "hover:border-orange-600/30" },
      { name: "GitHub", icon: FaGithub, color: "text-foreground", hoverBorder: "hover:border-foreground/30" },
      { name: "Postman", icon: SiPostman, color: "text-orange-500", hoverBorder: "hover:border-orange-500/30" },
      { name: "Jira", icon: FaJira, color: "text-blue-600", hoverBorder: "hover:border-blue-600/30" },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24">
      <div className="mx-auto max-w-7xl space-y-16">

        <section className="relative flex flex-col items-center justify-between gap-12 pt-8 lg:flex-row">
          <div className="flex flex-col space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">About</span>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl uppercase relative pb-2 w-fit">
              Know Who I'm
              <span className="absolute bottom-0 left-0 h-1 w-16 bg-primary rounded-full" />
            </h1>
            <div className="text-muted-foreground space-y-4 text-md leading-relaxed pt-4">
              <p>"I'm a passionate developer who loves transforming ideas into polished, performant products. From building delightful interfaces to architecting backend services, I obsess over code quality. I believe that great software is as much about the human experience as it is about the underlying logic, which is why my approach blends clean, maintainable architecture with a relentless focus on user-centric design. Whether it's optimizing a complex data flow or sweating the smallest UI detail, I’m committed to building solutions that grow alongside your vision."</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:w-1/2">
            {/* Wrapper for the floating animation */}
            <div className="animate-float  w-full max-w-lg">

              {/* Decorative blur effect behind the image */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-blob opacity-70" />

              {/* Image Component */}
              <Image
                src={ve1}
                alt="Hero Visual"
                width={1084}
                height={1084}
                priority
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: PROFESSIONAL SKILLSET */}
        <section className="space-y-12">
          <h2 className="text-3xl font-black text-foreground flex items-center gap-2">
            <HiSparkles className="h-6 w-6 text-primary" /> Professional Skillset
          </h2>

          <div className="space-y-10">
            {skillCategories.map((category) => (
              <div key={category.title} className="space-y-4">
                <h3 className="text-md font-bold text-foreground flex items-center gap-2 border-l-4 border-primary pl-3">
                  {category.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {category.skills.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className={`group flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-[0_10px_30px_-15px_color-mix(in_oklch,var(--color-primary)_40%,transparent)] ${skill.hoverBorder}`}
                      >
                        <div className="grid place-items-center size-14 rounded-xl bg-muted/40 dark:bg-muted/10 group-hover:bg-gradient-to-br group-hover:from-cyan-500/10 group-hover:to-teal-500/10 transition-colors mb-3">
                          <IconComponent className={`h-8 w-8 transition-transform duration-300 group-hover:scale-110 ${skill.color}`} />
                        </div>
                        <span className="text-sm font-medium text-foreground tracking-wide text-center">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}