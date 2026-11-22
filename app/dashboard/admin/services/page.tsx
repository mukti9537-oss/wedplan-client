"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    Search,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Power,
    Loader2,
    X,
    Package,
} from "lucide-react";
import { toast } from "react-toastify";

import { getService } from "@/lib/api/service";
import {
    approveRejectService,
    deleteServiceAdmin,
} from "@/lib/api/admin";

interface Service {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    location: string;
    serviceImage: string;
    status: "Pending" | "Approved" | "Rejected";
    isAvailable: boolean;
    vendorName?: string;
    vendorEmail?: string;
}

export default function ManageServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedService, setSelectedService] =
        useState<Service | null>(null);

    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getService()
            .then((data) => {
                if (!cancelled) {
                    setServices(Array.isArray(data) ? data : []);
                }
            })
            .catch((error) => {
                console.error("Service fetch error:", error);
                toast.error("Failed to load services");
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Search and Filter
    const filteredServices = useMemo(() => {
        return services.filter((service) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                service.serviceName?.toLowerCase().includes(search) ||
                service.category?.toLowerCase().includes(search) ||
                service.location?.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                service.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [services, searchTerm, statusFilter]);

    // Approve / Reject Service
    const handleStatusChange = async (
        id: string,
        status: "Approved" | "Rejected"
    ) => {
        try {
            setProcessingId(id);

            await approveRejectService(id, status);

            setServices((prev) =>
                prev.map((service) =>
                    service._id === id
                        ? {
                              ...service,
                              status,
                              isAvailable:
                                  status === "Approved"
                                      ? service.isAvailable
                                      : false,
                          }
                        : service
                )
            );

            toast.success(`Service ${status.toLowerCase()} successfully`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update service status");
        } finally {
            setProcessingId(null);
        }
    };

    // Active / Inactive Service
    const handleAvailability = async (service: Service) => {
        try {
            setProcessingId(service._id);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/services/${service._id}/availability`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isAvailable: !service.isAvailable,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update availability");
            }

            setServices((prev) =>
                prev.map((item) =>
                    item._id === service._id
                        ? {
                              ...item,
                              isAvailable: !item.isAvailable,
                          }
                        : item
                )
            );

            toast.success(
                `Service ${
                    !service.isAvailable ? "activated" : "deactivated"
                } successfully`
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to change service availability");
        } finally {
            setProcessingId(null);
        }
    };

    // Delete Service
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) return;

        try {
            setProcessingId(id);

            await deleteServiceAdmin(id);

            setServices((prev) =>
                prev.filter((service) => service._id !== id)
            );

            if (selectedService?._id === id) {
                setSelectedService(null);
            }

            toast.success("Service deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete service");
        } finally {
            setProcessingId(null);
        }
    };

    const pendingCount = services.filter(
        (service) => service.status === "Pending"
    ).length;

    const approvedCount = services.filter(
        (service) => service.status === "Approved"
    ).length;

    const activeCount = services.filter(
        (service) =>
            service.status === "Approved" && service.isAvailable
    ).length;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-green-100 text-green-700";

            case "Rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#fffaf7] p-4 md:p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#4b1727]">
                    Manage Services
                </h1>

                <p className="mt-2 text-sm text-[#947e82]">
                    Review, approve, manage and monitor all submitted services.
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                <div className="rounded-xl border border-[#f0dfd9] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#947e82]">
                                Total Services
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-[#4b1727]">
                                {services.length}
                            </h2>
                        </div>

                        <div className="rounded-lg bg-pink-50 p-3 text-[#800000]">
                            <Package size={25} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#f0dfd9] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#947e82]">
                                Pending Review
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                                {pendingCount}
                            </h2>
                        </div>

                        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
                            <Loader2 size={25} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#f0dfd9] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#947e82]">
                                Approved Services
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-green-600">
                                {approvedCount}
                            </h2>
                        </div>

                        <div className="rounded-lg bg-green-50 p-3 text-green-600">
                            <CheckCircle size={25} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-[#f0dfd9] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#947e82]">
                                Active Services
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-blue-600">
                                {activeCount}
                            </h2>
                        </div>

                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                            <Power size={25} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">

                <div className="relative flex-1">
                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#947e82]"
                    />

                    <input
                        type="text"
                        placeholder="Search service name, category or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-[#f0dfd9] bg-white py-3 pl-11 pr-4 text-sm text-[#4b1727] outline-none focus:border-[#800000]"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-[#f0dfd9] bg-white px-4 py-3 text-sm text-[#4b1727] outline-none focus:border-[#800000]"
                >
                    <option value="All">All Services</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

            </div>

            {/* Services Table */}
            <div className="overflow-hidden rounded-xl border border-[#f0dfd9] bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px] text-left">

                        <thead className="bg-[#fff4ef] text-sm text-[#4b1727]">
                            <tr>
                                <th className="px-5 py-4">Service</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Price</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Availability</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#f0dfd9]">

                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <Loader2 className="mx-auto animate-spin text-[#800000]" />
                                        <p className="mt-2 text-sm text-[#947e82]">
                                            Loading services...
                                        </p>
                                    </td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-[#947e82]">
                                        No services found.
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr
                                        key={service._id}
                                        className="text-sm hover:bg-[#fffaf7]"
                                    >

                                        {/* Service */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {service.serviceImage ? (
                                                    <Image
                                                        src={service.serviceImage}
                                                        alt={service.serviceName}
                                                        width={48}
                                                        height={48}
                                                        unoptimized
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 text-[#800000]">
                                                        <Package size={22} />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-[#4b1727]">
                                                        {service.serviceName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-[#947e82]">
                                                        {service.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-5 py-4 text-[#6b555b]">
                                            {service.category}
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4 font-medium text-[#4b1727]">
                                            ৳{service.price}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                    service.status
                                                )}`}
                                            >
                                                {service.status}
                                            </span>
                                        </td>

                                        {/* Availability */}
                                        <td className="px-5 py-4">
                                            {service.status === "Approved" ? (
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        service.isAvailable
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {service.isAvailable
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-[#947e82]">
                                                    Not Published
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-2">

                                                <button
                                                    onClick={() => setSelectedService(service)}
                                                    title="View Details"
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                {service.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    service._id,
                                                                    "Approved"
                                                                )
                                                            }
                                                            disabled={processingId === service._id}
                                                            title="Approve"
                                                            className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 disabled:opacity-50"
                                                        >
                                                            <CheckCircle size={17} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    service._id,
                                                                    "Rejected"
                                                                )
                                                            }
                                                            disabled={processingId === service._id}
                                                            title="Reject"
                                                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                        >
                                                            <XCircle size={17} />
                                                        </button>
                                                    </>
                                                )}

                                                {service.status === "Approved" && (
                                                    <button
                                                        onClick={() =>
                                                            handleAvailability(service)
                                                        }
                                                        disabled={processingId === service._id}
                                                        title={
                                                            service.isAvailable
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }
                                                        className={`rounded-lg p-2 disabled:opacity-50 ${
                                                            service.isAvailable
                                                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                                                : "bg-green-50 text-green-600 hover:bg-green-100"
                                                        }`}
                                                    >
                                                        <Power size={17} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(service._id)}
                                                    disabled={processingId === service._id}
                                                    title="Delete Service"
                                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    <Trash2 size={17} />
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

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                        <button
                            onClick={() => setSelectedService(null)}
                            className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        >
                            <X size={19} />
                        </button>

                        <h2 className="mb-5 text-xl font-bold text-[#4b1727]">
                            Service Details
                        </h2>

                        {selectedService.serviceImage && (
                            <Image
                                src={selectedService.serviceImage}
                                alt={selectedService.serviceName}
                                width={500}
                                height={250}
                                unoptimized
                                className="mb-5 h-48 w-full rounded-xl object-cover"
                            />
                        )}

                        <h3 className="text-lg font-bold text-[#4b1727]">
                            {selectedService.serviceName}
                        </h3>

                        <p className="mt-2 text-sm text-[#947e82]">
                            {selectedService.description}
                        </p>

                        <div className="mt-5 space-y-3 text-sm">

                            <p>
                                <strong className="text-[#4b1727]">Category:</strong>{" "}
                                {selectedService.category}
                            </p>

                            <p>
                                <strong className="text-[#4b1727]">Price:</strong>{" "}
                                ৳{selectedService.price}
                            </p>

                            <p>
                                <strong className="text-[#4b1727]">Location:</strong>{" "}
                                {selectedService.location}
                            </p>

                            {selectedService.vendorName && (
                                <p>
                                    <strong className="text-[#4b1727]">Vendor:</strong>{" "}
                                    {selectedService.vendorName}
                                </p>
                            )}

                            {selectedService.vendorEmail && (
                                <p>
                                    <strong className="text-[#4b1727]">Vendor Email:</strong>{" "}
                                    {selectedService.vendorEmail}
                                </p>
                            )}

                            <p>
                                <strong className="text-[#4b1727]">Status:</strong>{" "}
                                {selectedService.status}
                            </p>

                            <p>
                                <strong className="text-[#4b1727]">Availability:</strong>{" "}
                                {selectedService.isAvailable ? "Active" : "Inactive"}
                            </p>

                        </div>

                        <button
                            onClick={() => setSelectedService(null)}
                            className="mt-6 w-full rounded-xl bg-[#800000] py-3 text-sm font-semibold text-white hover:bg-[#650000]"
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}