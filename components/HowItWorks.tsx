"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, CheckCircle2, Heart } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
} as const;

const steps = [
    {
        step: "01",
        title: "Browse Services",
        description: "Explore our curated list of wedding vendors and services.",
        icon: CalendarDays,
    },
    {
        step: "02",
        title: "Check Availability",
        description: "View vendor availability and pricing for your wedding date.",
        icon: MapPin,
    },
    {
        step: "03",
        title: "Book Online",
        description: "Submit your booking request securely through WedPlan.",
        icon: CheckCircle2,
    },
    {
        step: "04",
        title: "Celebrate",
        description: "Enjoy your special day with everything perfectly planned.",
        icon: Heart,
    },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 bg-[#FCF4F2]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-4">
                        How WedPlan Works
                    </h2>
                    <p className="text-[#806a70] text-sm md:text-base">
                        Plan your dream wedding in four simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connector lines between steps */}
                    <div className="hidden lg:flex absolute top-1/2 left-0 w-full -z-10">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className="w-1/4 h-px bg-[#f0dfd9] mt-[14px]"
                            />
                        ))}
                    </div>

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className="text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#7C0A09] flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">
                                <div className="text-white font-bold text-xs tracking-wider uppercase">
                                    {step.step}
                                </div>
                            </div>

                            <div className="w-12 h-12 rounded-full bg-[#fce8e6] flex items-center justify-center mx-auto mb-4">
                                <step.icon size={22} className="text-[#7C0A09]" />
                            </div>

                            <h3 className="text-lg font-serif font-bold text-[#4b1727] mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-[#806a70] leading-6">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
