"use client";

import React, { useEffect, useState } from "react";

import {
    BriefcaseBusiness,
    CheckCircle2,
    CalendarCheck,
    Crown,
    ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { getService } from "@/lib/actions/service";
import { useRouter } from "next/navigation";

type Service = {
    _id: string;
    serviceName: string;
    category: string;
    price: number;
    location: string;
    serviceImage: string;
    status?: "Approved" | "Pending" | "Rejected";
};

const statusStyle: Record<NonNullable<Service["status"]>, string> = {
    Approved: "bg-[#dcf4df] text-[#18743b]",
    Pending: "bg-[#fff0d0] text-[#a65b08]",
    Rejected: "bg-[#fde2e2] text-[#b42318]",
};

const bookings = [
    {
        name: "Sarah Ahmed",
        service: "Wedding Photography",
        date: "Dec 25, 2026",
        status: "Pending",
    },
    {
        name: "Nusrat Jahan",
        service: "Floral Decoration",
        date: "Dec 28, 2026",
        status: "Pending",
    },
    {
        name: "Ayesha Rahman",
        service: "Full Wedding Planning",
        date: "Jan 03, 2027",
        status: "Accepted",
    },
];

const VendorDashboardpage = () => {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getService();
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const stats = [
        {
            title: "Total Services",
            value: services.length.toString().padStart(2, "0"),
            icon: BriefcaseBusiness,
        },
        {
            title: "Pending Services",
            value: services.filter(
                (service) => service.status === "Pending"
            ).length.toString().padStart(2, "0"),
            icon: CheckCircle2,
        },
        {
            title: "Approved Services",
            value: services.filter(
                (service) => service.status === "Approved"
            ).length.toString().padStart(2, "0"),
            icon: CalendarCheck,
        },
    ];

    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>
                    <p className="text-sm text-[#800000] font-medium mb-2">
                        Vendor / Dashboard
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4b1727]">
                        Vendor Dashboard
                    </h1>

                    <p className="text-[#8c7479] mt-2 text-sm md:text-base">
                        Manage your services and booking requests in one place.
                    </p>
                </div>
            </div>


            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">

                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                            <stat.icon className="text-[#800000]" size={23} />
                        </div>

                        <p className="text-sm text-[#5c4148] font-medium">
                            {stat.title}
                        </p>

                        <h2 className="text-3xl font-serif font-bold text-[#800000] mt-1">
                            {stat.value}
                        </h2>
                    </div>
                ))}

                {/* Subscription Card */}
                <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                        <Crown className="text-[#800000]" size={23} />
                    </div>

                    <p className="text-sm text-[#5c4148] font-medium">
                        Current Plan
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#800000] mt-1">
                        Free Plan
                    </h2>
                    <button
                        onClick={() => router.push("/payment")}
                        className="text-sm text-[#800000] underline mt-2 font-semibold"
                    >
                        Upgrade to Premium
                    </button>

                </div>

            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 2xl:grid-cols-5 gap-6 mb-8">

                {/* Booking Requests */}
                <div className="2xl:col-span-3 bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm">

                    <div className="flex items-center justify-between mb-5 border-b border-[#f0dfd9] pb-4">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            Recent Booking Requests
                        </h2>
                    </div>

                    <div className="space-y-4">

                        {bookings.map((booking, index) => (
                            <div
                                key={index}
                                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#f4e9e5] pb-4 last:border-0"
                            >

                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                        {booking.name.charAt(0)}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-[#3f2930]">
                                            {booking.name}
                                        </h3>

                                        <p className="text-xs text-[#947e82] mt-1">
                                            {booking.service}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">

                                    <span className="text-xs text-[#6b555b]">
                                        {booking.date}
                                    </span>

                                    <span
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${booking.status === "Pending"
                                            ? "bg-[#fff0d0] text-[#a65b08]"
                                            : "bg-[#dcf4df] text-[#18743b]"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>

                                    {booking.status === "Pending" && (
                                        <div className="flex gap-2">
                                            <button className="border border-[#800000] text-[#800000] px-3 py-1.5 rounded-lg text-xs hover:bg-[#fff1f1]">
                                                Reject
                                            </button>

                                            <button className="bg-[#800000] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#600000]">
                                                Accept
                                            </button>
                                        </div>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                </div>


                {/* My Services */}
                <div className="2xl:col-span-2 bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 border-b border-[#f0dfd9] pb-4">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            My Services
                        </h2>

                        <button className="text-[#800000] text-sm font-semibold flex items-center gap-1">
                            Manage <ArrowRight size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 py-5">
                            Loading services...
                        </p>
                    ) : services.length === 0 ? (
                        <p className="text-center text-gray-500 py-5">
                            No services added yet.
                        </p>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service._id}
                                className="flex items-center gap-3 border-b border-[#f4e9e5] pb-4 last:border-0"
                            >
                                {/* Service Image */}
                                <Image
                                    src={service.serviceImage}
                                    alt={service.serviceName}
                                    width={64}
                                    height={56}
                                    unoptimized
                                    className="w-16 h-14 rounded-xl object-cover shrink-0"
                                />

                                {/* Service Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-[#3f2930] truncate">
                                        {service.serviceName}
                                    </h3>

                                    <p className="text-sm text-[#947e82] mt-1">
                                        Tk.{service.price.toLocaleString("en-BD")}
                                    </p>
                                </div>

                                {/* Category Badge */}
                                <span
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full
                                         ${statusStyle[service.status || "Pending"]
                                        }`}
                                >
                                    {service.status || "Pending"}
                                </span>

                            </div>
                        ))
                    )}

                </div>

            </div>


            {/* Premium Upgrade Banner */}
            <div className="bg-linear-to-r from-[#f8dada] to-[#fce8e6] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#f3d2d2]">

                <div className="flex items-center gap-5">

                    <div className="hidden sm:flex w-16 h-16 rounded-full bg-[#f4c9b5] items-center justify-center">
                        <Crown size={34} className="text-[#a45a13]" />
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4b1727]">
                            Ready to grow your business?
                        </h2>

                        <p className="text-sm md:text-base text-[#684650] mt-2">
                            Upgrade to Premium for unlimited active services and a premium vendor badge.
                        </p>
                    </div>

                </div>

                <button
                    onClick={() => router.push("/payment")}
                    className="bg-[#800000] hover:bg-[#600000] text-white px-7 py-4 rounded-xl font-semibold whitespace-nowrap transition-all shadow-md"
                >
                    Upgrade to Premium
                </button>

            </div>

        </div>
    );
};

export default VendorDashboardpage;
