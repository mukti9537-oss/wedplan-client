"use client";

import React from "react";
import {
    Users,
    UserRound,
    Store,
    BriefcaseBusiness,
    Clock,
    Wallet,
    Search,
    Eye,
    Ban,
    CheckCircle2,
    XCircle,
    Trash2,
    Crown,
    ArrowRight,
    Filter,
    CalendarDays,
} from "lucide-react";
import Image from "next/image";


const stats = [
    {
        title: "Registered Users",
        value: "1,248",
        icon: Users,
    },
    {
        title: "Total Vendors",
        value: "186",
        icon: Store,
    },
    {
        title: "Total Customers",
        value: "1,062",
        icon: UserRound,
    },
    {
        title: "Total Services",
        value: "342",
        icon: BriefcaseBusiness,
    },
    {
        title: "Pending Services",
        value: "18",
        icon: Clock,
    },
    {
        title: "Total Transactions",
        value: "৳4,85,000",
        icon: Wallet,
    },
];


const users = [
    {
        name: "Sarah Ahmed",
        email: "sarah@gmail.com",
        role: "Customer",
        status: "Active",
        joined: "Nov 15, 2026",
    },
    {
        name: "Dream Lens Photography",
        email: "dreamlens@gmail.com",
        role: "Vendor",
        status: "Active",
        joined: "Nov 12, 2026",
    },
    {
        name: "Nusrat Jahan",
        email: "nusrat@gmail.com",
        role: "Customer",
        status: "Blocked",
        joined: "Nov 10, 2026",
    },
    {
        name: "Royal Events",
        email: "royal@gmail.com",
        role: "Vendor",
        status: "Active",
        joined: "Nov 08, 2026",
    },
];


const services = [
    {
        name: "Wedding Photography",
        vendor: "Dream Lens Photography",
        category: "Photography",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=100",
    },
    {
        name: "Floral Decoration",
        vendor: "Bloom Wedding Decor",
        category: "Decoration",
        status: "Approved",
        image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=100",
    },
    {
        name: "Wedding Venue",
        vendor: "Royal Events",
        category: "Venue",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100",
    },
];


const transactions = [
    {
        vendor: "Dream Lens Photography",
        plan: "Premium",
        amount: "৳2,500",
        status: "Successful",
        date: "Nov 18, 2026",
    },
    {
        vendor: "Bloom Wedding Decor",
        plan: "Premium",
        amount: "৳2,500",
        status: "Successful",
        date: "Nov 16, 2026",
    },
    {
        vendor: "Royal Events",
        plan: "Premium",
        amount: "৳2,500",
        status: "Failed",
        date: "Nov 14, 2026",
    },
];


