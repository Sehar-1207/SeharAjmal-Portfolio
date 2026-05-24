import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import NavigationWrapper from "./components/NavigationWrapper";

export const metadata = {
  title: "Sehar Ajmal | Portfolio",
  description: "Backend Developer Portfolio Built with Next.js & Tailwind CSS",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}