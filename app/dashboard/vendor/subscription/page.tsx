"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Check,
    Crown,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
    {
        name: "Free Plan",
        subtitle: "Get started with your wedding business",
        price: "Free",
        period: "Forever",
        features: [
            "Maximum 3 Active Services",
            "Basic Vendor Dashboard",
            "Booking Request Management",
        ],
        buttonText: "Current Plan",
        premium: false,
    },
    {
        name: "Premium Plan",
        subtitle: "Grow your business without limits",
        price: "Premium",
        period: "Subscription",
        features: [
            "Unlimited Active Services",
            "Premium Vendor Badge",
            "All Free Plan Features",
        ],
        buttonText: "Upgrade to Premium",
        premium: true,
    },
];

export default function SubscriptionPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#FFF8FA] px-4 py-8 md:px-8">

            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                <Link
                    href="/dashboard/vendor"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#783447] transition hover:text-[#A43D5B]"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                {/* Heading */}
                <div className="mb-10 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE7EE] text-[#8B304A]">
                        <Crown size={28} />
                    </div>

                    <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#A34A64]">
                        Subscription Plans
                    </p>

                    <h1 className="text-3xl font-bold text-[#542332] md:text-4xl">
                        Choose Your Perfect Plan
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 md:text-base">
                        Select the right plan for your business and take your
                        wedding service business to the next level.
                    </p>

                </div>

                {/* Plan Cards */}
                <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">

                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9 ${
                                plan.premium
                                    ? "border-[#9A405A] bg-white shadow-lg shadow-[#8B304A]/10"
                                    : "border-[#F2DCE3] bg-white shadow-sm"
                            }`}
                        >

                            {/* Premium Badge */}
                            {plan.premium && (
                                <div className="absolute -top-4 right-6 flex items-center gap-1.5 rounded-full bg-[#843047] px-4 py-2 text-xs font-semibold text-white shadow-md">
                                    <Sparkles size={14} />
                                    RECOMMENDED
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div
                                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${
                                    plan.premium
                                        ? "bg-[#FCE7EE] text-[#8B304A]"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {plan.premium ? (
                                    <Crown size={25} />
                                ) : (
                                    <ShieldCheck size={25} />
                                )}
                            </div>

                            {/* Plan Name */}
                            <h2 className="text-2xl font-bold text-[#542332]">
                                {plan.name}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {plan.subtitle}
                            </p>

                            {/* Price */}
                            <div className="my-7 border-b border-dashed border-[#EBD8DF] pb-7">
                                <h3 className="text-3xl font-bold text-[#843047]">
                                    {plan.price}
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    {plan.period}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="flex-1">

                                <h3 className="mb-5 text-sm font-semibold text-[#542332]">
                                    What&apos;s included:
                                </h3>

                                <div className="space-y-5">
                                    {plan.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FCE7EE] text-[#8B304A]">
                                                <Check size={13} strokeWidth={3} />
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {feature}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            {/* Button */}
                            {plan.premium ? (
                                <button
                                    onClick={() => router.push("/checkout")}
                                    className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#843047] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#843047]/20 transition hover:bg-[#692438] active:scale-[0.98]"
                                >
                                    <Zap size={17} />
                                    {plan.buttonText}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="mt-9 w-full cursor-not-allowed rounded-xl border border-[#EBD8DF] bg-[#FFF8FA] px-5 py-3.5 text-sm font-semibold text-[#843047]"
                                >
                                    {plan.buttonText}
                                </button>
                            )}

                        </div>
                    ))}

                </div>

                {/* Bottom Information */}
                <div className="mx-auto mt-9 flex max-w-4xl items-start gap-3 rounded-2xl border border-[#F2DCE3] bg-white p-5">

                    <ShieldCheck
                        size={22}
                        className="mt-0.5 shrink-0 text-[#843047]"
                    />

                    <div>
                        <h3 className="text-sm font-semibold text-[#542332]">
                            Secure Subscription
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500 md:text-sm">
                            Your subscription payment will be securely
                            processed through Stripe. Your Premium benefits
                            will activate after payment verification.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}