import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { generateTemplate } from "@/services/templateGeneration";

import InitialInfoStep from "./questionnaire/InitialInfoStep";
import ObjectiveStep from "./questionnaire/ObjectiveStep";
import OfferDetailsStep from "./questionnaire/OfferDetailsStep";
import VisualsStep from "./questionnaire/VisualsStep";
import AdditionalInfoStep from "./questionnaire/AdditionalInfoStep";
import CompanyHistoryStep from "./questionnaire/CompanyHistoryStep";
import TemplatePreviewStep from "./questionnaire/TemplatePreviewStep";
import PricingStep from "./questionnaire/PricingStep";

interface QuestionnaireData {
  client_name: string;
  company_name: string;
  business_type: string;
  objective: "leads" | "appointment" | "sales" | "event" | "branding" | "other";
  objective_other?: string;
  offer_details?: string;
  has_photos: boolean;
  uploaded_images?: string[];
  additional_comments?: string;
  company_history?: string;
  show_pricing: boolean;
  pricing_details?: string;
}

export default function LandingPageQuestionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    client_name: "",
    company_name: "",
    business_type: "",
    objective: "leads",
    has_photos: false,
    show_pricing: false,
  });
  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleObjectiveChange = (value: QuestionnaireData["objective"]) => {
    setFormData((prev) => ({
      ...prev,
      objective: value,
    }));
  };

  const handlePhotoChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      has_photos: value,
    }));
  };

  const handlePricingChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      show_pricing: value,
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      uploaded_images: urls,
    }));
  };

  const handleGenerateTemplate = async () => {
    try {
      setIsGenerating(true);
      const template = await generateTemplate({
        client_name: formData.client_name,
        company_name: formData.company_name,
        business_type: formData.business_type,
        objective: formData.objective,
        offer_details: formData.offer_details,
        company_history: formData.company_history,
      });
      setGeneratedTemplate(template);
      toast({
        title: "Success!",
        description: "Template generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate template.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const title = `${formData.company_name} - ${formData.business_type} Landing Page`;

      const { error } = await supabase.from("landing_pages").insert({
        ...formData,
        profile_id: user.id,
        status: "draft",
        title,
        content: {
          template: generatedTemplate,
          images: formData.uploaded_images || [],
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your landing page is being generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create landing page.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <InitialInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <ObjectiveStep
            formData={formData}
            handleObjectiveChange={handleObjectiveChange}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <OfferDetailsStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <VisualsStep
            formData={formData}
            handlePhotoChange={handlePhotoChange}
            handleImageUpload={handleImageUpload}
          />
        );
      case 5:
        return (
          <AdditionalInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <CompanyHistoryStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <TemplatePreviewStep
            generatedTemplate={generatedTemplate}
            isGenerating={isGenerating}
            handleGenerateTemplate={handleGenerateTemplate}
          />
        );
      case 8:
        return (
          <PricingStep
            formData={formData}
            handlePricingChange={handlePricingChange}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
          >
            <ChevronLeft className="mr-2" />
            Anterior
          </Button>
        )}
        {step < 8 ? (
          <Button
            className="ml-auto"
            onClick={() => setStep((prev) => prev + 1)}
          >
            Próximo
            <ChevronRight className="ml-2" />
          </Button>
        ) : (
          <Button
            className="ml-auto"
            onClick={handleSubmit}
            disabled={!generatedTemplate}
          >
            Gerar Landing Page
            <Check className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}