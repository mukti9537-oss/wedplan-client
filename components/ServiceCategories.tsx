"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Heart, Sparkles, Coffee, Tag, Award, ArrowRight } from "lucide-react";

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
} as const;

interface Category {
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    bg: string;
    color: string;
}

const categories: Category[] = [
    {
        title: "Photography & Videography",
        description: "Capture every beautiful moment of your big day.",
        icon: Camera,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
    {
        title: "Wedding Venues",
        description: "Stunning locations for your dream celebration.",
        icon: Heart,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
    {
        title: "Decoration & Florist",
        description: "Elegant decor and fresh floral arrangements.",
        icon: Sparkles,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
    {
        title: "Catering Services",
        description: "Delicious meals for your wedding guests.",
        icon: Coffee,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
    {
        title: "Makeup & Styling",
        description: "Bridal beauty and groom styling services.",
        icon: Tag,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
    {
        title: "Wedding Fashion",
        description: "Designer outfits for the perfect wedding look.",
        icon: Award,
        color: "text-[#7C0A09]",
        bg: "bg-[#fce8e6]",
    },
];

export const ServiceCategories = () => {
    return (
        <section id="categories" className="py-20 bg-[#FCF4F2]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b1727] mb-4">
                        Explore by Category
                    </h2>
                    <p className="text-[#806a70] text-sm md:text-base">
                        Find the perfect wedding service for every part of your celebration.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className={`group relative rounded-2xl border border-[#f0dfd9] bg-white p-8 hover:shadow-lg transition-all duration-300 ${cat.bg}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm ${cat.color}`}>
                                <cat.icon size={28} />
                            </div>

                            <h3 className="text-xl font-serif font-bold text-[#4b1727] mb-2 group-hover:text-[#7C0A09] transition">
                                {cat.title}
                            </h3>
                            <p className="text-sm text-[#806a70] leading-6">
                                {cat.description}
                            </p>

                            <Link
                                href={`/browse-services?category=${encodeURIComponent(cat.title)}`}
                                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#7C0A09] transition"
                            >
                                Explore <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
