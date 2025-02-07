import { supabase } from "@/integrations/supabase/client";

export interface TemplateGenerationData {
  client_name: string;
  company_name: string;
  business_type: string;
  objective: string;
  offer_details?: string;
  company_history?: string;
}

export async function generateTemplate(data: TemplateGenerationData) {
  try {
    const response = await supabase.functions.invoke('generate-template', {
      body: { data }
    });

    if (response.error) throw response.error;
    return response.data;
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
}