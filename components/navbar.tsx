"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Heart, Menu, X } from "lucide-react"

import {
  Drawer,
  DrawerContent,
  DrawerBackdrop,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerPortal,
} from "@/components/ui/drawer"
import { useSession , signOut} from "@/lib/auth-client"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/browse-services", label: "Browse Services" },
] as const

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const {data: session} = useSession()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "bg-[#FAF0F0]/95 backdrop-blur-md",
          "border-b border-[#EADDDD]",
          "transition-all duration-300"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 lg:px-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C0A09] transition-transform duration-300 group-hover:scale-105">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#7C0A09]">
                WedPlan
              </span>
              <span className="text-[9px] font-medium tracking-[2px] text-[#766766] uppercase">
                Wedding Planning Platform
              </span>
            </div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">

            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-[13px] font-medium",
                  "text-[#3D2928]",
                  "transition-colors duration-200",
                  "hover:text-[#7C0A09]",
                  "after:absolute after:-bottom-1 after:left-0",
                  "after:h-[1.5px] after:w-0",
                  "after:bg-[#7C0A09]",
                  "after:transition-all after:duration-300",
                  "hover:after:w-full"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Sign In */}
            {session?.user ? 
            <>
            <span className="text-[#7C0A09]">welcome, {session.user.name}</span>
               <button
              onClick={handleSignOut}
              className={cn(
                "rounded-full bg-[#7C0A09]",
                "px-6 py-2.5",
                "text-[12px] font-semibold text-white",
                "shadow-sm shadow-[#7C0A09]/20",
                "transition-all duration-300",
                "hover:bg-[#5F0808]",
                "hover:shadow-md hover:shadow-[#7C0A09]/25",
                "hover:-translate-y-0.5"
              )}
            >
              Sign Out 
            </button>
            </>
          :<>
             <Link
              href="/sign-in"
              className="text-[13px] font-semibold text-[#3D2928] transition-colors duration-200 hover:text-[#7C0A09]"
            >
              Sign In
            </Link>

            {/* Sign Up */}
            <Link
              href="/sign-up"
              className={cn(
                "rounded-full bg-[#7C0A09]",
                "px-6 py-2.5",
                "text-[12px] font-semibold text-white",
                "shadow-sm shadow-[#7C0A09]/20",
                "transition-all duration-300",
                "hover:bg-[#5F0808]",
                "hover:shadow-md hover:shadow-[#7C0A09]/25",
                "hover:-translate-y-0.5"
              )}
            >
              Sign Up
            </Link>
         </>
          }
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#7C0A09] transition-colors hover:bg-[#7C0A09]/10"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
      >
        <DrawerPortal>

          <DrawerBackdrop className="bg-black/40" />

          <DrawerContent className="border-t border-[#EADDDD] bg-[#FAF0F0] p-6">

            {/* Drawer Header */}
            <div className="mb-8 flex items-center justify-between">

              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7C0A09]">
                  <Heart className="h-5 w-5 fill-white text-white" />
                </div>

                <span className="text-xl font-bold text-[#7C0A09]">
                  WedPlan
                </span>
              </Link>

              <DrawerClose className="flex h-9 w-9 items-center justify-center rounded-full text-[#7C0A09] transition-colors hover:bg-[#7C0A09]/10">
                <X className="h-5 w-5" />
              </DrawerClose>

            </div>

            <DrawerTitle className="sr-only">
              Navigation Menu
            </DrawerTitle>

            <DrawerDescription className="mb-7 text-sm leading-relaxed text-[#766766]">
              Discover meaningful connections and plan your perfect future.
            </DrawerDescription>

            {/* Mobile Navigation Links */}
            <nav className="grid gap-2">

              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3.5",
                    "text-sm font-semibold text-[#3D2928]",
                    "transition-colors duration-200",
                    "hover:bg-[#7C0A09]/10 hover:text-[#7C0A09]"
                  )}
                >
                  {item.label}
                </Link>
              ))}

            </nav>

            {/* Mobile Auth Buttons */}
            <div className="mt-7 space-y-3 border-t border-[#EADDDD] pt-6">

              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-[#7C0A09] py-3 text-sm font-semibold text-[#7C0A09] transition-colors hover:bg-[#7C0A09]/5"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-[#7C0A09] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5F0808]"
              >
                Sign Up
              </Link>

            </div>

          </DrawerContent>

        </DrawerPortal>
      </Drawer>
    </>
  )
}