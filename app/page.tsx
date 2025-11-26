"use client";

import { ContactSection } from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import { PricingSection } from "@/components/PricingSection";
import { RepairServicesSection } from "@/components/RepairServicesSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <RepairServicesSection />
      <PricingSection />
      <ContactSection />
    </>
  );
}
