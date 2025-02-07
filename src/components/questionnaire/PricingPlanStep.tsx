
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
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
];

interface PricingPlanStepProps {
  selectedPlan: string | null;
  onSelectPlan: (plan: string) => void;
}

export default function PricingPlanStep({ selectedPlan, onSelectPlan }: PricingPlanStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
      <p className="text-muted-foreground">
        Você terá 7 dias para testar todos os recursos gratuitamente.
        Após este período, será cobrado o valor do plano selecionado.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-6 bg-white ${
              selectedPlan === plan.name
                ? "border-2 border-accent shadow-lg"
                : "border border-gray-200"
            } ${plan.highlighted ? "ring-2 ring-accent ring-offset-2" : ""}`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">R${plan.price}</span>
              <span className="text-gray-600 ml-2">/mês</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <Check className="h-4 w-4 text-accent mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                selectedPlan === plan.name
                  ? "bg-accent hover:bg-accent/90"
                  : "bg-primary hover:bg-primary/90"
              }`}
              onClick={() => onSelectPlan(plan.name)}
            >
              {selectedPlan === plan.name ? "Selecionado" : "Selecionar"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
