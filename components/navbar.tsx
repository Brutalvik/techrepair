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

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* LEFT: logo */}
      <NavbarContent justify="start" className="flex-none">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-2 cursor-pointer">
            <Logo className="h-5 w-auto" />
            <span className="font-bold">Infinite Tech Repairs</span>
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
                  "cursor-pointer transition-colors duration-150",
                  "hover:text-blue-500 hover:font-semibold"
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
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* MOBILE right side */}
      <NavbarContent className="sm:hidden pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* MOBILE MENU */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link
                href={item.href}
                size="lg"
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                className="cursor-pointer"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
