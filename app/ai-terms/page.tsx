import React from "react";
import { AITermsAndConditions } from "@/components/AITermsAndConditions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot Terms - Infinite Tech Repairs",
  description:
    "Terms and conditions governing the use of the Infinite Tech Assistant chatbot.",
};

export default function AITermsPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        <AITermsAndConditions />
      </div>
    </div>
  );
}
