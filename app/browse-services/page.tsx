import { getService } from '@/lib/actions/service';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const BrowseServicesPage = async ({
    searchParams
}: {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}) => {

    const search = await searchParams;
    const urlSearch = new URLSearchParams(
        search as Record<string, string>
    );

    const query = urlSearch.toString();

    // A failed API request must never crash the page - show a friendly
    // error state instead (avoids React error #441 in production).
    let service: unknown[] = [];
    let loadError = false;

    try {
        const result = await getService(query);
        service = Array.isArray(result)
            ? result
            : (result as { services?: unknown[] })?.services ||
              (result as { data?: unknown[] })?.data ||
              [];
    } catch (error) {
        console.error('Browse services error:', error);
        loadError = true;
    }

    // Only show approved and active services to public
    const approvedServices = Array.isArray(service)
        ? service.filter(
            (s: any) => s.status === "Approved" && (s.isAvailable ?? true)
        )
        : [];

    return (
        <section className="min-h-screen bg-[#FCF4F2] py-14">

            <div className="mx-auto max-w-7xl px-5">

                {/* Page Heading */}
                <div className="mb-10 text-center">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#A34D5B]">
                        Find Your Perfect Wedding Vendors
                    </p>

                    <h1 className="text-4xl font-bold text-[#461A2B] md:text-5xl">
                        Browse Services
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Discover trusted wedding professionals and find
                        everything you need to make your special day
                        unforgettable.
                    </p>

                    <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#850D0D]"></div>

                </div>


                {/* Search & Filter */}
                <div className="mb-10 rounded-2xl border border-[#F0DADA] bg-white p-5 shadow-sm">

                    <form
                        action="/browse-services"
                        method="GET"
                        className="grid grid-cols-1 gap-4 md:grid-cols-4"
                    >

                        {/* Search */}
                        <input
                            type="text"
                            name="search"
                            defaultValue={
                                typeof search.search === 'string'
                                    ? search.search
                                    : ''
                            }
                            placeholder="Search service name..."
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#850D0D] focus:ring-2 focus:ring-[#850D0D]/10"
                        />


                        {/* Category */}
                        <select
                            name="category"
                            defaultValue={
                                typeof search.category === 'string'
                                    ? search.category
                                    : ''
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#850D0D]"
                        >
                            <option value="">All Categories</option>
                            <option value="Photography">Photography</option>
                            <option value="Videography">Videography</option>
                            <option value="Catering">Catering</option>
                            <option value="Decoration">Decoration</option>
                            <option value="Venue">Venue</option>
                            <option value="Makeup">Makeup</option>
                            <option value="Music">Music</option>
                            <option value="Wedding Planning">Wedding Planning</option>
                            <option value="Other">Other</option>
                        </select>


                        {/* Location */}
                        <input
                            type="text"
                            name="location"
                            defaultValue={
                                typeof search.location === 'string'
                                    ? search.location
                                    : ''
                            }
                            placeholder="Enter location..."
                            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#850D0D]"
                        />


                        {/* Buttons */}
                        <div className="flex gap-2">

                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-[#850D0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#650909]"
                            >
                                Search
                            </button>

                            <Link
                                href="/browse-services"
                                className="rounded-lg border border-[#850D0D] px-4 py-3 text-sm font-semibold text-[#850D0D] transition hover:bg-[#FCF4F2]"
                            >
                                Reset
                            </Link>

                        </div>

                    </form>

                </div>


                {/* Service Count */}
                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-bold text-[#461A2B]">
                        Available Services
                    </h2>

                    <span className="rounded-full bg-[#F2DDDF] px-4 py-2 text-sm font-semibold text-[#850D0D]">
                        {approvedServices.length} Services
                    </span>

                </div>


                {/* Service Listing */}
                {loadError ? (

                    /* Error State (API unreachable) */
                    <div className="rounded-2xl border border-dashed border-[#DDBFC3] bg-white px-5 py-20 text-center">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE8E6]">
                            <AlertCircle size={26} className="text-[#850D0D]" />
                        </div>

                        <h3 className="text-2xl font-bold text-[#461A2B]">
                            Unable to Load Services
                        </h3>

                        <p className="mt-3 text-gray-500">
                            We couldn&apos;t reach the WedPlan server right now.
                            Please try again in a moment.
                        </p>

                        <Link
                            href="/browse-services"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#850D0D] px-7 py-3 text-sm font-semibold text-white hover:bg-[#650909]"
                        >
                            <RefreshCw size={15} />
                            Try Again
                        </Link>

                    </div>

                ) : approvedServices.length === 0 ? (

                    /* Empty State */
                    <div className="rounded-2xl border border-dashed border-[#DDBFC3] bg-white px-5 py-20 text-center">

                        <div className="mb-4 text-5xl">♡</div>

                        <h3 className="text-2xl font-bold text-[#461A2B]">
                            No Services Found
                        </h3>

                        <p className="mt-3 text-gray-500">
                            We couldn&#39;t find any services matching
                            your search. Try different keywords or filters.
                        </p>

                        <Link
                            href="/browse-services"
                            className="mt-6 inline-block rounded-lg bg-[#850D0D] px-7 py-3 text-sm font-semibold text-white hover:bg-[#650909]"
                        >
                            Explore All Services
                        </Link>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                        {approvedServices.map((item: any) => (

                            <div
                                key={item._id}
                                className="group overflow-hidden rounded-2xl border border-[#F0DEDE] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >

                                {/* Service Image */}
                                <div className="relative h-56 overflow-hidden">

                                    {typeof item.serviceImage === 'string' &&
                                    item.serviceImage.trim() ? (
                                        <Image
                                            width={10}
                                            height={10}
                                            src={item.serviceImage}
                                            alt={item.serviceName}
                                            unoptimized
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[#FCE8E6] text-4xl text-[#850D0D]">
                                            ♡
                                        </div>
                                    )}

                                    <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#850D0D] shadow">
                                        {item.category}
                                    </span>

                                </div>


                                {/* Card Content */}
                                <div className="p-5">

                                    <h3 className="mb-3 line-clamp-1 text-xl font-bold text-[#461A2B] transition group-hover:text-[#850D0D]">
                                        {item.serviceName}
                                    </h3>


                                    {/* Location */}
                                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                                        <span>📍</span>
                                        <span>{item.location}</span>
                                    </div>


                                    {/* Vendor Information */}
                                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                                        <span>♙</span>
                                        <span>
                                            {item.vendorName ||
                                                (item.vendor?.name ||
                                                    item.vendorEmail ||
                                                    'Vendor information unavailable')}
                                        </span>
                                    </div>


                                    {/* Price */}
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Starting Price
                                            </p>

                                            <p className="text-xl font-bold text-[#850D0D]">
                                                TK.{Number(item.price).toLocaleString('en-BD')}
                                            </p>
                                        </div>


                                        {/* Details Button */}
                                        <Link
                                            href={`/browse-services/${item._id}`}
                                            className="rounded-lg bg-[#850D0D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#650909]"
                                        >
                                            View Details →
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
};

export default BrowseServicesPage;
