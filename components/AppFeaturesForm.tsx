"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { callGeminiAI } from "@/lib/gemini";
import { createZipFromResult } from "@/lib/utils/createZip";

type FormData = {
  prompt: string;
  designFile?: FileList;
  appType: string;
  framework: string;
};

const appTypes = ["Web App", "Mobile App", "Desktop App"];
const frameworks = ["React", "Next.js", "Vue", "Flutter"];

export function AppFeaturesForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = `Generate a ${data.appType} using ${data.framework}.\n\nUser Prompt: ${data.prompt}`;

      // Call Gemini AI
      const aiResponse = await callGeminiAI(prompt);
      setResult(aiResponse);

      // Save result + form data to backend API
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, result: aiResponse }),
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate app code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!result) return;
    const blob = await createZipFromResult(result);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-app.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Generate Your AI-Powered App
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="prompt"
            className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
          >
            Project Description / Prompt
          </label>
          <textarea
            id="prompt"
            {...register("prompt", { required: "Prompt is required" })}
            rows={4}
            placeholder="Describe your app idea or features..."
            className={`w-full rounded-md border px-4 py-3 resize-none dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.prompt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.prompt && (
            <p className="text-red-500 mt-1">{errors.prompt.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="designFile"
            className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
          >
            Upload Design File (optional)
          </label>
          <input
            id="designFile"
            type="file"
            accept=".json,.fig,.png,.jpg,.jpeg"
            {...register("designFile")}
            className="w-full text-slate-700 dark:text-slate-200"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Supported formats: Figma JSON, PNG, JPG
          </p>
        </div>

        <div>
          <label
            htmlFor="appType"
            className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
          >
            Select App Type
          </label>
          <select
            id="appType"
            {...register("appType", { required: true })}
            className="w-full rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>
              Choose app type
            </option>
            {appTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.appType && (
            <p className="text-red-500 mt-1">App type is required</p>
          )}
        </div>

        <div>
          <label
            htmlFor="framework"
            className="block mb-2 font-medium text-slate-700 dark:text-slate-300"
          >
            Select Framework / Platform
          </label>
          <select
            id="framework"
            {...register("framework", { required: true })}
            className="w-full rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>
              Choose framework
            </option>
            {frameworks.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </select>
          {errors.framework && (
            <p className="text-red-500 mt-1">Framework is required</p>
          )}
        </div>

        <div className="text-center mt-8">
          <Button
            type="submit"
            className="text-lg px-10 py-4 rounded-xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Generating...
              </>
            ) : (
              "Generate App"
            )}
          </Button>
        </div>
      </form>

      {result && (
        <div className="mt-10 bg-slate-100 dark:bg-slate-900 p-6 rounded-xl text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200">
          <h3 className="text-lg font-semibold mb-3">Generated App Code:</h3>
          <pre>{result}</pre>
          <Button onClick={handleDownloadZip} className="mt-4">
            Export as ZIP
          </Button>
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </section>
  );
}
