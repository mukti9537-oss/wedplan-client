"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    CalendarDays,
    MapPin,
    MessageSquare,
    Loader2,
    Send,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const BookingForm = ({ serviceId }: { serviceId: string }) => {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [eventDate, setEventDate] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);

    const [eventLocation, setEventLocation] = useState("");
    const [additionalMessage, setAdditionalMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);


    // Authentication Protection
    useEffect(() => {
        if (!isPending && !session?.user) {
            router.replace(`/sign-in?callbackURL=${encodeURIComponent(`/bookingform/${serviceId}`)}`);
        }
    }, [session, isPending, serviceId, router]);

    // Loading / Redirect Screen
    if (isPending || !session?.user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2
                    size={35}
                    className="animate-spin text-[#800000]"
                />

                <span className="ml-3 text-[#401b29]">
                    Checking authentication...
                </span>
            </div>
        );
    }

    // Submit Booking
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const res = await fetch(`${BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    serviceId,
                    customerEmail: session.user.email,
                    eventDate,
                    eventLocation,
                    additionalMessage,
                }),
            });

            // Handle API Response
            const responseText = await res.text();

            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    "Server returned an invalid response. Please check your API URL."
                );
            }

            console.log("Booking API Response:", result);

            if (!res.ok) {
                throw new Error(
                    result.message || "Booking request failed."
                );
            }

            setSuccess(true);

            setMessage(
                result.message ||
                "Booking request submitted successfully!"
            );

            // Reset Form
            setEventDate("");
            setEventLocation("");
            setAdditionalMessage("");

        } catch (error) {
            setSuccess(false);

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-15 mb-15 bg-white border border-[#f0dfd9] rounded-2xl shadow-sm overflow-hidden">

            {/* Form Header */}
            <div className="bg-[#f8eeeb] px-6 py-8 md:px-9">

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#401b29] mb-3">
                    Request Your Booking
                </h2>

                <p className="text-sm md:text-base text-[#806a70] leading-7 max-w-lg">
                    Share your event details with the service provider.
                    We will help you make your special day memorable.
                </p>

            </div>

            {/* Form Body */}
            <div className="p-6 md:p-9">

                <form onSubmit={handleSubmit} className="space-y-7">

                    {/* Event Date */}
                    <div>

                        <label className="block text-sm font-semibold text-[#4b1727] mb-3">
                            Event Date <span className="text-red-500">*</span>
                        </label>

                        <div
                            className="relative cursor-pointer"
                            onClick={() =>
                                dateInputRef.current?.showPicker?.()
                            }
                        >

                            <input
                                ref={dateInputRef}
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={eventDate}
                                onChange={(e) =>
                                    setEventDate(e.target.value)
                                }
                                className="w-full bg-[#fffaf7] border border-[#ead6d1] rounded-xl pl-4 pr-12 py-3.5 text-[#4b1727] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 cursor-pointer"
                            />

                            <CalendarDays
                                size={20}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#800000] pointer-events-none"
                            />

                        </div>

                        <p className="text-xs text-[#947e82] mt-2">
                            Select your preferred event date.
                        </p>

                    </div>

                    {/* Event Location */}
                    <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-[#4b1727] mb-3">

                            <MapPin
                                size={18}
                                className="text-[#800000]"
                            />

                            Event Location

                            <span className="text-red-500">*</span>

                        </label>

                        <input
                            type="text"
                            required
                            placeholder="Enter your event location"
                            value={eventLocation}
                            onChange={(e) =>
                                setEventLocation(e.target.value)
                            }
                            className="w-full bg-[#fffaf7] border border-[#ead6d1] rounded-xl px-4 py-3.5 text-[#4b1727] placeholder:text-[#b6a4a6] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                        />

                    </div>

                    {/* Additional Message */}
                    <div>

                        <label className="flex items-center gap-2 text-sm font-semibold text-[#4b1727] mb-3">

                            <MessageSquare
                                size={18}
                                className="text-[#800000]"
                            />

                            Additional Message

                            <span className="text-xs font-normal text-[#947e82]">
                                (Optional)
                            </span>

                        </label>

                        <textarea
                            rows={5}
                            placeholder="Write additional details about your event..."
                            value={additionalMessage}
                            onChange={(e) =>
                                setAdditionalMessage(e.target.value)
                            }
                            className="w-full bg-[#fffaf7] border border-[#ead6d1] rounded-xl px-4 py-3.5 text-[#4b1727] placeholder:text-[#b6a4a6] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 resize-none"
                        />

                    </div>

                    {/* Response Message */}
                    {message && (

                        <div
                            className={`p-4 rounded-xl text-sm border ${success
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                                }`}
                        >
                            {message}
                        </div>

                    )}

                    {/* Submit Button */}
                    <div className="pt-3 border-t border-[#f0dfd9]">

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#800000] hover:bg-[#600000] text-white font-semibold py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#800000]/10"
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />

                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />

                                    Submit Booking Request
                                </>
                            )}

                        </button>

                        <p className="text-center text-xs text-[#947e82] mt-4 leading-6">
                            Your booking request will be sent to the service provider
                            for review.
                        </p>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default BookingForm;