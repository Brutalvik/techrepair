"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Tooltip } from "@heroui/tooltip";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper: Define which labels correspond to ID sections on the home page
  // You can easily add "Contact" or "Testimonials" here later
  const homeSections: Record<string, string> = {
    Services: "#services",
    Pricing: "#pricing",
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMenuOpen(false);

    // If it's an anchor link (starts with #) AND we are on the home page
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* LEFT: logo */}
      <NavbarContent justify="start" className="flex-none">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2 cursor-pointer">
            <Logo className="h-5 w-auto" />
            <span className="font-bold cursor-pointer transition-colors duration-150 hover:text-blue-500">
              Infinite Tech Repairs
            </span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER: desktop nav items */}
      <NavbarContent className="hidden lg:flex flex-1 justify-center">
        <ul className="flex items-center gap-6">
          {siteConfig.navItems.map((item) => {
            // Check if this item is a scrollable section
            const sectionId = homeSections[item.label];

            // Determine the link:
            // 1. If it's a section, check if we are on Home (#id) or elsewhere (/#id)
            // 2. If it's not a section, use the default href from config
            let linkHref = item.href;
            if (sectionId) {
              linkHref = pathname === "/" ? sectionId : `/${sectionId}`;
            }

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  href={linkHref}
                  onClick={(e) => handleNavClick(e, linkHref)}
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "cursor-pointer transition-colors duration-150 hover:text-blue-500 hover:font-semibold"
                  )}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </ul>
      </NavbarContent>

      {/* RIGHT: theme switch (desktop) */}
      <NavbarContent className="hidden sm:flex flex-none" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Tooltip content="Toggle theme" placement="bottom">
            <button
              type="button"
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full cursor-pointer
               transition-all duration-200
               hover:text-blue-500
               hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]
               focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-full border border-transparent
                 transition-all duration-200
                 group-hover:border-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
              />
              <span
                className="pointer-events-none absolute inline-flex h-full w-full rounded-full
                 bg-blue-500/40 opacity-0
                 group-hover:opacity-70 group-hover:animate-ping"
              />
              <ThemeSwitch />
            </button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      {/* MOBILE: theme switch + menu toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Tooltip content="Toggle theme" placement="bottom">
          <button
            type="button"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full cursor-pointer
                       transition-all duration-200
                       hover:text-blue-500
                       hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-full border border-transparent
                         transition-all duration-200
                         group-hover:border-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
            />
            <span
              className="pointer-events-none absolute inline-flex h-full w-full rounded-full
                         bg-blue-500/40 opacity-0
                         group-hover:opacity-70 group-hover:animate-ping"
            />
            <ThemeSwitch />
          </button>
        </Tooltip>

        <NavbarMenuToggle />
      </NavbarContent>

      {/* MOBILE MENU */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => {
            // Apply same logic for mobile links
            const sectionId = homeSections[item.label];

            let linkHref = item.href;
            if (sectionId) {
              linkHref = pathname === "/" ? sectionId : `/${sectionId}`;
            }

            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <NextLink
                  href={linkHref}
                  onClick={(e) => handleNavClick(e, linkHref)}
                  className="w-full text-lg"
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
