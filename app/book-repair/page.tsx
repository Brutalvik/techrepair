"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  X,
  CheckCircle,
  Smartphone,
  User,
  Mail,
  Phone,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import clsx from "clsx";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  updateBookingField,
  resetBooking,
  setTrackingId,
} from "@/store/slices/bookingSlice";
import { API_BASE_URL } from "@/config/api-config";
import { useRouter } from "next/navigation";

// --- CONFIG ---
const LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown Hub",
    address: "123 Main St",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "westside",
    name: "Westside Center",
    address: "456 West Ave",
    phone: "+1 (555) 987-6543",
  },
];

const DEVICE_TYPES = [
  "Smartphone",
  "Laptop",
  "Tablet",
  "Console",
  "Watch",
  "Other",
];

// --- VALIDATION ---
const BookingSchema = Yup.object().shape({
  customerName: Yup.string().min(2, "Too short").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().min(10, "Too short").required("Required"),
  deviceType: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  issueDescription: Yup.string().min(10, "Too short").required("Required"),
  date: Yup.string().required("Required"),
  time: Yup.string()
    .required("Required")
    // Validation matches the modal logic: 11am to 8pm (20:00)
    .test("is-business-hours", "Operating hours: 11am - 8pm", (val) => {
      if (!val) return false;
      const [h] = val.split(":").map(Number);
      return h >= 11 && h <= 20;
    }),
});

