"use client";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />

            <main className="flex-1 min-w-0 bg-[#fffaf7] min-h-screen pt-[74] pb-10">
                    
                {children}
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
