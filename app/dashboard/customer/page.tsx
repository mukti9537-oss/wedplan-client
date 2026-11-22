"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    MapPin,
    UserRound,
    Settings,
    CalendarCheck,
    ArrowRight,
    Mail,
    Phone,
    Loader2,
    AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Booking {
    _id: string;
    serviceName: string;
    serviceImage: string;
    vendorName: string;
    vendorEmail: string;
    customerName: string;
    customerEmail: string;
    eventDate: string;
    eventLocation: string;
    status: string;
    requestDate: string;
}

const CustomerDashboardpage = () => {
    const { data: session, isPending: sessionLoading } = useSession();
    const customerEmail = session?.user?.email;

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch Customer Bookings from backend
    const fetchBookings = useCallback(async () => {
        if (!customerEmail) return;

        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                `${BASE_URL}/my-bookings/${encodeURIComponent(customerEmail)}`,
                {
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to load bookings");
            }

            const data = await res.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid booking response");
            }

            setBookings(data);
        } catch (err) {
            console.error("Booking Fetch Error:", err);
            setError("Unable to load your bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [customerEmail]);

    useEffect(() => {
        if (sessionLoading) return;

        const timeoutId = window.setTimeout(() => {
            if (customerEmail) {
                void fetchBookings();
            } else {
                setLoading(false);
            }
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [customerEmail, fetchBookings, sessionLoading]);

    // Calculate stats from real data
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "pending"
    ).length;
    const acceptedBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "accepted"
    ).length;
    const rejectedBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "rejected"
    ).length;

    const stats = [
        {
            title: "Total Booking Requests",
            value: totalBookings.toString(),
            icon: CalendarDays,
        },
        {
            title: "Pending Bookings",
            value: pendingBookings.toString().padStart(2, "0"),
            icon: Clock,
        },
        {
            title: "Accepted Bookings",
            value: acceptedBookings.toString().padStart(2, "0"),
            icon: CheckCircle2,
        },
        {
            title: "Rejected Bookings",
            value: rejectedBookings.toString().padStart(2, "0"),
            icon: XCircle,
        },
    ];

    // Date Formatting
    const formatDate = (date: string) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Status Styling
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-[#fff0d0] text-[#a65b08]";
            case "accepted":
                return "bg-[#dcf4df] text-[#18743b]";
            case "rejected":
                return "bg-[#fde2e2] text-[#b42323]";
            case "cancelled":
                return "bg-gray-100 text-gray-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // Loading State
    if (sessionLoading || loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fffaf7]">
                <Loader2
                    size={38}
                    className="animate-spin text-[#800000] mb-4"
                />

                <p className="text-[#806a70]">
                    Loading your dashboard...
                </p>
            </div>
        );
    }


    // Authentication Check
    if (!customerEmail) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fffaf7] px-5 text-center">

                <UserRound size={45} className="text-[#800000] mb-4" />

                <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                    Login Required
                </h2>

                <p className="text-[#806a70] mt-3 mb-6">
                    Please login to view your dashboard.
                </p>

                <Link
                    href="/sign-in"
                    className="bg-[#800000] text-white px-7 py-3 rounded-xl"
                >
                    Login Now
                </Link>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>
                    <p className="text-sm text-[#800000] font-medium mb-2">
                        Customer / Dashboard
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4b1727]">
                        My Dashboard
                    </h1>

                    <p className="text-[#8c7479] mt-2 text-sm md:text-base">
                        Track your bookings and manage your wedding plans.
                    </p>
                </div>

                <Link
                    href="/browse-services"
                    className="flex items-center justify-center gap-2 bg-[#800000] hover:bg-[#600000] text-white px-6 py-3 rounded-xl transition-all shadow-md"
                >
                    <CalendarDays size={19} />
                    Browse Services
                </Link>

            </div>


            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

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

            </div>


            {/* My Bookings */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            My Bookings
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Manage all your booking requests.
                        </p>
                    </div>

                    <button className="text-[#800000] font-semibold flex items-center gap-2 text-sm">
                        View All <ArrowRight size={17} />
                    </button>

                </div>


                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-5">
                        <AlertCircle size={20} />

                        <span>{error}</span>

                        <button
                            onClick={fetchBookings}
                            className="ml-auto font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}


                {/* Empty State */}
                {!error && bookings.length === 0 && (
                    <div className="py-16 text-center">

                        <CalendarCheck
                            size={55}
                            className="mx-auto text-[#c99a9a] mb-5"
                        />

                        <h3 className="text-2xl font-serif font-bold text-[#4b1727]">
                            No Bookings Yet
                        </h3>

                        <p className="text-[#947e82] mt-2 mb-6">
                            You haven&apos;t submitted any booking requests yet.
                        </p>

                        <Link
                            href="/browse-services"
                            className="inline-flex items-center gap-2 bg-[#800000] text-white px-6 py-3 rounded-xl hover:bg-[#600000] transition"
                        >
                            Explore Services
                        </Link>

                    </div>
                )}


                {/* Booking Cards */}
                <div className="space-y-5">

                    {bookings.map((booking) => (

                        <div
                            key={booking._id}
                            className="flex flex-col lg:flex-row lg:items-center gap-5 border border-[#f3e8e3] rounded-xl p-4 hover:shadow-sm transition-all"
                        >

                            {/* Service Image */}
                            <Image
                                width={10}
                                height={10}
                                src={booking.serviceImage}
                                alt={booking.serviceName}
                                unoptimized
                                className="w-full lg:w-28 h-40 lg:h-24 object-contain rounded-lg bg-[#fce8e6]"
                            />


                            {/* Service Information */}
                            <div className="flex-1 min-w-0">

                                <h3 className="text-lg font-semibold text-[#4b1727]">
                                    {booking.serviceName}
                                </h3>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <UserRound size={15} className="text-[#800000]" />
                                    <span>{booking.vendorName}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <CalendarDays size={15} className="text-[#800000]" />
                                    <span>{formatDate(booking.eventDate)}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <MapPin size={15} className="text-[#800000]" />
                                    <span>{booking.eventLocation}</span>
                                </div>

                            </div>


                            {/* Booking Status and Actions */}
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:items-end xl:items-center gap-3">

                                <div className="flex flex-col items-start lg:items-end">

                                    <span
                                        className={`text-xs font-semibold px-4 py-2 rounded-full ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>

                                    <p className="text-xs text-[#947e82] mt-2">
                                        Requested: {formatDate(booking.requestDate)}
                                    </p>


                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* Profile Settings */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            Profile Settings
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Manage your personal information.
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-[#800000] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#600000] transition-all">
                        <Settings size={17} />
                        Edit Profile
                    </button>

                </div>


                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                    <div className="w-20 h-20 rounded-full bg-[#fce8e6] flex items-center justify-center">
                        <UserRound size={38} className="text-[#800000]" />
                    </div>

                    <div className="text-center sm:text-left">

                        <h3 className="text-xl font-serif font-bold text-[#4b1727]">
                            Customer Name
                        </h3>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-[#806a70]">
                            <Mail size={15} />
                            {customerEmail || "customer@example.com"}
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-[#806a70]">
                            <Phone size={15} />
                            +880 1XXXXXXXXX
                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom Banner */}
            <div className="bg-linear-to-r from-[#f8dada] to-[#fce8e6] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#f3d2d2]">

                <div className="flex items-center gap-5">

                    <div className="hidden sm:flex w-16 h-16 rounded-full bg-[#f4c9b5] items-center justify-center">
                        <CalendarCheck size={34} className="text-[#800000]" />
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4b1727]">
                            Plan Your Dream Wedding!
                        </h2>

                        <p className="text-sm md:text-base text-[#684650] mt-2">
                            Discover amazing wedding services for your special day.
                        </p>
                    </div>

                </div>

                <Link
                    href="/browse-services"
                    className="bg-[#800000] hover:bg-[#600000] text-white px-7 py-4 rounded-xl font-semibold whitespace-nowrap transition-all shadow-md"
                >
                    Explore Services
                </Link>

            </div>

        </div>
    );
};

export default CustomerDashboardpage;
