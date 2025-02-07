
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Plano Inicial",
    price: "39",
    features: [
      "1 Landing Page",
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
      "5 Landing Pages",
      "3 Domínios Próprios",
      "Subdomínio Gratuito",
      "Dashboard do Cliente",
      "Suporte Prioritário",
    ],
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Planos e Preços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <span className="text-4xl font-bold text-primary">R${plan.price}</span>
                <span className="text-gray-600 ml-2">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-accent mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-6 text-lg ${
                  plan.highlighted
                    ? "bg-accent hover:bg-accent/90"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                Começar Agora
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
