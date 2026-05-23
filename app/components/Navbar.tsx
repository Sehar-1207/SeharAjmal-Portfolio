"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";
import logo1 from "../../public/assets/logo2.png";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Resume", href: "/resume" },
    { name: "Certifications", href: "/certifications" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/40 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 sm:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-foreground text-xl cursor-pointer"
        >
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-md shadow-cyan-500/20 select-none pointer-events-none">
            <Image
              src={logo1}
              alt="Sehar Logo"
              width={34}
              height={33}
              priority
              className="h-full w-full object-contain pointer-events-none"
              draggable={false}
            />
          </span>

          <span className="tracking-tight text-[19px]">Sehar</span>
        </Link>
        <div className="hidden space-x-8 md:flex text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors pb-1 border-b-2 ${
                  isActive
                    ? "text-primary border-primary font-semibold"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <button
          onClick={toggleTheme}
          className="relative flex h-6 w-12 cursor-pointer items-center rounded-full bg-muted p-1 transition-colors duration-300"
          aria-label="Toggle Theme"
        >
          <div
            className={`h-5 w-5 rounded-full bg-primary transition-transform duration-300 flex items-center justify-center text-primary-foreground ${
              isDark ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {isDark ? (
              <Moon className="size-3.5 fill-current" />
            ) : (
              <Sun className="size-3.5 stroke-[2.5]" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}
