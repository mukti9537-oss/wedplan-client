"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, UserRound, ArrowRight } from "lucide-react";
import { getService } from "@/lib/actions/service";

interface Service {
    _id: string;
    serviceName: string;
    serviceImage: string;
    category: string;
    price: number;
    location: string;
    vendorName?: string;
    vendorEmail?: string;
    status?: string;
    isAvailable?: boolean;
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
} as const;

export const FeaturedServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const result = await getService("status=Approved&isAvailable=true");
                const data = Array.isArray(result)
                    ? result
                    : result?.services || result?.data || [];

                const active = data.filter(
                    (item: Service) =>
                        item.status === "Approved" &&
                        (item.isAvailable ?? true)
                );
                setServices(active.slice(0, 6));
            } catch (err) {
                console.error("Featured services error:", err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <section id="services" className="py-20 bg-[#fffaf7]">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-12 text-center">
                        Featured Wedding Services
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                className="flex flex-col items-center justify-center h-64 bg-[#fce8e6] rounded-xl"
                            >
                                <div className="animate-pulse rounded-full h-12 w-12 bg-[#e5d5d7]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (services.length === 0) {
        return (
            <section id="services" className="py-20 bg-[#fffaf7]">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-12 text-center">
                        Featured Wedding Services
                    </h2>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-[#806a70]">No featured services available.</p>
                        <Link
                            href="/browse-services"
                            className="mt-6 inline-flex items-center gap-2 bg-[#7C0A09] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#600000] transition"
                        >
                            Browse All Services <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="py-20 bg-[#fffaf7]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-4">
                        Featured Wedding Services
                    </h2>
                    <p className="text-[#806a70] text-sm md:text-base">
                        Handpicked services trusted by couples for their special day.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <motion.div
                            key={service._id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className="group overflow-hidden rounded-2xl border border-[#f0dfd9] bg-white shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    width={400}
                                    height={300}
                                    src={service.serviceImage}
                                    alt={service.serviceName}
                                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                {!service.isAvailable && (
                                    <span className="absolute right-4 top-4 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 shadow">
                                        Unavailable
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="mb-1 text-lg font-serif font-bold text-[#4b1727] group-hover:text-[#7C0A09] transition">
                                    {service.serviceName}
                                </h3>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a3652e]">
                                    {service.category}
                                </p>

                                <div className="flex items-center gap-2 mt-3 text-sm text-[#806a70]">
                                    <UserRound size={15} className="text-[#7C0A09]" />
                                    <span>{service.vendorName || "WedPlan Vendor"}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <MapPin size={15} className="text-[#7C0A09]" />
                                    <span>{service.location}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <span className="text-xl font-serif font-bold text-[#7C0A09]">
                                        TK.{Number(service.price).toLocaleString("en-BD")}
                                    </span>
                                    <span className="text-xs text-gray-400">starting</span>
                                </div>

                                <Link
                                    href={`/browse-services/${service._id}`}
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#7C0A09] px-5 py-2.5 text-sm font-medium text-[#7C0A09] transition hover:bg-[#7C0A09] hover:text-white"
                                >
                                    View Details <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/browse-services"
                        className="inline-flex items-center gap-2 bg-[#7C0A09] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#600000] transition shadow-md hover:shadow-lg"
                    >
                        Explore All Services <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};
