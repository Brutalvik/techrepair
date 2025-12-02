import React from "react";
import { TermsOfService } from "@/components/TermsOfService"; // Import the component
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Infinite Tech Repair",
  description:
    "The official terms of service and repair guarantee for Infinite Tech Repair, governed by Canadian law.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <TermsOfService />
      </div>
    </div>
  );
}
