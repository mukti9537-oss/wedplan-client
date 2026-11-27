"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    MapPin,
    Heart,
    Camera,
    Loader2,
    Save,
    ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { getService, updateServiceDetails } from "@/lib/actions/service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
    "Photography",
    "Videography",
    "Catering",
    "Decoration",
    "Venue",
    "Makeup",
    "Music",
    "Wedding Planning",
    "Other",
];

const CATEGORY_LABELS: Record<string, string> = {
    Photography: "Photography",
    Videography: "Videography",
    Catering: "Catering",
    Decoration: "Wedding Decoration",
    Venue: "Wedding Venue",
    Makeup: "Makeup Artist",
    Music: "Music & Entertainment",
    "Wedding Planning": "Wedding Planning",
    Other: "Other",
};

type Service = {
    _id: string;
    serviceName: string;
    category: string;
    description: string;
    price: number;
    location: string;
    serviceImage: string;
    status?: string;
    isAvailable?: boolean;
};

const EditServicePage = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const [serviceId, setServiceId] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [serviceName, setServiceName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    // Load the current service details
    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                    setNotFound(true);
                    return;
                }

                setServiceId(id);

                const result = await getService();
                const data: Service[] = Array.isArray(result)
                    ? result
                    : result?.services || result?.data || [];

                const service = data.find(
                    (item) => item._id === id
                );

                if (!service) {
                    setNotFound(true);
                    return;
                }

                setServiceName(service.serviceName || "");
                setCategory(service.category || "");
                setDescription(service.description || "");
                setPrice(service.price != null ? String(service.price) : "");
                setLocation(service.location || "");
                setPreview(service.serviceImage || "");
            } catch (error) {
                console.error("Failed to load service:", error);
                toast.error("Failed to load service details!");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!serviceId) return;

        if (!serviceName.trim() || !category || !description.trim() || !location.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error("Price must be a positive number.");
            return;
        }

        try {
            setSaving(true);

            await updateServiceDetails(serviceId, {
                serviceName: serviceName.trim(),
                category,
                description: description.trim(),
                price: parsedPrice,
                location: location.trim(),
            });

            toast.success("Service updated successfully!");
            router.push("/dashboard/vendor/my-services");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update service!"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF2F0]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={30}
                        className="animate-spin text-[#8B0D0D]"
                    />
                    <p className="text-sm text-[#80676B]">
                        Loading service details...
                    </p>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FBF2F0] px-5 text-center">
                <h2 className="font-serif text-3xl font-bold text-[#401827] mb-3">
                    Service Not Found
                </h2>

                <p className="text-sm text-[#80676B] mb-6">
                    This service does not exist or has been removed.
                </p>

                <Link
                    href="/dashboard/vendor/my-services"
                    className="rounded-lg bg-[#8B0D0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6E0808]"
                >
                    Back to My Services
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF2F0] px-4 py-12 md:px-8">

            <div className="mx-auto max-w-5xl">

                {/* Page Heading */}
                <div className="mb-10 text-center">

                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Heart
                            size={17}
                            className="fill-[#8B0D0D] text-[#8B0D0D]"
                        />

                        <span className="text-xs font-semibold uppercase tracking-[3px] text-[#A45C61]">
                            WedPlan Marketplace
                        </span>

                        <Heart
                            size={17}
                            className="fill-[#8B0D0D] text-[#8B0D0D]"
                        />
                    </div>

                    <h1 className="font-serif text-4xl font-bold text-[#401827] md:text-5xl">
                        Update Your Service
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#80676B] md:text-base">
                        Keep your service information fresh so couples
                        always see the latest details.
                    </p>

                    <div className="mx-auto mt-6 h-[2] w-16 bg-[#8B0D0D]" />

                </div>


                {/* Form Card */}
                <Card className="overflow-hidden rounded-2xl border border-[#F0DDDA] bg-white shadow-[0_10px_40px_rgba(64,24,39,0.07)]">

                    {/* Card Header */}
                    <div className="border-b border-[#F1E4E1] bg-[#FFF9F7] px-6 py-6 md:px-10">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B0D0D] text-white">
                                <Camera size={21} />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl font-bold text-[#401827]">
                                    Service Details
                                </h2>

                                <p className="mt-1 text-sm text-[#927A7D]">
                                    Edit the information shown to customers.
                                </p>
                            </div>

                        </div>

                    </div>


                    <CardContent className="p-6 md:p-10">

                        <form onSubmit={handleSubmit} className="space-y-7">

                            {/* Service Name */}
                            <div className="space-y-2">

                                <label className="text-sm font-semibold text-[#401827]">
                                    Service Name <span className="text-[#8B0D0D]">*</span>
                                </label>

                                <Input
                                    name="serviceName"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="e.g. Premium Wedding Photography"
                                    required
                                    className="h-12 border-[#EBDAD7] bg-[#FFFCFB] px-4 text-sm text-[#401827] placeholder:text-[#B8A5A5] focus-visible:border-[#8B0D0D] focus-visible:ring-[#8B0D0D]/20"
                                />

                            </div>


                            {/* Category */}
                            <div className="space-y-2">

                                <label className="text-sm font-semibold text-[#401827]">
                                    Service Category <span className="text-[#8B0D0D]">*</span>
                                </label>

                                <Select
                                    value={category}
                                    onValueChange={(value) => setCategory(value ?? "")}
                                    required
                                >

                                    <SelectTrigger className="h-12 w-full border-[#EBDAD7] bg-[#FFFCFB] px-4 text-sm text-[#040203] focus:ring-[#8B0D0D]/20">
                                        <SelectValue placeholder="Choose a service category" />
                                    </SelectTrigger>

                                    <SelectContent>

                                        {CATEGORIES.map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {CATEGORY_LABELS[value]}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>

                                </Select>

                            </div>


                            {/* Description */}
                            <div className="space-y-2">

                                <label className="text-sm font-semibold text-[#401827]">
                                    Description <span className="text-[#8B0D0D]">*</span>
                                </label>

                                <Textarea
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your service, experience, and what makes it special..."
                                    required
                                    className="min-h-36 resize-none text-[#401827] border-[#EBDAD7] bg-[#FFFCFB] p-4 text-sm leading-7 placeholder:text-[#B8A5A5] focus-visible:border-[#8B0D0D] focus-visible:ring-[#8B0D0D]/20"
                                />

                            </div>


                            {/* Price & Location */}
                            <div className="grid gap-6 md:grid-cols-2">

                                {/* Price */}
                                <div className="space-y-2">

                                    <label className="text-sm font-semibold text-[#401827]">
                                        Price (BDT) <span className="text-[#8B0D0D]">*</span>
                                    </label>

                                    <div className="relative">
                                        <Input
                                            name="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter your price"
                                            required
                                            className="h-12 border-[#EBDAD7] text-[#401827] bg-[#FFFCFB] pl-10 placeholder:text-[#B8A5A5] focus-visible:border-[#8B0D0D] focus-visible:ring-[#8B0D0D]/20"
                                        />

                                    </div>

                                </div>


                                {/* Location */}
                                <div className="space-y-2">

                                    <label className="text-sm font-semibold text-[#401827]">
                                        Location <span className="text-[#8B0D0D]">*</span>
                                    </label>

                                    <div className="relative">

                                        <MapPin
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B0D0D]"
                                        />

                                        <Input
                                            name="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Chattogram, Bangladesh"
                                            required
                                            className="h-12 border-[#EBDAD7] text-[#401827] bg-[#FFFCFB] pl-11 placeholder:text-[#831515] focus-visible:border-[#8B0D0D] focus-visible:ring-[#8B0D0D]/20"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Current Image (read-only preview) */}
                            <div className="space-y-3">

                                <label className="text-sm font-semibold text-[#401827]">
                                    Service Image
                                </label>

                                {preview ? (
                                    <div className="relative overflow-hidden rounded-xl border border-[#EBDAD7]">

                                        <Image
                                            width={10}
                                            height={10}
                                            src={preview}
                                            alt="Service Image"
                                            unoptimized
                                            className="h-64 w-full object-cover"
                                        />

                                        <div className="flex items-center gap-2 bg-[#FFF9F7] px-4 py-3">

                                            <Camera
                                                size={17}
                                                className="text-[#8B0D0D]"
                                            />

                                            <span className="truncate text-sm font-medium text-[#401827]">
                                                Current service image
                                            </span>

                                        </div>

                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-[#DDBEBC] bg-[#FFFAF8] px-6 py-8 text-center text-sm text-[#A58B8E]">
                                        No service image uploaded
                                    </div>
                                )}

                                <p className="text-xs text-[#A58B8E]">
                                    The service image stays unchanged when you update
                                    the details.
                                </p>

                            </div>


                            {/* Submit Buttons */}
                            <div className="border-t border-[#F1E4E1] pt-7 flex flex-wrap items-center gap-4">

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-13 rounded-lg bg-[#8B0D0D] text-sm font-semibold text-white shadow-md shadow-[#8B0D0D]/15 transition-all hover:bg-[#6E0808] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-48"
                                >

                                    {saving ? (
                                        <>
                                            <Loader2 size={17} className="mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            Save Changes
                                            <Save size={17} className="ml-2" />
                                        </>
                                    )}

                                </Button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/dashboard/vendor/my-services")
                                    }
                                    className="flex h-13 items-center gap-2 rounded-lg border border-[#EBDAD7] px-6 text-sm font-semibold text-[#401827] transition hover:border-[#8B0D0D] hover:text-[#8B0D0D]"
                                >
                                    <ArrowLeft size={17} />
                                    Cancel
                                </button>

                                <p className="w-full text-xs leading-6 text-[#A58B8E] sm:w-auto sm:flex-1">
                                    Changes are visible to customers as soon
                                    as they are saved.
                                </p>

                            </div>

                        </form>

                    </CardContent>

                </Card>


                {/* Bottom Note */}
                <div className="mt-8 flex items-center justify-center gap-2 text-center">

                    <Heart
                        size={14}
                        className="fill-[#8B0D0D] text-[#8B0D0D]"
                    />

                    <p className="text-xs text-[#927A7D]">
                        Make every wedding moment unforgettable with WedPlan.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default EditServicePage;
