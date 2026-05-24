"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";
import logo1 from "../../public/assets/logo2.png";

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 font-bold text-foreground text-xl">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-md shadow-cyan-500/20">
            <Image src={logo1} alt="Logo" width={34} height={33} priority className="object-contain" />
          </span>
          <span className="tracking-tight text-[19px]">Sehar</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden space-x-8 md:flex text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`transition-colors pb-1 border-b-2 ${pathname === link.href ? "text-primary border-primary font-semibold" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Theme Toggle & Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex h-6 w-12 cursor-pointer items-center rounded-full bg-muted p-1">
            <div className={`h-5 w-5 rounded-full bg-primary transition-transform ${isDark ? "translate-x-6" : "translate-x-0"} flex items-center justify-center`}>
              {isDark ? <Moon className="size-3.5 text-background" /> : <Sun className="size-3.5 text-background" />}
            </div>
          </button>
          
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-background/95 backdrop-blur-lg border-b border-border p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${pathname === link.href ? "text-primary" : "text-muted-foreground"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}