const AdminDashboardpage = () => {
    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>
                    <p className="text-sm text-[#800000] font-medium mb-2">
                        Admin / Dashboard
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4b1727]">
                        Admin Dashboard
                    </h1>

                    <p className="text-[#8c7479] mt-2 text-sm md:text-base">
                        Monitor and manage your entire WedPlan platform.
                    </p>
                </div>

                <div className="bg-white border border-[#f0dfd9] rounded-xl px-5 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center">
                        <Crown className="text-[#800000]" size={22} />
                    </div>

                    <div>
                        <p className="text-xs text-[#947e82]">
                            Account Role
                        </p>
                        <p className="font-semibold text-[#4b1727]">
                            Administrator
                        </p>
                    </div>
                </div>

            </div>


            {/* Overview Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-8">

                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >

                        <div className="w-12 h-12 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                            <stat.icon className="text-[#800000]" size={23} />
                        </div>

                        <p className="text-sm text-[#5c4148] font-medium">
                            {stat.title}
                        </p>

                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#800000] mt-2">
                            {stat.value}
                        </h2>

                    </div>
                ))}

            </div>


            {/* Manage Users */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                            Manage Users
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            View and manage all registered platform users.
                        </p>
                    </div>

                    <button className="text-[#800000] font-semibold flex items-center gap-2 text-sm">
                        View All Users <ArrowRight size={17} />
                    </button>

                </div>


                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#947e82]"
                        />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full border border-[#eadbd5] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#800000] text-sm text-[#4b1727]"
                        />

                    </div>

                    <div className="relative">

                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]"
                        />

                        <select className="border border-[#eadbd5] rounded-xl py-3 pl-10 pr-8 outline-none focus:border-[#800000] text-sm text-[#4b1727] bg-white w-full sm:w-auto">
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Vendor</option>
                            <option>Customer</option>
                        </select>

                    </div>

                </div>


                {/* Users Table */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[750] text-left">

                        <thead>
                            <tr className="border-b border-[#f0dfd9] text-xs text-[#947e82] uppercase tracking-wider">
                                <th className="py-4 px-3">User</th>
                                <th className="py-4 px-3">Role</th>
                                <th className="py-4 px-3">Joined Date</th>
                                <th className="py-4 px-3">Status</th>
                                <th className="py-4 px-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[#f4e9e5] last:border-0 hover:bg-[#fffaf7]"
                                >

                                    <td className="py-4 px-3">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                                {user.name.charAt(0)}
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-[#4b1727]">
                                                    {user.name}
                                                </p>

                                                <p className="text-xs text-[#947e82] mt-1">
                                                    {user.email}
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    <td className="py-4 px-3">
                                        <span className="text-sm text-[#5c4148]">
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="py-4 px-3 text-sm text-[#806a70]">
                                        {user.joined}
                                    </td>

                                    <td className="py-4 px-3">

                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${user.status === "Active"
                                                ? "bg-[#dcf4df] text-[#18743b]"
                                                : "bg-[#fde2e2] text-[#b42323]"
                                            }`}>
                                            {user.status}
                                        </span>

                                    </td>

                                    <td className="py-4 px-3">

                                        <div className="flex justify-end items-center gap-2">

                                            <button className="p-2 rounded-lg border border-[#eadbd5] text-[#800000] hover:bg-[#fff1f1]">
                                                <Eye size={16} />
                                            </button>

                                            <button className={`p-2 rounded-lg ${user.status === "Active"
                                                    ? "border border-[#eadbd5] text-[#b42323] hover:bg-red-50"
                                                    : "border border-green-200 text-green-700 hover:bg-green-50"
                                                }`}>
                                                {user.status === "Active"
                                                    ? <Ban size={16} />
                                                    : <CheckCircle2 size={16} />
                                                }
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Manage Services */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                            Manage Services
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Review and manage vendor submitted services.
                        </p>
                    </div>

                    <button className="text-[#800000] font-semibold flex items-center gap-2 text-sm">
                        View All Services <ArrowRight size={17} />
                    </button>

                </div>


                <div className="space-y-4">

                    {services.map((service, index) => (

                        <div
                            key={index}
                            className="flex flex-col lg:flex-row lg:items-center gap-4 border border-[#f3e8e3] rounded-xl p-4 hover:shadow-sm transition-all"
                        >

                            <Image
                                width={10}
                                height={10}
                                src={service.image}
                                alt={service.name}
                                className="w-full lg:w-24 h-36 lg:h-20 object-cover rounded-lg"
                            />

                            <div className="flex-1">

                                <h3 className="font-semibold text-[#4b1727]">
                                    {service.name}
                                </h3>

                                <p className="text-sm text-[#806a70] mt-1">
                                    Vendor: {service.vendor}
                                </p>

                                <p className="text-xs text-[#947e82] mt-1">
                                    Category: {service.category}
                                </p>

                            </div>


                            <div className="flex flex-wrap items-center gap-3">

                                <span className={`text-xs font-semibold px-3 py-2 rounded-full ${service.status === "Approved"
                                        ? "bg-[#dcf4df] text-[#18743b]"
                                        : "bg-[#fff0d0] text-[#a65b08]"
                                    }`}>
                                    {service.status}
                                </span>


                                <button className="p-2 border border-[#eadbd5] text-[#800000] rounded-lg hover:bg-[#fff1f1]">
                                    <Eye size={17} />
                                </button>


                                {service.status === "Pending" && (
                                    <>
                                        <button className="flex items-center gap-1.5 bg-[#18743b] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-800">
                                            <CheckCircle2 size={15} />
                                            Approve
                                        </button>

                                        <button className="flex items-center gap-1.5 border border-[#b42323] text-[#b42323] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-50">
                                            <XCircle size={15} />
                                            Reject
                                        </button>
                                    </>
                                )}

                                <button className="p-2 border border-[#eadbd5] text-[#b42323] rounded-lg hover:bg-red-50">
                                    <Trash2 size={17} />
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* Transactions */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                            Recent Transactions
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Monitor vendor subscription payments.
                        </p>
                    </div>

                    <button className="text-[#800000] font-semibold flex items-center gap-2 text-sm">
                        View All Transactions <ArrowRight size={17} />
                    </button>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[650] text-left">

                        <thead>
                            <tr className="border-b border-[#f0dfd9] text-xs text-[#947e82] uppercase tracking-wider">
                                <th className="py-4 px-3">Vendor</th>
                                <th className="py-4 px-3">Plan</th>
                                <th className="py-4 px-3">Amount</th>
                                <th className="py-4 px-3">Payment Status</th>
                                <th className="py-4 px-3">Transaction Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {transactions.map((transaction, index) => (

                                <tr
                                    key={index}
                                    className="border-b border-[#f4e9e5] last:border-0 hover:bg-[#fffaf7]"
                                >

                                    <td className="py-4 px-3">
                                        <p className="text-sm font-semibold text-[#4b1727]">
                                            {transaction.vendor}
                                        </p>
                                    </td>

                                    <td className="py-4 px-3">

                                        <span className="flex items-center gap-1.5 text-sm text-[#800000] font-medium">
                                            <Crown size={15} />
                                            {transaction.plan}
                                        </span>

                                    </td>

                                    <td className="py-4 px-3 text-sm font-semibold text-[#4b1727]">
                                        {transaction.amount}
                                    </td>

                                    <td className="py-4 px-3">

                                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${transaction.status === "Successful"
                                                ? "bg-[#dcf4df] text-[#18743b]"
                                                : "bg-[#fde2e2] text-[#b42323]"
                                            }`}>
                                            {transaction.status}
                                        </span>

                                    </td>

                                    <td className="py-4 px-3 text-sm text-[#806a70]">
                                        {transaction.date}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Bottom Banner */}
            <div className="bg-linear-to-r from-[#f8dada] to-[#fce8e6] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#f3d2d2]">

                <div>

                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4b1727]">
                        Keep WedPlan Running Smoothly!
                    </h2>

                    <p className="text-sm md:text-base text-[#684650] mt-2">
                        Monitor users, review services and manage platform activities.
                    </p>

                </div>

                <div className="w-14 h-14 rounded-full bg-[#f4c9b5] flex items-center justify-center">
                    <Crown size={30} className="text-[#800000]" />
                </div>

            </div>

        </div>
    );
};

export default AdminDashboardpage;
