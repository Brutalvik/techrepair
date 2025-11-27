"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Wrench,
  CheckCircle,
  Truck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import clsx from "clsx";

// --- STATUS CONFIGURATION ---
// These are the visual steps in our repair process
const STEPS = [
  { id: "Booked", label: "Booked", icon: CalendarIcon },
  { id: "Diagnosing", label: "Diagnosing", icon: Search },
  { id: "Repairing", label: "Repairing", icon: Wrench },
  { id: "Ready", label: "Ready for Pickup", icon: CheckCircle },
  { id: "Completed", label: "Completed", icon: Package },
];

function CalendarIcon(props: any) {
  return <Clock {...props} />;
}

export default function TrackRepairPage() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repairData, setRepairData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setRepairData(null);

    try {
      // Connect to your Fastify Backend
      const res = await fetch(
        `http://localhost:9000/api/bookings/${trackingId}`
      );

      if (!res.ok) {
        throw new Error("Repair not found. Please check your ID.");
      }

      const data = await res.json();
      setRepairData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine if a step is completed, current, or pending
  const getStepStatus = (stepId: string, currentStatus: string) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId);
    const currentIndex = STEPS.findIndex(
      (s) => s.id === (currentStatus || "Booked")
    );

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-20 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Track Your Repair
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Enter your Tracking ID (e.g., TR-1234) or numeric ID to see the
            status.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Enter Tracking ID..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              startContent={<Search className="text-slate-400" size={20} />}
              size="lg"
              className="flex-1"
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={loading}
              className="font-semibold"
            >
              Track
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </div>

        {/* Result Card */}
        {repairData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900"
          >
            {/* Header Info */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-800/30">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {repairData.device}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Customer: {repairData.customer}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {repairData.trackingId}
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="p-6 md:p-8">
              <div className="relative flex flex-col justify-between gap-8 md:flex-row">
                {/* Connecting Line (Desktop) */}
                <div className="absolute left-0 top-5 hidden h-1 w-full -translate-y-1/2 bg-slate-100 dark:bg-zinc-800 md:block" />

                {STEPS.map((step, idx) => {
                  const status = getStepStatus(step.id, repairData.status);
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="relative z-10 flex flex-1 flex-col items-center text-center"
                    >
                      <div
                        className={clsx(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                          status === "completed" || status === "current"
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-200 bg-white text-slate-300 dark:border-zinc-700 dark:bg-zinc-900"
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="mt-3">
                        <p
                          className={clsx(
                            "text-sm font-semibold transition-colors",
                            status === "current"
                              ? "text-blue-600 dark:text-blue-400"
                              : status === "completed"
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-slate-600"
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Message */}
              <div className="mt-10 rounded-xl bg-slate-50 p-4 text-center dark:bg-zinc-800/50">
                <p className="text-slate-600 dark:text-slate-300">
                  Current Status:{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {repairData.status}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Started on {new Date(repairData.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
