"use client";

import Link from "next/link";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSession } from "@/lib/auth-client";

import {
    Heart,
    LayoutDashboard,
    Plus,
    Grid2X2,
    CalendarDays,
    Crown,
    Headset,
    Settings,
    Users,
    Wallet,
    ClipboardList,
} from "lucide-react";



const menuItemsByRole = {

    // Vendor Menu
    vendor: [
        {
            name: "Dashboard",
            url: "/dashboard/vendor",
            icon: LayoutDashboard,
        },
        {
            name: "Add Service",
            url: "/dashboard/vendor/add-service",
            icon: Plus,
        },
        {
            name: "My Services",
            url: "/dashboard/vendor/my-services",
            icon: Grid2X2,
        },
        {
            name: "Booking Requests",
            url: "/dashboard/vendor/bookings",
            icon: CalendarDays,
        },
        {
            name: "Subscription",
            url: "/dashboard/vendor/subscription",
            icon: Crown,
        },
    ],

    // Customer Menu
    customer: [
        {
            name: "Dashboard",
            url: "/dashboard/customer",
            icon: LayoutDashboard,
        },
        {
            name: "My Bookings",
            url: "/dashboard/customer/bookings",
            icon: CalendarDays,
        },
        {
            name: "Profile Settings",
            url: "/dashboard/customer/profile",
            icon: Settings,
        },
    ],

    // Admin Menu
    admin: [
        {
            name: "Dashboard",
            url: "/dashboard/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Manage Users",
            url: "/dashboard/admin/users",
            icon: Users,
        },
        {
            name: "Manage Services",
            url: "/dashboard/admin/services",
            icon: ClipboardList,
        },
        {
            name: "Transactions",
            url: "/dashboard/admin/transactions",
            icon: Wallet,
        },
    ],

};


export function DashboardSidebar() {

    const { data: session, isPending } = useSession();

    const role = session?.user?.role;

    const menuItems = role && role in menuItemsByRole
        ? menuItemsByRole[role as keyof typeof menuItemsByRole]
        : [];

    return (
        <Sidebar className="border-r-0 top-18.5! h-[calc(100svh-74px)]! sticky">

            {/* Sidebar Header */}
            <SidebarHeader className="bg-[#3d1423] px-5 py-8">

                <div className="flex flex-col items-center text-center">

                    <div className="w-16 h-16 bg-[#800000] rounded-full flex items-center justify-center mb-3">
                        <Heart
                            size={32}
                            fill="white"
                            className="text-white"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        WedPlan
                    </h1>

                    <p className="text-[9px] tracking-[3px] text-[#e8cdd2] mt-1">
                        WEDDING PLANNING PLATFORM
                    </p>

                </div>

                <div className="h-px bg-[#70404e] mt-8" />

            </SidebarHeader>


            {/* Sidebar Menu */}
            <SidebarContent className="bg-[#3d1423] px-3">

                <SidebarGroup>

                    <SidebarMenu className="gap-3">

                        {isPending ? (

                            <div className="px-4 py-4 text-sm text-[#e8cdd2]">
                                Loading menu...
                            </div>

                        ) : (

                            menuItems.map((item) => (

                                <SidebarMenuItem key={item.name}>

                                    <SidebarMenuButton
                                        render={
                                            <Link href={item.url} />
                                        }
                                        className="h-12 px-4 text-white hover:bg-[#713b4b] hover:text-white data-[active=true]:bg-[#713b4b] data-[active=true]:text-white transition-all rounded-xl"
                                    >

                                        <item.icon size={21} />

                                        <span className="text-sm font-medium">
                                            {item.name}
                                        </span>

                                    </SidebarMenuButton>

                                </SidebarMenuItem>

                            ))

                        )}

                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>


            {/* Sidebar Footer */}
            <SidebarFooter className="bg-[#3d1423] p-4">

                <div className="border border-[#79505d] rounded-xl p-4 text-white">

                    <div className="flex items-center gap-2 mb-2">

                        <Headset size={22} />

                        <h3 className="font-semibold text-sm">
                            Need Help?
                        </h3>

                    </div>

                    <p className="text-xs text-[#e8cdd2] mb-4">
                        Our support team is here to assist you.
                    </p>

                    <button className="bg-[#fce8e6] text-[#800000] px-4 py-2 rounded-full text-xs font-semibold hover:bg-white transition-all">
                        Contact Support
                    </button>

                </div>

            </SidebarFooter>

        </Sidebar>
    );
}