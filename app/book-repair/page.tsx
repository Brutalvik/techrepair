"use client";

import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Smartphone,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import clsx from "clsx";

// --- CONFIG ---
const LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown Tech Hub",
    address: "123 Main St, Downtown",
  },
  {
    id: "westside",
    name: "Westside Repair Center",
    address: "456 West Ave, Westside",
  },
];

const DEVICE_TYPES = [
  "Smartphone",
  "Laptop",
  "Tablet",
  "Console",
  "Smartwatch",
  "Other",
];

// --- VALIDATION SCHEMA ---
const BookingSchema = Yup.object().shape({
  customerName: Yup.string().min(2, "Too short").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, "Invalid phone number")
    .min(10, "Phone number too short")
    .required("Phone is required"),
  deviceType: Yup.string().required("Please select a device"),
  location: Yup.string().required("Please select a service location"),
  issueDescription: Yup.string()
    .min(10, "Please describe the issue in more detail")
    .required("Issue description is required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string()
    .required("Time is required")
    .test("is-business-hours", "We are open from 8am to 8pm", (value) => {
      if (!value) return false;
      const [hours] = value.split(":").map(Number);
      return hours >= 8 && hours <= 20;
    }),
  images: Yup.array().max(3, "Maximum 3 images allowed"),
});

