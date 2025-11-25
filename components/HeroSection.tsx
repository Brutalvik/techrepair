"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const leftColVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const rightColVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HeroSection() {
  return (
    <motion.section
      // UPDATED: Added flex, flex-col, and justify-center to force vertical centering of the whole section
      className="relative min-h-screen flex flex-col justify-center bg-background overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Faded image background - Hidden on mobile to keep text legible and centered */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden md:block">
        <div className="absolute inset-y-0 right-0 w-full bg-[url('/images/hero-tech-placeholder.png')] bg-right bg-no-repeat bg-contain opacity-60" />
        <div className="absolute inset-y-0 left-0 right-1/4 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex w-full flex-col lg:flex-row lg:items-center">
          {/* Left side: copy */}
          <motion.div
            className="flex-1 space-y-6 py-10 lg:py-0"
            variants={leftColVariants}
          >
            <motion.div className="space-y-3" variants={textItemVariants}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Infinite Tech Repairs
              </p>

              <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                <span className="block">We Fix Everything.</span>
                <span className="mt-1 block text-blue-500">
                  Fast, Professional &amp; Reliable
                </span>
                <span className="mt-1 block">Tech Repair Services.</span>
              </h1>
            </motion.div>

            <motion.p
              className="max-w-xl text-base md:text-lg opacity-80"
              variants={textItemVariants}
            >
              From smartphones to gaming consoles — certified experts ready to
              bring your device back to life.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={textItemVariants}
            >
              <Button variant="solid" color="primary" size="lg">
                Book a Repair
              </Button>
              <Button variant="ghost" color="primary" size="lg">
                Check Repair Status
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm opacity-75"
              variants={textItemVariants}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Same-day diagnostics</span>
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>No fix, no fee</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Warranty on repairs</span>
            </motion.div>
          </motion.div>

          {/* Right side: visual alignment area */}
          {/* UPDATED: Added 'hidden lg:flex' so this completely disappears on mobile */}
          <motion.div
            className="hidden lg:flex flex-1 items-center justify-center"
            variants={rightColVariants}
          >
            <div className="h-[320px] w-full max-w-md">
              {/* Desktop Image Placeholder */}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
