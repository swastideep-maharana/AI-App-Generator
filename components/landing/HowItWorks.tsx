"use client";

import { motion } from "framer-motion";
import { Sparkles, Settings, DownloadCloud } from "lucide-react";

const steps = [
  {
    icon: <Sparkles className="h-8 w-8 text-violet-600 dark:text-violet-400" />,
    title: "Describe Your Idea",
    text: "Use natural language prompts or upload your design to define your project.",
  },
  {
    icon: (
      <Settings className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />
    ),
    title: "Customize Visually",
    text: "Tweak components, layout, themes, and workflows in an intuitive visual editor.",
  },
  {
    icon: (
      <DownloadCloud className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    ),
    title: "Generate & Deploy",
    text: "Get complete production-ready code — export, edit, or deploy in one click.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-orange-900 dark:to-amber-950 text-slate-900 dark:text-white px-6 md:px-20 rounded-3xl shadow-lg">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          From idea to AI-powered product — in just a few steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-shadow cursor-default"
          >
            <div className="mb-6 flex justify-center">
              {index === 0 && <Sparkles className="h-8 w-8 text-teal-500" />}
              {index === 1 && <Settings className="h-8 w-8 text-amber-500" />}
              {index === 2 && (
                <DownloadCloud className="h-8 w-8 text-orange-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-muted-foreground dark:text-slate-300">
              {step.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
