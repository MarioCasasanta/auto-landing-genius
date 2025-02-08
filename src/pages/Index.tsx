
import React from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

const Index = () => {
  const defaultContent = {
    title: "Landing Pages Prontas em Minutos, Sem Você Precisar Editar Nada!",
    description: "Crie landing pages de alta conversão com IA e templates validados. Ideal para profissionais autônomos e pequenas empresas.",
    cta: "Começar Agora"
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
