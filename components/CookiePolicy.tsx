import React from "react";

// Define the content data structure to keep the component clean
const COOKIE_POLICY_CONTENT = {
  effectiveDate: "November 28, 2025",
  summary: {
    commitment: "We value your trust and privacy.",
    purpose: [
      "Necessity: To make the booking system, login process, and security functions work.",
      "Performance: To see how the site is performing (e.g., how fast pages load).",
      "Analytics: To understand what pages you visit (e.g., if you check the 'Track Repair' page often).",
    ],
    control: [
      "Essential Cookies: We use strictly necessary cookies automatically.",
      "Non-Essential Cookies: We use performance and analytics cookies based on implied consent.",
      "Blocking: You can manage or delete all cookies through your browser settings at any time.",
    ],
  },
  tables: {
    necessary: [
      {
        name: "csrf-token",
        purpose: "Prevents cross-site request forgery (CSRF) attacks.",
        duration: "Session",
      },
      {
        name: "_auth_session",
        purpose: "Maintains Admin login state across pages.",
        duration: "30 Days",
      },
      {
        name: "cart_session_id",
        purpose: "Stores items placed in a mock shopping cart.",
        duration: "24 Hours",
      },
    ],
    analytics: [
      {
        name: "_ga (Google Analytics)",
        purpose:
          "Distinguishes unique users and tracks campaign effectiveness.",
        duration: "2 Years",
      },
      {
        name: "_gid (Google Analytics)",
        purpose: "Stores and updates a unique value for each page visited.",
        duration: "24 Hours",
      },
      {
        name: "_chat_count (Redux)",
        purpose: "Tracks the number of questions asked in the Gemini chatbot.",
        duration: "Session",
      },
    ],
    functional: [
      {
        name: "theme",
        purpose: "Remembers dark mode vs. light mode selection.",
        duration: "1 Year",
      },
      {
        name: "redux_persist",
        purpose: "Stores your unsaved repair form data in session storage.",
        duration: "Session",
      },
    ],
  },
};

interface PolicyTableProps {
  title: string;
  description: string;
  data: { name: string; purpose: string; duration: string }[];
}

// Reusable table component for clean JSX
const PolicyTable: React.FC<PolicyTableProps> = ({
  title,
  description,
  data,
}) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
      {title}
    </h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
      {description}
    </p>
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-700">
        <thead className="bg-slate-50 dark:bg-zinc-800">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Cookie Example
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Purpose
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
          {data.map((item) => (
            <tr
              key={item.name}
              className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
                {item.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {item.purpose}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 dark:text-slate-500">
                {item.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const CookiePolicy: React.FC = () => {
  const { summary, tables, effectiveDate } = COOKIE_POLICY_CONTENT;

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl max-w-4xl mx-auto my-12 p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-zinc-800">
      <header className="mb-10 border-b border-slate-100 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          Infinite Tech Repair - Cookie Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective Date: <span className="font-semibold">{effectiveDate}</span>
        </p>
      </header>

      {/* SECTION 1: SIMPLE SUMMARY */}
      <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-600 dark:border-blue-400">
        <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
          💡 OUR COMMITMENT: YOUR PRIVACY MATTERS (The Simple Summary)
        </h2>
        <p className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4">
          {summary.commitment} This policy explains how we use cookies while
          adhering to Canadian privacy laws (PIPEDA and CASL).
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">
          What We Use Cookies For:
        </h3>
        <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
          {summary.purpose.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-5">
          Your Control:
        </h3>
        <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
          {summary.control.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* SECTION 2: DEFINITIONS */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          1. WHAT ARE COOKIES?
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Cookies are tiny text files that are stored on your computer or mobile
          device when you visit a website. They allow the website (like ours) to
          recognize your device on subsequent visits and store limited
          information, such as your preferences (like dark mode vs. light mode)
          or login status (for the Admin panel).
        </p>
      </div>

      {/* SECTION 3: LEGAL BASIS */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          2. LEGAL BASIS FOR USE (Canadian Law)
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          As a Canadian-based company, our use of cookies is governed by federal
          legislation, notably the **Personal Information Protection and
          Electronic Documents Act (PIPEDA)**, and, where applicable, the
          **Anti-Spam Legislation (CASL)**.
        </p>
        <p className="text-base text-slate-600 dark:text-slate-400">
          We generally rely on **Implied Consent** for non-invasive, commonly
          expected uses (like general analytics) and **Express Consent** where
          required for high-risk or specific commercial electronic messages. By
          continuing to use our website after being presented with our cookie
          notice, you agree to the use of cookies as described in this policy.
        </p>
      </div>

      {/* SECTION 4: DETAILED COOKIE TABLES */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          3. TYPES OF COOKIES WE USE
        </h2>

        <PolicyTable
          title="A. Strictly Necessary Cookies (Essential)"
          description="These cookies are crucial for the basic functionality of the website (like Admin login and security) and cannot be switched off. PIPEDA Compliance: These are generally exempt from strict consent requirements."
          data={tables.necessary}
        />

        <PolicyTable
          title="B. Performance and Analytics Cookies"
          description="These cookies help us understand how visitors interact with our site by collecting and reporting information anonymously. No direct Personal Identifiable Information (PII) is collected."
          data={tables.analytics}
        />

        <PolicyTable
          title="C. Functional Cookies"
          description="These cookies allow our website to remember choices you make (like your repair form state or theme preference) to provide enhanced, personalized features."
          data={tables.functional}
        />
      </div>

      {/* SECTION 5: MANAGEMENT */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          4. YOUR CHOICES AND HOW TO MANAGE COOKIES
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
          A. Browser Controls (Global Opt-Out)
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-4">
          You can choose to accept or decline cookies directly through your web
          browser settings. Note that blocking Strictly Necessary Cookies may
          cause core features of the website to malfunction.
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-2">
          <li>
            <span className="font-semibold">Chrome:</span>{" "}
            <a
              href="chrome://settings/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              \[Settings\] &gt; \[Privacy and Security\] &gt; \[Site Settings\]
              &gt; \[Cookies and site data\]
            </a>
          </li>
          <li>
            <span className="font-semibold">Firefox:</span>{" "}
            <a
              href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              \[Options\] &gt; \[Privacy & Security\] &gt; \[Cookies and Site
              Data\]
            </a>
          </li>
          <li>
            <span className="font-semibold">Safari:</span>{" "}
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              \[Preferences\] &gt; \[Privacy\] &gt; \[Manage Website Data\]
            </a>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
          B. Opt-Out of Analytics
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400">
          If you wish to prevent your data from being used by Google Analytics,
          you can install the official Google Analytics opt-out browser add-on.
        </p>
      </div>

      {/* SECTION 6: CONTACT */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          5. CONTACT US
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-4">
          If you have any questions or concerns about our use of cookies or this
          policy, please contact our Privacy Officer:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>
            <span className="font-semibold">Email:</span>{" "}
            <a
              href="mailto:info@infinitetechrepair.com"
              className="text-blue-500 hover:underline"
            >
              info@infinitetechrepair.com
            </a>
          </li>
          <li>
            <span className="font-semibold">Address:</span> 707 7 Ave SW,
            Calgary, AB T2P 3H6
          </li>
        </ul>
      </div>
    </section>
  );
};
