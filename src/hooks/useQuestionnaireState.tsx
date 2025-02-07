
import { useState } from "react";

export interface QuestionnaireData {
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

export const useQuestionnaireState = () => {
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

  return {
    step,
    setStep,
    formData,
    setFormData,
    generatedTemplate,
    setGeneratedTemplate,
    isGenerating,
    setIsGenerating,
    handleInputChange,
    handleObjectiveChange,
    handlePhotoChange,
    handlePricingChange,
    handlePlanSelect,
    handleImageUpload,
  };
};
