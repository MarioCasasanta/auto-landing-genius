import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OfferDetailsStepProps {
  formData: {
    offer_details?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function OfferDetailsStep({ formData, handleInputChange }: OfferDetailsStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Detalhes da sua Oferta</h2>
      <p className="text-muted-foreground">
        Conte-nos mais sobre o que você oferece e o que torna sua oferta única.
      </p>
      <div>
        <Label htmlFor="offer_details">Detalhes da Oferta</Label>
        <Textarea
          id="offer_details"
          name="offer_details"
          value={formData.offer_details}
          onChange={handleInputChange}
          placeholder="Descreva seus diferenciais competitivos e como sua oferta transforma a vida do cliente"
          className="h-32"
        />
      </div>
    </div>
  );
}