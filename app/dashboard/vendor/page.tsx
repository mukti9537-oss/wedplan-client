"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
    BriefcaseBusiness,
    CheckCircle2,
    CalendarCheck,
    Clock,
    Power,
    Crown,
    ArrowRight,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { getService } from "@/lib/actions/service";
import {
    getVendorBookings,
    updateBookingStatus,
} from "@/lib/actions/bookingsrequests";
import { getPremiumById } from "@/lib/api/user";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Service = {
    _id: string;
    serviceName: string;
    category: string;
    price: number;
    location: string;
    serviceImage: string;
    status?: "Approved" | "Pending" | "Rejected";
    isAvailable?: boolean;
    vendorEmail?: string;
};

type Booking = {
    _id: string;
    customerName?: string;
    serviceName: string;
    eventDate?: string;
    status?: string;
};

const statusStyle: Record<NonNullable<Service["status"]>, string> = {
    Approved: "bg-[#dcf4df] text-[#18743b]",
    Pending: "bg-[#fff0d0] text-[#a65b08]",
    Rejected: "bg-[#fde2e2] text-[#b42318]",
};

const VendorDashboardpage = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [services, setServices] = useState<Service[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [premium, setPremium] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const vendorEmail = session?.user?.email || "";
    const userId = session?.user?.id || "";

    const fetchData = useCallback(async () => {
        if (!vendorEmail) return;

        try {
            setLoading(true);

            const [servicesData, bookingsData] = await Promise.all([
                getService(),
                getVendorBookings(vendorEmail),
            ]);

            const allServices: Service[] = Array.isArray(servicesData)
                ? servicesData
                : [];

            setServices(
                allServices.filter(
                    (service) => service.vendorEmail === vendorEmail
                )
            );

            setBookings(Array.isArray(bookingsData) ? bookingsData : []);

            if (userId) {
                try {
                    const premiumResult = await getPremiumById(userId);
                    setPremium(Boolean(premiumResult?.premium));
                } catch {
                    setPremium(false);
                }
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [vendorEmail, userId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    // Accept / Reject a booking request (only pending requests can be processed)
    const handleStatus = async (
        id: string,
        status: "Accepted" | "Rejected"
    ) => {
        try {
            setProcessingId(id);
            await updateBookingStatus(id, vendorEmail, status);
            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === id ? { ...booking, status } : booking
                )
            );
            toast.success(`Booking ${status.toLowerCase()} successfully!`);
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update booking"
            );
            void fetchData();
        } finally {
            setProcessingId(null);
        }
    };

    const activeServices = services.filter(
        (service) =>
            service.status === "Approved" && (service.isAvailable ?? true)
    ).length;
    const pendingRequests = bookings.filter(
        (booking) => booking.status === "Pending"
    ).length;
    const acceptedBookings = bookings.filter(
        (booking) => booking.status === "Accepted"
    ).length;

    const stats = [
        {
            title: "Total Services",
            value: services.length.toString().padStart(2, "0"),
            icon: BriefcaseBusiness,
        },
        {
            title: "Active Services",
            value: activeServices.toString().padStart(2, "0"),
            icon: Power,
        },
        {
            title: "Pending Requests",
            value: pendingRequests.toString().padStart(2, "0"),
            icon: Clock,
        },
        {
            title: "Accepted Bookings",
            value: acceptedBookings.toString().padStart(2, "0"),
            icon: CalendarCheck,
        },
    ];

    const recentBookings = bookings.slice(0, 5);

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
                        {premium ? "Premium Plan" : "Free Plan"}
                    </h2>
                    {!premium && (
                        <button
                            onClick={() => router.push("/payment")}
                            className="text-sm text-[#800000] underline mt-2 font-semibold"
                        >
                            Upgrade to Premium
                        </button>
                    )}

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

                        <button
                            onClick={() => router.push("/dashboard/vendor/bookings")}
                            className="text-[#800000] text-sm font-semibold flex items-center gap-1"
                        >
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-8 text-[#806a70]">
                            <Loader2 size={22} className="animate-spin text-[#800000]" />
                            Loading booking requests...
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No booking requests yet.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {recentBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#f4e9e5] pb-4 last:border-0"
                                >

                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                            {(booking.customerName || "C").charAt(0)}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-[#3f2930]">
                                                {booking.customerName || "Customer"}
                                            </h3>

                                            <p className="text-xs text-[#947e82] mt-1">
                                                {booking.serviceName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">

                                        <span className="text-xs text-[#6b555b]">
                                            {booking.eventDate
                                                ? new Date(booking.eventDate).toLocaleDateString(
                                                      "en-BD",
                                                      {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Date not set"}
                                        </span>

                                        <span
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${booking.status === "Pending"
                                                ? "bg-[#fff0d0] text-[#a65b08]"
                                                : booking.status === "Rejected"
                                                  ? "bg-[#fde2e2] text-[#b42318]"
                                                  : "bg-[#dcf4df] text-[#18743b]"
                                                }`}
                                        >
                                            {booking.status || "Pending"}
                                        </span>

                                        {booking.status === "Pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleStatus(booking._id, "Rejected")
                                                    }
                                                    disabled={processingId === booking._id}
                                                    className="border border-[#800000] text-[#800000] px-3 py-1.5 rounded-lg text-xs hover:bg-[#fff1f1] disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleStatus(booking._id, "Accepted")
                                                    }
                                                    disabled={processingId === booking._id}
                                                    className="bg-[#800000] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#600000] disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}
                </div>


                {/* My Services */}
                <div className="2xl:col-span-2 bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 border-b border-[#f0dfd9] pb-4">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            My Services
                        </h2>

                        <button
                            onClick={() => router.push("/dashboard/vendor/my-services")}
                            className="text-[#800000] text-sm font-semibold flex items-center gap-1"
                        >
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
            {!premium && (
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
                        className="bg-[#843047] hover:bg-[#542332] text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Upgrade to Premium
                    </button>

                </div>
            )}

        </div>
    );
};

export default VendorDashboardpage;
