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
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Tooltip } from "@heroui/tooltip";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State for dock visibility
  const pathname = usePathname();

  const homeSections: Record<string, string> = {
    Services: "#services",
    Pricing: "#pricing",
    Contact: "#contact",
  };

  // --- NEW: Handle "Hidden Dock" Logic ---
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScrollAndMouse = (e?: MouseEvent) => {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY < 10; // User is at the very top of page

      // Check if mouse is near the top (Dock trigger zone - 60px)
      // We use optional chaining because this function runs on scroll events too (where e is undefined)
      const isMouseAtTop = e?.clientY !== undefined && e.clientY < 60;

      // LOGIC:
      // 1. If menu is open (mobile), ALWAYS show.
      // 2. If at very top of page, ALWAYS show.
      // 3. If mouse is hovering the top zone, SHOW.
      // 4. Otherwise, HIDE.
      if (isMenuOpen || isAtTop || isMouseAtTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    // Attach listeners
    window.addEventListener("scroll", () => handleScrollAndMouse());
    window.addEventListener("mousemove", handleScrollAndMouse);

    return () => {
      window.removeEventListener("scroll", () => handleScrollAndMouse());
      window.removeEventListener("mousemove", handleScrollAndMouse);
    };
  }, [isMenuOpen]); // Re-run if menu state changes

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsMenuOpen(false);
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
      // Apply the transformation classes here
      className={clsx(
        "fixed top-0 z-50 w-full transition-transform duration-300 ease-in-out",
        // If visible, translate-y-0. If hidden, translate-y-full (move up out of view)
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
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

      <NavbarContent className="hidden lg:flex flex-1 justify-center">
        <ul className="flex items-center gap-6">
          {siteConfig.navItems.map((item) => {
            const sectionId = homeSections[item.label];
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

      <NavbarContent className="hidden sm:flex flex-none" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Tooltip content="Toggle theme" placement="bottom">
            <button
              type="button"
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:text-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
            >
              <span className="pointer-events-none absolute inset-0 rounded-full border border-transparent transition-all duration-200 group-hover:border-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]" />
              <span className="pointer-events-none absolute inline-flex h-full w-full rounded-full bg-blue-500/40 opacity-0 group-hover:opacity-70 group-hover:animate-ping" />
              <ThemeSwitch />
            </button>
          </Tooltip>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Tooltip content="Toggle theme" placement="bottom">
          <button
            type="button"
            className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:text-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full border border-transparent transition-all duration-200 group-hover:border-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]" />
            <span className="pointer-events-none absolute inline-flex h-full w-full rounded-full bg-blue-500/40 opacity-0 group-hover:opacity-70 group-hover:animate-ping" />
            <ThemeSwitch />
          </button>
        </Tooltip>
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => {
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
