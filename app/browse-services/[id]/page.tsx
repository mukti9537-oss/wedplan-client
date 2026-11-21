import React from "react";
import { getService } from "@/lib/actions/service";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const ServiceDetailsPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    // Validate service ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        notFound();
    }

    let result;
    let loadError = false;

    try {
        result = await getService();
    } catch (error) {
        console.error("Service details error:", error);
        loadError = true;
    }

    if (loadError) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fffaf7] px-5">
                <h2 className="text-3xl font-serif text-[#401b29] mb-4">
                    Something Went Wrong!
                </h2>

                <p className="text-gray-500 mb-6">
                    Unable to load service details.
                </p>

                <Link
                    href="/browse-services"
                    className="bg-[#8c1010] text-white px-6 py-3 rounded-lg"
                >
                    Back to Services
                </Link>
            </div>
        );
    }

    const services = Array.isArray(result)
        ? result
        : result?.data || [];

    const service = services.find(
        (item: { _id?: unknown }) =>
            item._id != null && String(item._id) === id
    );

    // Service not found
    if (!service) {
        notFound();
    }

    // Service images
    const images = [
        service.serviceImage,
        ...(service.serviceImages || []),
        ...(service.images || []),
    ].filter(Boolean);

    // Approval and active status
    const isApproved =
        service.isApproved === true ||
        service.approvalStatus === "approved";

    const isActive = service.isActive === true;

    const canBook = isApproved && isActive;

    // Vendor information
    const vendorName =
        service.vendorName ||
        service.vendor?.name ||
        "Vendor information unavailable";

    const vendorEmail =
        service.vendorEmail ||
        service.vendor?.email ||
        "";

    const vendorPhone =
        service.vendorPhone ||
        service.vendor?.phone ||
        "";

    return (
        <main className="bg-[#fffaf7] min-h-screen">

            {/* Page Heading */}
            <section className="bg-[#f8eeeb] py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-5 md:px-8">

                    <p className="text-sm uppercase tracking-[4px] text-[#a34d59] font-semibold mb-4">
                        WedPlan / Our Services
                    </p>

                    <h1 className="text-3xl md:text-5xl font-serif text-[#401b29] font-bold">
                        Service Details
                    </h1>

                    <p className="text-gray-600 mt-4 max-w-xl leading-7">
                        Discover every detail of this service and
                        make your special day unforgettable.
                    </p>

                </div>
            </section>


            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Content */}
                    <div className="lg:col-span-2">

                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

                            {images.length > 0 ? (
                                images.map(
                                    (image: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`overflow-hidden rounded-2xl ${index === 0
                                                ? "md:col-span-2 h-[280px] md:h-[430px]"
                                                : "h-[220px]"
                                                }`}
                                        >
                                            <Image
                                                width={10}
                                                height={10}
                                                src={image}
                                                alt={`${service.serviceName} ${index + 1}`}
                                                unoptimized
                                                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                            />
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="md:col-span-2 h-[350px] bg-[#f3e6e2] rounded-2xl flex items-center justify-center text-[#401b29]">
                                    No service images available
                                </div>
                            )}

                        </div>


                        {/* Service Information */}
                        <div className="mb-10">

                            <div className="flex flex-wrap items-center gap-3 mb-4">

                                <span className="bg-[#f2e2df] text-[#8c1010] px-4 py-2 rounded-full text-sm font-semibold">
                                    {service.category}
                                </span>

                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${canBook
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}>
                                    {canBook ? "Available" : "Not Available for Booking"}
                                </span>

                            </div>

                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#401b29] mb-5">
                                {service.serviceName}
                            </h2>

                            <div className="h-[2px] w-20 bg-[#a34d59] mb-6"></div>

                            <h3 className="text-xl font-semibold text-[#401b29] mb-3">
                                About This Service
                            </h3>

                            <p className="text-gray-600 leading-8 text-base md:text-lg whitespace-pre-line">
                                {service.description}
                            </p>

                        </div>


                        {/* Service Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">

                            <div className="bg-white border border-[#f0dfda] rounded-xl p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Service Category
                                </p>

                                <h3 className="text-lg font-semibold text-[#401b29]">
                                    {service.category}
                                </h3>
                            </div>

                            <div className="bg-white border border-[#f0dfda] rounded-xl p-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Service Location
                                </p>

                                <h3 className="text-lg font-semibold text-[#401b29]">
                                    {service.location}
                                </h3>
                            </div>

                        </div>


                        {/* Vendor Information */}
                        <div className="bg-white border border-[#f0dfda] rounded-2xl p-6 md:p-8">

                            <h3 className="text-2xl font-serif font-bold text-[#401b29] mb-6">
                                About The Vendor
                            </h3>

                            <div className="flex items-center gap-4 mb-5">

                                <div className="w-16 h-16 rounded-full bg-[#f2e2df] flex items-center justify-center text-2xl text-[#8c1010]">
                                    ♡
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#401b29]">
                                        {vendorName}
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Service Provider
                                    </p>
                                </div>

                            </div>

                            {vendorEmail && (
                                <p className="text-gray-600 mb-2">
                                    Email: {vendorEmail}
                                </p>
                            )}

                            {vendorPhone && (
                                <p className="text-gray-600">
                                    Phone: {vendorPhone}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* Right Booking Card */}
                    <div className="lg:col-span-1">

                        <div className="bg-white border border-[#ead6d1] rounded-2xl shadow-sm p-6 md:p-8 sticky top-28">

                            <p className="text-sm uppercase tracking-[2px] text-[#a34d59] font-semibold mb-3">
                                Service Pricing
                            </p>

                            <h2 className="text-3xl md:text-4xl font-bold text-[#401b29] mb-2">
                                TK.{Number(service.price).toLocaleString("en-BD")}
                            </h2>

                            <p className="text-gray-500 text-sm mb-7">
                                Service starting price
                            </p>

                            <div className="border-t border-[#f0dfda] pt-6 space-y-5 mb-7">

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Category
                                    </span>

                                    <span className="font-semibold text-[#401b29]">
                                        {service.category}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Location
                                    </span>

                                    <span className="font-semibold text-[#401b29]">
                                        {service.location}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">
                                        Status
                                    </span>

                                    <span className={`font-semibold ${canBook
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}>
                                        {canBook ? "Active" : "Unavailable"}
                                    </span>
                                </div>

                            </div>


                            {/* Booking Option */}
                            {canBook ? (
                                <Link
                                    href={`/booking/${service._id}`}
                                    className="block text-center w-full bg-[#8c1010] hover:bg-[#681010] text-white font-semibold py-4 rounded-lg transition duration-300"
                                >
                                    Request Booking →
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-gray-300 text-gray-600 font-semibold py-4 rounded-lg cursor-not-allowed"
                                >
                                    Booking Unavailable
                                </button>
                            )}

                            <p className="text-center text-xs text-gray-500 mt-5 leading-6">
                                Make your wedding day special with
                                our professional services.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* Bottom Section */}
            <section className="bg-[#401522] py-14 px-5">

                <div className="max-w-4xl mx-auto text-center">

                    <p className="text-[#e6b9b9] uppercase tracking-[4px] text-xs mb-4">
                        Your Dream Wedding
                    </p>

                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-5">
                        Every Detail Matters
                    </h2>

                    <p className="text-[#ead5d8] leading-7 mb-8">
                        Let WedPlan help you create beautiful memories
                        that last a lifetime.
                    </p>

                    <Link
                        href="/browse-services"
                        className="inline-block bg-white text-[#8c1010] px-8 py-3 rounded-md font-semibold hover:bg-[#f4e6e3] transition"
                    >
                        Explore More Services
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default ServiceDetailsPage;