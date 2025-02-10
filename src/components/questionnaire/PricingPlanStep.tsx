
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PaymentPlan {
  name: string;
  price_monthly: number;
  price_yearly: number;
  description: string | null;
  features: {
    landing_pages: number;
    custom_domains: number;
    support: string;
    analytics: boolean;
    ab_testing?: boolean;
    white_label?: boolean;
  };
}

const fetchPaymentPlans = async () => {
  const { data, error } = await supabase
    .from('payment_plans')
    .select('*')
    .order('price_monthly');

  if (error) {
    console.error('Error fetching payment plans:', error);
    throw error;
  }

  return data as PaymentPlan[];
};

const formatFeatures = (plan: PaymentPlan) => {
  const features = [];
  
  features.push(`${plan.features.landing_pages} Landing Pages`);
  features.push(`${plan.features.custom_domains} ${plan.features.custom_domains > 1 ? 'Domínios Próprios' : 'Domínio Próprio'}`);
  features.push("Subdomínio Gratuito");
  features.push("Dashboard do Cliente");
  
  switch (plan.features.support) {
    case 'basic':
      features.push("Suporte Básico");
      break;
    case 'priority':
      features.push("Suporte Prioritário");
      break;
    case 'vip':
      features.push("Suporte VIP");
      break;
  }

  if (plan.features.analytics) {
    features.push("Análise de Desempenho");
  }

  if (plan.features.ab_testing) {
    features.push("Testes A/B");
  }

  if (plan.features.white_label) {
    features.push("White Label");
  }

  return features;
};

interface PricingPlanStepProps {
  selectedPlan: string | null;
  onSelectPlan: (plan: string) => void;
}

export default function PricingPlanStep({ selectedPlan, onSelectPlan }: PricingPlanStepProps) {
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: fetchPaymentPlans,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-up">
        <h2 className="text-2xl font-bold">Carregando planos...</h2>
      </div>
    );
  }

  if (error) {
    console.error('Failed to load payment plans:', error);
    return (
      <div className="space-y-6 animate-fade-up">
        <h2 className="text-2xl font-bold">Erro ao carregar planos</h2>
        <p className="text-muted-foreground">
          Tente novamente mais tarde
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
      <p className="text-muted-foreground">
        Você terá 7 dias para testar todos os recursos gratuitamente.
        Após este período, será cobrado o valor do plano selecionado.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isEssential = plan.name === 'Plano Essencial';
          const features = formatFeatures(plan);

          return (
            <div
              key={plan.name}
              className={`rounded-xl p-6 bg-white ${
                selectedPlan === plan.name
                  ? "border-2 border-accent shadow-lg"
                  : "border border-gray-200"
              } ${isEssential ? "ring-2 ring-accent ring-offset-2" : ""}`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">R${plan.price_monthly}</span>
                <span className="text-gray-600 ml-2">/mês</span>
              </div>
              <ul className="space-y-3 mb-6">
                {features.map((feature, i) => (
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
          );
        })}
      </div>
    </div>
  );
}
