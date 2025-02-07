
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

  return {
    handleGenerateTemplate,
    handleSubmit,
  };
};
