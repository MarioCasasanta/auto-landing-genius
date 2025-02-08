
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Template {
  id?: string;
  landingPage: {
    sections: {
      hero: {
        headline: string;
        description: string;
      };
      features?: {
        benefit1?: {
          title: string;
          description: string;
        };
        benefit2?: {
          title: string;
          description: string;
        };
        benefit3?: {
          title: string;
          description: string;
        };
      };
    };
  };
}

interface TemplatePreviewProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
}

export default function TemplatePreview({ template, isSelected, onSelect }: TemplatePreviewProps) {
  if (!template?.landingPage?.sections) {
    return null;
  }

  const { hero, features } = template.landingPage.sections;

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
              {hero?.headline || "Template Preview"}
            </h3>
            <p className="text-muted-foreground">
              {hero?.description || "Click to select this template"}
            </p>
          </div>
          {isSelected && (
            <Check className="text-primary h-5 w-5" />
          )}
        </div>
        
        {features && (
          <div className="space-y-2">
            <h4 className="font-medium">Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              {features.benefit1 && (
                <li key="benefit1" className="text-sm text-muted-foreground">
                  {features.benefit1.title}
                </li>
              )}
              {features.benefit2 && (
                <li key="benefit2" className="text-sm text-muted-foreground">
                  {features.benefit2.title}
                </li>
              )}
              {features.benefit3 && (
                <li key="benefit3" className="text-sm text-muted-foreground">
                  {features.benefit3.title}
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
