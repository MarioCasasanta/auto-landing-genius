import React from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import LandingPageQuestionnaire from "@/components/LandingPageQuestionnaire";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main>
        <Hero />
        <LandingPageQuestionnaire />
        <Features />
        <Pricing />
      </main>
    </div>
  );
};

export default Index;