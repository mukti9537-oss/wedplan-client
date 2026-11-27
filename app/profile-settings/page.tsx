"use client";

import { useState } from "react";
import Link from "next/link";
import { useRef } from "react";
import {
    User,
    Mail,
    Camera,
    ShieldCheck,
    Save,
    Loader2,
    ArrowLeft,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfileSettingsPage = () => {
    const { data: session, isPending } = useSession();

    const [name, setName] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const profileName = name ?? session?.user.name ?? "";
    const profileImage = session?.user.image ?? "";
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [previewImage, setPreviewImage] = useState(
        session?.user?.image || ""
    );

    const fileInputRef = useRef<HTMLInputElement>(null);


const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    e.preventDefault();

    if (!profileName.trim()) {
        toast.error("Name is required");
        return;
    }

    try {
        setLoading(true);

        let imageUrl = "";

        // Upload selected image to ImgBB
        if (selectedImage) {
            const formData = new FormData();
            formData.append("profileImage", selectedImage);

            const { getAuthHeaders } = await import("@/lib/core/auth-headers");
            const headers = await getAuthHeaders();

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/upload-profile-image`,
                {
                    method: "POST",
                    headers,
                    body: formData,
                }
            );

            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.message || "Image upload failed");
            }

            imageUrl = uploadData.imageUrl;
        }

        const { error } = await authClient.updateUser({
            name: profileName.trim(),
            ...(selectedImage ? { image: imageUrl } : {}),
        });

        if (error) {
            toast.error(error.message || "Failed to update profile");
            return;
        }

        toast.success("Profile updated successfully!");
        setSelectedImage(null);

    } catch (error) {
        console.error("Profile update error:", error);

        toast.error(
            error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."
        );

    } finally {
        setLoading(false);
    }
};


    if (isPending) {
        return (
            <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center">
                <Loader2 size={35} className="animate-spin text-[#843047]" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="min-h-screen bg-[#FFF8FA] flex items-center justify-center p-5">
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#F3DDE5]">
                    <h2 className="text-xl font-bold text-[#542332]">
                        Please Sign In
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        You need to sign in to access your profile settings.
                    </p>
                    <Link
                        href="/sign-in"
                        className="inline-block mt-5 bg-[#843047] text-white px-6 py-3 rounded-xl"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const role = session.user.role || "User";

    return (
        <div className="min-h-screen bg-[#FFF8FA] px-4 py-8 md:px-8">

            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#843047] hover:text-[#542332] mb-5"
                    >
                        <ArrowLeft size={17} />
                        Back to Home
                    </Link>

                    <h1 className="text-2xl md:text-3xl font-bold text-[#542332]">
                        Profile Settings
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        Manage your personal information and account details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Profile Preview */}
                    <div className="bg-white rounded-2xl border border-[#F3DDE5] shadow-sm p-6 h-fit">

                        <div className="text-center">

                            <div className="relative w-28 h-28 mx-auto mb-4">

                                {profileImage ? (
                                    <Image
                                        width={10}
                                        height={10}
                                        src={profileImage}
                                        unoptimized
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border-4 border-[#FCE7EE]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#FCE7EE] flex items-center justify-center border-4 border-[#F3DDE5]">
                                        <User size={45} className="text-[#843047]" />
                                    </div>
                                )}

                                <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#843047] rounded-full flex items-center justify-center border-4 border-white">
                                    <Camera size={16} className="text-white" />
                                </div>

                            </div>

                            <h2 className="text-xl font-bold text-[#542332]">
                                {profileName || session.user.name}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {session.user.email}
                            </p>

                            <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#FCE7EE] text-[#843047] rounded-full text-xs font-bold capitalize">
                                <ShieldCheck size={15} />
                                {role} Account
                            </span>

                        </div>

                        <div className="border-t border-[#F3DDE5] mt-6 pt-5">
                            <p className="text-xs text-gray-500 leading-6">
                                Keep your profile information updated so customers and service providers can identify your account.
                            </p>
                        </div>

                    </div>

                    {/* Edit Profile Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F3DDE5] shadow-sm p-6 md:p-8">

                        <div className="mb-7">
                            <h2 className="text-xl font-bold text-[#542332]">
                                Personal Information
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Update your profile details below.
                            </p>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#542332] mb-2">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#843047]"
                                    />

                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#F3DDE5] bg-[#FFF8FA] text-[#542332] outline-none focus:border-[#843047] focus:ring-2 focus:ring-[#843047]/10 transition"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#542332] mb-2">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        value={session.user.email}
                                        readOnly
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
                                    />
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    Email address cannot be changed here.
                                </p>
                            </div>

                            {/* Profile Image */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-[#542332]">
                                    Profile Image
                                </label>

                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FCE7EE] bg-[#FFF8FA]">
                                        {previewImage ? (
                                            <Image
                                                width={10}
                                                height={10}
                                                unoptimized
                                                src={previewImage}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#A34A64]">
                                                <Camera size={30} />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];

                                                if (!file) return;

                                                if (file.size > 5 * 1024 * 1024) {
                                                    toast.error("Image size must be under 5MB");
                                                    return;
                                                }

                                                setSelectedImage(file);
                                                setPreviewImage(URL.createObjectURL(file));
                                            }}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 rounded-lg bg-[#843047] text-white hover:bg-[#542332]"
                                        >
                                            Choose Image
                                        </button>

                                        <p className="text-xs text-gray-500 mt-2">
                                            JPG, PNG or WEBP. Maximum 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Role */}
                            <div>
                                <label className="block text-sm font-semibold text-[#542332] mb-2">
                                    Account Role
                                </label>

                                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-100">
                                    <ShieldCheck size={19} className="text-[#843047]" />

                                    <span className="text-gray-500 capitalize">
                                        {role}
                                    </span>

                                    <span className="ml-auto text-xs text-gray-400">
                                        Protected
                                    </span>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-[#FFF8FA] border border-[#F3DDE5] rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck
                                        size={20}
                                        className="text-[#843047] shrink-0 mt-0.5"
                                    />

                                    <div>
                                        <h3 className="text-sm font-semibold text-[#542332]">
                                            Account Security
                                        </h3>

                                        <p className="text-xs text-gray-500 leading-6 mt-1">
                                            Your account role and subscription status are protected and cannot be changed through profile settings.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-[#843047] hover:bg-[#542332] text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#843047]/10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={19} className="animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save size={19} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;