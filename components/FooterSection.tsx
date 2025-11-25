"use client";

import { Link } from "@heroui/link";
import React from "react";
import { BsFacebook } from "react-icons/bs";
import { FaInstagramSquare } from "react-icons/fa";

const FooterSection = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white pt-12 pb-8 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* LEFT: Brand & Tagline */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link
              isExternal
              className="flex items-center gap-2"
              href="https://infinitetechrepair.com/"
            >
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                Infinite Tech <span className="text-blue-600">Repairs</span>
              </p>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Restoring your digital life, one device at a time. Fast, reliable,
              and professional service you can trust.
            </p>
          </div>

          {/* RIGHT: Socials & Connect */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Connect with us
            </span>
            <div className="flex gap-4">
              {/* Facebook */}
              <Link
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-blue-600 hover:text-white dark:bg-zinc-900 dark:text-slate-400 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <BsFacebook
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              {/* Instagram */}
              <Link
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-red-800 hover:text-white dark:bg-zinc-900 dark:text-slate-400 dark:hover:bg-pink-600 dark:hover:text-white"
              >
                <FaInstagramSquare
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />
              </Link>

              {/* X (Twitter) - Custom SVG for the modern look */}
              <Link
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-black hover:text-white dark:bg-zinc-900 dark:text-slate-400 dark:hover:bg-white dark:hover:text-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current transition-transform group-hover:scale-110"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM: Divider & Links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 dark:border-zinc-900 md:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © 2025 Infinite Tech Repairs. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link
              href="#"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-500 text-current"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-500 text-current"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-500 text-current"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
