import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface PricingStepProps {
  formData: {
    show_pricing: boolean;
    pricing_details?: string;
  };
  handlePricingChange: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function PricingStep({ formData, handlePricingChange, handleInputChange }: PricingStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Preço e Contato</h2>
      <p className="text-muted-foreground">
        Sua landing page terá informações de preço ou o foco será em gerar contato?
      </p>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show_pricing"
            checked={formData.show_pricing}
            onCheckedChange={handlePricingChange}
          />
          <Label htmlFor="show_pricing">Exibir preços na landing page</Label>
        </div>
        {formData.show_pricing && (
          <div>
            <Label htmlFor="pricing_details">Informações de Preço</Label>
            <Textarea
              id="pricing_details"
              name="pricing_details"
              value={formData.pricing_details}
              onChange={handleInputChange}
              placeholder="Detalhe as informações de preço que deseja exibir"
              className="h-32"
            />
          </div>
        )}
      </div>
    </div>
  );
}