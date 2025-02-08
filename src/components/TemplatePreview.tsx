
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Template {
  id?: string;
  landingPage: {
    sections: {
      hero: {
        headline: string;
        subheadline: string;
        description: string;
      };
      services: {
        title: string;
        description: string;
        items: Array<{
          title: string;
          description: string;
        }>;
      };
      benefits: {
        title: string;
        items: Array<{
          title: string;
          description: string;
        }>;
      };
      testimonials: {
        title: string;
        items: Array<{
          quote: string;
          author: string;
          role: string;
        }>;
      };
      cta: {
        headline: string;
        description: string;
        buttonText: string;
        contactInfo: {
          address: string;
          phone: string;
          email: string;
          socialMedia: {
            instagram: string;
            linkedin: string;
          };
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

  const { hero, services, benefits, testimonials, cta } = template.landingPage.sections;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={() => onSelect(template)}
    >
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {hero.headline}
            </h3>
            <p className="text-lg text-muted-foreground">
              {hero.subheadline}
            </p>
            <p className="text-muted-foreground">
              {hero.description}
            </p>
          </div>
          {isSelected && (
            <Check className="text-primary h-5 w-5" />
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{services.title}</h4>
            <p className="text-sm text-muted-foreground">{services.description}</p>
            <ul className="mt-2 space-y-1">
              {services.items.map((service, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {service.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">{benefits.title}</h4>
            <ul className="mt-2 space-y-1">
              {benefits.items.map((benefit, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {benefit.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium">{testimonials.title}</h4>
            <div className="mt-2 space-y-2">
              {testimonials.items.map((testimonial, index) => (
                <div key={index} className="text-sm text-muted-foreground italic">
                  "{testimonial.quote}" - {testimonial.author}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium">{cta.headline}</h4>
            <p className="text-sm text-muted-foreground">{cta.description}</p>
            <div className="mt-2 p-2 bg-primary/10 rounded-md">
              <p className="text-sm font-medium">Botão: {cta.buttonText}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
