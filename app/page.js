"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/hero";
import { MacbookScrollDemo } from "@/components/HomeScroll";
import { Button } from "@/components/ui/MovingBorder";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { WavyBackground } from "@/components/ui/Waves";
import { Spinner } from "@/components/ui/Spinner"; // Import Spinner component

export default function Generate() {
  const [customInput, setCustomInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [progress, setProgress] = useState(0); // Track progress
  const [isMounted, setIsMounted] = useState(false); // ✅ Fix: Ensure hydration sync
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("dark");
    setIsMounted(true); // ✅ Mark component as mounted
  }, []);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Disable submit button
      setProgress(10); // Start progress

      // Simulate a 3-second delay before starting the progress update
      setTimeout(async () => {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customInput }),
        });

        if (response.ok) {
          setProgress(50); // Midway through the process
          const data = await response.json();
          if (data.error) {
            setGeneratedContent("Error: " + data.error);
          } else {
            setGeneratedContent(
              data.markdown || "No markdown content generated."
            );
            setProgress(100); // Completed
            // Wait until progress is 100% before navigating
            setTimeout(() => {
              router.push(
                `/edit?markdown=${encodeURIComponent(data.markdown)}`
              );
            }, 300); // Wait a moment before transitioning to allow smooth animation
          }
        } else {
          alert("Error generating content");
          setProgress(0); // Reset on error
        }
      }, 3000); // 3-second delay before starting
    } catch (error) {
      setGeneratedContent("Error: " + error.message);
      setProgress(0); // Reset on error
    }
  };

  const handleSend = () => {
    router.push("/edit");
    // You can add functionality for sending content here
  };

  if (!isMounted) return null; // ✅ Fix: Prevent SSR mismatch

  return (
    <div className="p-0">
      <div className="top-0 w-full bg-black text-white shadow-md py-4 px-6 flex items-center justify-between z-30 sticky">
        <h1 className="text-xl md:text-3xl font-bold">
          Markify<span className="text-blue-400">.</span>
        </h1>
      </div>
      <Hero />
      <MacbookScrollDemo />
      <WavyBackground id="ai-generator" className="max-w-4xl mx-auto pb-2 pt-6">
        <div className="flex flex-col items-center justify-center p-4 gap-20">
          <h1 className="text-4xl font-semibold">
            Tell AI what you just Cooked up and let it do the rest 🚀
          </h1>
          <Textarea
            className="h-64 border-2 border-gray-300 dark:border-slate-700 rounded-lg p-4 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-black dark:text-white"
            placeholder="Type your content here..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          {/* Show loading spinner while submitting */}
          {isSubmitting && (
            <div className="mt-4">
              <Spinner />
            </div>
          )}
          <div>
            <Button
              onClick={handleSubmit}
              borderRadius="1.75rem"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 hover:bg-slate-200"
              disabled={isSubmitting} // Disable button during submission
            >
              Submit Prompt
            </Button>
            <Button
              onClick={handleSend}
              borderRadius="1.75rem"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              Try out the editor
            </Button>
          </div>
        </div>
      </WavyBackground>
      {/* Footer */}
      <footer className="w-full bg-black text-white py-6 flex justify-center items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Markify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
