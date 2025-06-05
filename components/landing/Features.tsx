"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Sliders, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI Generation",
    description:
      "Use natural language to instantly generate full-stack apps with clean, editable code.",
    icon: Bot,
    colorLight: "text-violet-600",
    colorDark: "text-violet-400",
  },
  {
    title: "Visual Customization",
    description:
      "Drag, drop, and fine-tune every element using our real-time visual editor.",
    icon: Sliders,
    colorLight: "text-fuchsia-600",
    colorDark: "text-fuchsia-400",
  },
  {
    title: "Design to Code",
    description:
      "Import Figma designs and transform them into responsive React components.",
    icon: Code,
    colorLight: "text-blue-600",
    colorDark: "text-blue-400",
  },
];

export function FeatureCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-br from-white to-gray-100 dark:from-slate-900 dark:to-black py-24 px-6 md:px-20 text-slate-900 dark:text-white overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-teal-700 blur-3xl opacity-20 rounded-full z-0 animate-blob" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[300px] h-[300px] bg-amber-700 blur-2xl opacity-20 rounded-full z-0 animate-blob" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto text-center space-y-12"
      >
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Why Build with Us?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From prompt to deployment — every part of your product is fast,
            customizable, and production-grade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-300 dark:border-slate-700 text-left cursor-pointer transition-shadow hover:shadow-2xl"
            >
              <Icon
                className={`${
                  i === 0
                    ? "text-teal-600 dark:text-teal-400"
                    : i === 1
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-orange-600 dark:text-orange-400"
                } w-8 h-8 mb-4`}
              />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground dark:text-slate-300 text-sm">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA button */}
        <div className="mt-12">
          <Button className="text-lg px-6 py-4 rounded-xl shadow-xl bg-gradient-to-r from-teal-500 via-orange-500 to-amber-600 hover:from-teal-600 hover:via-orange-600 hover:to-amber-700 transition-all">
            🚀 Try It Now
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
