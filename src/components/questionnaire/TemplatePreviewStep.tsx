import React from "react";
import { Button } from "@/components/ui/button";
import TemplatePreview from "../TemplatePreview";

interface TemplatePreviewStepProps {
  generatedTemplate: any;
  isGenerating: boolean;
  handleGenerateTemplate: () => void;
}

export default function TemplatePreviewStep({
  generatedTemplate,
  isGenerating,
  handleGenerateTemplate,
}: TemplatePreviewStepProps) {
  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">Template Preview</h2>
      <p className="text-muted-foreground">
        Review and select the AI-generated template for your landing page.
      </p>
      
      <Button
        onClick={handleGenerateTemplate}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate Template"}
      </Button>

      {generatedTemplate && (
        <div className="mt-6">
          <TemplatePreview
            template={generatedTemplate}
            isSelected={true}
            onSelect={() => {}}
          />
        </div>
      )}
    </div>
  );
}