"use client";

import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedGlobe } from "@/components/AnimatedGlobe";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const leftColVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.12 },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    <motion.section
      // UPDATED:
      // 1. 'min-h-screen': Forces section to be at least the height of the screen on ALL devices.
      // 2. 'justify-center': Vertically centers the content.
      // 3. 'pt-16': Adds a little padding top to account for the fixed navbar visually.
      className="relative min-h-screen flex flex-col justify-center bg-background overflow-hidden pt-16 lg:pt-0"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hidden md:block absolute top-0 right-0 h-full w-[55%] pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop"
          alt="Tech Repair Background"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6 z-10">
        {/* 'lg:min-h-[600px]': Keeps the desktop height consistency */}
        <div className="flex w-full flex-col lg:flex-row lg:items-center justify-between lg:min-h-[600px]">
          <motion.div
            className="flex-1 space-y-6 max-w-2xl z-20 flex flex-col items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0"
            variants={leftColVariants}
          >
            <motion.div className="space-y-3" variants={textItemVariants}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Infinite Tech Repair
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
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              variants={textItemVariants}
            >
              <Button
                as={Link}
                href="/book-repair"
                variant="solid"
                color="primary"
                size="lg"
              >
                Book a Repair
              </Button>

              <Button
                as={Link}
                href="/track-repair"
                variant="ghost"
                color="primary"
                size="lg"
              >
                Check Repair Status
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs md:text-sm opacity-75"
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

          <motion.div
            variants={textItemVariants}
            className="hidden lg:flex items-center justify-center relative w-full lg:w-1/2 h-[400px] lg:h-[600px] mt-10 lg:mt-0 z-10"
          >
            <AnimatedGlobe />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
