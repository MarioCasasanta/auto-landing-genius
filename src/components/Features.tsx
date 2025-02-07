
import React from "react";
import { CheckCircle, Clock, Brain, Layout } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Rápido e Simples",
    description: "Crie sua landing page em minutos respondendo algumas perguntas simples",
  },
  {
    icon: Brain,
    title: "IA Avançada",
    description: "Nossa IA gera automaticamente o melhor conteúdo para sua página",
  },
  {
    icon: Layout,
    title: "Templates Validados",
    description: "Use templates profissionais otimizados para conversão",
  },
  {
    icon: CheckCircle,
    title: "Pronto para Usar",
    description: "Publique instantaneamente e comece a converter visitantes",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-muted hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
