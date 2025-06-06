

import Head from "next/head";
import { AppFeaturesForm } from "@/components/AppFeaturesForm";

export default function GeneratePage() {
  return (
    <>
      <Head>
        <title>Generate AI-Powered App | YourAppName</title>
        <meta
          name="description"
          content="Generate custom AI-powered apps with code generated on-demand."
        />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 px-6">
        <AppFeaturesForm />
      </main>
    </>
  );
}
