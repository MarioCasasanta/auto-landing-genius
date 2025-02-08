
import React from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

const Index = () => {
  const defaultContent = {
    title: "Crie Landing Pages Otimizadas em Minutos",
    description: "Responda algumas perguntas simples sobre seu negócio e deixe nossa IA criar uma landing page profissional e otimizada para conversão.",
    cta: "Criar Minha Landing Page"
  };

  console.log('Index component rendering with defaultContent:', defaultContent);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main>
        <Hero content={defaultContent} />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
    </div>
  );
};

export default Index;
