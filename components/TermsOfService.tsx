import React from "react";

// Disclaimer: This is a general legal template and MUST be reviewed by a licensed legal professional in Canada.
const TOS_CONTENT = {
  effectiveDate: "November 28, 2025",
  companyName: "Infinite Tech Repairs Inc.",
  governingProvince: "Alberta",
  contactEmail: "legal@infinitetechrepairs.com",
  address: "707 7 Ave SW, Calgary, AB T2P 3H6",
};

export const TermsOfService: React.FC = () => {
  const {
    effectiveDate,
    companyName,
    governingProvince,
    contactEmail,
    address,
  } = TOS_CONTENT;

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl max-w-4xl mx-auto my-12 p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-zinc-800">
      <header className="mb-10 border-b border-slate-100 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Terms and Conditions of Service
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective Date: <span className="font-semibold">{effectiveDate}</span>
        </p>
      </header>

      {/* SECTION 1: ACCEPTANCE */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          By submitting a device to {companyName} for diagnostic examination,
          repair, or any related service, you (the "Customer") agree to be bound
          by these Terms and Conditions. These terms constitute the entire
          agreement between the Customer and {companyName}.
        </p>
      </div>

      {/* SECTION 2: REPAIR SERVICES AND WARRANTY */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          2. Repair Services and Guarantee
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          2.1. No Fix, No Fee Policy
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          If our technician is unable to repair your device, you will not be
          charged for the repair labour. This policy excludes parts, diagnostic
          fees (if applicable, e.g., water damage), and shipping/courier fees.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          2.2. Repair Warranty
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We offer a **90-day limited warranty** on all parts and labour
          directly related to the original repair performed by {companyName}.
          This warranty does not cover:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>
            Subsequent damage (e.g., drops, physical damage, liquid exposure).
          </li>
          <li>Faults unrelated to the original service.</li>
          <li>
            Damage resulting from unauthorized repair attempts by a third party.
          </li>
        </ul>
      </div>

      {/* SECTION 3: DATA AND BACKUP */}
      <div className="mb-10 bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg border-l-4 border-yellow-600 dark:border-yellow-400">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          3. Data Backup and Liability
        </h2>
        <p className="text-base font-medium text-red-700 dark:text-yellow-300 mb-3">
          **CRITICAL WARNING: The Customer is solely responsible for backing up
          all data** (files, photos, contacts, etc.) before submitting the
          device for service.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          While we take every precaution to protect your data, {companyName}{" "}
          assumes no liability for any loss, corruption, or compromise of data
          during the repair process. By proceeding, you acknowledge this risk.
        </p>
      </div>

      {/* SECTION 4: DIAGNOSTICS, QUOTES, AND PAYMENT */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          4. Diagnostics and Payment
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          4.1. Quotation
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          All repair quotes are estimates. If the technician identifies
          additional damage that increases the cost by more than 10% of the
          original quote, we will contact you for approval before proceeding.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          4.2. Payment and Abandonment
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          Full payment is required upon completion of the repair, prior to
          device return. If the Customer fails to pick up the device and pay the
          balance within ninety (90) days of receiving notification of repair
          completion, the device will be considered abandoned, and {companyName}{" "}
          reserves the right to dispose of the property.
        </p>
      </div>

      {/* SECTION 5: GOVERNING LAW AND CONTACT */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          5. Governing Law and Contact
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          These Terms and Conditions shall be governed by and construed in
          accordance with the laws of the Province of {governingProvince} and
          the federal laws of Canada applicable therein.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          Contact Information
        </h3>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>
            <span className="font-semibold">Email:</span>{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-500 hover:underline"
            >
              {contactEmail}
            </a>
          </li>
          <li>
            <span className="font-semibold">Address:</span> {address}
          </li>
        </ul>
      </div>
    </section>
  );
};