export default function BookRepairPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Calculate default values
  const { defaultDate, defaultTime } = useMemo(() => {
    const now = new Date();

    // Default Date: Today (Local YYYY-MM-DD)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Default Time: Now + 2 hours (HH:mm)
    now.setHours(now.getHours() + 2);
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    return { defaultDate: dateStr, defaultTime: timeStr };
  }, []);

  const formik = useFormik({
    initialValues: {
      customerName: "",
      email: "",
      phone: "",
      deviceType: "",
      location: "",
      issueDescription: "",
      date: defaultDate, // Default: Today
      time: defaultTime, // Default: Now + 2h
      images: [] as string[], // Base64 strings
    },
    validationSchema: BookingSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError("");

      try {
        // Construct payload for backend
        const payload = {
          customerName: values.customerName,
          email: values.email,
          phone: values.phone,
          deviceType: values.deviceType,
          issueDescription: values.issueDescription,
          serviceType: "Drop-off", // Since user selected a location
          address: LOCATIONS.find((l) => l.id === values.location)?.address,
          bookingDate: values.date,
          bookingTime: values.time,
          images: values.images, // Sending base64 images
        };

        const res = await fetch("http://localhost:9000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to book repair");
        }

        setSubmitSuccess(true);
        formik.resetForm({
          values: {
            ...formik.initialValues,
            date: defaultDate,
            time: defaultTime,
          },
        });
      } catch (err: any) {
        setSubmitError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle Image Upload (Convert to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (formik.values.images.length + files.length > 3) {
        alert("You can only upload a maximum of 3 images.");
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          formik.setFieldValue("images", [
            ...formik.values.images,
            reader.result as string,
          ]);
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

  // Success View
  if (submitSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-green-50 p-10 dark:bg-green-900/20"
        >
          <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-green-700 dark:text-green-400">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            We have received your request. Check your email for details.
          </p>
          <Button
            className="mt-8 font-semibold"
            color="success"
            variant="flat"
            onPress={() => setSubmitSuccess(false)}
          >
            Book Another Repair
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-slate-50 py-12 dark:bg-black">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Book a Repair
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Select a location, describe your issue, and pick a time.
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="grid gap-8 md:grid-cols-2"
        >
          {/* LEFT COLUMN: Customer & Device Info */}
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900 md:p-8">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
              <User className="text-blue-500" size={20} /> Personal Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                startContent={<User size={16} className="text-slate-400" />}
                {...formik.getFieldProps("customerName")}
                errorMessage={
                  formik.touched.customerName && formik.errors.customerName
                }
                isInvalid={
                  formik.touched.customerName && !!formik.errors.customerName
                }
                isRequired
              />
              <Input
                label="Email"
                placeholder="john@example.com"
                startContent={<Mail size={16} className="text-slate-400" />}
                {...formik.getFieldProps("email")}
                errorMessage={formik.touched.email && formik.errors.email}
                isInvalid={formik.touched.email && !!formik.errors.email}
                isRequired
              />
              <Input
                label="Phone Number"
                placeholder="(555) 123-4567"
                startContent={<Phone size={16} className="text-slate-400" />}
                {...formik.getFieldProps("phone")}
                errorMessage={formik.touched.phone && formik.errors.phone}
                isInvalid={formik.touched.phone && !!formik.errors.phone}
                isRequired
              />
            </div>

            <div className="my-6 h-px bg-slate-100 dark:bg-zinc-800" />

            <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
              <Smartphone className="text-blue-500" size={20} /> Device Info
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-small font-medium text-foreground-500 after:content-['*'] after:ml-0.5 after:text-red-500">
                  Device Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEVICE_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => formik.setFieldValue("deviceType", type)}
                      className={clsx(
                        "cursor-pointer rounded-lg border px-4 py-2 text-center text-sm transition-all",
                        formik.values.deviceType === type
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "border-slate-200 hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
                      )}
                    >
                      {type}
                    </div>
                  ))}
                </div>
                {formik.touched.deviceType && formik.errors.deviceType && (
                  <div className="mt-1 text-xs text-danger">
                    {formik.errors.deviceType}
                  </div>
                )}
              </div>

              <Textarea
                label="Issue Description"
                placeholder="Describe the problem (e.g., cracked screen, battery drains fast)..."
                minRows={3}
                startContent={
                  <FileText size={16} className="mt-1 text-slate-400" />
                }
                {...formik.getFieldProps("issueDescription")}
                errorMessage={
                  formik.touched.issueDescription &&
                  formik.errors.issueDescription
                }
                isInvalid={
                  formik.touched.issueDescription &&
                  !!formik.errors.issueDescription
                }
                isRequired
              />

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-small font-medium text-foreground-500">
                  Upload Images (Max 3)
                </label>
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-800/50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={formik.values.images.length >= 3}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="mb-2 text-slate-400" size={24} />
                    <span className="text-sm text-slate-500">
                      Click to upload photos
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {formik.values.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {formik.values.images.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src={img}
                          alt={`preview-${idx}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-red-500 text-white hover:bg-red-600"
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Location & Time */}
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900 md:p-8">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
              <MapPin className="text-blue-500" size={20} /> Location & Time
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-small font-medium text-foreground-500 after:content-['*'] after:ml-0.5 after:text-red-500">
                  Select Location
                </label>
                <div className="grid gap-3">
                  {LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => formik.setFieldValue("location", loc.id)}
                      className={clsx(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all",
                        formik.values.location === loc.id
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20"
                          : "border-slate-200 hover:border-blue-300 dark:border-zinc-800"
                      )}
                    >
                      <MapPin
                        size={20}
                        className={
                          formik.values.location === loc.id
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
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
                  <div className="mt-1 text-xs text-danger">
                    {formik.errors.location}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-small font-medium text-foreground-500 flex items-center gap-1 after:content-['*'] after:ml-0.5 after:text-red-500">
                    <Calendar size={14} /> Date
                  </label>
                  <input
                    type="date"
                    min={defaultDate}
                    {...formik.getFieldProps("date")}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.date && formik.errors.date && (
                    <div className="mt-1 text-xs text-danger">
                      {formik.errors.date}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-small font-medium text-foreground-500 flex items-center gap-1 after:content-['*'] after:ml-0.5 after:text-red-500">
                    <Clock size={14} /> Time (8AM - 8PM)
                  </label>
                  <input
                    type="time"
                    min="08:00"
                    max="20:00"
                    {...formik.getFieldProps("time")}
                    className="w-full rounded-xl border-slate-200 bg-slate-50 p-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.time && formik.errors.time && (
                    <div className="mt-1 text-xs text-danger">
                      {formik.errors.time}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800">
              {submitError && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-bold shadow-lg shadow-blue-500/30"
                color="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={!formik.isValid || !formik.dirty}
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400">
                By booking, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
