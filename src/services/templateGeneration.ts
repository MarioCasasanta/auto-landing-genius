
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
      throw new Error(response.error.message || 'Failed to generate template');
    }

    if (!response.data?.template) {
      console.error('Invalid template response:', response.data);
      throw new Error('Invalid template response from server');
    }

    console.log('Generated template:', response.data.template);
    return response.data.template;
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
}
