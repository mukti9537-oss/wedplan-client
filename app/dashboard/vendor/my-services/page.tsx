"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Eye,
    Pencil,
    Trash2,
    MapPin,
    Power,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface Service {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    location: string;
    serviceImage: string;
    status: "Approved" | "Pending" | "Rejected";
    isAvailable: boolean;
}

const myServicespage = () => {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([
        {
            _id: "1",
            serviceName: "Wedding Photography",
            category: "Photography",
            description: "Professional wedding photography service.",
            price: 25000,
            location: "Chattogram",
            serviceImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500",
            status: "Approved",
            isAvailable: true,
        },
        {
            _id: "2",
            serviceName: "Floral Decoration",
            category: "Decoration",
            description: "Beautiful floral wedding decoration.",
            price: 18000,
            location: "Dhaka",
            serviceImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
            status: "Pending",
            isAvailable: false,
        },
    ]);

    const [viewService, setViewService] = useState<Service | null>(null);

    const toggleAvailability = (id: string) => {
        setServices((prev) =>
            prev.map((service) =>
                service._id === id && service.status === "Approved"
                    ? { ...service, isAvailable: !service.isAvailable }
                    : service
            )
        );
    };

const deleteService = (id: string) => {
    toast.info(
        <div>
            <p className="mb-3 font-medium">
                Are you sure you want to delete this service?
            </p>

            <div className="flex gap-2">
                <button
                    onClick={() => {
                        setServices((prev) =>
                            prev.filter((service) => service._id !== id)
                        );

                        toast.dismiss();
                        toast.success("Service deleted successfully!");
                    }}
                    className="rounded bg-[#800000] px-3 py-1.5 text-white"
                >
                    Yes, Delete
                </button>

                <button
                    onClick={() => toast.dismiss()}
                    className="rounded border px-3 py-1.5 text-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>,
        {
            autoClose: false,
            closeOnClick: false,
            position: "top-center"
        }
    );
};

    const statusStyle = {
        Approved: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Rejected: "bg-red-100 text-red-700",
    };

    return (
        <div className="min-h-screen bg-[#fffaf7] px-5 py-8 md:px-8">

            {/* Heading */}
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-[#a13b4a]">
                    Vendor / My Services
                </p>

                <h1 className="font-serif text-4xl font-bold text-[#4b1928] md:text-5xl">
                    My Services
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage all your wedding services in one place.
                </p>
            </div>

            {/* Services */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                {services.map((service) => (
                    <div
                        key={service._id}
                        className="overflow-hidden rounded-2xl border border-[#f0dfd9] bg-white shadow-sm transition hover:shadow-md"
                    >
                        {/* Image */}
                        <div className="relative h-52">
                            <Image
                                width={10}
                                height={10}
                                src={service.serviceImage}
                                alt={service.serviceName}
                                unoptimized
                                className="h-full w-full object-cover"
                            />

                            <span
                                className={`absolute right-4 top-4 rounded-full px-4 py-1.5 text-xs font-semibold ${statusStyle[service.status]}`}
                            >
                                {service.status}
                            </span>
                        </div>

                        {/* Information */}
                        <div className="p-5">

                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a3652e]">
                                {service.category}
                            </p>

                            <h2 className="font-serif text-2xl font-bold text-[#4b1928]">
                                {service.serviceName}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500 line-clamp-2">
                                {service.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-[#800000]">
                                    Tk.{service.price.toLocaleString("en-BD")}
                                </span>

                                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <MapPin size={15} />
                                    {service.location}
                                </span>
                            </div>

                            {/* Availability */}
                            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#fff7f4] p-3">

                                <div className="flex items-center gap-2 text-sm font-medium text-[#4b1928]">
                                    <Power size={17} />
                                    Availability
                                </div>

                                <button
                                    onClick={() => toggleAvailability(service._id)}
                                    disabled={service.status !== "Approved"}
                                    className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${service.isAvailable
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${service.isAvailable
                                            ? "left-6"
                                            : "left-1"
                                            }`}
                                    />
                                </button>

                            </div>

                            {service.status === "Rejected" && (
                                <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                                    This service is rejected and not visible to customers.
                                </p>
                            )}

                            {/* Actions */}
                            <div className="mt-5 flex gap-2 border-t border-[#f0dfd9] pt-4">

                                <button
                                    onClick={() => setViewService(service)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#eadbd5] py-2.5 text-sm font-medium text-[#4b1928] transition hover:border-[#800000] hover:text-[#800000]"
                                >
                                    <Eye size={16} />
                                    View
                                </button>

                                <button
                                    onClick={() => router.push(`/dashboard/vendor/edit-service/${service._id}`)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#800000] py-2.5 text-sm font-medium text-white transition hover:bg-[#600000]"
                                >
                                    <Pencil size={16} />
                                    Update
                                </button>

                                <button
                                    onClick={() => deleteService(service._id)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-600 hover:text-white"
                                    aria-label="Delete service"
                                >
                                    <Trash2 size={17} />
                                </button>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Empty State */}
            {services.length === 0 && (
                <div className="rounded-2xl border border-[#f0dfd9] bg-white py-16 text-center">
                    <h2 className="font-serif text-2xl font-bold text-[#4b1928]">
                        No Services Found
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        You haven&apos;t created any services yet.
                    </p>
                </div>
            )}

            {/* View Modal */}
            {viewService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6">

                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="font-serif text-2xl font-bold text-[#4b1928]">
                                Service Information
                            </h2>

                            <button
                                onClick={() => setViewService(null)}
                                className="text-xl text-gray-500 hover:text-[#800000]"
                            >
                                ✕
                            </button>
                        </div>

                        <Image
                            width={10}
                            height={10}
                            src={viewService.serviceImage}
                            alt={viewService.serviceName}
                            unoptimized
                            className="mb-5 h-52 w-full rounded-xl object-cover"
                        />

                        <h3 className="font-serif text-2xl font-bold text-[#800000]">
                            {viewService.serviceName}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {viewService.description}
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                            <p>Category: {viewService.category}</p>
                            <p>Price: ৳{viewService.price.toLocaleString("en-BD")}</p>
                            <p>Location: {viewService.location}</p>
                            <p>Status: {viewService.status}</p>
                            <p>
                                Availability: {viewService.isAvailable ? "Available" : "Unavailable"}
                            </p>
                        </div>

                        <button
                            onClick={() => setViewService(null)}
                            className="mt-6 w-full rounded-lg bg-[#800000] py-3 font-medium text-white hover:bg-[#600000]"
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default myServicespage;