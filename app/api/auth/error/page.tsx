"use client";

import { useSearchParams } from "next/navigation";
import { ShieldX, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <ShieldX className="text-red-600 dark:text-red-400" size={40} />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h1>

        <div className="mb-8 text-slate-500 dark:text-slate-400">
          {error === "AccessDenied" ? (
            <p>
              Your email address is not authorized to access the Admin
              Dashboard.
              <br />
              <span className="mt-2 block text-xs text-slate-400">
                Please contact the system administrator if you believe this is a
                mistake.
              </span>
            </p>
          ) : (
            <p>An authentication error occurred. Please try again.</p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            as={Link}
            href="/admin"
            className="w-full font-semibold"
            color="primary"
            variant="solid"
          >
            Try Different Account
          </Button>

          <Button
            as={Link}
            href="/"
            className="w-full font-semibold"
            variant="light"
            startContent={<ArrowLeft size={16} />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
