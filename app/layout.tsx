import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata = {
  title: "Sehar Ajmal | Portfolio",
  description: "Backend Developer Portfolio Built with Next.js & Tailwind CSS",
  icons: {
    icon: "/favicon.png", // Path to your icon in the public folder
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body suppressHydrationWarning className="min-h-screen antialiased bg-background text-foreground transition-colors duration-300"> */}
       <body className="flex flex-col min-h-screen antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}