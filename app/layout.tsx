import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "next-themes";

import Header from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-svh" suppressHydrationWarning>
      <head />
      <body
        className={`${raleway.variable} flex h-svh flex-col bg-background text-foreground font-sans [--app-header-height:3.5rem]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <Header />
          <div className="h-[calc(100svh-var(--app-header-height))] overflow-hidden">
            <SidebarProvider
              defaultOpen={true}
              className="h-full min-h-0 overflow-hidden [--sidebar-mobile-offset:var(--app-header-height)] [--sidebar-mobile-height:calc(100svh-var(--app-header-height))]"
            >
              <AppSidebar />
              <SidebarInset className="min-h-0 h-full">
                <div className="h-full min-h-0 overflow-y-auto">
                  <div className="flex min-h-full">{children}</div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
