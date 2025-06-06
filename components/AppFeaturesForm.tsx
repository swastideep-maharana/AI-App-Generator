"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { callGeminiAI } from "@/lib/gemini";
import { createZipFromResult } from "@/lib/utils/createZip";
import { LiveProvider, LiveError, LivePreview } from "react-live";

type FormData = {
  prompt: string;
  designFile?: FileList;
  appType: string;
  framework: string;
};

const appTypes = ["Web App", "Mobile App", "Desktop App"];
const frameworks = ["React", "Next.js", "Vue", "Flutter"];

function formatPrompt(appType: string, framework: string, userPrompt: string) {
  return `Generate a complete ${appType} using ${framework}.

Requirements:
- Follow best practices and write clean, well-commented code.
- Use modern ${framework} features and architecture.
- Implement the following user features:

${userPrompt}

Please provide the full source code files and configurations. 
Also provide a standalone React component named "App" that demonstrates the main UI for live preview.`;
}

// Simple extractor function to get the code of the App component from full source code string
function extractAppComponent(fullCode: string): string {
  // This tries to extract from "export default function App()" till the matching closing brace
  // It's a simple regex; for complex cases, you'd need a proper parser.
  const appComponentMatch = fullCode.match(
    /export\s+default\s+function\s+App\s*\([^)]*\)\s*{([\s\S]*?)}\s*$/m
  );

  if (appComponentMatch) {
    // Return the full function including signature plus body
    return `function App() {${appComponentMatch[1]}} \n\n render(<App />);`;
  } else {
    // fallback: just return full code
    return fullCode;
  }
}

export function AppFeaturesForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editableCode, setEditableCode] = useState<string>("");

  const [designPreviewUrl, setDesignPreviewUrl] = useState<string | null>(null);
  const [designPreviewData, setDesignPreviewData] = useState<string | null>(
    null
  );

  const [showPreview, setShowPreview] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "design" | "aiPreview" | "code" | "livePreview"
  >("design");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowPreview(false);
    setActiveTab("aiPreview");

    try {
      const prompt = formatPrompt(data.appType, data.framework, data.prompt);
      const aiResponse = await callGeminiAI(prompt);

      setResult(aiResponse);
      setEditableCode(aiResponse);

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
    if (!editableCode) return;
    const blob = await createZipFromResult(editableCode);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-app.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreviewClick = async () => {
    const file = watch("designFile")?.[0];
    if (!file) return;

    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setDesignPreviewUrl(imageUrl);
      setDesignPreviewData(null);
      setShowPreview(true);
      setActiveTab("design");
    } else if (file.name.endsWith(".json") || file.name.endsWith(".fig")) {
      const text = await file.text();
      try {
        const json = JSON.parse(text);
        const formatted = JSON.stringify(json, null, 2);
        setDesignPreviewData(formatted);
        setDesignPreviewUrl(null);
        setShowPreview(true);
        setActiveTab("design");
      } catch {
        setDesignPreviewData("Invalid JSON file");
        setDesignPreviewUrl(null);
        setShowPreview(true);
        setActiveTab("design");
      }
    } else {
      setDesignPreviewData("Unsupported format for preview.");
      setDesignPreviewUrl(null);
      setShowPreview(true);
      setActiveTab("design");
    }
  };

  const handleClearPreview = () => {
    if (designPreviewUrl) URL.revokeObjectURL(designPreviewUrl);
    setDesignPreviewUrl(null);
    setDesignPreviewData(null);
    setShowPreview(false);
  };

  const handleClearResult = () => {
    setResult(null);
    setEditableCode("");
    setError(null);
    setActiveTab("design");
  };

  // Extract the App component code for react-live
  const livePreviewCode = result ? extractAppComponent(result) : "";

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">
        Generate Your AI-Powered App
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-6 bg-slate-100 dark:bg-slate-900 p-6 rounded-lg shadow-md"
        >
          {/* Prompt textarea */}
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
              disabled={loading}
            />
            {errors.prompt && (
              <p className="text-red-500 mt-1">{errors.prompt.message}</p>
            )}
          </div>

          {/* Design file input */}
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
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Supported formats: Figma JSON, PNG, JPG
            </p>

            {watch("designFile")?.[0] && (
              <div className="mt-3 flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviewClick}
                  disabled={loading}
                >
                  Preview Design
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearPreview}
                  disabled={!showPreview}
                >
                  Clear Preview
                </Button>
              </div>
            )}
          </div>

          {/* App Type selector */}
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
              disabled={loading}
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

          {/* Framework selector */}
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
              disabled={loading}
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

          {/* Submit and Clear buttons */}
          <div className="text-center mt-8 flex flex-col items-center gap-4">
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

            <Button
              type="button"
              variant="outline"
              onClick={handleClearResult}
              disabled={!result && !error}
            >
              Clear Generated Code
            </Button>
          </div>
        </form>

        {/* RIGHT: Preview and Editable Code Panel */}
        <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 p-6 rounded-lg shadow-md max-h-[90vh] overflow-auto">
          {/* Tabs */}
          <div className="flex space-x-4 mb-4 border-b border-gray-300 dark:border-slate-700">
            <button
              className={`pb-2 font-semibold ${
                activeTab === "design"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("design")}
              disabled={!showPreview}
            >
              Design Preview
            </button>
            <button
              className={`pb-2 font-semibold ${
                activeTab === "aiPreview"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("aiPreview")}
              disabled={!result}
            >
              AI App Preview
            </button>
            <button
              className={`pb-2 font-semibold ${
                activeTab === "code"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("code")}
              disabled={!result}
            >
              Editable Code
            </button>
            <button
              className={`pb-2 font-semibold ${
                activeTab === "livePreview"
                  ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setActiveTab("livePreview")}
              disabled={!result}
            >
              Live Preview
            </button>
          </div>

          {/* Tab Panels */}
          <div className="flex-1 overflow-auto">
            {activeTab === "design" && showPreview && (
              <>
                {designPreviewUrl && (
                  <img
                    src={designPreviewUrl}
                    alt="Design Preview"
                    className="w-full max-w-full rounded-lg shadow-md"
                  />
                )}
                {designPreviewData && (
                  <pre className="text-xs whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-4 rounded-md max-h-[70vh] overflow-auto">
                    {designPreviewData}
                  </pre>
                )}
                {!designPreviewUrl && !designPreviewData && (
                  <p className="text-center text-slate-500 dark:text-slate-400">
                    No design preview available.
                  </p>
                )}
              </>
            )}

            {activeTab === "aiPreview" && result && (
              <div className="h-full w-full p-4 bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-700 overflow-auto">
                {/* You can replace this with iframe or a live rendered preview */}
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  AI-generated app preview is not yet live-rendered.
                </p>
                <pre className="text-xs whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200 max-h-[70vh] overflow-auto">
                  {result}
                </pre>
              </div>
            )}

            {activeTab === "code" && result && (
              <div className="flex flex-col h-full">
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  rows={20}
                  className="w-full font-mono text-xs p-4 rounded-md border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
                />
                <Button
                  onClick={handleDownloadZip}
                  className="mt-4 self-start"
                  disabled={!editableCode}
                >
                  Export as ZIP
                </Button>
              </div>
            )}

            {activeTab === "livePreview" && result && (
              <LiveProvider code={livePreviewCode} language="jsx" noInline>
                <div className="h-full w-full p-4 bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-700 overflow-auto">
                  <LivePreview />
                  <LiveError className="text-red-500 mt-2" />
                </div>
              </LiveProvider>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
      )}
    </section>
  );
}