export default function BookRepairPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const bookingState = useSelector((state: RootState) => state.booking);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedTrackingId, setConfirmedTrackingId] = useState("");

  // Modal State
  const [showOutHoursModal, setShowOutHoursModal] = useState(false);

  const [isSyncing, setIsSyncing] = useState(true);

  const { defaultDate, defaultTime } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    // Default time is handled, but user must pick specific slot
    const hours = "12";
    const minutes = "00";
    return { defaultDate: dateStr, defaultTime: `${hours}:${minutes}` };
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: bookingState.customerName || "",
      email: bookingState.email || "",
      phone: bookingState.phone || "",
      deviceType: bookingState.deviceType || "",
      location: bookingState.location || "",
      issueDescription: bookingState.issueDescription || "",
      date: bookingState.date || defaultDate,
      time: bookingState.time || defaultTime,
    },
    validationSchema: BookingSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError("");

      try {
        const payload = {
          customerName: values.customerName,
          email: values.email,
          phone: values.phone,
          deviceType: values.deviceType,
          issueDescription: values.issueDescription,
          serviceType: "Drop-off",
          address: LOCATIONS.find((l) => l.id === values.location)?.address,
          bookingDate: values.date,
          bookingTime: values.time,
          images: [], // Images removed
        };

        const res = await fetch(`${API_BASE_URL}/api/bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to book repair");
        }

        const data = await res.json();

        setIsSyncing(false);
        setSubmitSuccess(true);
        setConfirmedTrackingId(data.trackingId);
        if (data.trackingId) dispatch(setTrackingId(data.trackingId));

        dispatch(resetBooking());
        formik.resetForm();

        setTimeout(() => setIsSyncing(true), 50);
      } catch (err: any) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle Time Change explicitly to trigger Modal
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("time", val);

    if (val) {
      const [h] = val.split(":").map(Number);
      // Check if time is before 11 (00-10) or after 20 (21-23)
      if (h < 11 || h > 20) {
        setShowOutHoursModal(true);
      }
    }
  };

  useEffect(() => {
    if (isSyncing) {
      dispatch(updateBookingField(formik.values));
    }
  }, [formik.values, dispatch, isSyncing]);

  // --- MODAL COMPONENT ---
  const OutHoursModal = () => (
    <AnimatePresence>
      {showOutHoursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowOutHoursModal(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700"
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Outside Standard Hours
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Our standard drop-off hours are{" "}
                  <strong>11:00 AM to 8:00 PM</strong>. However, we can likely
                  accommodate you! Please call the location directly to confirm
                  a special drop-off time.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-zinc-800/50">
              {LOCATIONS.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-0 last:pb-0 dark:border-zinc-700"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {loc.name}
                    </p>
                    <p className="text-xs text-slate-500">{loc.address}</p>
                  </div>
                  <a
                    href={`tel:${loc.phone}`}
                    className="flex items-center gap-1.5 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                  >
                    <Phone size={12} /> Call
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="light"
                color="default"
                onPress={() => setShowOutHoursModal(false)}
              >
                Change Time
              </Button>
              <Button
                color="primary"
                onPress={() => setShowOutHoursModal(false)}
              >
                Understood
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (submitSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-black">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full rounded-2xl bg-white p-8 dark:bg-zinc-900 shadow-xl border border-slate-100 dark:border-zinc-800"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Booking Confirmed!
          </h2>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-100 dark:bg-black/40 dark:border-zinc-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tracking ID
            </p>
            <span className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 block mt-1">
              {confirmedTrackingId}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Use this ID to track your repair status.
          </p>
          <Button
            className="mt-6 w-full font-semibold"
            color="primary"
            variant="solid"
            onPress={() => {
              setSubmitSuccess(false);
              setConfirmedTrackingId("");
            }}
          >
            Book Another
          </Button>
          <Button
            className="mt-6 w-full font-semibold"
            color="primary"
            variant="flat"
            onPress={() => router.push("/")}
          >
            Go to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-slate-50 px-4 pt-24 pb-12 dark:bg-black">
      <OutHoursModal />
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Book a Repair
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tell us about your device and pick a slot.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="grid gap-5 md:grid-cols-12 items-start"
        >
          {/* LEFT COLUMN (Wider): Personal & Device */}
          <div className="md:col-span-7 space-y-5">
            {/* Personal Details Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <User size={16} /> Contact Info
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Name"
                    size="sm"
                    variant="bordered"
                    {...formik.getFieldProps("customerName")}
                    isInvalid={
                      formik.touched.customerName &&
                      !!formik.errors.customerName
                    }
                    errorMessage={
                      formik.touched.customerName && formik.errors.customerName
                    }
                    startContent={<User size={16} className="text-slate-400" />}
                  />
                  <Input
                    label="Email"
                    size="sm"
                    variant="bordered"
                    {...formik.getFieldProps("email")}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                    errorMessage={formik.touched.email && formik.errors.email}
                    startContent={<Mail size={16} className="text-slate-400" />}
                  />
                </div>
                <Input
                  label="Phone"
                  size="sm"
                  variant="bordered"
                  {...formik.getFieldProps("phone")}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                  errorMessage={formik.touched.phone && formik.errors.phone}
                  startContent={<Phone size={16} className="text-slate-400" />}
                />
              </div>
            </div>

            {/* Device Info Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Smartphone size={16} /> Device Details
              </h3>

              <div className="space-y-4">
                {/* Device Type Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {DEVICE_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => formik.setFieldValue("deviceType", type)}
                      className={clsx(
                        "cursor-pointer rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all",
                        formik.values.deviceType === type
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "border-slate-200 hover:border-blue-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                      )}
                    >
                      {type}
                    </div>
                  ))}
                </div>
                {formik.touched.deviceType && formik.errors.deviceType && (
                  <p className="text-xs text-red-500">
                    {formik.errors.deviceType}
                  </p>
                )}

                <Textarea
                  label="Describe the Issue"
                  placeholder="Screen cracked, not charging, etc."
                  minRows={3}
                  variant="bordered"
                  {...formik.getFieldProps("issueDescription")}
                  isInvalid={
                    formik.touched.issueDescription &&
                    !!formik.errors.issueDescription
                  }
                  errorMessage={
                    formik.touched.issueDescription &&
                    formik.errors.issueDescription
                  }
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Narrower): Location, Time & Submit */}
          <div className="md:col-span-5 space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 h-full flex flex-col">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <MapPin size={16} /> Where & When
              </h3>

              <div className="space-y-4 flex-1">
                {/* Compact Location Cards */}
                <div className="grid gap-2">
                  {LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => formik.setFieldValue("location", loc.id)}
                      className={clsx(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-all",
                        formik.values.location === loc.id
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:border-blue-500"
                          : "border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      )}
                    >
                      <MapPin
                        size={18}
                        className={
                          formik.values.location === loc.id
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {loc.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {formik.touched.location && formik.errors.location && (
                  <p className="text-xs text-red-500">
                    {formik.errors.location}
                  </p>
                )}

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Date
                    </label>
                    <input
                      type="date"
                      min={defaultDate}
                      {...formik.getFieldProps("date")}
                      className="w-full rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formik.values.time}
                      onChange={handleTimeChange}
                      onBlur={formik.handleBlur}
                      name="time"
                      className="w-full rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* FIX: Only show time error if touched AND error exists */}
                {((formik.touched.date && formik.errors.date) ||
                  (formik.touched.time && formik.errors.time)) && (
                  <div className="flex items-start gap-2 text-xs text-red-500 mt-2">
                    <AlertCircle size={14} className="mt-0.5" />
                    <span>
                      Please select a date and valid time (11am - 8pm).
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Area */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                {submitError && (
                  <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {submitError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full font-bold"
                  color="primary"
                  variant="solid"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
                <p className="mt-2 text-center text-[10px] text-slate-400">
                  By clicking confirm, you agree to our Terms.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
