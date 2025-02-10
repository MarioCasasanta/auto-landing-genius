
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
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

const Pricing = () => {
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: fetchPaymentPlans,
  });

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">
            Carregando planos...
          </h2>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Failed to load payment plans:', error);
    return (
      <section id="pricing" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">
            Erro ao carregar planos
          </h2>
          <p className="text-center text-muted-foreground">
            Tente novamente mais tarde
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Planos e Preços
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const isEssential = plan.name === 'Plano Essencial';
            const features = formatFeatures(plan);

            return (
              <div
                key={index}
                className={`rounded-2xl p-8 bg-white animate-fade-up ${
                  isEssential
                    ? "border-2 border-accent shadow-xl"
                    : "border border-gray-200 shadow-lg"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-primary">
                    R${plan.price_monthly}
                  </span>
                  <span className="text-gray-600 ml-2">/mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <Check className="h-5 w-5 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/questionnaire">
                  <Button
                    className={`w-full py-6 text-lg ${
                      isEssential
                        ? "bg-accent hover:bg-accent/90"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                  >
                    Começar Agora
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
