"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    UserRound,
    Store,
    BriefcaseBusiness,
    Clock,
    Search,
    Eye,
    Ban,
    CheckCircle2,
    XCircle,
    Trash2,
    Crown,
    Filter,
    User as UserIcon,
    Mail as MailIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

import {
    blockUser,
    approveRejectService,
    deleteServiceAdmin,
} from "@/lib/api/admin";

interface User {
    _id: string;
    name?: string;
    email: string;
    role: "admin" | "vendor" | "customer";
    isBlocked?: boolean;
    blockedAt?: Date | string;
    createdAt?: Date | string;
}

interface Service {
    _id: string;
    serviceName: string;
    serviceImage: string;
    category: string;
    price: number;
    location: string;
    vendorName: string;
    vendorEmail: string;
    status: "Pending" | "Approved" | "Rejected";
    isAvailable?: boolean;
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

interface RawService {
    _id?: string;
    id?: string;
    serviceName?: string;
    serviceImage?: string;
    category?: string;
    price?: number | string;
    location?: string;
    vendorName?: string;
    vendorEmail?: string;
    status?: Service["status"];
    isAvailable?: boolean;
    createdAt?: Date | string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const AdminDashboardpage = () => {
    // States
    const [users, setUsers] = useState<User[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [serviceLoading, setServiceLoading] = useState(false);

    // Search and filter states
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("all");
    const [serviceSearch, setServiceSearch] = useState("");
    const [serviceStatusFilter, setServiceStatusFilter] = useState("all");

    // Modal states
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Fetch Users
    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/users`, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            const userData = Array.isArray(data) ? data : data.users || [];
            setUsers(
                userData.map((u: RawUser) => ({
                    _id: u._id || u.id,
                    name: u.name || u.email?.split("@")[0] || "Unknown",
                    email: u.email,
                    role: u.role || "customer",
                    isBlocked: u.isBlocked || false,
                    blockedAt: u.blockedAt,
                    createdAt: u.createdAt,
                }))
            );
        } catch (err) {
            console.error("Fetch Users Error:", err);
            toast.error("Failed to load users");
        } finally {
            setUserLoading(false);
        }
    };

    // Fetch Services
    const fetchServices = async () => {
        setServiceLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/add-service`, { cache: "no-store" });
            if (!res.ok) throw new Error("Failed to fetch services");
            const data = await res.json();
            const serviceData = Array.isArray(data) ? data : [];
            setServices(
                serviceData.flatMap((s: RawService) => {
                    const id = s._id || s.id;
                    if (!id) return [];

                    return [{
                        _id: id,
                        serviceName: s.serviceName || "Unknown Service",
                        serviceImage: s.serviceImage || "",
                        category: s.category || "General",
                        price: Number(s.price || 0),
                        location: s.location || "Not specified",
                        vendorName: s.vendorName || "Unknown Vendor",
                        vendorEmail: s.vendorEmail || "",
                        status: s.status || "Pending",
                        isAvailable: s.isAvailable ?? true,
                        createdAt: s.createdAt,
                    }];
                })
            );
        } catch (err) {
            console.error("Fetch Services Error:", err);
            toast.error("Failed to load services");
        } finally {
            setServiceLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchUsers();
            void fetchServices();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    // Block/Unblock User
    const handleBlockUser = async (user: User) => {
        try {
            setUserLoading(true);
            await blockUser(user._id, !user.isBlocked);
            toast.success(
                `User ${!user.isBlocked ? "blocked" : "unblocked"} successfully`
            );
            fetchUsers();
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update user status"
            );
        } finally {
            setUserLoading(false);
        }
    };

    // Approve/Reject Service
    const handleApproveReject = async (
        service: Service,
        status: "Approved" | "Rejected"
    ) => {
        try {
            setServiceLoading(true);
            await approveRejectService(service._id, status);
            toast.success(`Service ${status.toLowerCase()} successfully`);
            fetchServices();
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "Failed to update service"
            );
        } finally {
            setServiceLoading(false);
        }
    };

