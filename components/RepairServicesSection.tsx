"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const services = [
  { icon: "📱", title: "Smartphone", desc: "Screen, battery, port" },
  { icon: "💻", title: "Laptop/Mac", desc: "Board, screen, keys" },
  { icon: "📲", title: "Tablet", desc: "Touch & hardware" },
  { icon: "🎮", title: "Console", desc: "PS5, Xbox, Switch" },
  { icon: "🧠", title: "Recovery", desc: "Files & data restore" },
  { icon: "💧", title: "Diagnostics", desc: "Water damage fix" },
];

const reasons = [
  { icon: "🛠️", title: "Certified Experts", desc: "Pro technicians" },
  { icon: "⏱️", title: "Same-Day Fix", desc: "Quick turnaround" },
  { icon: "🛡️", title: "90-Day Warranty", desc: "Parts guaranteed" },
  { icon: "💲", title: "Fair Pricing", desc: "Transparent rates" },
  { icon: "🚚", title: "Pickup/Drop", desc: "We come to you" },
  { icon: "📍", title: "Live Tracking", desc: "Real-time updates" },
];

export function RepairServicesSection() {
  return (
    // ADDED id="services" here to allow the Navbar to scroll to this section
    <section
      id="services"
      className="w-full bg-slate-50 py-20 dark:bg-zinc-900/50"
    >
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-6xl px-6"
      >
        {/* --- TOP SECTION: Services --- */}
        <div className="mb-16">
          <motion.h2
            variants={itemVariants}
            className="text-center text-3xl text-blue-500 font-bold tracking-tight md:text-4xl"
          >
            Repair Services
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-3 text-center text-slate-500 dark:text-slate-400"
          >
            Expert fixes for all your favorite devices.
          </motion.p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl group-hover:bg-blue-100 dark:bg-blue-900/20">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white dark:hover:text-blue-500 hover:text-blue-500">
                  {service.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- BOTTOM SECTION: Reasons --- */}
        <div className="rounded-3xl bg-white px-6 py-12 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 md:px-12">
          <motion.h2
            variants={itemVariants}
            className="mb-10 text-center text-2xl font-bold text-blue-500 "
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <motion.div
                key={reason.title}
                variants={itemVariants}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl dark:bg-blue-900/20">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {reason.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {reason.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
