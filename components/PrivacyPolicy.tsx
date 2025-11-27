import React from "react";

// Disclaimer: This is a general legal template and MUST be reviewed by a licensed legal professional in Canada.
const PP_CONTENT = {
  effectiveDate: "November 28, 2025",
  companyName: "Infinite Tech Repairs Inc.",
  governingProvince: "Alberta",
  contactEmail: "privacy@infinitetechrepairs.com",
  address: "707 7 Ave SW, Calgary, AB T2P 3H6",
};

export const PrivacyPolicy: React.FC = () => {
  const {
    effectiveDate,
    companyName,
    governingProvince,
    contactEmail,
    address,
  } = PP_CONTENT;

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl max-w-4xl mx-auto my-12 p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-zinc-800">
      <header className="mb-10 border-b border-slate-100 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective Date: <span className="font-semibold">{effectiveDate}</span>
        </p>
      </header>

      {/* INTRODUCTION */}
      <div className="mb-10">
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          Your privacy is important to us. This Privacy Policy explains how{" "}
          {companyName} collects, uses, discloses, and retains personal
          information in accordance with the **Personal Information Protection
          and Electronic Documents Act (PIPEDA)** and other applicable
          provincial laws in {governingProvince}.
        </p>
      </div>

      {/* SECTION 1: COLLECTION OF INFORMATION */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          1.1. Personal Information
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We collect personal information necessary to process your repair
          requests, complete transactions, and communicate with you. This
          includes:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>**Contact Data:** Name, email address, phone number.</li>
          <li>
            **Repair Data:** Device type, issue description, passwords/passcodes
            (provided solely for diagnostic purposes).
          </li>
          <li>
            **Location Data:** Pickup/drop-off address or selected store
            location.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          1.2. Technical and Usage Data
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We automatically collect non-identifiable information about your usage
          of our website and chatbot (e.g., IP address, browser type, pages
          viewed, chat history). This data is used for analytics and improving
          our service quality.
        </p>
      </div>

      {/* SECTION 2: USE OF INFORMATION */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          2. How We Use Your Information
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          Your information is used exclusively for the following purposes:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>To fulfill the service contract (diagnostics and repair).</li>
          <li>
            To communicate status updates, quotes, and completion notifications.
          </li>
          <li>
            For internal record-keeping and auditing (e.g., warranty claims).
          </li>
          <li>
            To operate and improve the functionality of our website and AI
            services.
          </li>
          <li>To comply with legal obligations.</li>
        </ul>
      </div>

      {/* SECTION 3: CONSENT AND SECURITY */}
      <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-600 dark:border-blue-400">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          3. Consent and Data Security
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          3.1. Consent and Withdrawal
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          By providing your personal information, you consent to its collection
          and use as described in this policy. You may withdraw your consent at
          any time, subject to legal or contractual restrictions, by contacting
          our Privacy Officer.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          3.2. Security Measures
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We use physical, organizational, and technological measures (e.g.,
          encryption, firewalls, secure internal networks) designed to protect
          your personal information against unauthorized access, disclosure, or
          misuse.
        </p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          *Note: Any passcodes provided for repair are wiped immediately upon
          completion of testing and prior to device return.*
        </p>
      </div>

      {/* SECTION 4: DISCLOSURE AND RETENTION */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          4. Disclosure and Retention
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          4.1. Disclosure to Third Parties
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We do not sell your personal information. We may disclose your
          information to third-party service providers (e.g., payment
          processors, courier services) strictly to the extent necessary to
          fulfill the service you requested. These parties are bound by
          confidentiality agreements.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          4.2. Retention
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          We retain personal information only as long as necessary to fulfill
          the purposes for which it was collected or as required by{" "}
          {governingProvince} law. Repair records are typically kept for the
          duration of the warranty period (90 days) for auditing purposes.
        </p>
      </div>

      {/* SECTION 5: ACCESS AND CONTACT */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          5. Access and Contact
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          5.1. Access and Accuracy
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          You have the right to request access to the personal information we
          hold about you and to request corrections if you believe it is
          inaccurate.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          5.2. Privacy Officer Contact
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400">
          All requests regarding your privacy rights or concerns should be
          directed to our Privacy Officer:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1 mt-2">
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