    // Delete Service
    const handleDeleteService = async (serviceId: string) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            setServiceLoading(true);
            await deleteServiceAdmin(serviceId);
            toast.success("Service deleted successfully");
            fetchServices();
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : "Failed to delete service"
            );
        } finally {
            setServiceLoading(false);
        }
    };

    // Filtered Users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole =
            userRoleFilter === "all" || u.role === userRoleFilter;
        return matchesSearch && matchesRole;
    });

    // Filtered Services
    const filteredServices = services.filter((s) => {
        const matchesSearch = s.serviceName
            .toLowerCase()
            .includes(serviceSearch.toLowerCase());
        const matchesStatus =
            serviceStatusFilter === "all" || s.status === serviceStatusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalUsers = users.length;
    const totalVendors = users.filter((u) => u.role === "vendor").length;
    const totalCustomers = users.filter((u) => u.role === "customer").length;
    const totalServices = services.length;
    const pendingServices = services.filter(
        (s) => s.status === "Pending"
    ).length;
    const blockedUsers = users.filter((u) => u.isBlocked).length;

    const stats = [
        {
            title: "Registered Users",
            value: totalUsers.toString(),
            icon: Users,
        },
        {
            title: "Total Vendors",
            value: totalVendors.toString(),
            icon: Store,
        },
        {
            title: "Total Customers",
            value: totalCustomers.toString(),
            icon: UserRound,
        },
        {
            title: "Total Services",
            value: totalServices.toString(),
            icon: BriefcaseBusiness,
        },
        {
            title: "Pending Services",
            value: pendingServices.toString(),
            icon: Clock,
        },
        {
            title: "Blocked Users",
            value: blockedUsers.toString(),
            icon: Ban,
        },
    ];

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
                        <p className="text-xs text-[#947e82]">Account Role</p>
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
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full border border-[#eadbd5] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#800000] text-sm text-[#4b1727]"
                        />
                    </div>
                    <div className="relative">
                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]"
                        />
                        <select
                            value={userRoleFilter}
                            onChange={(e) => setUserRoleFilter(e.target.value)}
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
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#947e82]">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-[#f4e9e5] last:border-0 hover:bg-[#fffaf7]"
                                    >
                                        <td className="py-4 px-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#800000] font-bold">
                                                    {user.name?.charAt(0) ||
                                                    user.email.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#4b1727]">
                                                        {user.name || "Unknown User"}
                                                    </p>
                                                    <p className="text-xs text-[#947e82] mt-1">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3">
                                            <span className="text-sm text-[#5c4148] capitalize">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 text-sm text-[#806a70]">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                : "Not available"}
                                        </td>
                                        <td className="py-4 px-3">
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                                user.isBlocked
                                                    ? "bg-[#fde2e2] text-[#b42323]"
                                                    : user.role === "admin"
                                                      ? "bg-[#dcf4df] text-[#18743b]"
                                                      : "bg-[#dcf4df] text-[#18743b]"
                                            }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 rounded-lg border border-[#eadbd5] text-[#800000] hover:bg-[#fff1f1] transition"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleBlockUser(user)}
                                                    disabled={userLoading}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        user.isBlocked
                                                            ? "border border-green-200 text-green-700 hover:bg-green-50"
                                                            : "border border-[#eadbd5] text-[#b42323] hover:bg-red-50"
                                                    }`}
                                                >
                                                    {user.isBlocked ? (
                                                        <CheckCircle2 size={16} />
                                                    ) : (
                                                        <Ban size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                            placeholder="Search services by name..."
                            value={serviceSearch}
                            onChange={(e) => setServiceSearch(e.target.value)}
                            className="w-full border border-[#eadbd5] rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#800000] text-sm text-[#4b1727]"
                        />
                    </div>
                    <div className="relative">
                        <Filter
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000]"
                        />
                        <select
                            value={serviceStatusFilter}
                            onChange={(e) => setServiceStatusFilter(e.target.value)}
                            className="border border-[#eadbd5] rounded-xl py-3 pl-10 pr-8 outline-none focus:border-[#800000] text-sm text-[#4b1727] bg-white w-full sm:w-auto"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                    {filteredServices.length === 0 ? (
                        <div className="py-8 text-center text-[#947e82]">
                            No services found
                        </div>
                    ) : (
                        filteredServices.map((service) => (
                            <div
                                key={service._id}
                                className="flex flex-col lg:flex-row lg:items-center gap-4 border border-[#f3e8e3] rounded-xl p-4 hover:shadow-sm transition-all"
                            >
                                <Image
                                    width={10}
                                    height={10}
                                    src={service.serviceImage}
                                    alt={service.serviceName}
                                    className="w-full lg:w-24 h-36 lg:h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=100";
                                    }}
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-[#4b1727]">
                                        {service.serviceName}
                                    </h3>
                                    <p className="text-sm text-[#806a70] mt-1">
                                        Vendor: {service.vendorName}
                                    </p>
                                    <p className="text-xs text-[#947e82] mt-1">
                                        Category: {service.category}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`text-xs font-semibold px-3 py-2 rounded-full ${
                                        service.status === "Approved"
                                            ? "bg-[#dcf4df] text-[#18743b]"
                                            : service.status === "Rejected"
                                              ? "bg-[#fde2e2] text-[#b42323]"
                                              : "bg-[#fff0d0] text-[#a65b08]"
                                    }`}>
                                        {service.status}
                                    </span>

                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className="p-2 border border-[#eadbd5] text-[#800000] rounded-lg hover:bg-[#fff1f1] transition"
                                    >
                                        <Eye size={17} />
                                    </button>

                                    {service.status === "Pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleApproveReject(
                                                        service,
                                                        "Approved"
                                                    )
                                                }
                                                disabled={serviceLoading}
                                                className="flex items-center gap-1.5 bg-[#18743b] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 transition"
                                            >
                                                <CheckCircle2 size={15} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleApproveReject(
                                                        service,
                                                        "Rejected"
                                                    )
                                                }
                                                disabled={serviceLoading}
                                                className="flex items-center gap-1.5 border border-[#b42323] text-[#b42323] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-red-50 transition"
                                            >
                                                <XCircle size={15} />
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => handleDeleteService(service._id)}
                                        disabled={serviceLoading}
                                        className="p-2 border border-[#eadbd5] text-[#b42323] rounded-lg hover:bg-red-50 transition"
                                        aria-label="Delete service"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-[#4b1727]">
                                User Details
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-xl text-gray-500 hover:text-[#800000]"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <UserIcon size={18} className="text-[#800000]" />
                                <span>
                                    <strong>Name:</strong> {selectedUser.name || "Unknown"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MailIcon size={18} className="text-[#800000]" />
                                <span>
                                    <strong>Email:</strong> {selectedUser.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>
                                    <strong>Role:</strong>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                        selectedUser.role === "admin"
                                            ? "bg-[#dcf4df] text-[#18743b]"
                                            : selectedUser.role === "vendor"
                                              ? "bg-[#dcf4df] text-[#18743b]"
                                              : "bg-[#dcf4df] text-[#18743b]"
                                    } capitalize`}>
                                        {selectedUser.role}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                        selectedUser.isBlocked
                                            ? "bg-[#fde2e2] text-[#b42323]"
                                            : "bg-[#dcf4df] text-[#18743b]"
                                    }`}>
                                        {selectedUser.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>
                                    <strong>Joined:</strong>
                                </span>
                                <span className="ml-2">
                                    {selectedUser.createdAt
                                        ? new Date(selectedUser.createdAt).toLocaleDateString("en-BD", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "Not available"}
                                </span>
                            </div>
                            {selectedUser.blockedAt && (
                                <div className="flex items-center gap-3">
                                    <span>
                                        <strong>Blocked At:</strong>
                                    </span>
                                    <span className="ml-2">
                                        {new Date(selectedUser.blockedAt).toLocaleDateString("en-BD", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="flex-1 border border-[#eadbd5] text-[#800000] py-3 rounded-lg font-medium hover:bg-[#fff1f1] transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleBlockUser(selectedUser!);
                                    setSelectedUser(null);
                                }}
                                disabled={userLoading}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                    selectedUser.isBlocked
                                        ? "bg-[#18743b] text-white hover:bg-green-800"
                                        : "bg-[#b42323] text-white hover:bg-[#8b1010]"
                                }`}
                            >
                                {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-serif font-bold text-[#4b1727]">
                                Service Details
                            </h2>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-xl text-gray-500 hover:text-[#800000]"
                            >
                                ✕
                            </button>
                        </div>
                        <Image
                            width={10}
                            height={10}
                            src={selectedService.serviceImage}
                            alt={selectedService.serviceName}
                            className="w-full h-48 object-cover rounded-xl mb-5"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519741497674-611481863552?w=100";
                            }}
                        />
                        <div className="space-y-4 text-sm">
                            <div>
                                <strong className="text-[#4b1727]">Service Name:</strong>
                                <p className="mt-1 text-[#806a70]">{selectedService.serviceName}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Vendor:</strong>
                                <p className="mt-1 text-[#806a70]">{selectedService.vendorName}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Vendor Email:</strong>
                                <p className="mt-1 text-[#806a70]">{selectedService.vendorEmail}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Category:</strong>
                                <p className="mt-1 text-[#806a70]">{selectedService.category}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Location:</strong>
                                <p className="mt-1 text-[#806a70]">{selectedService.location}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Price:</strong>
                                <p className="mt-1 text-[#806a70]">TK.{Number(selectedService.price).toLocaleString("en-BD")}</p>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Status:</strong>
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                    selectedService.status === "Approved"
                                        ? "bg-[#dcf4df] text-[#18743b]"
                                        : selectedService.status === "Rejected"
                                          ? "bg-[#fde2e2] text-[#b42323]"
                                          : "bg-[#fff0d0] text-[#a65b08]"
                                } capitalize`}>
                                    {selectedService.status}
                                </span>
                            </div>
                            <div>
                                <strong className="text-[#4b1727]">Availability:</strong>
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                    selectedService.isAvailable
                                        ? "bg-[#dcf4df] text-[#18743b]"
                                        : "bg-[#fde2e2] text-[#b42323]"
                                }`}>
                                    {selectedService.isAvailable ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="flex-1 border border-[#eadbd5] text-[#800000] py-3 rounded-lg font-medium hover:bg-[#fff1f1] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardpage;
