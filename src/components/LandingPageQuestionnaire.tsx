
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { generateTemplate } from "@/services/templateGeneration";
import { useNavigate } from "react-router-dom";

import InitialInfoStep from "./questionnaire/InitialInfoStep";
import ObjectiveStep from "./questionnaire/ObjectiveStep";
import OfferDetailsStep from "./questionnaire/OfferDetailsStep";
import VisualsStep from "./questionnaire/VisualsStep";
import AdditionalInfoStep from "./questionnaire/AdditionalInfoStep";
import CompanyHistoryStep from "./questionnaire/CompanyHistoryStep";
import TemplatePreviewStep from "./questionnaire/TemplatePreviewStep";
import PricingStep from "./questionnaire/PricingStep";
import PricingPlanStep from "./questionnaire/PricingPlanStep";

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
  selected_plan?: string | null;
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
    selected_plan: null,
  });
  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handlePlanSelect = (plan: string) => {
    setFormData((prev) => ({
      ...prev,
      selected_plan: plan,
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
        title: "Sucesso!",
        description: "Template gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar o template.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Start trial period
      const now = new Date().toISOString();
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          trial_start_date: now,
          selected_plan: formData.selected_plan,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Create landing page
      const title = `${formData.company_name} - ${formData.business_type} Landing Page`;
      const { error: landingPageError } = await supabase.from("landing_pages").insert({
        ...formData,
        profile_id: user.id,
        status: "draft",
        title,
        content: {
          template: generatedTemplate,
          images: formData.uploaded_images || [],
        },
      });

      if (landingPageError) throw landingPageError;

      toast({
        title: "Sucesso!",
        description: "Sua landing page está sendo gerada.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar landing page.",
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
      case 9:
        return (
          <PricingPlanStep
            selectedPlan={formData.selected_plan}
            onSelectPlan={handlePlanSelect}
          />
        );
      default:
        return null;
    }
  };

  const totalSteps = 9;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
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
        {step < totalSteps ? (
          <Button
            className="ml-auto"
            onClick={() => setStep((prev) => prev + 1)}
            disabled={step === 7 && !generatedTemplate}
          >
            Próximo
            <ChevronRight className="ml-2" />
          </Button>
        ) : (
          <Button
            className="ml-auto"
            onClick={handleSubmit}
            disabled={!formData.selected_plan || !generatedTemplate}
          >
            Criar Landing Page
            <Check className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
