"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { NavigationMenu as NavigationMenuParts } from "@base-ui/react/navigation-menu"

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.Root
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
NavigationMenu.displayName = "NavigationMenu"

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.List
    ref={ref}
    className={cn("flex flex-row gap-8", className)}
    {...props}
  />
))
NavigationMenuList.displayName = "NavigationMenuList"

export const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.Item
    ref={ref}
    className={cn("relative", className)}
    {...props}
  />
))
NavigationMenuItem.displayName = "NavigationMenuItem"

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.Trigger>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-sm px-4 py-1.5 text-sm font-medium transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.Portal>
    <NavigationMenuParts.Content
      ref={ref}
      className={cn(
        "w-[var(--radix-navigation-menu-trigger-width)] max-w-xs overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </NavigationMenuParts.Portal>
))
NavigationMenuContent.displayName = "NavigationMenuContent"

export const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuParts.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuParts.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuParts.Link
    ref={ref}
    className={cn(
      "flex flex-col gap-1 -mx-2 my-1.5 pl-8 pr-2 py-1.5 text-sm transition-colors rounded-md data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
NavigationMenuLink.displayName = "NavigationMenuLink"
