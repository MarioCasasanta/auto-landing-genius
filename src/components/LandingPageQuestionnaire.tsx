
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";
import { useQuestionnaireSubmit } from "@/hooks/useQuestionnaireSubmit";

import InitialInfoStep from "./questionnaire/InitialInfoStep";
import ObjectiveStep from "./questionnaire/ObjectiveStep";
import OfferDetailsStep from "./questionnaire/OfferDetailsStep";
import VisualsStep from "./questionnaire/VisualsStep";
import AdditionalInfoStep from "./questionnaire/AdditionalInfoStep";
import CompanyHistoryStep from "./questionnaire/CompanyHistoryStep";
import TemplatePreviewStep from "./questionnaire/TemplatePreviewStep";
import PricingStep from "./questionnaire/PricingStep";
import PricingPlanStep from "./questionnaire/PricingPlanStep";

export default function LandingPageQuestionnaire() {
  const {
    step,
    setStep,
    formData,
    generatedTemplate,
    isGenerating,
    setGeneratedTemplate,
    setIsGenerating,
    handleInputChange,
    handleObjectiveChange,
    handlePhotoChange,
    handlePricingChange,
    handlePlanSelect,
    handleImageUpload,
  } = useQuestionnaireState();

  const { handleGenerateTemplate, handleSubmit } = useQuestionnaireSubmit();

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
            handleGenerateTemplate={() =>
              handleGenerateTemplate(formData, setGeneratedTemplate, setIsGenerating)
            }
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
            onClick={() => handleSubmit(formData, generatedTemplate)}
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
