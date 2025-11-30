"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  MapPin,
  Upload,
  X,
  CheckCircle,
  Smartphone,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Clock,
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

// --- CONFIG ---
const LOCATIONS = [
  { id: "downtown", name: "Downtown Hub", address: "123 Main St" },
  { id: "westside", name: "Westside Center", address: "456 West Ave" },
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
    .test("is-business-hours", "8am-8pm only", (val) => {
      if (!val) return false;
      const [h] = val.split(":").map(Number);
      return h >= 8 && h <= 20;
    }),
  images: Yup.array().max(3, "Max 3"),
});

export default function BookRepairPage() {
  const dispatch = useDispatch();
  const bookingState = useSelector((state: RootState) => state.booking);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmedTrackingId, setConfirmedTrackingId] = useState("");

  // FIX 1: State to control when the Redux sync useEffect is active
  const [isSyncing, setIsSyncing] = useState(true);

  const { defaultDate, defaultTime } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    now.setHours(now.getHours() + 2);
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
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
      images: bookingState.images || [],
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
          images: values.images,
        };

        // Frontend URL should be correct based on the last fix (local:9000)
        const res = await fetch("http://localhost:9000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to book repair");
        }

        const data = await res.json();

        // --- FIX 2: Success Logic Update (Break the Loop) ---
        // 1. Pause synchronization to prevent loop
        setIsSyncing(false);

        setSubmitSuccess(true);
        setConfirmedTrackingId(data.trackingId);
        if (data.trackingId) dispatch(setTrackingId(data.trackingId));

        // 2. Clear Redux and Formik states
        dispatch(resetBooking());
        formik.resetForm();

        // 3. Re-enable sync after a short delay (allowing React to finish its renders)
        setTimeout(() => setIsSyncing(true), 50);
        // ----------------------------------------------------
      } catch (err: any) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // FIX 3: Update useEffect to depend on isSyncing
  useEffect(() => {
    if (isSyncing) {
      dispatch(updateBookingField(formik.values));
    }
  }, [formik.values, dispatch, isSyncing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (formik.values.images.length + files.length > 3) {
        alert("Max 3 images allowed.");
        return;
      }
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImages = [...formik.values.images, reader.result as string];
          formik.setFieldValue("images", newImages);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formik.values.images];
    newImages.splice(index, 1);
    formik.setFieldValue("images", newImages);
  };

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
                  minRows={2}
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

                {/* Compact Image Upload */}
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500">
                      <Upload size={16} />
                      <span>Upload Photos (Max 3)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={formik.values.images.length >= 3}
                      />
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {formik.values.images.length}/3
                    </span>
                  </div>

                  {/* Horizontal Preview Strip */}
                  {formik.values.images.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {formik.values.images.map((img: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-slate-200"
                        >
                          <img
                            src={img}
                            alt="preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-0 top-0 bg-red-500/80 p-0.5 text-white hover:bg-red-600"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                      Time (8am-8pm)
                    </label>
                    <input
                      type="time"
                      min="08:00"
                      max="20:00"
                      {...formik.getFieldProps("time")}
                      className="w-full rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:text-white"
                    />
                  </div>
                </div>
                {(formik.errors.date || formik.errors.time) && (
                  <p className="text-xs text-red-500">Invalid Date or Time</p>
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
