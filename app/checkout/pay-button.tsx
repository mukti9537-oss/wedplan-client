"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface PayButtonProps {
    premiumPrice: number;
}

export default function PayButton({
    premiumPrice,
}: PayButtonProps) {

    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);

            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Payment session creation failed"
                );
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Stripe checkout URL not found");
            }

        } catch (error) {
            console.error("Payment Error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#843047] hover:bg-[#692438] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 font-bold text-base shadow-lg shadow-[#843047]/20 transition active:scale-[0.98]"
        >
            {loading ? (
                <>
                    <Loader2 size={19} className="animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    Pay ৳{premiumPrice.toLocaleString("en-BD")}
                    <CreditCard size={19} />
                </>
            )}
        </button>
    );
}