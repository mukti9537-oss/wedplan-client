import Link from "next/link";
import {
    Heart,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#3a1421] text-[#fff8f3]">

            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* Logo & Description */}
                    <div>
                        <Link href="/" className="mb-5 inline-flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C0A09] transition-transform duration-300 group-hover:scale-105">
                                <Heart className="h-5 w-5 fill-white text-white" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    WedPlan
                                </h2>
                                <p className="text-[10px] tracking-[0.2em] text-[#e5c5c9]">
                                    WEDDING PLANNING PLATFORM
                                </p>
                            </div>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-[#e8d5d7]">
                            Making your special moments unforgettable. We bring your
                            dream wedding to life with beautiful planning, creativity,
                            and attention to every detail.
                        </p>

                        {/* Social Media */}
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b78b96] transition hover:border-[#8b1010] hover:bg-[#8b1010]"
                            >
                                <FaFacebookF size={16} />
                            </a>

                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b78b96] transition hover:border-[#8b1010] hover:bg-[#8b1010]"
                            >
                                <FaInstagram size={16} />
                            </a>

                            <a
                                href="https://www.linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b78b96] transition hover:border-[#8b1010] hover:bg-[#8b1010]"
                            >
                                <FaLinkedinIn size={16} />
                            </a>

                            <a
                                href="https://www.youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b78b96] transition hover:border-[#8b1010] hover:bg-[#8b1010]"
                            >
                                <FaYoutube size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm text-[#e8d5d7]">

                            <li>
                                <Link href="/" className="transition hover:text-white">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Browse Services
                                </Link>
                            </li>

                            <li>
                                <Link href="/#why" className="transition hover:text-white">
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link href="mailto:hello@wedplan.com" className="transition hover:text-white">
                                    Contact
                                </Link>
                            </li>

                            <li>
                                <Link href="/sign-in" className="transition hover:text-white">
                                    Sign In
                                </Link>
                            </li>

                            <li>
                                <Link href="/sign-up" className="transition hover:text-white">
                                    Sign Up
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest">
                            Our Services
                        </h3>

                        <ul className="space-y-3 text-sm text-[#e8d5d7]">

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Full Wedding Planning
                                </Link>
                            </li>

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Partial Planning
                                </Link>
                            </li>

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Day-Of Coordination
                                </Link>
                            </li>

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Venue Selection
                                </Link>
                            </li>

                            <li>
                                <Link href="/browse-services" className="transition hover:text-white">
                                    Wedding Decoration
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest">
                            Get In Touch
                        </h3>

                        <ul className="space-y-5 text-sm text-[#e8d5d7]">

                            <li className="flex items-start gap-3">
                                <Mail size={18} className="mt-0.5 shrink-0 text-[#e5a9b5]" />
                                <a
                                    href="mailto:hello@wedplan.com"
                                    className="transition hover:text-white"
                                >
                                    hello@wedplan.com
                                </a>
                            </li>

                            <li className="flex items-start gap-3">
                                <Phone size={18} className="mt-0.5 shrink-0 text-[#e5a9b5]" />
                                <a
                                    href="tel:+8801700000000"
                                    className="transition hover:text-white"
                                >
                                    +880 1700-000000
                                </a>
                            </li>

                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-0.5 shrink-0 text-[#e5a9b5]" />
                                <span>Chattogram, Bangladesh</span>
                            </li>

                        </ul>

                        <Link
                            href="/browse-services"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#f1c6ce] transition hover:text-white"
                        >
                            Explore Our Services
                            <ArrowUpRight size={16} />
                        </Link>

                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-[#805361]">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs text-[#d9bdc2] sm:flex-row sm:px-8 lg:px-12">

                    <p>
                        © 2026 WedPlan. All rights reserved.
                    </p>

                    <p className="flex items-center gap-1.5">
                        Made with
                        <Heart size={13} fill="#e5a9b5" className="text-[#e5a9b5]" />
                        for your special moments.
                    </p>

                </div>
            </div>

        </footer>
    );
};

export default Footer;
