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
    console.log('Generating template with data:', data);
    
    const response = await supabase.functions.invoke('generate-template', {
      body: { data }
    });

    if (response.error) {
      console.error('Template generation error:', response.error);
      throw response.error;
    }

    console.log('Generated template:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
}