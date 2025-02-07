
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-white">
      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Landing Pages Prontas em Minutos,
            <br />
            <span className="text-accent">Sem Você Precisar Editar Nada!</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie landing pages de alta conversão com IA e templates validados.
            Ideal para profissionais autônomos e pequenas empresas.
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 transition-colors text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl"
          >
            Crie Sua Landing Page Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
