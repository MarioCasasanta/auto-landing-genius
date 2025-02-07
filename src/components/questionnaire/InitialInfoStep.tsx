import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InitialInfoStepProps {
  formData: {
    client_name: string;
    company_name: string;
    business_type: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InitialInfoStep({ formData, handleInputChange }: InitialInfoStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Informações Iniciais</h2>
      <p className="text-muted-foreground">
        Nesta primeira etapa, precisamos de algumas informações básicas para começarmos a criar sua landing page.
      </p>
      <div className="space-y-4">
        <div>
          <Label htmlFor="client_name">Seu Nome</Label>
          <Input
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            placeholder="Digite seu nome"
            required
          />
        </div>
        <div>
          <Label htmlFor="company_name">Nome da Empresa/Marca</Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder="Digite o nome da sua empresa"
            required
          />
        </div>
        <div>
          <Label htmlFor="business_type">Ramo de Atuação</Label>
          <Input
            id="business_type"
            name="business_type"
            value={formData.business_type}
            onChange={handleInputChange}
            placeholder="Ex: Marketing Digital, Consultoria, etc."
            required
          />
        </div>
      </div>
    </div>
  );
}