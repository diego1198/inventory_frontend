"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/10">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 fixed inset-y-0 left-0 z-10">
        <Sidebar className="h-full w-full" />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64 transition-all duration-300 ease-in-out">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-16 px-4 border-b bg-background sticky top-0 z-20">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <Sidebar className="border-none" />
                </SheetContent>
            </Sheet>
            <span className="font-semibold">Inventory App</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
