"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    CheckCircle,
    XCircle,
    CreditCard,
    ShieldCheck,
    ArrowRight,
    RefreshCw,
} from "lucide-react";

const PaymentPage = () => {
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get("status");
    const status = paymentStatus === "success" || paymentStatus === "cancel"
        ? paymentStatus
        : null;

    if (!status) {
        return (
            <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center p-5">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F3DDE5] text-center max-w-md w-full">
                    <CreditCard size={42} className="mx-auto text-[#843047] mb-4" />
                    <h2 className="text-xl font-bold text-[#542332]">
                        Payment Status
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        No payment status found. Please return to your subscription page.
                    </p>
                    <Link
                        href="/dashboard/vendor/subscription"
                        className="inline-flex items-center gap-2 mt-6 bg-[#843047] hover:bg-[#542332] text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Back to Subscription
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    const isSuccess = status === "success";

    return (
        <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center px-4 py-12">

            <div className="max-w-lg w-full bg-white rounded-3xl border border-[#F3DDE5] shadow-lg shadow-[#843047]/5 overflow-hidden">

                {/* Top Decoration */}
                <div className={`h-2 ${isSuccess ? "bg-green-500" : "bg-[#843047]"}`} />

                <div className="p-7 md:p-10 text-center">

                    {/* Status Icon */}
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                        isSuccess ? "bg-green-50" : "bg-[#FCE7EE]"
                    }`}>
                        {isSuccess ? (
                            <CheckCircle size={55} className="text-green-600" />
                        ) : (
                            <XCircle size={55} className="text-[#843047]" />
                        )}
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl md:text-3xl font-bold text-[#542332]">
                        {isSuccess
                            ? "Payment Successful!"
                            : "Payment Cancelled"}
                    </h1>

                    <p className="text-gray-500 text-sm leading-7 mt-4">
                        {isSuccess
                            ? "Thank you for choosing WedPlan Premium! Your payment has been received. We are verifying your transaction."
                            : "Your payment was cancelled. No payment confirmation was received. You can return to your subscription page and try again."}
                    </p>

                    {/* Payment Information */}
                    <div className="bg-[#FFF8FA] border border-[#F3DDE5] rounded-2xl p-5 mt-8 text-left">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FCE7EE] flex items-center justify-center">
                                <CreditCard size={20} className="text-[#843047]" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#542332]">
                                    WedPlan Premium
                                </p>
                                <p className="text-xs text-gray-500">
                                    Vendor Subscription
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-[#F3DDE5] pt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                Payment Status
                            </span>

                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                isSuccess
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-600"
                            }`}>
                                {isSuccess ? "Verification Pending" : "Cancelled"}
                            </span>
                        </div>

                    </div>

                    {/* Security Notice */}
                    {isSuccess && (
                        <div className="flex items-start gap-3 text-left bg-green-50 border border-green-100 rounded-xl p-4 mt-5">
                            <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-green-700 leading-6">
                                Your Premium access will be activated after Stripe verifies your payment.
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-8 space-y-3">

                        {isSuccess ? (
                            <Link
                                href="/dashboard/vendor"
                                className="w-full flex items-center justify-center gap-2 bg-[#843047] hover:bg-[#542332] text-white py-3.5 rounded-xl font-semibold transition"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard/vendor/subscription"
                                className="w-full flex items-center justify-center gap-2 bg-[#843047] hover:bg-[#542332] text-white py-3.5 rounded-xl font-semibold transition"
                            >
                                <RefreshCw size={17} />
                                Try Again
                            </Link>
                        )}

                        <Link
                            href="/"
                            className="block text-sm text-[#843047] hover:text-[#542332] font-medium py-2 transition"
                        >
                            Back to Home
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
