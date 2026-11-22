"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    CalendarDays,
    MapPin,
    Mail,
    User,
    MessageSquare,
    CheckCircle,
    XCircle,
    Loader2,
    ClipboardList,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import {
    getVendorBookings,
    updateBookingStatus,
} from "@/lib/actions/bookingsrequests";

import { toast } from "react-toastify";

interface Booking {
    _id: string;
    bookingId: string;
    customerId: string;
    customerName?: string;
    email: string;
    serviceName: string;
    serviceImage?: string;
    eventDate: string;
    eventLocation: string;
    AdditionalMessage?: string;
    status: string;
    requestDate?: string;
}

const VendorBookingsPage = () => {
    const { data: session, isPending } = useSession();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const vendorEmail = session?.user?.email || "";

    const fetchBookings = useCallback(async () => {
        if (!vendorEmail) return;

        try {
            setLoading(true);

            const data = await getVendorBookings(vendorEmail);

            setBookings(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load booking requests");
        } finally {
            setLoading(false);
        }
    }, [vendorEmail]);

    useEffect(() => {
        if (!isPending && vendorEmail) {
            const timeoutId = window.setTimeout(() => {
                void fetchBookings();
            }, 0);

            return () => window.clearTimeout(timeoutId);
        }
    }, [isPending, vendorEmail, fetchBookings]);

    const handleStatus = async (
        id: string,
        status: "Accepted" | "Rejected"
    ) => {
        try {
            setProcessingId(id);

            await updateBookingStatus(id, vendorEmail, status);

            setBookings((previous) =>
                previous.map((booking) =>
                    booking._id === id
                        ? { ...booking, status }
                        : booking
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
        } finally {
            setProcessingId(null);
        }
    };

    if (isPending || loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#843047]" size={35} />
            </div>
        );
    }

    if (!session?.user || session.user.role !== "vendor") {
        return (
            <div className="p-8 text-center text-[#843047]">
                Only vendors can access booking requests.
            </div>
        );
    }

    const pendingCount = bookings.filter(
        (booking) => booking.status === "Pending"
    ).length;

    const acceptedCount = bookings.filter(
        (booking) => booking.status === "Accepted"
    ).length;

    const rejectedCount = bookings.filter(
        (booking) => booking.status === "Rejected"
    ).length;

    return (
        <div className="min-h-screen bg-[#FFF8FA] p-4 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#542332]">
                    Booking Requests
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                    Manage booking requests from your customers.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                <div className="bg-white border border-[#F3DDE5] rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Pending Requests</p>
                    <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                        {pendingCount}
                    </h2>
                </div>

                <div className="bg-white border border-[#F3DDE5] rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Accepted Requests</p>
                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {acceptedCount}
                    </h2>
                </div>

                <div className="bg-white border border-[#F3DDE5] rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Rejected Requests</p>
                    <h2 className="text-3xl font-bold text-red-600 mt-2">
                        {rejectedCount}
                    </h2>
                </div>

            </div>

            {/* Booking List */}
            <div className="space-y-5">

                {bookings.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-[#F3DDE5] p-12 text-center">
                        <ClipboardList
                            size={45}
                            className="mx-auto text-[#C58A9C] mb-4"
                        />

                        <h3 className="text-lg font-semibold text-[#542332]">
                            No Booking Requests Yet
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            Customer booking requests will appear here.
                        </p>
                    </div>

                ) : (

                    bookings.map((booking) => (

                        <div
                            key={booking._id}
                            className="bg-white border border-[#F3DDE5] rounded-2xl p-5 md:p-6 shadow-sm"
                        >

                            {/* Top Section */}
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">

                                <div className="flex gap-4">

                                    {booking.serviceImage ? (
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={booking.serviceImage}
                                                alt={booking.serviceName}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-[#FCE7EE] flex items-center justify-center">
                                            <ClipboardList className="text-[#843047]" />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-lg font-bold text-[#542332]">
                                            {booking.serviceName}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Booking ID: {booking._id}
                                        </p>

                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                            booking.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : booking.status === "Accepted"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/* Customer Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#F3DDE5] pt-5">

                                <div>
                                    <h3 className="font-semibold text-[#843047] mb-3">
                                        Customer Information
                                    </h3>

                                    <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <User size={16} />
                                        {booking.customerName || "Customer"}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm text-gray-600 break-all">
                                        <Mail size={16} />
                                        {booking.email}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-[#843047] mb-3">
                                        Event Information
                                    </h3>

                                    <p className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <CalendarDays size={16} />
                                        {booking.eventDate || "Not provided"}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} />
                                        {booking.eventLocation || "Not provided"}
                                    </p>
                                </div>

                            </div>

                            {/* Customer Message */}
                            <div className="mt-5 bg-[#FFF8FA] rounded-xl p-4">
                                <h3 className="flex items-center gap-2 font-semibold text-[#843047] text-sm mb-2">
                                    <MessageSquare size={16} />
                                    Customer Message
                                </h3>

                                <p className="text-sm text-gray-600 leading-6">
                                    {booking.AdditionalMessage || "No additional message."}
                                </p>
                            </div>

                            {/* Actions */}
                            {booking.status === "Pending" && (

                                <div className="flex flex-col sm:flex-row gap-3 mt-5">

                                    <button
                                        onClick={() =>
                                            handleStatus(booking._id, "Accepted")
                                        }
                                        disabled={processingId === booking._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                                    >
                                        {processingId === booking._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <CheckCircle size={18} />
                                        )}
                                        Accept
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleStatus(booking._id, "Rejected")
                                        }
                                        disabled={processingId === booking._id}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                                    >
                                        {processingId === booking._id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <XCircle size={18} />
                                        )}
                                        Reject
                                    </button>

                                </div>

                            )}

                        </div>

                    ))

                )}

            </div>

        </div>
    );
};

export default VendorBookingsPage;