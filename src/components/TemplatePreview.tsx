import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Template {
  id: string;
  content: {
    hero?: {
      title?: string;
      description?: string;
    };
    features?: Array<{
      title: string;
      description: string;
    }>;
  };
}

interface TemplatePreviewProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
}

export default function TemplatePreview({ template, isSelected, onSelect }: TemplatePreviewProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(template)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {template.content.hero?.title || "Template Preview"}
            </h3>
            <p className="text-muted-foreground">
              {template.content.hero?.description || "Click to select this template"}
            </p>
          </div>
          {isSelected && (
            <Check className="text-primary h-5 w-5" />
          )}
        </div>
        
        {template.content.features && (
          <div className="space-y-2">
            <h4 className="font-medium">Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              {template.content.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {feature.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}