"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    CalendarDays,
    Loader2,
    MapPin,
    MessageSquare,
    Send,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createApplication } from "@/lib/actions/bookingsrequests";

const BookingForm = () => {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const serviceId = params.id;

    const dateInputRef = useRef<HTMLInputElement>(null);
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [additionalMessage, setAdditionalMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.replace(
                `/sign-in?callbackURL=${encodeURIComponent(
                    `/bookingform/${serviceId}`
                )}`
            );
        }
    }, [isPending, router, serviceId, session?.user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!session?.user) return;

        setLoading(true);
        setMessage("");
        setSuccess(false);

        try {
            const bookingsrequest = {
                bookingId: serviceId,
                customerId: session.user.id,
                email: session.user.email,
                BookingDate: eventDate,
                BookingLocation: eventLocation,
                AdditionalMessage: additionalMessage,
            };

            const result = await createApplication(bookingsrequest);
            console.log("Booking Response:", result);

            if (result.insertedId) {
                setSuccess(true);
                setMessage("Booking request submitted successfully!");
                toast.success("Booking request submitted successfully!");
                router.push("/browse-services");
            } else {
                setSuccess(false);
                setMessage("Unable to submit your booking request. Please try again.");
            }
        } catch (error) {
            setSuccess(false);
            setMessage("Unable to submit your booking request. Please try again.");
            console.error("Booking request failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isPending || !session?.user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 size={35} className="animate-spin text-[#800000]" />
                <span className="ml-3 text-[#401b29]">
                    Checking authentication...
                </span>
            </div>
        );
    }

    if (session.user.role !== "customer") {
        return (
            <div className="max-w-2xl mx-auto mt-15 mb-15 p-8 text-center rounded-2xl border border-[#f0dfd9] bg-white text-[#401b29]">
                Only customers can submit booking requests.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-15 mb-15 bg-white border border-[#f0dfd9] rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#f8eeeb] px-6 py-8 md:px-9">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#401b29] mb-3">
                    Request Your Booking
                </h2>
                <p className="text-sm md:text-base text-[#806a70] leading-7 max-w-lg">
                    Share your event details with the service provider.
                    We will help you make your special day memorable.
                </p>
            </div>

            <div className="p-6 md:p-9">
                <form onSubmit={handleSubmit} className="space-y-7">
                    <div>
                        <label className="block text-sm font-semibold text-[#4b1727] mb-3">
                            Event Date <span className="text-red-500">*</span>
                        </label>

                        <div
                            className="relative cursor-pointer"
                            onClick={(e) =>
                                e.currentTarget
                                    .querySelector<HTMLInputElement>("input")
                                    ?.showPicker?.()
                            }
                        >
                            <input
                                ref={dateInputRef}
                                type="date"
                                required
                                min={new Date().toISOString().split("T")[0]}
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
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

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#4b1727] mb-3">
                            <MapPin size={18} className="text-[#800000]" />
                            Event Location
                            <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            required
                            placeholder="Enter your event location"
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="w-full bg-[#fffaf7] border border-[#ead6d1] rounded-xl px-4 py-3.5 text-[#4b1727] placeholder:text-[#b6a4a6] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#4b1727] mb-3">
                            <MessageSquare size={18} className="text-[#800000]" />
                            Additional Message
                            <span className="text-xs font-normal text-[#947e82]">
                                (Optional)
                            </span>
                        </label>

                        <textarea
                            rows={5}
                            placeholder="Write additional details about your event..."
                            value={additionalMessage}
                            onChange={(e) => setAdditionalMessage(e.target.value)}
                            className="w-full bg-[#fffaf7] border border-[#ead6d1] rounded-xl px-4 py-3.5 text-[#4b1727] placeholder:text-[#b6a4a6] outline-none transition focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 resize-none"
                        />
                    </div>

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

                    <div className="pt-3 border-t border-[#f0dfd9]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#800000] hover:bg-[#600000] text-white font-semibold py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#800000]/10"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
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