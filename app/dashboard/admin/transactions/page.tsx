"use client";

import { useEffect, useState } from "react";
import {
    Wallet,
    Loader2,
    AlertCircle,
    ShieldCheck,
    Store,
} from "lucide-react";

import { getTransactions } from "@/lib/api/user";

interface Transaction {
    _id: string;
    vendorName: string;
    vendorEmail: string;
    plan: string;
    amount: number | null;
    currency: string;
    status: string;
    date: string | null;
    sessionId?: string;
}

const formatDate = (date: string | null) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatAmount = (amount: number | null, currency: string) => {
    if (amount === null || amount === undefined) return "Not available";
    const value = Number(amount) / 100;
    return `${value.toLocaleString("en-BD", { minimumFractionDigits: 2 })} ${(
        currency || "usd"
    ).toUpperCase()}`;
};

const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
        case "paid":
        case "complete":
        case "succeeded":
            return "bg-[#dcf4df] text-[#18743b]";
        case "pending":
        case "open":
            return "bg-[#fff0d0] text-[#a65b08]";
        default:
            return "bg-[#fde2e2] text-[#b42318]";
    }
};

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getTransactions();
            setTransactions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Transactions Error:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load transactions"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchTransactions();
    }, []);

    const totalAmount = transactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
    );

    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <p className="text-sm text-[#800000] font-medium mb-2">
                    Admin / Transactions
                </p>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727]">
                    Transactions
                </h1>

                <p className="text-[#8c7479] mt-2">
                    View all premium subscription payments on the platform.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                        <Wallet size={22} className="text-[#800000]" />
                    </div>

                    <p className="text-sm text-[#806a70]">Total Transactions</p>

                    <h2 className="text-3xl font-serif font-bold text-[#800000] mt-2">
                        {transactions.length}
                    </h2>
                </div>

                <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                        <Store size={22} className="text-[#800000]" />
                    </div>

                    <p className="text-sm text-[#806a70]">Premium Vendors</p>

                    <h2 className="text-3xl font-serif font-bold text-[#800000] mt-2">
                        {
                            transactions.filter(
                                (t) =>
                                    t.status?.toLowerCase() === "paid" ||
                                    t.status?.toLowerCase() === "complete"
                            ).length
                        }
                    </h2>
                </div>

                <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                        <ShieldCheck size={22} className="text-[#800000]" />
                    </div>

                    <p className="text-sm text-[#806a70]">Total Revenue</p>

                    <h2 className="text-3xl font-serif font-bold text-[#800000] mt-2">
                        {formatAmount(totalAmount, "usd")}
                    </h2>
                </div>

            </div>

            {/* Read-only notice */}
            <div className="flex items-start gap-3 bg-[#fff7f4] border border-[#f0dfd9] rounded-xl p-4 mb-6">
                <ShieldCheck size={20} className="text-[#800000] shrink-0 mt-0.5" />
                <p className="text-sm text-[#6b555b] leading-6">
                    Payment records are created automatically by verified Stripe
                    webhook events and cannot be modified manually. Successful
                    payments can never be marked as unsuccessful from here.
                </p>
            </div>

            {/* Transactions Table */}
            <div className="overflow-hidden rounded-xl border border-[#f0dfd9] bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[750px] text-left">

                        <thead className="bg-[#fff4ef] text-sm text-[#4b1727]">
                            <tr>
                                <th className="px-5 py-4">Vendor</th>
                                <th className="px-5 py-4">Subscription Plan</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#f0dfd9]">

                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Loader2
                                            className="mx-auto animate-spin text-[#800000]"
                                            size={28}
                                        />
                                        <p className="mt-3 text-sm text-[#947e82]">
                                            Loading transactions...
                                        </p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <AlertCircle
                                                size={30}
                                                className="text-[#b42318]"
                                            />
                                            <p className="text-sm text-[#b42318]">
                                                {error}
                                            </p>
                                            <button
                                                onClick={fetchTransactions}
                                                className="text-sm font-semibold text-[#800000] underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-sm text-[#947e82]">
                                        No transactions found yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction._id}
                                        className="text-sm hover:bg-[#fffaf7]"
                                    >

                                        {/* Vendor */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                                    {(transaction.vendorName || "V")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-[#4b1727]">
                                                        {transaction.vendorName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#947e82]">
                                                        {transaction.vendorEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-[#fce8e6] px-3 py-1 text-xs font-semibold text-[#800000]">
                                                {transaction.plan}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-5 py-4 font-medium text-[#4b1727]">
                                            {formatAmount(
                                                transaction.amount,
                                                transaction.currency
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                    transaction.status
                                                )}`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-4 text-[#6b555b]">
                                            {formatDate(transaction.date)}
                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer note */}
            <div className="mt-5 pt-4 border-t border-[#f0dfd9] text-sm text-[#947e82]">
                Showing {transactions.length} transaction{transactions.length === 1 ? "" : "s"}.
                Records are read-only.
            </div>

        </div>
    );
}
