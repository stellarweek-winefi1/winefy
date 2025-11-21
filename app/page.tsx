"use client";

import dynamic from "next/dynamic";

// Lazy load sections that are below the fold for better performance
const HeroSection = dynamic(() => import("@/components/HeroSection"), {
  ssr: true, // Keep SSR for hero section (above fold)
});

const WhyInvestSection = dynamic(() => import("@/components/WhyInvestSection"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white" />, // Placeholder
});

const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"), {
  ssr: false,
  loading: () => <div className="h-96 bg-white" />, // Placeholder
});

const CTASection = dynamic(() => import("@/components/CTASection"), {
  ssr: false,
  loading: () => <div className="h-64 bg-black" />, // Placeholder
});

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <WhyInvestSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
