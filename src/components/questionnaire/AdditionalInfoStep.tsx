import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoStepProps {
  formData: {
    additional_comments?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function AdditionalInfoStep({ formData, handleInputChange }: AdditionalInfoStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Comentários Adicionais</h2>
      <p className="text-muted-foreground">
        Há mais algum detalhe importante que você gostaria de adicionar?
      </p>
      <div>
        <Label htmlFor="additional_comments">Comentários (Opcional)</Label>
        <Textarea
          id="additional_comments"
          name="additional_comments"
          value={formData.additional_comments}
          onChange={handleInputChange}
          placeholder="Adicione informações extras que possam ser relevantes"
          className="h-32"
        />
      </div>
    </div>
  );
}