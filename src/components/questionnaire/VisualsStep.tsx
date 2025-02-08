
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "../ImageUploader";

interface VisualsStepProps {
  formData: {
    has_photos: boolean;
    uploaded_images?: string[];
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
          <div className="space-y-4">
            <ImageUploader onUploadComplete={handleImageUpload} />
            
            {formData.uploaded_images && formData.uploaded_images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.uploaded_images.map((url, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
