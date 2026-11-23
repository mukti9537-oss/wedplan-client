import { checkoutVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2,
    Heart,
    ArrowRight,
    CreditCard,
    ShieldCheck,
    Receipt,
    Mail,
} from "lucide-react";

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const { session_id } = await searchParams;

    if (!session_id || typeof session_id !== "string") {
        return redirect("/");
    }

    let session;

    try {
        session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items", "payment_intent"],
        });
    } catch {
        return redirect("/");
    }

    const {
        status,
        payment_status,
        customer_email,
        metadata,
        payment_intent,
    } = session;

    if (status !== "complete" || payment_status !== "paid") {
        return redirect("/");
    }

    let verificationResult;

    try {
        verificationResult = await checkoutVerify(session_id);

        console.log("Payment Verification:", verificationResult);

        if (
            verificationResult &&
            typeof verificationResult === "object" &&
            "success" in verificationResult &&
            verificationResult.success === false
        ) {
            throw new Error("Payment verification failed");
        }
    } catch (error) {
        console.error("checkoutVerify failed:", error);

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#FBF2F0] px-4 py-12">
                <div className="w-full max-w-lg rounded-3xl border border-[#F0DDDA] bg-white p-8 text-center shadow-xl">
                    <h1 className="font-serif text-2xl font-bold text-[#401827]">
                        Payment Verification Failed
                    </h1>
                    <p className="mt-3 text-sm text-[#80676B]">
                        Your payment was received, but subscription verification could not be completed. Please contact support.
                    </p>
                    <Link
                        href="/dashboard/vendor"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#8B0D0D] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Go to Dashboard
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </main>
        );
    }

    const paymentIntentId =
        typeof payment_intent === "string"
            ? payment_intent
            : payment_intent?.id;

    const metadataEntries = Object.entries(metadata ?? {}).filter(
        ([, value]) => value !== null && value !== ""
    );

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FBF2F0] px-4 py-12">

            <div className="w-full max-w-2xl">

                {/* Success Card */}
                <div className="overflow-hidden rounded-3xl border border-[#F0DDDA] bg-white shadow-[0_15px_50px_rgba(64,24,39,0.10)]">

                    {/* Header */}
                    <div className="bg-[#401827] px-6 py-10 text-center text-white md:px-10">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                            <CheckCircle2
                                size={48}
                                className="text-green-600"
                            />
                        </div>

                        <div className="mb-3 flex items-center justify-center gap-2">
                            <Heart size={15} className="fill-[#E8B8A8] text-[#E8B8A8]" />
                            <span className="text-xs font-semibold uppercase tracking-[3px] text-[#E8B8A8]">
                                WedPlan Marketplace
                            </span>
                            <Heart size={15} className="fill-[#E8B8A8] text-[#E8B8A8]" />
                        </div>

                        <h1 className="font-serif text-3xl font-bold md:text-4xl">
                            Payment Successful!
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#F1DDE0]">
                            Thank you for upgrading your subscription.
                            Your payment has been successfully verified.
                        </p>

                    </div>

                    {/* Payment Details */}
                    <div className="p-6 md:p-10">

                        <div className="mb-7 text-center">
                            <h2 className="font-serif text-2xl font-bold text-[#401827]">
                                Payment Details
                            </h2>
                            <p className="mt-2 text-sm text-[#927A7D]">
                                Here is your transaction information.
                            </p>
                        </div>

                        <div className="space-y-4">

                            {/* Payment Status */}
                            <div className="flex items-center justify-between rounded-xl bg-[#F4F9F3] p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="text-green-600" size={20} />
                                    <span className="text-sm font-medium text-[#401827]">
                                        Payment Status
                                    </span>
                                </div>

                                <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-bold uppercase text-green-700">
                                    {payment_status}
                                </span>
                            </div>

                            {/* Customer Email */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#F0DDDA] p-4">
                                <Mail size={19} className="mt-0.5 text-[#8B0D0D]" />

                                <div className="min-w-0">
                                    <p className="text-xs text-[#927A7D]">
                                        Customer Email
                                    </p>
                                    <p className="mt-1 break-all text-sm font-semibold text-[#401827]">
                                        {customer_email || "Not available"}
                                    </p>
                                </div>
                            </div>

                            {/* Session ID */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#F0DDDA] p-4">
                                <Receipt size={19} className="mt-0.5 text-[#8B0D0D]" />

                                <div className="min-w-0">
                                    <p className="text-xs text-[#927A7D]">
                                        Checkout Session ID
                                    </p>
                                    <p className="mt-1 break-all text-xs font-medium text-[#401827]">
                                        {session.id}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Intent */}
                            <div className="flex items-start gap-3 rounded-xl border border-[#F0DDDA] p-4">
                                <CreditCard size={19} className="mt-0.5 text-[#8B0D0D]" />

                                <div className="min-w-0">
                                    <p className="text-xs text-[#927A7D]">
                                        Payment Intent ID
                                    </p>
                                    <p className="mt-1 break-all text-xs font-medium text-[#401827]">
                                        {paymentIntentId || "Not available"}
                                    </p>
                                </div>
                            </div>

                            {/* Metadata */}
                            {metadataEntries.length > 0 && (
                                <div className="rounded-xl border border-[#F0DDDA] p-4">

                                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#401827]">
                                        <Receipt size={18} className="text-[#8B0D0D]" />
                                        Subscription Information
                                    </h3>

                                    <div className="space-y-3">
                                        {metadataEntries.map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EAE8] pb-3 last:border-0 last:pb-0"
                                            >
                                                <span className="text-sm capitalize text-[#927A7D]">
                                                    {key.replace(/_/g, " ")}
                                                </span>

                                                <span className="break-all text-sm font-semibold text-[#401827]">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Verification Message */}
                        <div className="mt-7 rounded-xl border border-[#E8D4C8] bg-[#FFF9F5] p-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck
                                    size={24}
                                    className="shrink-0 text-[#8B0D0D]"
                                />

                                <div>
                                    <p className="text-sm font-bold text-[#401827]">
                                        Payment Verified Successfully
                                    </p>
                                    <p className="mt-1 text-xs leading-6 text-[#927A7D]">
                                        Your transaction has been verified through Stripe.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Button */}
                        <Link
                            href="/dashboard/vendor"
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B0D0D] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#8B0D0D]/15 transition hover:bg-[#6E0808]"
                        >
                            Go to Vendor Dashboard
                            <ArrowRight size={18} />
                        </Link>

                        <p className="mt-5 text-center text-xs text-[#A58B8E]">
                            Thank you for being a part of WedPlan.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}