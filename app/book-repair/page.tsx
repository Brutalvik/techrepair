"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle,
  Smartphone,
  User,
  Mail,
  Phone,
  Moon,
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

// --- CONFIG: LOCATIONS ---
const LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown Hub",
    address:
      "Beside Good Earth Coffee, Elveden Centre, 707 6 St SW Main Floor, Calgary, AB T2P 3H6",
    phone: "(825) 454-4444",
  },
  {
    id: "kensington",
    name: "Kensington",
    address: "1211 Kensington Rd NW #101, Calgary, AB T2N 3P6",
    phone: "(403) 462-5456",
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
  time: Yup.string().required("Required"),
});

export default function BookRepairPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const bookingState = useSelector((state: RootState) => state.booking);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedTrackingId, setConfirmedTrackingId] = useState("");

  const [isSyncing, setIsSyncing] = useState(true);

  const { defaultDate, defaultTime } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return { defaultDate: dateStr, defaultTime: "12:00" };
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
          images: [],
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

  useEffect(() => {
    if (isSyncing) {
      dispatch(updateBookingField(formik.values));
    }
  }, [formik.values, dispatch, isSyncing]);

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
          className="grid gap-5 grid-cols-1 md:grid-cols-12 items-start"
        >
          {/* LEFT COLUMN: Personal & Device */}
          <div className="md:col-span-7 space-y-5 order-1">
            {/* Contact Info */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <User size={16} /> Contact Info
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    classNames={{ inputWrapper: "bg-transparent" }}
                  />
                  <Input
                    label="Email"
                    size="sm"
                    variant="bordered"
                    {...formik.getFieldProps("email")}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                    errorMessage={formik.touched.email && formik.errors.email}
                    startContent={<Mail size={16} className="text-slate-400" />}
                    classNames={{ inputWrapper: "bg-transparent" }}
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
                  classNames={{ inputWrapper: "bg-transparent" }}
                />
              </div>
            </div>

            {/* Device Info */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Smartphone size={16} /> Device Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {DEVICE_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => formik.setFieldValue("deviceType", type)}
                      className={clsx(
                        "cursor-pointer rounded-lg border px-1 py-2 text-center text-xs font-medium transition-all",
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
                  classNames={{ inputWrapper: "bg-transparent" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Location, Time & Submit */}
          <div className="md:col-span-5 space-y-5 order-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800 h-full flex flex-col">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <MapPin size={16} /> Where & When
              </h3>

              <div className="space-y-4 flex-1">
                {/* Location Cards */}
                <div className="grid gap-2">
                  {LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => formik.setFieldValue("location", loc.id)}
                      className={clsx(
                        "cursor-pointer rounded-lg border p-3 transition-all",
                        formik.values.location === loc.id
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:border-blue-500"
                          : "border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={18}
                          className={clsx(
                            "mt-0.5 shrink-0",
                            formik.values.location === loc.id
                              ? "text-blue-600"
                              : "text-slate-400"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {loc.name}
                          </div>
                          <div className="text-[11px] leading-snug text-slate-500 mt-1 break-words">
                            {loc.address}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400 mt-1">
                            {loc.phone}
                          </div>
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
                      {...formik.getFieldProps("time")}
                      className="w-full rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Inline Hint for Late Hours */}
                {(() => {
                  if (!formik.values.time) return null;
                  const [h] = formik.values.time.split(":").map(Number);
                  return (
                    (h >= 23 || h < 7) && (
                      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md transition-all duration-300">
                        <Moon size={14} className="mt-0.5 shrink-0" />
                        <span>
                          Selected time is outside standard hours. You can still
                          book!
                        </span>
                      </div>
                    )
                  );
                })()}
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
