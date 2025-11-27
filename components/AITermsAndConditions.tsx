import React from "react";

// Disclaimer: This is a general legal template and MUST be reviewed by a licensed legal professional.
const AI_TNC_CONTENT = {
  effectiveDate: "November 28, 2025",
  companyName: "Infinite Tech Repairs Inc.",
  chatbotName: "Infinite Tech Assistant",
  contactEmail: "privacy@infinitetechrepairs.com",
};

export const AITermsAndConditions: React.FC = () => {
  const { effectiveDate, companyName, chatbotName, contactEmail } =
    AI_TNC_CONTENT;

  return (
    <section className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl max-w-4xl mx-auto my-12 p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-zinc-800">
      <header className="mb-10 border-b border-slate-100 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
          AI Chatbot Terms of Use
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Governing the use of the {chatbotName} powered by Google Gemini.
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Effective Date: <span className="font-semibold">{effectiveDate}</span>
        </p>
      </header>

      {/* INTRODUCTION & DISCLAIMER */}
      <div className="mb-10 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border-l-4 border-blue-600 dark:border-blue-400">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          1. General Terms and Disclaimer
        </h2>
        <p className="text-base font-medium text-red-700 dark:text-red-400 mb-3">
          **CRITICAL NOTICE:** The {chatbotName} is an artificial intelligence
          (AI) system designed for general guidance only. It is not a
          replacement for a certified technician.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You acknowledge that AI models can produce inaccurate information
          ("hallucinations"). Any information, advice, or repair suggestions
          provided by the chatbot are for informational purposes only. Do not
          rely on chatbot outputs for critical repair decisions without
          confirmation from a human expert.
        </p>
      </div>

      {/* SECTION 2: LIMITATIONS OF CHATBOT SERVICE */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          2. Limitations of Service
        </h2>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          2.1. No Warranty or Guarantee
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          {companyName} offers no warranty, express or implied, regarding the
          accuracy, completeness, or reliability of any information provided by
          the chatbot. All specific repair quotes require physical inspection.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          2.2. DIY Repair Refusal
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          The chatbot is programmed to refuse detailed instructions or tutorials
          for "Do-It-Yourself" repairs. This is done to prevent property damage
          and ensure customer safety. The chatbot will refer you to professional
          service immediately for liability-sensitive inquiries.
        </p>
      </div>

      {/* SECTION 3: PRIVACY AND DATA USAGE */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          3. Privacy and Data Usage
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          Your privacy is protected under our main Privacy Policy. Specific to
          the chatbot, you agree that:
        </p>
        <ul className="list-disc pl-5 text-base text-slate-600 dark:text-slate-400 space-y-1">
          <li>
            **Chat History:** Your conversation history may be recorded and
            retained by {companyName} for quality assurance, service
            improvement, and safety purposes.
          </li>
          <li>
            **Anonymity:** We do not collect personally identifiable information
            (PII) through the chatbot itself. You should not share sensitive PII
            (passwords, bank details) with the AI.
          </li>
          <li>
            **AI Training:** Conversations may be used in an aggregated and
            anonymized form to improve the AI model's performance and accuracy.
          </li>
        </ul>
      </div>

      {/* SECTION 4: LIMITS AND TERMINATION */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          4. Usage Limits and Restrictions
        </h2>

        <p className="text-base text-slate-600 dark:text-slate-400 mb-3">
          The chatbot service may be subject to rate limits (e.g., 10 questions
          per session) to maintain service quality for all users. {companyName}{" "}
          reserves the right to terminate or suspend access to the chatbot at
          any time, without notice.
        </p>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 mt-4">
          Prohibited Use
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400">
          You may not use the chatbot for any illegal, harmful, or abusive
          purposes, including generating malicious code or engaging in
          harassment.
        </p>
      </div>
    </section>
  );
};

export default AITermsAndConditions;
