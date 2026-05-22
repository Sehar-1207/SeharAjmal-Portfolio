"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  FileText,
  Code2,
  Layout,
  Server,
} from "lucide-react";
import Image from "next/image";
import heroImg from "@/public/assets/home/hero-3d.png";
import avatarImg from "@/public/assets/home/avatar.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, ContactFormData } from "./lib/schema";
import { sendEmail } from "./actions/sendmail";

const ROLES = [
  "Flutter App Developer",
  "Backend Developer",
  "ASP.NET Core Developer",
  "Frontend Developer",
  "Mern Stack Developer",
];

function useTyping() {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = ROLES[i % ROLES.length];
    const t = setTimeout(
      () => {
        if (!del) {
          const next = word.slice(0, text.length + 1);
          setText(next);
          if (next === word) setTimeout(() => setDel(true), 1300);
        } else {
          const next = word.slice(0, text.length - 1);
          setText(next);
          if (next === "") {
            setDel(false);
            setI((v) => v + 1);
          }
        }
      },
      del ? 40 : 85,
    );
    return () => clearTimeout(t);
  }, [text, del, i]);
  return text;
}

function Hero() {
  const typed = useTyping();
  return (
    <section className="relative min-h-[88vh] flex items-center pt-18 pb-16">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Available for new projects
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Hi <span className="inline-block animate-float">👋</span> I'm{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Sehar Ajmal
            </span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl font-medium text-muted-foreground min-h-[2.5rem]">
            I'm a <span className="text-foreground">{typed}</span>
            <span className="caret ml-0.5 text-primary">|</span>
          </p>
          <p className="mt-5 text-base text-muted-foreground max-w-lg">
            I craft elegant, performant web experiences and scalable full-stack
            systems with a deep love for modern UI and clean architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-5 py-3 text-sm font-semibold shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5"
            >
              View My Work
              <ExternalLink className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 backdrop-blur px-5 py-3 text-sm font-semibold hover:border-primary/60 hover:text-primary transition-colors hover:-translate-y-0.5"
            >
              <FileText className="size-4" />
              Resume
            </Link>
          </div>
        </div>

        <div className="relative tilt-3d">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-teal-400/20 blur-3xl rounded-full" />
          <div className="relative animate-float">
            <Image
              src={heroImg}
              alt="3D abstract tech illustration"
              width={1024}
              height={1024}
              priority
              className="w-full max-w-md mx-auto drop-shadow-[0_20px_60px_rgba(6,182,212,0.45)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function AvatarBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag) {
      setRot((r) => ({
        x: r.x - (e.clientY - drag.y) * 0.6,
        y: r.y + (e.clientX - drag.x) * 0.6,
      }));
      setDrag({ x: e.clientX, y: e.clientY });
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRot({ x: -py * 25, y: px * 35 });
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div
          ref={ref}
          className="relative mx-auto"
          style={{ perspective: "1000px" }}
          onMouseMove={onMove}
          onMouseLeave={() => {
            setRot({ x: 0, y: 0 });
            setDrag(null);
          }}
          onMouseDown={(e) => setDrag({ x: e.clientX, y: e.clientY })}
          onMouseUp={() => setDrag(null)}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/40 to-teal-400/40 blur-2xl" />
          <div className="absolute inset-4 rounded-full border border-primary/30 animate-spin-slow" />
          <div className="absolute inset-10 rounded-full border border-dashed border-primary/20 animate-spin-slow [animation-direction:reverse]" />
          <div
            className="relative size-72 md:size-80 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500/30 to-teal-500/30 glow cursor-grab active:cursor-grabbing select-none transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={avatarImg}
              alt="Sehar Ajmal avatar"
              width={768}
              height={768}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            My Core{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Interests
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            What gets me up in the morning, turning ideas into pixel-perfect,
            scalable products.
          </p>
          <div className="mt-6 space-y-4">
            {[
              {
                icon: Code2,
                title: "Software Development",
                desc: "Clean architecture, maintainable code, and modern tooling across the stack.",
              },
              {
                icon: Layout,
                title: "Responsive Design",
                desc: "Mobile-first UIs that feel buttery smooth on every device & screen.",
              },
              {
                icon: Server,
                title: "Scalable Systems",
                desc: "Robust APIs and services built to grow gracefully with your product.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_10px_30px_-12px] hover:shadow-cyan-500/40"
              >
                <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-primary group-hover:from-cyan-500 group-hover:to-teal-500 group-hover:text-white transition-colors">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await sendEmail(data);
    if (result.success) {
      alert("Message sent!");
      reset();
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <section className="py-20 px-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Get In Touch</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" className="w-full p-3 rounded-xl border border-border bg-card/60" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        
        <input {...register("email")} placeholder="Email" className="w-full p-3 rounded-xl border border-border bg-card/60" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        
        <textarea {...register("message")} placeholder="Message" className="w-full p-3 rounded-xl border border-border bg-card/60 h-32" />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        
        <button disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:opacity-90">
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <AvatarBlock />
      <ContactForm />
    </>
  );
}