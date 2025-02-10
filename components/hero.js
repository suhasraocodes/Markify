"use client";
import React from "react";
import ColourfulText from "@/components/ui/colourfull-text";
import { motion } from "motion/react";
import { Button } from "./ui/MovingBorder";
import { useRouter } from "next/navigation";
export function Hero() {
  const router = useRouter();
  const handleSubmit = () => {
    router.push("/edit");
  };
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image */}
      <motion.img
        src="image.png"
        className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      />

      {/* Hero Content */}
      <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
        Effortlessly <ColourfulText text="generate" /> and <br />
        customize markdown for your projects.
      </h1>
      <div className="mt-5">
        <Button
          onClick={handleSubmit}
          borderRadius="1.75rem"
          className="bg-white  dark:bg-white text-black dark:text-black border-slate-800 hover:bg-purple-500"
        >
          Try Now
        </Button>
      </div>
    </div>
  );
}
