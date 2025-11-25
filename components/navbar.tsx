import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { Tooltip } from "@heroui/tooltip";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
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
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                href={item.href}
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "cursor-pointer transition-colors duration-150 hover:text-blue-500 hover:font-semibold"
                )}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
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

      {/* MOBILE MENU stays the same */}
      <NavbarMenu>{/* ... */}</NavbarMenu>
    </HeroUINavbar>
  );
};
