"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Loader2, // Added Loader icon
} from "lucide-react";
import clsx from "clsx";

// Type definition for our booking data
type Booking = {
  id: number;
  tracking_id: string;
  customer_name: string;
  device_type: string;
  email: string;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  "Booked",
  "Diagnosing",
  "Repairing",
  "Ready",
  "Completed",
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // 1. Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9000/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Update Status Handler
  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id); // Start loading spinner for this row

    try {
      // Simulate a small delay if you want to see the spinner (optional, remove in prod)
      // await new Promise(r => setTimeout(r, 500));

      const res = await fetch(
        `http://localhost:9000/api/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        // Update local state to reflect change immediately
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdatingId(null); // Stop loading spinner
    }
  };

  // Helper for Status Badge Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Booked":
        return "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300";
      case "Diagnosing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Repairing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Ready":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    // Added 'mt-5' for the requested 20px margin push
    <div className="min-h-screen w-full bg-slate-50 px-4 py-12 mt-5 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage repair orders
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-slate-50 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-zinc-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Device</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="group hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {booking.tracking_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {booking.customer_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {booking.device_type}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getStatusColor(booking.status)
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative min-w-[140px]">
                        {/* If this specific row is updating, show Spinner.
                           Otherwise, show the Select dropdown.
                        */}
                        {updatingId === booking.id ? (
                          <div className="flex items-center gap-2 py-1.5 pl-3 text-blue-600">
                            <Loader2 className="animate-spin" size={16} />
                            <span className="text-xs font-medium">
                              Updating...
                            </span>
                          </div>
                        ) : (
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusChange(booking.id, e.target.value)
                            }
                            className={clsx(
                              "cursor-pointer w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            )}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && bookings.length === 0 && (
            <div className="py-20 text-center text-slate-500">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
