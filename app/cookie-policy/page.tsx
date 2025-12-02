import React from "react";
import { CookiePolicy } from "@/components/CookiePolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Infinite Tech Repair",
  description:
    "Infinite Tech Repair's Cookie Policy outlining the use of cookies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <CookiePolicy />
      </div>
    </div>
  );
}
