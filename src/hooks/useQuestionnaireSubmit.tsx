
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateTemplate } from "@/services/templateGeneration";
import type { QuestionnaireData } from "./useQuestionnaireState";

export const useQuestionnaireSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateTemplate = async (
    formData: QuestionnaireData,
    setGeneratedTemplate: (template: any) => void,
    setIsGenerating: (isGenerating: boolean) => void
  ) => {
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
      console.error("Error generating template:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar o template.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (formData: QuestionnaireData, generatedTemplate: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // Insert questionnaire data
      const { error: questionnaireError } = await supabase
        .from("questionnaires")
        .insert({
          profile_id: user.id,
          client_name: formData.client_name,
          company_name: formData.company_name,
          business_type: formData.business_type,
          objective: formData.objective,
          objective_other: formData.objective_other,
          offer_details: formData.offer_details,
          has_photos: formData.has_photos,
          uploaded_images: formData.uploaded_images,
          additional_comments: formData.additional_comments,
          company_history: formData.company_history,
          show_pricing: formData.show_pricing,
          pricing_details: formData.pricing_details,
          selected_plan: formData.selected_plan,
          generated_content: generatedTemplate,
          status: "draft"
        });

      if (questionnaireError) throw questionnaireError;

      // Update profile with selected plan
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          trial_start_date: new Date().toISOString(),
          selected_plan: formData.selected_plan,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Sucesso!",
        description: "Seu questionário foi salvo com sucesso.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar o questionário.",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateTemplate,
    handleSubmit,
  };
};
