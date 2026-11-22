"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Rocket, Clock2, Users } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
} as const;

const benefits = [
    {
        title: "Verified Vendors",
        description: "Every service provider is carefully vetted for quality and reliability.",
        icon: Shield,
    },
    {
        title: "Instant Booking",
        description: "Book your favorite wedding services in just a few clicks.",
        icon: Rocket,
    },
    {
        title: "On-Time Delivery",
        description: "Punctual and professional services for your wedding day.",
        icon: Clock2,
    },
    {
        title: "Dedicated Support",
        description: "Our team is here to assist you at every step of your planning.",
        icon: Users,
    },
];

export const WhyChooseWedPlan = () => {
    return (
        <section id="why" className="py-20 bg-[#fffaf7]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-4">
                        Why Choose WedPlan?
                    </h2>
                    <p className="text-[#806a70] text-sm md:text-base">
                        Making your wedding planning simple, trusted, and unforgettable.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, idx) => (
                        <motion.div
                            key={benefit.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className="bg-white border border-[#f0dfd9] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#fce8e6] flex items-center justify-center mx-auto mb-6">
                                <benefit.icon size={26} className="text-[#7C0A09]" />
                            </div>

                            <h3 className="text-xl font-serif font-bold text-[#4b1727] mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-sm text-[#806a70] leading-6">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/browse-services"
                        className="inline-flex items-center gap-2 bg-[#7C0A09] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#600000] transition shadow-md hover:shadow-lg"
                    >
                        Start Planning <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};
