"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    X,
    MapPin,
    UserRound,
    Mail,
    Loader2,
    AlertCircle,
    CalendarCheck,
} from "lucide-react";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface Booking {
    _id: string;
    serviceId: string;
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

const CustomerBookingpage = () => {
    const { data: session, isPending: sessionLoading } = useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedBooking, setSelectedBooking] =
        useState<Booking | null>(null);

    const [cancelBooking, setCancelBooking] =
        useState<Booking | null>(null);

    const [cancelling, setCancelling] = useState(false);

    const customerEmail = session?.user?.email;

    // Fetch Customer Bookings
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


    // Cancel Booking
    const handleCancelBooking = async () => {
        if (!cancelBooking || !customerEmail) return;

        if (cancelBooking.status !== "Pending") return;

        try {
            setCancelling(true);

            const res = await fetch(
                `${BASE_URL}/booking/${cancelBooking._id}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customerEmail,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to cancel booking"
                );
            }

            setCancelBooking(null);
            await fetchBookings();

        } catch (err) {
            console.error("Cancel Booking Error:", err);

            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );

        } finally {
            setCancelling(false);
        }
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


    // Date Formatting
    const formatDate = (date: string) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
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
                    Loading your bookings...
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
                    Please login to view your bookings.
                </p>

                <Link
                    href="/login"
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
                        Customer / My Bookings
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4b1727]">
                        My Bookings
                    </h1>

                    <p className="text-[#8c7479] mt-2">
                        Track and manage your wedding booking requests.
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


            {/* Booking Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                {[
                    {
                        title: "Total Bookings",
                        value: bookings.length,
                        icon: CalendarDays,
                    },
                    {
                        title: "Pending",
                        value: bookings.filter(
                            (b) => b.status?.toLowerCase() === "pending"
                        ).length,
                        icon: Clock,
                    },
                    {
                        title: "Accepted",
                        value: bookings.filter(
                            (b) => b.status?.toLowerCase() === "accepted"
                        ).length,
                        icon: CheckCircle2,
                    },
                    {
                        title: "Rejected",
                        value: bookings.filter(
                            (b) => b.status?.toLowerCase() === "rejected"
                        ).length,
                        icon: XCircle,
                    },
                ].map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#fce8e6] flex items-center justify-center mb-3">
                            <stat.icon
                                size={22}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="text-sm text-[#806a70]">
                            {stat.title}
                        </p>

                        <h2 className="text-3xl font-serif font-bold text-[#800000] mt-1">
                            {stat.value}
                        </h2>
                    </div>
                ))}

            </div>


            {/* Booking List */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm">

                <div className="border-b border-[#f0dfd9] pb-4 mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                        All Booking Requests
                    </h2>

                    <p className="text-sm text-[#947e82] mt-1">
                        Your booking history and current requests.
                    </p>
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
                                width={500}
                                height={400}
                                src={booking.serviceImage}
                                alt={booking.serviceName}
                                className="w-full lg:w-32 h-48 lg:h-28 object-cover rounded-lg"
                            />


                            {/* Service Information */}
                            <div className="flex-1 min-w-0">

                                <h3 className="text-xl font-serif font-bold text-[#4b1727]">
                                    {booking.serviceName}
                                </h3>

                                <div className="flex items-center gap-2 mt-3 text-sm text-[#806a70]">
                                    <UserRound
                                        size={16}
                                        className="text-[#800000]"
                                    />
                                    {booking.vendorName}
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <CalendarDays
                                        size={16}
                                        className="text-[#800000]"
                                    />
                                    {formatDate(booking.eventDate)}
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <MapPin
                                        size={16}
                                        className="text-[#800000]"
                                    />
                                    {booking.eventLocation}
                                </div>

                            </div>


                            {/* Status & Actions */}
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


                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() => setSelectedBooking(booking)}
                                        className="flex items-center gap-1.5 border border-[#800000] text-[#800000] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#fff1f1] transition-all"
                                    >
                                        <Eye size={15} />
                                        Details
                                    </button>


                                    {booking.status?.toLowerCase() === "pending" && (
                                        <button
                                            onClick={() => setCancelBooking(booking)}
                                            className="flex items-center gap-1.5 bg-[#800000] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#600000] transition-all"
                                        >
                                            <X size={15} />
                                            Cancel
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">

                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="absolute top-4 right-4 text-[#800000]"
                        >
                            <X size={23} />
                        </button>

                        <h2 className="text-2xl font-serif font-bold text-[#4b1727] mb-5">
                            Booking Details
                        </h2>

                        <Image
                            width={800}
                            height={500}
                            src={selectedBooking.serviceImage}
                            alt={selectedBooking.serviceName}
                            unoptimized
                            className="w-full h-52 object-cover rounded-xl mb-5"
                        />

                        <h3 className="text-xl font-bold text-[#4b1727]">
                            {selectedBooking.serviceName}
                        </h3>

                        <div className="space-y-4 mt-5 text-sm text-[#806a70]">

                            <p className="flex items-center gap-3">
                                <UserRound size={18} className="text-[#800000]" />
                                Vendor: {selectedBooking.vendorName}
                            </p>

                            <p className="flex items-center gap-3 break-all">
                                <Mail size={18} className="text-[#800000]" />
                                {selectedBooking.vendorEmail}
                            </p>

                            <p className="flex items-center gap-3">
                                <CalendarDays size={18} className="text-[#800000]" />
                                Event Date: {formatDate(selectedBooking.eventDate)}
                            </p>

                            <p className="flex items-center gap-3">
                                <MapPin size={18} className="text-[#800000]" />
                                Event Location: {selectedBooking.eventLocation}
                            </p>

                            <p className="flex items-center gap-3">
                                <Clock size={18} className="text-[#800000]" />
                                Request Date: {formatDate(selectedBooking.requestDate)}
                            </p>

                            <div className="pt-3">
                                Booking Status:

                                <span
                                    className={`ml-3 inline-block px-4 py-2 rounded-full text-xs font-semibold ${getStatusStyle(
                                        selectedBooking.status
                                    )}`}
                                >
                                    {selectedBooking.status}
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="w-full mt-7 bg-[#800000] text-white py-3 rounded-xl hover:bg-[#600000] transition"
                        >
                            Close Details
                        </button>

                    </div>

                </div>
            )}


            {/* Cancel Confirmation Modal */}
            {cancelBooking && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-md rounded-2xl p-7">

                        <div className="w-14 h-14 rounded-full bg-[#fde2e2] flex items-center justify-center mb-5">
                            <AlertCircle
                                size={28}
                                className="text-[#b42323]"
                            />
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                            Cancel Booking?
                        </h2>

                        <p className="text-sm text-[#806a70] mt-3 leading-6">
                            Are you sure you want to cancel your booking request for{" "}
                            <strong>{cancelBooking.serviceName}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-7">

                            <button
                                disabled={cancelling}
                                onClick={() => setCancelBooking(null)}
                                className="flex-1 border border-[#e5d5d0] text-[#4b1727] py-3 rounded-xl font-semibold"
                            >
                                Keep Booking
                            </button>

                            <button
                                disabled={cancelling}
                                onClick={handleCancelBooking}
                                className="flex-1 bg-[#800000] text-white py-3 rounded-xl font-semibold hover:bg-[#600000] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {cancelling ? (
                                    <>
                                        <Loader2 size={17} className="animate-spin" />
                                        Cancelling
                                    </>
                                ) : (
                                    "Yes, Cancel"
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default CustomerBookingpage;