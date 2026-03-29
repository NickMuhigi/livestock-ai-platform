"use client";

import React from "react";

const importanceColors = {
  Critical: "bg-red-700 text-white border-red-500",
  Important: "bg-yellow-600 text-black border-yellow-400",
  Standard: "bg-green-700 text-white border-green-500",
};

const clausesA = [
  {
    number: 1,
    title: "Nature of Service and Decision-Support Disclaimer",
    importance: "Critical",
    body: `Herd AI is an AI-assisted decision-support tool. It does not constitute professional veterinary advice, diagnosis, or treatment. Accuracy is 88.6% weighted average. Approximately one in nine analyses may be incorrect. Users must not make treatment or biosecurity decisions without consulting a licensed veterinarian.`,
    ethical: `A false negative could delay isolation and allow disease to spread. FMD is notifiable under Rwandan law. This clause prevents overreliance on AI predictions.`,
  },
  {
    number: 2,
    title: "Licence Grant",
    importance: "Standard",
    body: `Non-exclusive, non-transferable, revocable licence for personal non-commercial cattle health management. No resale, sublicensing, modification, or commercial use permitted.`,
    ethical: `Commercial repurposing without revalidation could result in harmful misuse in untested contexts.`,
  },
  {
    number: 3,
    title: "Permitted and Prohibited Uses",
    importance: "Important",
    body: `May use: upload images, access advisory chat, book vet appointments, review analysis history. May not use: outputs as sole basis for public health reporting, insurance claims, legal proceedings, or any purpose requiring professional veterinary certification. May not reverse engineer the model.`,
    ethical: `Using AI classifications in legal or insurance contexts without certification could harm farmers if the result was incorrect.`,
  },
  {
    number: 4,
    title: "Limitation of Liability",
    importance: "Important",
    body: `Developers not liable for direct, indirect, incidental, or consequential loss including livestock loss, delayed treatment, or disease spread. Users accept full responsibility for treatment decisions.`,
    ethical: `This clause is only ethically defensible because the Clause 1 disclaimer is prominently shown before every result.`,
  },
  {
    number: 5,
    title: "Governing Law",
    importance: "Standard",
    body: `Governed by laws of the Republic of Rwanda. Disputes subject to jurisdiction of courts of Rwanda.`,
    ethical: `Establishes Rwandan jurisdiction so users' rights under Rwanda's data protection law apply, not the laws of the countries where cloud infrastructure is hosted.`,
  },
];

const clausesB = [
  {
    number: 1,
    title: "Data We Collect",
    importance: "Important",
    body: `Account data: name, email, encrypted password. Location data: GPS coordinates at time of analysis, district name. GPS sharing is optional. Cattle images submitted for analysis. Analysis records: predicted disease class, confidence score, four-class probability distribution, nearest clinic. Appointment records: veterinarian, date, time, reason.`,
    ethical: `GPS combined with disease history reveals precise farm location. GPS is optional to implement Rwanda Law 058/2021 data minimisation principle.`,
  },
  {
    number: 2,
    title: "How We Use Your Data",
    importance: "Important",
    body: `(a) authenticating account, (b) running disease classification, (c) identifying nearest vet clinic from GPS, (d) storing analysis history, (e) enabling vet appointment booking and email notification. Data will not be used for commercial profiling or advertising without separate explicit consent.`,
    ethical: `Purpose-limitation under Rwanda Law 058/2021 prohibits repurposing data beyond what was consented to. GPS data for clinic referral cannot be used for national surveillance without a separate consent process.`,
  },
  {
    number: 3,
    title: "Data Storage and Security",
    importance: "Standard",
    body: `Managed PostgreSQL database on Render. Passwords hashed with bcrypt cost factor 10. Authentication tokens in HTTP-only cookies inaccessible to client-side scripts.`,
    ethical: ``,
  },
  {
    number: 4,
    title: "Cross-Border Data Transfer",
    importance: "Critical",
    body: `Platform hosted on Render (frontend and backend) and Hugging Face Spaces (ML inference), both located outside Rwanda. Data is transferred outside Rwanda when the platform is used. Conducted in accordance with Rwanda Law 058/2021 with contractual safeguards in place. User consents by using the platform.`,
    ethical: `Rwanda Law 058/2021 requires explicit disclosure of cross-border transfers. Farmers have a legal right to know their data leaves Rwanda. This clause fulfils that legal and ethical obligation.`,
  },
  {
    number: 5,
    title: "Data Retention",
    importance: "Important",
    body: `Analysis records and account data retained for 24 months from last account activity. Securely deleted after that. Users may request earlier deletion.`,
    ethical: `Rwanda Law 058/2021 requires data not be held longer than necessary. Defined retention period implements the storage-limitation principle.`,
  },
  {
    number: 6,
    title: "Your Rights Under Rwanda Law No. 058/2021",
    importance: "Critical",
    body: `Right to Access, Right to Correction, Right to Deletion, Right to Object, Right to Withdraw Consent. Response within 30 days.`,
    ethical: `These are binding legal rights under Rwandan law, not optional courtesies. Making them visible and actionable is an ethical obligation.`,
  },
  {
    number: 7,
    title: "Contact and Data Deletion Requests",
    importance: "Standard",
    body: `Email: nicolasmuhigi@gmail.com. Response within 30 days. Users can also delete analysis history from account settings within the app.`,
    ethical: ``,
  },
];

