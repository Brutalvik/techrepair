"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  RefreshCw,
  Loader2,
  LogOut,
  ShieldAlert,
  User as UserIcon,
  ArrowUpDown,
  ArrowUp, // Added
  ArrowDown, // Added
} from "lucide-react";
import { Button } from "@heroui/button";
import clsx from "clsx";

// Type definition
type Booking = {
  id: number;
  tracking_id: string;
  customer_name: string;
  device_type: string;
  email: string;
  status: string;
  created_at: string;
  booking_time: string;
};

type SortConfig = {
  key: keyof Booking | null;
  direction: "asc" | "desc";
};

const STATUS_OPTIONS = [
  "Booked",
  "Diagnosing",
  "Repairing",
  "Ready",
  "Completed",
];

export default function AdminDashboard() {
  const { data: session, status: authStatus } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  });

  // 1. Fetch Bookings
  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("http://localhost:9000/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchBookings();
    }
  }, [authStatus]);

  // 2. Sorting Logic
  const sortedBookings = useMemo(() => {
    if (!sortConfig.key) return bookings;

    return [...bookings].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [bookings, sortConfig]);

  const handleSort = (key: keyof Booking) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 3. Helper: Format Time
  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  // 4. Update Status Handler
  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(
        `http://localhost:9000/api/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

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

  // --- AUTH LOADING ---
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // --- AUTH UNAUTHENTICATED ---
  if (authStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <ShieldAlert
              className="text-blue-600 dark:text-blue-400"
              size={32}
            />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Admin Access Only
          </h1>
          <p className="mb-8 text-slate-500 dark:text-slate-400">
            You must be an authorized administrator to view this dashboard.
          </p>
          <Button
            className="w-full font-bold"
            color="primary"
            size="lg"
            onPress={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-12 mt-5 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-12 w-12 rounded-full border-2 border-white shadow-sm dark:border-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <UserIcon size={24} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <div className="flex flex-col md:flex-row md:gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {session?.user?.name}
                </span>
                <span className="hidden md:inline">•</span>
                <span>{session?.user?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onPress={fetchBookings}
              disabled={loadingData}
              className="bg-white dark:bg-zinc-900"
              variant="flat"
            >
              <RefreshCw
                size={16}
                className={loadingData ? "animate-spin" : ""}
              />
              Refresh
            </Button>
            <Button
              onPress={() => signOut()}
              className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              variant="flat"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        {loadingData && bookings.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-800/50"
              />
            ))}
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-zinc-800/50 dark:text-slate-400">
                    <tr>
                      {[
                        { label: "ID", key: "tracking_id" },
                        { label: "Customer", key: "customer_name" },
                        { label: "Device", key: "device_type" },
                        { label: "Date", key: "created_at" },
                        { label: "Time", key: "booking_time" },
                        { label: "Status", key: "status" },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className="cursor-pointer px-6 py-4 font-medium transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                          onClick={() => handleSort(col.key as keyof Booking)}
                        >
                          <div className="flex items-center gap-1.5">
                            {col.label}
                            {/* DYNAMIC ICON LOGIC:
                                1. Active & Ascending -> ArrowUp (Blue)
                                2. Active & Descending -> ArrowDown (Blue)
                                3. Inactive -> ArrowUpDown (Gray/Faint)
                            */}
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === "asc" ? (
                                <ArrowUp size={14} className="text-blue-500" />
                              ) : (
                                <ArrowDown
                                  size={14}
                                  className="text-blue-500"
                                />
                              )
                            ) : (
                              <ArrowUpDown
                                size={14}
                                className="text-slate-300 dark:text-zinc-600"
                              />
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {sortedBookings.map((booking) => (
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
                        <td className="px-6 py-4 text-slate-500">
                          {formatTime(booking.booking_time)}
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
                                className="cursor-pointer w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden space-y-4">
              {sortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {booking.tracking_id}
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getStatusColor(booking.status)
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Customer</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {booking.customer_name}
                      </p>
                      <p className="text-xs text-slate-400">{booking.email}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Device</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {booking.device_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Date & Time</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatTime(booking.booking_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Update Status
                    </label>
                    <div className="relative">
                      {updatingId === booking.id ? (
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-blue-600 dark:border-zinc-700 dark:bg-zinc-800">
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
                          className="cursor-pointer w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm font-medium shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loadingData && bookings.length === 0 && (
              <div className="py-20 text-center text-slate-500">
                No bookings found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
