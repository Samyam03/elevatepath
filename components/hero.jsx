"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-indigo-50 via-white to-slate-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">

      <div className="flex flex-col gap-16 items-center justify-center max-w-6xl mx-auto">
        {/* Heading and Description */}
        <motion.div
          className="max-w-4xl text-center space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white tracking-tight">
            Your AI-Powered Application to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-glow">
              Elevate Your Career Path
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Build personalized resumes, cover letters, and prep for interviews
            with intelligent assistance tailored to your goals.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="mt-2 px-8 py-5 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-300 ease-in-out shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Banner Image with hover effect
        <motion.div
          className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-2xl group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
         <div className="relative aspect-[16/7] w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl group">
  <Image
    src="/banner.png"
    alt="Banner"
    fill
    priority
    className="object-contain rounded-3xl transition-transform duration-500 group-hover:scale-105"
  />
</div>


        </motion.div> */}
      </div>
    </section>
  );
};

export default HeroSection;