const thirdPartyServices = [
  { service: "Google Gemini API", purpose: "Advisory chat generation", data: "Disease context, chat messages" },
  { service: "OpenStreetMap / Overpass", purpose: "Veterinary clinic geolocation", data: "GPS coordinates" },
  { service: "Render", purpose: "Platform hosting", data: "All platform data" },
  { service: "Hugging Face Spaces", purpose: "ML model inference", data: "Cattle images" },
];

function ImportanceBadge({ importance }: { importance: string }) {
  return (
    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold border ${importanceColors[importance as keyof typeof importanceColors]}`}>{importance}</span>
  );
}

function ClauseCard({ clause }: { clause: any }) {
  return (
    <div className="bg-[#101513] rounded-lg shadow p-6 mb-6 border border-[#3ddc84]/30">
      <div className="flex items-center mb-2">
        <span className="text-[#3ddc84] font-bold text-lg mr-2">Clause {clause.number}:</span>
        <span className="font-semibold text-base">{clause.title}</span>
        <ImportanceBadge importance={clause.importance} />
      </div>
      <div className="text-[#e6f2ed] mb-3 whitespace-pre-line">{clause.body}</div>
      {clause.ethical && (
        <div className="border-l-4 border-[#3ddc84] bg-[#16211b] p-3 mt-2 text-[#b6f5d6]">
          <span className="font-semibold">Why this matters ethically:</span> {clause.ethical}
        </div>
      )}
    </div>
  );
}

function RightsGrid() {
  const rights = [
    { title: "Right to Access", desc: "Request a copy of your data." },
    { title: "Right to Correction", desc: "Request correction of inaccurate data." },
    { title: "Right to Deletion", desc: "Request deletion of your data." },
    { title: "Right to Object", desc: "Object to certain data uses." },
    { title: "Right to Withdraw Consent", desc: "Withdraw consent at any time." },
    { title: "Response Time", desc: "We respond within 30 days." },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {rights.map((r) => (
        <div key={r.title} className="bg-[#101513] rounded-lg p-4 border border-[#3ddc84]/30">
          <div className="text-[#3ddc84] font-bold mb-1">{r.title}</div>
          <div className="text-[#e6f2ed] text-sm">{r.desc}</div>
        </div>
      ))}
    </div>
  );
}

function ThirdPartyTable() {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="min-w-full text-sm text-[#e6f2ed] bg-[#101513] border border-[#3ddc84]/30 rounded-lg">
        <thead>
          <tr className="bg-[#16211b]">
            <th className="px-4 py-2 text-left">Service</th>
            <th className="px-4 py-2 text-left">Purpose</th>
            <th className="px-4 py-2 text-left">Data Shared</th>
          </tr>
        </thead>
        <tbody>
          {thirdPartyServices.map((s) => (
            <tr key={s.service} className="border-t border-[#3ddc84]/20">
              <td className="px-4 py-2">{s.service}</td>
              <td className="px-4 py-2">{s.purpose}</td>
              <td className="px-4 py-2">{s.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TermsPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#e6f2ed]">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-[#101513] border-b border-[#3ddc84]/30 shadow-lg">
        <span className="text-2xl font-bold text-[#3ddc84] tracking-tight">Herd AI</span>
        <span className="text-lg font-semibold text-[#e6f2ed]">Terms & Privacy</span>
      </nav>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto py-10 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#3ddc84]">Terms of Use & Privacy Policy</h1>
        <div className="text-[#e6f2ed] mb-2">Effective: March 2026 · Governing Law: Republic of Rwanda · Version 1.0</div>
        <div className="bg-yellow-400 text-black rounded-lg px-4 py-3 font-semibold mb-6 shadow-md">
          Decision-Support Tool Only. Herd AI is an AI-assisted decision-support system with a weighted average accuracy of 88.6%. Approximately one in nine analyses may return an incorrect result. This platform does not constitute professional veterinary advice, diagnosis, or treatment. Always consult a licensed veterinarian before making treatment or biosecurity decisions.
        </div>
      </section>

      {/* PART A */}
      <section className="max-w-3xl mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[#3ddc84]">PART A — END-USER LICENCE AGREEMENT</h2>
        {clausesA.map((clause) => (
          <ClauseCard key={clause.number} clause={clause} />
        ))}
      </section>

      {/* PART B */}
      <section className="max-w-3xl mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold mb-4 text-[#3ddc84]">PART B — PRIVACY POLICY</h2>
        {clausesB.slice(0, 5).map((clause) => (
          <ClauseCard key={clause.number} clause={clause} />
        ))}
        <h3 className="text-xl font-bold mt-8 mb-2 text-[#3ddc84]">Your Rights Under Rwanda Law No. 058/2021</h3>
        <RightsGrid />
        {clausesB.slice(5, 7).map((clause) => (
          <ClauseCard key={clause.number} clause={clause} />
        ))}
        <h3 className="text-xl font-bold mt-8 mb-2 text-[#3ddc84]">Third-Party Services</h3>
        <ThirdPartyTable />
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-[#3ddc84]/30 bg-[#101513] text-[#b6f5d6] text-sm">
        © 2026 Herd AI · Nicolas Muhigi · African Leadership University · Governed by Rwanda Law No. 058/2021
      </footer>
    </div>
  );
}
