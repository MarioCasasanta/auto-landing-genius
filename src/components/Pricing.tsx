
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Plano Inicial",
    price: "39",
    features: [
      "3 Landing Pages",
      "1 Domínio Próprio",
      "Subdomínio Gratuito",
      "Dashboard do Cliente",
      "Suporte Básico",
    ],
  },
  {
    name: "Plano Essencial",
    price: "79",
    features: [
      "7 Landing Pages",
      "3 Domínios Próprios",
      "Subdomínio Gratuito",
      "Dashboard do Cliente",
      "Suporte Prioritário",
      "Análise de Desempenho",
    ],
    highlighted: true,
  },
  {
    name: "Plano Profissional",
    price: "149",
    features: [
      "20 Landing Pages",
      "5 Domínios Próprios",
      "Subdomínio Gratuito",
      "Dashboard do Cliente",
      "Suporte VIP",
      "Análise de Desempenho",
      "Otimização SEO",
      "Integrações Avançadas",
    ],
  },
  {
    name: "Plano Enterprise",
    price: "Sob Consulta",
    features: [
      "Landing Pages Ilimitadas",
      "Domínios Ilimitados",
      "Subdomínio Gratuito",
      "Dashboard Personalizado",
      "Suporte Dedicado 24/7",
      "Análise Avançada",
      "Otimização SEO Premium",
      "Integrações Customizadas",
      "SLA Garantido",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Planos e Preços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 bg-white animate-fade-up ${
                plan.highlighted
                  ? "border-2 border-accent shadow-xl"
                  : "border border-gray-200 shadow-lg"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                {plan.price === "Sob Consulta" ? (
                  <span className="text-2xl font-bold text-primary">{plan.price}</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-primary">R${plan.price}</span>
                    <span className="text-gray-600 ml-2">/mês</span>
                  </>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-accent mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/questionnaire">
                <Button
                  className={`w-full py-6 text-lg ${
                    plan.highlighted
                      ? "bg-accent hover:bg-accent/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  Experimente Grátis
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
