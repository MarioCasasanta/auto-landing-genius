
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  content?: {
    title?: string;
    description?: string;
    cta?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  // Valores padrão caso o content não seja fornecido
  const defaultContent = {
    title: "Landing Pages Prontas em Minutos, Sem Você Precisar Editar Nada!",
    description: "Crie landing pages de alta conversão com IA e templates validados. Ideal para profissionais autônomos e pequenas empresas.",
    cta: "Começar Agora"
  };

  // Use os valores do content se disponíveis, caso contrário use os valores padrão
  const {
    title = defaultContent.title,
    description = defaultContent.description,
    cta = defaultContent.cta
  } = content || defaultContent;

  console.log('Hero rendering with content:', { content, title, description, cta });

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-white">
      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          <Link to="/questionnaire">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 transition-colors text-lg py-6 px-8 rounded-xl shadow-lg hover:shadow-xl"
            >
              {cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
