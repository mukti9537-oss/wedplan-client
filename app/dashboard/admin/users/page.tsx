"use client";

import { useEffect, useState } from "react";

import {
    Search,
    Filter,
    Eye,
    Ban,
    CheckCircle2,
    Users,
    UserRound,
    Mail,
    CalendarDays,
    X,
    Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import { blockUser } from "@/lib/api/admin";

// Types
interface User {
    _id: string;
    name?: string;
    email: string;
    role: "admin" | "vendor" | "customer";
    isBlocked?: boolean;
    blockedAt?: Date | string;
    createdAt?: Date | string;
}

interface RawUser {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: User["role"];
    isBlocked?: boolean;
    blockedAt?: Date | string;
    createdAt?: Date | string;
}

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ManageUsersPage() {
    // States
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Search and Filter
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch All Users
    const fetchUsers = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/users`, {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await res.json();

            const userData = Array.isArray(data)
                ? data
                : data.users || [];

            const formattedUsers: User[] = userData.flatMap(
                (u: RawUser) => {
                    const id = u._id || u.id;

                    if (!id || !u.email) return [];

                    return [{
                        _id: id,
                        name: u.name || u.email.split("@")[0],
                        email: u.email,
                        role: u.role || "customer",
                        isBlocked: u.isBlocked ?? false,
                        blockedAt: u.blockedAt,
                        createdAt: u.createdAt,
                    }];
                }
            );

            setUsers(formattedUsers);

        } catch (error) {
            console.error("Fetch Users Error:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchUsers();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    // Search and Role Filter
    const filteredUsers = users.filter((user) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            user.name?.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText);

        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Statistics
    const totalUsers = users.length;

    const totalVendors = users.filter(
        (user) => user.role === "vendor"
    ).length;

    const totalCustomers = users.filter(
        (user) => user.role === "customer"
    ).length;

    const blockedUsers = users.filter(
        (user) => user.isBlocked
    ).length;

    // Block / Unblock User
    const handleBlockUser = async (user: User) => {
        try {
            setActionLoading(true);

            await blockUser(user._id, !user.isBlocked);

            toast.success(
                user.isBlocked
                    ? "User unblocked successfully"
                    : "User blocked successfully"
            );

            await fetchUsers();

            setSelectedUser((current) =>
                current?._id === user._id
                    ? {
                        ...current,
                        isBlocked: !user.isBlocked,
                        blockedAt: !user.isBlocked
                            ? new Date()
                            : undefined,
                    }
                    : current
            );

        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update user status"
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <p className="text-sm text-[#800000] font-medium mb-2">
                    Admin / Manage Users
                </p>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727]">
                    Manage Users
                </h1>

                <p className="text-[#8c7479] mt-2">
                    View, search and manage all registered users.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

                {[
                    {
                        title: "Total Users",
                        value: totalUsers,
                        icon: Users,
                    },
                    {
                        title: "Total Vendors",
                        value: totalVendors,
                        icon: UserRound,
                    },
                    {
                        title: "Total Customers",
                        value: totalCustomers,
                        icon: Users,
                    },
                    {
                        title: "Blocked Users",
                        value: blockedUsers,
                        icon: Ban,
                    },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#f0dfd9] rounded-2xl p-5 shadow-sm"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#fce8e6] flex items-center justify-center mb-4">
                            <stat.icon
                                size={22}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="text-sm text-[#806a70]">
                            {stat.title}
                        </p>

                        <h2 className="text-3xl font-serif font-bold text-[#800000] mt-2">
                            {stat.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Users Section */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm">

                <div className="mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#4b1727]">
                        All Registered Users
                    </h2>

                    <p className="text-sm text-[#947e82] mt-1">
                        Manage customer, vendor and admin accounts.
                    </p>
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-[#eadbd5] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#800000] text-sm text-[#4b1727]"
                        />
                    </div>

                    <div className="relative">
                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]"
                        />

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="border border-[#eadbd5] rounded-xl py-3 pl-10 pr-8 outline-none focus:border-[#800000] text-sm text-[#4b1727] bg-white w-full sm:w-auto"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="vendor">Vendor</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>

                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[750px] text-left">

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

                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-[#800000]" size={28} />
                                        <p className="text-sm text-[#947e82] mt-3">
                                            Loading users...
                                        </p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[#947e82]">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-[#f4e9e5] last:border-0 hover:bg-[#fffaf7] transition"
                                    >

                                        {/* User */}
                                        <td className="py-4 px-3">
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                                    {user.name?.charAt(0).toUpperCase() ||
                                                        user.email.charAt(0).toUpperCase()}
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

                                        {/* Role */}
                                        <td className="py-4 px-3">
                                            <span className="text-sm text-[#5c4148] capitalize">
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="py-4 px-3 text-sm text-[#806a70]">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "Not available"}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-3">
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                                user.isBlocked
                                                    ? "bg-[#fde2e2] text-[#b42323]"
                                                    : "bg-[#dcf4df] text-[#18743b]"
                                            }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-3">
                                            <div className="flex justify-end items-center gap-2">

                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 rounded-lg border border-[#eadbd5] text-[#800000] hover:bg-[#fff1f1]"
                                                    title="View Details"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    onClick={() => handleBlockUser(user)}
                                                    disabled={actionLoading || user.role === "admin"}
                                                    className={`p-2 rounded-lg transition ${
                                                        user.isBlocked
                                                            ? "border border-green-200 text-green-700 hover:bg-green-50"
                                                            : "border border-[#eadbd5] text-[#b42323] hover:bg-red-50"
                                                    } disabled:opacity-40`}
                                                    title={user.isBlocked ? "Unblock User" : "Block User"}
                                                >
                                                    {user.isBlocked
                                                        ? <CheckCircle2 size={17} />
                                                        : <Ban size={17} />
                                                    }
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-[#f0dfd9] text-sm text-[#947e82]">
                    Showing {filteredUsers.length} of {totalUsers} users
                </div>

            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">

                            <h2 className="text-xl font-serif font-bold text-[#4b1727]">
                                User Details
                            </h2>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-500 hover:text-[#800000]"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        {/* User Information */}
                        <div className="space-y-5">

                            <div className="flex items-center gap-3">
                                <UserRound className="text-[#800000]" size={20} />

                                <div>
                                    <p className="text-xs text-[#947e82]">Full Name</p>
                                    <p className="font-semibold text-[#4b1727]">
                                        {selectedUser.name || "Unknown"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="text-[#800000]" size={20} />

                                <div>
                                    <p className="text-xs text-[#947e82]">Email Address</p>
                                    <p className="font-semibold text-[#4b1727] break-all">
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Users className="text-[#800000]" size={20} />

                                <div>
                                    <p className="text-xs text-[#947e82]">User Role</p>
                                    <p className="font-semibold text-[#4b1727] capitalize">
                                        {selectedUser.role}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <CalendarDays className="text-[#800000]" size={20} />

                                <div>
                                    <p className="text-xs text-[#947e82]">Joined Date</p>
                                    <p className="font-semibold text-[#4b1727]">
                                        {selectedUser.createdAt
                                            ? new Date(selectedUser.createdAt).toLocaleDateString("en-BD", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-[#947e82] mb-2">
                                    Account Status
                                </p>

                                <span className={`text-xs font-semibold px-3 py-2 rounded-full ${
                                    selectedUser.isBlocked
                                        ? "bg-[#fde2e2] text-[#b42323]"
                                        : "bg-[#dcf4df] text-[#18743b]"
                                }`}>
                                    {selectedUser.isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>

                            {selectedUser.blockedAt && (
                                <div>
                                    <p className="text-xs text-[#947e82]">
                                        Blocked At
                                    </p>

                                    <p className="text-sm font-semibold text-[#4b1727] mt-1">
                                        {new Date(selectedUser.blockedAt).toLocaleDateString("en-BD")}
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* Modal Buttons */}
                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 border border-[#eadbd5] text-[#800000] py-3 rounded-lg font-medium hover:bg-[#fff1f1]"
                            >
                                Close
                            </button>

                            <button
                                disabled={actionLoading || selectedUser.role === "admin"}
                                onClick={() => handleBlockUser(selectedUser)}
                                className={`flex-1 py-3 rounded-lg font-medium text-white disabled:opacity-40 ${
                                    selectedUser.isBlocked
                                        ? "bg-[#18743b] hover:bg-green-800"
                                        : "bg-[#b42323] hover:bg-[#8b1010]"
                                }`}
                            >
                                {actionLoading
                                    ? "Processing..."
                                    : selectedUser.isBlocked
                                        ? "Unblock User"
                                        : "Block User"
                                }
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}