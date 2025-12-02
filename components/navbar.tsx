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
import { Button } from "@heroui/button";
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
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const homeSections: Record<string, string> = {
    Services: "#services",
    Pricing: "#pricing",
    Contact: "#contact",
  };

  // --- Handle "Hidden Dock" Logic ---
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScrollAndMouse = (e?: MouseEvent) => {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY < 10;
      const isMouseAtTop = e?.clientY !== undefined && e.clientY < 60;

      if (isMenuOpen || isAtTop || isMouseAtTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", () => handleScrollAndMouse());
    window.addEventListener("mousemove", handleScrollAndMouse);

    return () => {
      window.removeEventListener("scroll", () => handleScrollAndMouse());
      window.removeEventListener("mousemove", handleScrollAndMouse);
    };
  }, [isMenuOpen]);

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
      className={clsx(
        "fixed top-0 z-50 w-full transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <NavbarContent justify="start" className="flex-none">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2 cursor-pointer">
            <Logo className="h-5 w-auto" />
            <span className="font-bold cursor-pointer transition-colors duration-150 hover:text-blue-500">
              Infinite Tech Repair
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

      {/* --- DESKTOP RIGHT SIDE --- */}
      <NavbarContent className="hidden sm:flex flex-none gap-4" justify="end">
        {/* Book Repair Button (Desktop) */}
        <NavbarItem>
          <Button
            as={NextLink}
            href="/book-repair"
            color="primary"
            variant="solid"
            className="font-semibold shadow-lg shadow-blue-500/20"
          >
            Book a Repair
          </Button>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
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

      {/* --- MOBILE RIGHT SIDE --- */}
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

      {/* --- MOBILE MENU --- */}
      <NavbarMenu>
        <div className="mx-4 mt-6 flex flex-col gap-4">
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
                  className="w-full text-lg font-medium"
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            );
          })}

          {/* Book Repair Button (Mobile Menu) */}
          <NavbarMenuItem>
            <Button
              as={NextLink}
              href="/book-repair"
              color="primary"
              variant="solid"
              className="w-full font-semibold shadow-lg shadow-blue-500/20"
              onPress={() => setIsMenuOpen(false)}
            >
              Book a Repair
            </Button>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
