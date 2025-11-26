"use client";

import HeroSection from "@/components/HeroSection";
import { RepairServicesSection } from "@/components/RepairServicesSection";
import { ReviewsSection } from "@/components/Reviews";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <RepairServicesSection />
      <PricingSection />
      <ReviewsSection />
      <ContactSection />
    </>
  );
}
