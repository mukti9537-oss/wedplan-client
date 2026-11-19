"use client";

import React, { useState } from "react";
import {
    ImagePlus,
    MapPin,
    UploadCloud,
    X,
    Heart,
    ArrowRight,
    Camera,
    DollarSign,
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

const AddServicepage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [category, setCategory] = useState("");

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setImage(null);
        setPreview(null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const serviceData = {
            serviceName: formData.get("serviceName"),
            category,
            description: formData.get("description"),
            price: formData.get("price"),
            location: formData.get("location"),
            image,
        };

        console.log(serviceData);
    };

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
                        Share Your Service
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#80676B] md:text-base">
                        Showcase your expertise and become a part of
                        someone&apos;s beautiful wedding story.
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
                                    Tell us about the service you provide.
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

                                        <SelectItem value="Photography">
                                            Photography
                                        </SelectItem>

                                        <SelectItem value="Videography">
                                            Videography
                                        </SelectItem>

                                        <SelectItem value="Catering">
                                            Catering
                                        </SelectItem>

                                        <SelectItem value="Decoration">
                                            Wedding Decoration
                                        </SelectItem>

                                        <SelectItem value="Venue">
                                            Wedding Venue
                                        </SelectItem>

                                        <SelectItem value="Makeup">
                                            Makeup Artist
                                        </SelectItem>

                                        <SelectItem value="Music">
                                            Music & Entertainment
                                        </SelectItem>

                                        <SelectItem value="Wedding Planning">
                                            Wedding Planning
                                        </SelectItem>

                                        <SelectItem value="Other">
                                            Other
                                        </SelectItem>

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
                                            // min="1"
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
                                            placeholder="e.g. Chattogram, Bangladesh"
                                            required
                                            className="h-12 border-[#EBDAD7] text-[#401827] bg-[#FFFCFB] pl-11 placeholder:text-[#831515] focus-visible:border-[#8B0D0D] focus-visible:ring-[#8B0D0D]/20"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Image Upload */}
                            <div className="space-y-3">

                                <label className="text-sm font-semibold text-[#401827]">
                                    Service Image <span className="text-[#8B0D0D]">*</span>
                                </label>

                                {!preview ? (

                                    <label
                                        htmlFor="serviceImage"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDBEBC] bg-[#FFFAF8] px-6 py-12 transition-all hover:border-[#8B0D0D] hover:bg-[#FBF2F0]"
                                    >

                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F6E5E2]">

                                            <UploadCloud
                                                size={30}
                                                className="text-[#8B0D0D]"
                                            />

                                        </div>

                                        <p className="text-sm font-semibold text-[#401827]">
                                            Click to upload your service image
                                        </p>

                                        <p className="mt-2 text-xs text-[#A58B8E]">
                                            PNG, JPG or JPEG
                                        </p>

                                        <span className="mt-4 rounded-lg bg-[#8B0D0D] px-5 py-2 text-xs font-semibold text-white">
                                            Browse Files
                                        </span>

                                        <Input
                                            id="serviceImage"
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                    </label>

                                ) : (

                                    <div className="relative overflow-hidden rounded-xl border border-[#EBDAD7]">

                                        <Image
                                            width={10}
                                            height={10}
                                            src={preview}
                                            alt="Service Preview"
                                            className="h-64 w-full object-cover"
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={removeImage}
                                            className="absolute right-3 top-3 rounded-full"
                                        >
                                            <X size={18} />
                                        </Button>

                                        <div className="flex items-center gap-2 bg-[#FFF9F7] px-4 py-3">

                                            <ImagePlus
                                                size={17}
                                                className="text-[#8B0D0D]"
                                            />

                                            <span className="truncate text-sm font-medium text-[#401827]">
                                                {image?.name}
                                            </span>

                                        </div>

                                    </div>

                                )}

                                <p className="text-xs text-[#A58B8E]">
                                    Upload a beautiful image that represents your service.
                                </p>

                            </div>


                            {/* Submit Button */}
                            <div className="border-t border-[#F1E4E1] pt-7">

                                <Button
                                    type="submit"
                                    disabled={!image || !category}
                                    className="h-13 w-full rounded-lg bg-[#8B0D0D] text-sm font-semibold text-white shadow-md shadow-[#8B0D0D]/15 transition-all hover:bg-[#6E0808] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-48"
                                >

                                    Add Service

                                    <ArrowRight size={17} className="ml-2" />

                                </Button>

                                <p className="mt-4 text-xs leading-6 text-[#A58B8E]">
                                    By submitting, you agree to provide accurate
                                    information about your wedding service.
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

export default AddServicepage;