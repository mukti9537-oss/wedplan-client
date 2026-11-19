"use client";

import React from "react";
import {
    CalendarDays,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    X,
    MapPin,
    UserRound,
    Settings,
    CalendarCheck,
    ArrowRight,
    Mail,
    Phone,
} from "lucide-react";
import Image from "next/image";

const stats = [
    {
        title: "Total Booking Requests",
        value: "12",
        icon: CalendarDays,
    },
    {
        title: "Pending Bookings",
        value: "04",
        icon: Clock,
    },
    {
        title: "Accepted Bookings",
        value: "06",
        icon: CheckCircle2,
    },
    {
        title: "Rejected Bookings",
        value: "02",
        icon: XCircle,
    },
];

const bookings = [
    {
        id: 1,
        serviceName: "Wedding Photography",
        vendorName: "Dream Lens Photography",
        vendorEmail: "dreamlens@gmail.com",
        eventDate: "December 25, 2026",
        location: "Chattogram, Bangladesh",
        requestDate: "November 15, 2026",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200",
    },
    {
        id: 2,
        serviceName: "Floral Decoration",
        vendorName: "Bloom Wedding Decor",
        vendorEmail: "bloom@gmail.com",
        eventDate: "December 28, 2026",
        location: "Dhaka, Bangladesh",
        requestDate: "November 14, 2026",
        status: "Accepted",
        image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=200",
    },
    {
        id: 3,
        serviceName: "Wedding Venue",
        vendorName: "Royal Palace Events",
        vendorEmail: "royal@gmail.com",
        eventDate: "January 03, 2027",
        location: "Chattogram, Bangladesh",
        requestDate: "November 12, 2026",
        status: "Rejected",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200",
    },
    {
        id: 4,
        serviceName: "Bridal Makeup",
        vendorName: "Beauty Touch Studio",
        vendorEmail: "beautytouch@gmail.com",
        eventDate: "January 10, 2027",
        location: "Chattogram, Bangladesh",
        requestDate: "November 10, 2026",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200",
    },
];

const CustomerDashboardpage = () => {
    return (
        <div className="min-h-screen bg-[#fffaf7] p-5 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

                <div>
                    <p className="text-sm text-[#800000] font-medium mb-2">
                        Customer / Dashboard
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#4b1727]">
                        My Dashboard
                    </h1>

                    <p className="text-[#8c7479] mt-2 text-sm md:text-base">
                        Track your bookings and manage your wedding plans.
                    </p>
                </div>

                <button className="flex items-center justify-center gap-2 bg-[#800000] hover:bg-[#600000] text-white px-6 py-3 rounded-xl transition-all shadow-md">
                    <CalendarDays size={19} />
                    Browse Services
                </button>

            </div>


            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

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

                        <h2 className="text-3xl font-serif font-bold text-[#800000] mt-1">
                            {stat.value}
                        </h2>

                    </div>
                ))}

            </div>


            {/* My Bookings */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            My Bookings
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Manage all your booking requests.
                        </p>
                    </div>

                    <button className="text-[#800000] font-semibold flex items-center gap-2 text-sm">
                        View All <ArrowRight size={17} />
                    </button>

                </div>


                {/* Booking List */}
                <div className="space-y-5">

                    {bookings.map((booking) => (

                        <div
                            key={booking.id}
                            className="flex flex-col lg:flex-row lg:items-center gap-5 border border-[#f3e8e3] rounded-xl p-4 hover:shadow-sm transition-all"
                        >

                            {/* Service Image */}
                            <Image
                                width={10}
                                height={10}
                                src={booking.image}
                                alt={booking.serviceName}
                                className="w-full lg:w-28 h-40 lg:h-24 object-cover rounded-lg"
                            />


                            {/* Service Information */}
                            <div className="flex-1 min-w-0">

                                <h3 className="text-lg font-semibold text-[#4b1727]">
                                    {booking.serviceName}
                                </h3>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <UserRound size={15} className="text-[#800000]" />
                                    <span>{booking.vendorName}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <CalendarDays size={15} className="text-[#800000]" />
                                    <span>{booking.eventDate}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-sm text-[#806a70]">
                                    <MapPin size={15} className="text-[#800000]" />
                                    <span>{booking.location}</span>
                                </div>

                            </div>


                            {/* Booking Status and Actions */}
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:items-end xl:items-center gap-3">

                                <div className="flex flex-col items-start lg:items-end">

                                    <span
                                        className={`text-xs font-semibold px-4 py-2 rounded-full ${booking.status === "Pending"
                                                ? "bg-[#fff0d0] text-[#a65b08]"
                                                : booking.status === "Accepted"
                                                    ? "bg-[#dcf4df] text-[#18743b]"
                                                    : "bg-[#fde2e2] text-[#b42323]"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>

                                    <p className="text-xs text-[#947e82] mt-2">
                                        Requested: {booking.requestDate}
                                    </p>

                                </div>


                                <div className="flex items-center gap-2">

                                    <button
                                        className="flex items-center gap-1.5 border border-[#800000] text-[#800000] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#fff1f1] transition-all"
                                    >
                                        <Eye size={15} />
                                        Details
                                    </button>


                                    {booking.status === "Pending" && (

                                        <button
                                            className="flex items-center gap-1.5 bg-[#800000] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#600000] transition-all"
                                        >
                                            <X size={15} />
                                            Cancel
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* Profile Settings */}
            <div className="bg-white border border-[#f0dfd9] rounded-2xl p-5 md:p-6 shadow-sm mb-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#f0dfd9] pb-4">

                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#4b1727]">
                            Profile Settings
                        </h2>

                        <p className="text-sm text-[#947e82] mt-1">
                            Manage your personal information.
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-[#800000] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#600000] transition-all">
                        <Settings size={17} />
                        Edit Profile
                    </button>

                </div>


                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                    <div className="w-20 h-20 rounded-full bg-[#fce8e6] flex items-center justify-center">
                        <UserRound size={38} className="text-[#800000]" />
                    </div>

                    <div className="text-center sm:text-left">

                        <h3 className="text-xl font-serif font-bold text-[#4b1727]">
                            Customer Name
                        </h3>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-[#806a70]">
                            <Mail size={15} />
                            customer@example.com
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-[#806a70]">
                            <Phone size={15} />
                            +880 1XXXXXXXXX
                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom Banner */}
            <div className="bg-linear-to-r from-[#f8dada] to-[#fce8e6] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#f3d2d2]">

                <div className="flex items-center gap-5">

                    <div className="hidden sm:flex w-16 h-16 rounded-full bg-[#f4c9b5] items-center justify-center">
                        <CalendarCheck size={34} className="text-[#800000]" />
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4b1727]">
                            Plan Your Dream Wedding!
                        </h2>

                        <p className="text-sm md:text-base text-[#684650] mt-2">
                            Discover amazing wedding services for your special day.
                        </p>
                    </div>

                </div>

                <button className="bg-[#800000] hover:bg-[#600000] text-white px-7 py-4 rounded-xl font-semibold whitespace-nowrap transition-all shadow-md">
                    Explore Services
                </button>

            </div>

        </div>
    );
};

export default CustomerDashboardpage;
