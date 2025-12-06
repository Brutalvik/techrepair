"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // Added router hooks
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Wrench,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { API_BASE_URL } from "@/config/api-config";

// --- CONFIGURATION ---
const STEPS = [
  { id: "Booked", label: "Booked", icon: CalendarIcon, color: "blue" },
  { id: "Diagnosing", label: "Diagnosing", icon: Search, color: "yellow" },
  { id: "Repairing", label: "Repairing", icon: Wrench, color: "orange" },
  { id: "Ready", label: "Ready", icon: CheckCircle, color: "purple" },
  { id: "Completed", label: "Done", icon: Package, color: "green" },
];

function CalendarIcon(props: any) {
  return <Clock {...props} />;
}

export default function TrackRepairPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repairData, setRepairData] = useState<any>(null);

  // --- HELPER: Format ID ---
  // Centralizes the ID cleanup logic (e.g. adding TR- prefix)
  const formatTrackingId = (rawId: string) => {
    let finalId = rawId.trim().toUpperCase();
    // Handle "TR1234" -> "TR-1234"
    if (
      finalId.startsWith("TR") &&
      !finalId.includes("-") &&
      finalId.length > 2
    ) {
      finalId = finalId.replace("TR", "TR-");
    }
    // Handle "1234" -> "TR-1234"
    else if (!finalId.startsWith("TR") && !isNaN(Number(finalId))) {
      finalId = "TR-" + finalId;
    }
    return finalId;
  };

  // --- API FETCH FUNCTION ---
  const fetchRepairStatus = useCallback(async (formattedId: string) => {
    if (!formattedId) return;

    setLoading(true);
    setError("");
    setRepairData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${formattedId}`);
      if (!res.ok) throw new Error("Repair not found. Please check your ID.");
      const data = await res.json();
      setRepairData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- EFFECT: URL DRIVER ---
  // Watches the URL for changes and triggers the fetch.
  // This handles both initial load (from email) AND manual searches (via router push)
  useEffect(() => {
    const urlId = searchParams.get("trackingId");
    if (urlId) {
      const formatted = formatTrackingId(urlId);
      // Only update state if it differs to avoid loops (though formatting usually stabilizes it)
      setTrackingId((prev) => (prev !== formatted ? formatted : prev));
      fetchRepairStatus(formatted);
    }
  }, [searchParams, fetchRepairStatus]);

  // --- INPUT HANDLER ---
  const handleInputChange = (val: string) => {
    let input = val.toUpperCase();
    if (trackingId === "" && /^[0-9]/.test(input)) {
      input = "TR-" + input;
    }
    setTrackingId(input);
  };

  // --- MANUAL SEARCH HANDLER ---
  // Instead of fetching directly, we update the URL.
  // The useEffect above detects the URL change and handles the data fetching.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    const formattedId = formatTrackingId(trackingId);

    // Update the URL (this triggers the useEffect)
    // replace: updates current history entry so back button works nicely
    router.replace(`${pathname}?trackingId=${formattedId}`);
  };

  // --- STATUS HELPERS ---
  const getStepStatus = (stepId: string, currentStatus: string) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId);
    const currentIndex = STEPS.findIndex(
      (s) => s.id === (currentStatus || "Booked")
    );
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStepStyles = (color: string) => {
    switch (color) {
      case "blue":
        return {
          activeBorder: "border-blue-500 bg-blue-500 text-white",
          text: "text-blue-600 dark:text-blue-400",
        };
      case "yellow":
        return {
          activeBorder: "border-yellow-500 bg-yellow-500 text-white",
          text: "text-yellow-600 dark:text-yellow-400",
        };
      case "orange":
        return {
          activeBorder: "border-orange-500 bg-orange-500 text-white",
          text: "text-orange-600 dark:text-orange-400",
        };
      case "purple":
        return {
          activeBorder: "border-purple-500 bg-purple-500 text-white",
          text: "text-purple-600 dark:text-purple-400",
        };
      case "green":
        return {
          activeBorder: "border-green-500 bg-green-500 text-white",
          text: "text-green-600 dark:text-green-400",
        };
      default:
        return {
          activeBorder: "border-slate-500 bg-slate-500 text-white",
          text: "text-slate-600 dark:text-slate-400",
        };
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-20 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Track Your Repair
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Enter your Tracking ID (e.g., TR-1234) to see the status.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="TR-XXXX"
              value={trackingId}
              onChange={(e) => handleInputChange(e.target.value)}
              startContent={<Search className="text-slate-400" size={20} />}
              size="lg"
              className="flex-1 font-mono uppercase"
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

        {repairData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-zinc-900"
          >
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

            <div className="p-6 md:p-8">
              {/* --- HORIZONTAL TIMELINE (Responsive) --- */}
              <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 h-0.5 w-full -translate-y-1/2 bg-slate-100 dark:bg-zinc-800 md:top-5 md:h-1" />

                {STEPS.map((step) => {
                  const status = getStepStatus(step.id, repairData.status);
                  const Icon = step.icon;
                  const styles = getStepStyles(step.color);

                  return (
                    <div
                      key={step.id}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div
                        className={clsx(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-10 md:w-10",
                          status === "completed" || status === "current"
                            ? styles.activeBorder
                            : "border-slate-200 bg-white text-slate-300 dark:border-zinc-700 dark:bg-zinc-900"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />
                      </div>

                      <div className="mt-2 text-center">
                        <p
                          className={clsx(
                            "text-[10px] font-semibold md:text-sm transition-colors",
                            status === "current"
                              ? styles.text
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

              {/* STATUS & DATE */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-zinc-800/50">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>
                  <p
                    className={clsx("mt-1 text-lg font-bold capitalize", {
                      "text-yellow-500": repairData.status === "Diagnosing",
                      "text-blue-500":
                        repairData.status === "Repairing" ||
                        repairData.status === "Booked",
                      "text-orange-500": repairData.status === "Repairing",
                      "text-purple-500": repairData.status === "Ready",
                      "text-green-500": repairData.status === "Completed",
                    })}
                  >
                    {repairData.status}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-zinc-800/50">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Last Updated
                  </p>
                  <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                    {repairData.updatedAt ? (
                      <>
                        {formatDate(repairData.updatedAt)}{" "}
                        <span className="text-slate-400">at</span>{" "}
                        {formatTime(repairData.updatedAt)}
                      </>
                    ) : (
                      <>
                        {formatDate(repairData.date)}{" "}
                        <span className="text-slate-400">at</span>{" "}
                        {formatTime(repairData.date)}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
