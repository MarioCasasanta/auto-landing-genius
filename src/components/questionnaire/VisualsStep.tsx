import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "../ImageUploader";

interface VisualsStepProps {
  formData: {
    has_photos: boolean;
  };
  handlePhotoChange: (value: boolean) => void;
  handleImageUpload: (urls: string[]) => void;
}

export default function VisualsStep({ formData, handlePhotoChange, handleImageUpload }: VisualsStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Materiais Visuais</h2>
      <p className="text-muted-foreground">
        Você possui fotos que acredita serem úteis para a sua landing page?
      </p>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has_photos"
            checked={formData.has_photos}
            onCheckedChange={handlePhotoChange}
          />
          <Label htmlFor="has_photos">Sim, possuo fotos</Label>
        </div>
        {formData.has_photos && (
          <ImageUploader onUploadComplete={handleImageUpload} />
        )}
      </div>
    </div>
  );
}