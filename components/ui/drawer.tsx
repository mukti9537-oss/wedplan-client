"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Drawer as DrawerParts } from "@base-ui/react/drawer"

export const Drawer = DrawerParts.Root
export const DrawerPortal = DrawerParts.Portal

export const DrawerBackdrop = React.forwardRef<
  React.ElementRef<typeof DrawerParts.Backdrop>,
  React.ComponentPropsWithoutRef<typeof DrawerParts.Backdrop>
>(({ className, ...props }, ref) => (
  <DrawerParts.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
      "data-open:animate-in data-closed:animate-out",
      "data-closed:fade-out-0 data-open:fade-in-0",
      className
    )}
    {...props}
  />
))

DrawerBackdrop.displayName = "DrawerBackdrop"

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerParts.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerParts.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerParts.Viewport
    className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
  >
    <DrawerParts.Popup
      className={cn(
        "pointer-events-auto relative w-full max-w-md",
        "outline-none"
      )}
    >
      <DrawerParts.Content
        ref={ref}
        className={cn(
          "relative w-full rounded-t-xl",
          "border border-[#EADDDD]",
          "bg-[#FAF0F0] p-6 shadow-lg",
          "outline-none",
          "data-starting-style:translate-y-full",
          "data-ending-style:translate-y-full",
          "transition-transform duration-300",
          className
        )}
        {...props}
      >
        {children}
      </DrawerParts.Content>
    </DrawerParts.Popup>
  </DrawerParts.Viewport>
))

DrawerContent.displayName = "DrawerContent"

export const DrawerClose = React.forwardRef<
  React.ElementRef<typeof DrawerParts.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerParts.Close>
>(({ className, ...props }, ref) => (
  <DrawerParts.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 z-50",
      "flex h-9 w-9 items-center justify-center",
      "rounded-full text-[#7C0A09]",
      "opacity-100 transition-colors",
      "hover:bg-[#7C0A09]/10",
      "focus:outline-none focus:ring-2 focus:ring-[#7C0A09]",
      className
    )}
    {...props}
  />
))

DrawerClose.displayName = "DrawerClose"

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerParts.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerParts.Title>
>(({ className, ...props }, ref) => (
  <DrawerParts.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-[#241817]",
      className
    )}
    {...props}
  />
))

DrawerTitle.displayName = "DrawerTitle"

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerParts.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerParts.Description>
>(({ className, ...props }, ref) => (
  <DrawerParts.Description
    ref={ref}
    className={cn(
      "text-sm text-[#766766]",
      className
    )}
    {...props}
  />
))

DrawerDescription.displayName = "DrawerDescription"

export type DrawerContentProps =
  React.ComponentPropsWithoutRef<typeof DrawerContent>