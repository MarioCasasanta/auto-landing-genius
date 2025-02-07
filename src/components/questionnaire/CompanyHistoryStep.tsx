import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyHistoryStepProps {
  formData: {
    company_history?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function CompanyHistoryStep({ formData, handleInputChange }: CompanyHistoryStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Sua História</h2>
      <p className="text-muted-foreground">
        Compartilhe sua história para conectar-se ainda mais com seus clientes.
      </p>
      <div>
        <Label htmlFor="company_history">História (Opcional)</Label>
        <Textarea
          id="company_history"
          name="company_history"
          value={formData.company_history}
          onChange={handleInputChange}
          placeholder="Conte um pouco sobre sua trajetória e o que te motiva"
          className="h-32"
        />
      </div>
    </div>
  );
}