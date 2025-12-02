import React from "react";
import { PrivacyPolicy } from "@/components/PrivacyPolicy"; // Import the component
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Infinite Tech Repair",
  description:
    "Our commitment to protecting your personal information under Canadian PIPEDA law.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <PrivacyPolicy />
      </div>
    </div>
  );
}
