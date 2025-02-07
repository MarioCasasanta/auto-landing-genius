import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ObjectiveStepProps {
  formData: {
    objective: "leads" | "appointment" | "sales" | "event" | "branding" | "other";
    objective_other?: string;
  };
  handleObjectiveChange: (value: "leads" | "appointment" | "sales" | "event" | "branding" | "other") => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ObjectiveStep({ formData, handleObjectiveChange, handleInputChange }: ObjectiveStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Objetivo da Landing Page</h2>
      <p className="text-muted-foreground">
        Defina o principal objetivo da sua landing page para direcionarmos a criação da melhor estrutura para você.
      </p>
      <RadioGroup
        value={formData.objective}
        onValueChange={handleObjectiveChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="leads" id="leads" />
          <Label htmlFor="leads">Captar Leads/Contatos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="appointment" id="appointment" />
          <Label htmlFor="appointment">Agendar Sessão Estratégica/Consulta</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sales" id="sales" />
          <Label htmlFor="sales">Vender Produto/Infoproduto</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="event" id="event" />
          <Label htmlFor="event">Promover um Evento/Webinar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="branding" id="branding" />
          <Label htmlFor="branding">Divulgar minha Marca/Empresa</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="other" id="other" />
          <Label htmlFor="other">Outro</Label>
        </div>
      </RadioGroup>
      {formData.objective === "other" && (
        <div>
          <Label htmlFor="objective_other">Especifique outro objetivo</Label>
          <Input
            id="objective_other"
            name="objective_other"
            value={formData.objective_other}
            onChange={handleInputChange}
            placeholder="Digite seu objetivo"
          />
        </div>
      )}
    </div>
  );
}