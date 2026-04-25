import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import "./globals.css";
import { cn } from "@/lib/utils";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen = {false}>
      <html lang="en">
        <AppSidebar />
        <SidebarTrigger />
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </SidebarProvider>
  );
}
