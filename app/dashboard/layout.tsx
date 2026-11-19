"use client";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />

            <main className="flex-1 min-w-0 bg-[#fffaf7] min-h-screen">

                <div className="flex items-center h-12 px-5 border-b border-[#f0dfd9] bg-white">
                    <SidebarTrigger className="text-[#800000]" />
                </div>

                {children}

            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
