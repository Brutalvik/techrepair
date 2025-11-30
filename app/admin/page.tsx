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
  ArrowUp,
  ArrowDown,
  Clock,
  Search,
  Archive,
  RotateCcw,
  X,
  AlertTriangle,
  History,
  LayoutList,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import clsx from "clsx";
import { API_BASE_URL } from "@/config/api-config";

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
  updated_at: string;
  archived_at?: string | null; // Can be null for active items
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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingToArchive, setBookingToArchive] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  });

  // 1. Fetch Bookings Logic
  const fetchBookings = async (query = "") => {
    setLoadingData(true);
    try {
      let url = "";

      if (query) {
        // GLOBAL SEARCH: Hitting the main endpoint which now does UNION search
        url = `${API_BASE_URL}/api/admin/bookings?q=${encodeURIComponent(query)}`;
      } else {
        // NO SEARCH: Use tabs to decide endpoint
        url =
          viewMode === "active"
            ? `${API_BASE_URL}/api/admin/bookings`
            : `${API_BASE_URL}/api/admin/archived-bookings`;
      }

      const res = await fetch(url);
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

  // Trigger fetch on auth, viewMode change, or manual search clear
  useEffect(() => {
    if (authStatus === "authenticated") {
      // Only auto-fetch if we aren't holding a search query state
      // (Preverves search results if user switches tabs accidentally)
      if (!searchQuery) fetchBookings();
    }
  }, [authStatus, viewMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchBookings(""); // This will fall back to the current viewMode logic
  };

  // Helper: Determine if a row is archived based on DATA, not just viewMode
  // This allows search results to mix active/archived correctly
  const isArchived = (booking: Booking) => {
    return !!booking.archived_at;
  };

  const openArchiveModal = (id: number) => {
    setBookingToArchive(id);
    onOpen();
  };

  const handleArchiveConfirm = async () => {
    if (!bookingToArchive) return;
    setUpdatingId(bookingToArchive);
    onClose();

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${bookingToArchive}/archive`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingToArchive));
      } else {
        alert("Failed to archive");
      }
    } catch (err) {
      alert("Error archiving booking");
    } finally {
      setUpdatingId(null);
      setBookingToArchive(null);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        const updatedRecord = await res.json();
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status: newStatus,
                  updated_at: updatedRecord.data.updated_at,
                }
              : b
          )
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

  const sortedBookings = useMemo(() => {
    if (!sortConfig.key) return bookings;
    return [...bookings].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
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

  const formatTimeSlot = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const formatTimestamp = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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

  if (authStatus === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-zinc-900">
          <ShieldAlert
            className="mx-auto mb-4 text-blue-600 dark:text-blue-400"
            size={40}
          />
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Admin Access Only
          </h1>
          <Button
            className="mt-4 w-full font-bold"
            color="primary"
            onPress={() => signIn("google")}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* HEADER & PROFILE */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                Admin Dashboard
              </h1>
              <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 md:text-sm md:flex-row md:gap-2">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {session?.user?.name}
                </span>
                <span className="hidden md:inline">•</span>
                <span>{session?.user?.email}</span>
              </div>
            </div>
          </div>
          <Button
            onPress={() => signOut()}
            className="w-full md:w-auto bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            variant="flat"
            size="sm"
            startContent={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </div>

        {/* CONTROLS ROW */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* TABS */}
          <div className="grid grid-cols-2 lg:flex lg:w-auto rounded-lg bg-white p-1 shadow-sm dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <button
              onClick={() => setViewMode("active")}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                viewMode === "active"
                  ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <LayoutList size={16} />{" "}
              <span className="hidden sm:inline">Active Jobs</span>
              <span className="sm:hidden">Active</span>
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                viewMode === "archived"
                  ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <History size={16} /> Archive
            </button>
          </div>

          {/* SEARCH */}
          <div className="flex flex-col gap-2 sm:flex-row lg:items-center">
            <form onSubmit={handleSearch} className="relative w-full lg:w-80">
              <Input
                placeholder="Search name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="text-slate-400" size={18} />}
                endContent={
                  searchQuery && (
                    <button type="button" onClick={clearSearch}>
                      <X
                        size={16}
                        className="text-slate-400 hover:text-slate-600"
                      />
                    </button>
                  )
                }
                className="w-full"
              />
            </form>
            <div className="flex gap-2">
              <Button
                onPress={() => fetchBookings(searchQuery)}
                disabled={loadingData}
                className="flex-1 sm:flex-none bg-white dark:bg-zinc-900"
                variant="flat"
                isIconOnly
              >
                <RefreshCw
                  size={18}
                  className={loadingData ? "animate-spin" : ""}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        {loadingData && bookings.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
                        { label: "Booked", key: "booking_time" },
                        {
                          label:
                            viewMode === "active" && !searchQuery
                              ? "Updated"
                              : "Status/Archived",
                          key: "updated_at",
                        },
                        { label: "Status", key: "status" },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className="cursor-pointer px-6 py-4 font-medium hover:bg-slate-100 dark:hover:bg-zinc-800"
                          onClick={() => handleSort(col.key as keyof Booking)}
                        >
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            {col.label}
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
                        <td className="px-6 py-4">
                          <div className="text-slate-700 dark:text-slate-300">
                            {formatTimeSlot(booking.booking_time)}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Dynamic Timestamp: Show Archive date if archived, otherwise Updated date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            {isArchived(booking) ? (
                              <Archive size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                            <span>
                              {formatTimestamp(
                                isArchived(booking)
                                  ? booking.archived_at!
                                  : booking.updated_at
                              )}
                            </span>
                          </div>
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
                          {isArchived(booking) ? (
                            <span className="text-xs text-slate-400 italic">
                              Read Only
                            </span>
                          ) : (
                            <div className="relative min-w-[140px]">
                              {updatingId === booking.id ? (
                                <div className="flex items-center gap-2 py-1.5 pl-3 text-blue-600">
                                  <Loader2 className="animate-spin" size={16} />
                                  <span className="text-xs font-medium">
                                    Updating...
                                  </span>
                                </div>
                              ) : booking.status === "Completed" ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="h-8 px-3 font-medium"
                                    onPress={() =>
                                      handleStatusChange(
                                        booking.id,
                                        "Repairing"
                                      )
                                    }
                                    startContent={<RotateCcw size={14} />}
                                  >
                                    Reopen
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="danger"
                                    className="h-8 px-3 font-medium"
                                    onPress={() => openArchiveModal(booking.id)}
                                    startContent={<Archive size={14} />}
                                  >
                                    Archive
                                  </Button>
                                </div>
                              ) : (
                                <select
                                  value={booking.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      booking.id,
                                      e.target.value
                                    )
                                  }
                                  className={clsx(
                                    "cursor-pointer w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden space-y-3">
              {sortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {booking.tracking_id}
                    </span>
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide font-bold",
                        getStatusColor(booking.status)
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Customer
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {booking.customer_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {booking.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Device
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {booking.device_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Booked
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatTimeSlot(booking.booking_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {isArchived(booking) ? "Archived" : "Updated"}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {formatTimestamp(
                          isArchived(booking)
                            ? booking.archived_at!
                            : booking.updated_at
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions Section */}
                  {!isArchived(booking) && (
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800">
                      {updatingId === booking.id ? (
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2 text-blue-600 dark:border-zinc-700 dark:bg-zinc-800">
                          <Loader2 className="animate-spin" size={16} />
                          <span className="text-xs font-medium">
                            Updating...
                          </span>
                        </div>
                      ) : booking.status === "Completed" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onPress={() =>
                              handleStatusChange(booking.id, "Repairing")
                            }
                            color="primary"
                            variant="flat"
                            size="sm"
                            className="font-semibold"
                            startContent={<RotateCcw size={14} />}
                          >
                            Reopen
                          </Button>
                          <Button
                            onPress={() => openArchiveModal(booking.id)}
                            color="danger"
                            variant="flat"
                            size="sm"
                            className="font-semibold"
                            startContent={<Archive size={14} />}
                          >
                            Archive
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusChange(booking.id, e.target.value)
                            }
                            className={clsx(
                              "cursor-pointer appearance-none w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm font-medium text-center focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            )}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-slate-900 dark:text-white">
                Confirm Archive
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                  <AlertTriangle className="flex-shrink-0" size={24} />
                  <p className="text-sm">
                    This action will move the booking to the history archive. It
                    will no longer appear in the active list.
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Are you sure you want to proceed?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleArchiveConfirm}>
                  Yes, Archive it
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
