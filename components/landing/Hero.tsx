"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24
    bg-gradient-to-br from-teal-100 via-orange-100 to-amber-100
    text-white relative overflow-hidden"
    >
      {/* Left - Text Content */}
      <motion.div
        className="md:w-1/2 text-center md:text-left space-y-6 z-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-orange-600 to-amber-700">
          Visually Build <br /> AI-Powered Products
        </h1>
        <p className="text-base md:text-xl text-teal-500 max-w-xl mx-auto md:mx-0">
          Generate full-stack projects from prompts or design. Customize
          visually. Deploy instantly.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="inline-block"
        >
          <Button className="text-lg px-6 py-4 rounded-xl shadow-xl black hover:from-teal-500 hover:via-orange-500 hover:to-amber-500 transition-all">
            🚀 Get Started
          </Button>
        </motion.div>
      </motion.div>

      {/* Right - Animated Visual Blob */}
      <motion.div
        className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center relative z-0"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="w-[350px] h-[350px] rounded-full filter blur-3xl opacity-20 animate-blob bg-gradient-to-br from-teal-400 via-orange-400 to-amber-400" />
      </motion.div>
    </section>
  );
}
