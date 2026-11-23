import Link from "next/link";

import {
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    Lock,
    Crown,
    CheckCircle,
} from "lucide-react";

// import PayButton from "./pay-button";

// interface CheckoutPageProps {
//     searchParams: Promise<{
//         plan?: string;
//         canceled?: string;
//     }>;
// }

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {

    const { canceled } = await searchParams

    if (canceled) {
        console.log(
            'Order canceled -- continue to shop around and check out when you\'re ready.'
        )
    }

    // Premium Plan Price
    const premiumPrice = 2000;

    return (
        <div className="min-h-screen bg-[#FFF8FA] px-4 py-10 md:py-16">

            <div className="max-w-5xl mx-auto">

                {/* Back Button */}
                <Link
                    href="/dashboard/vendor/subscription"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#843047] hover:text-[#542332] transition mb-8"
                >
                    <ArrowLeft size={18} />
                    Back to Subscription
                </Link>

                {/* Checkout Heading */}
                <div className="text-center mb-10">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FCE7EE] text-[#843047] mb-4">
                        <Lock size={26} />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#542332]">
                        Secure Checkout
                    </h1>

                    <p className="text-gray-500 mt-3 text-sm md:text-base">
                        Complete your payment and unlock WedPlan Premium.
                    </p>

                </div>

                {/* Checkout Card */}
                <div className="bg-white rounded-3xl border border-[#F3DDE5] shadow-lg shadow-[#843047]/5 overflow-hidden">

                    <div className="h-1.5 bg-[#843047]" />

                    <div className="grid md:grid-cols-2">

                        {/* Left Side - Order Summary */}
                        <div className="p-7 md:p-10 border-b md:border-b-0 md:border-r border-[#F3DDE5]">

                            <p className="text-xs font-bold tracking-[2px] text-[#A34A64] uppercase mb-8">
                                Order Summary
                            </p>

                            {/* Plan Information */}
                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-start gap-4">

                                    <div className="w-12 h-12 rounded-xl bg-[#FCE7EE] flex items-center justify-center text-[#843047] shrink-0">
                                        <Crown size={25} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-lg text-[#542332]">
                                            WedPlan Premium
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Access to all premium features
                                        </p>
                                    </div>

                                </div>

                                <p className="font-bold text-[#542332] whitespace-nowrap">
                                    ৳{premiumPrice.toLocaleString("en-BD")}
                                </p>

                            </div>

                            {/* Features */}
                            <div className="mt-8 space-y-4">

                                {[
                                    "Unlimited Active Services",
                                    "Premium Vendor Badge",
                                    "Booking Request Management",
                                    "All Premium Features",
                                ].map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-3 text-sm text-gray-600"
                                    >
                                        <CheckCircle
                                            size={17}
                                            className="text-[#843047] shrink-0"
                                        />

                                        {feature}
                                    </div>
                                ))}

                            </div>

                            {/* Total */}
                            <div className="mt-10 pt-6 border-t border-dashed border-[#EBD8DF]">

                                <div className="flex items-center justify-between">

                                    <span className="font-semibold text-[#542332]">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-[#843047]">
                                        ৳{premiumPrice.toLocaleString("en-BD")}
                                    </span>

                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    One-time payment for Premium subscription
                                </p>

                            </div>

                        </div>

                        {/* Right Side - Payment Method */}
                        <div className="p-7 md:p-10">

                            <p className="text-xs font-bold tracking-[2px] text-[#A34A64] uppercase mb-8">
                                Payment Method
                            </p>

                            {/* Card Payment */}
                            <div className="border border-[#DDBCC7] rounded-2xl overflow-hidden">

                                <div className="flex items-center gap-3 bg-[#FFF8FA] px-5 py-4 border-b border-[#F3DDE5]">

                                    <CreditCard
                                        size={21}
                                        className="text-[#843047]"
                                    />

                                    <span className="font-semibold text-[#542332]">
                                        Card Payment
                                    </span>

                                    <span className="ml-auto text-xs font-semibold bg-[#FCE7EE] text-[#843047] px-3 py-1 rounded-full">
                                        Secure
                                    </span>

                                </div>

                                <div className="p-5">

                                    <p className="text-sm text-gray-600 leading-7">
                                        You will be redirected to Stripe&apos;s
                                        secure checkout to complete your payment.
                                        Your card details are never stored on
                                        WedPlan.
                                    </p>

                                </div>

                            </div>

                            {/* Pay Button */}
                            {/* <PayButton premiumPrice={premiumPrice} /> */}
                            <form action="/api/checkout_sessions" method="POST">
                                <section>
                                    <button
                                        type="submit" role="link"
                                        className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-[#843047] hover:bg-[#692438] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 font-bold text-base shadow-lg shadow-[#843047]/20 transition active:scale-[0.98]"
                                    >
                                        Checkout ${premiumPrice.toLocaleString("en-BD")}
                                    </button>
                                </section>
                            </form>

                            {/* Stripe Information */}
                            <div className="mt-5 flex items-center justify-center gap-2 text-gray-400">

                                <Lock size={13} />

                                <span className="text-xs font-medium">
                                    Secure Checkout Powered by Stripe
                                </span>

                            </div>

                            {/* Security Notice */}
                            <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#FFF8FA] border border-[#F3DDE5] p-4">

                                <ShieldCheck
                                    size={21}
                                    className="text-[#843047] shrink-0"
                                />

                                <p className="text-xs leading-6 text-gray-500">
                                    Your payment is protected by Stripe&apos;s
                                    secure payment infrastructure. WedPlan
                                    does not store your card information.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    © 2026 WedPlan. Secure Payment Experience.
                </p>

            </div>

        </div>
    );
}