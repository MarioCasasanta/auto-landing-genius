
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessLog {
  timestamp: string;
  stage: string;
  status: 'start' | 'success' | 'error';
  details?: any;
}

const createLog = (stage: string, status: 'start' | 'success' | 'error', details?: any): ProcessLog => {
  return {
    timestamp: new Date().toISOString(),
    stage,
    status,
    details
  };
}

serve(async (req) => {
  const logs: ProcessLog[] = [];
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logs.push(createLog('initialization', 'start'));
    console.log('Starting template generation process...');
    
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      const error = 'OpenAI API key is not configured';
      logs.push(createLog('api_key_check', 'error', { error }));
      console.error(error);
      throw new Error(error);
    }
    logs.push(createLog('api_key_check', 'success'));
    console.log('API key validation successful');
    
    const { data } = await req.json()
    logs.push(createLog('request_parsing', 'success', { data }));
    console.log('Received data:', data);

    if (!data || !data.client_name || !data.company_name || !data.business_type || !data.objective) {
      const error = 'Missing required data for template generation';
      logs.push(createLog('data_validation', 'error', { 
        missing_fields: {
          client_name: !data?.client_name,
          company_name: !data?.company_name,
          business_type: !data?.business_type,
          objective: !data?.objective
        }
      }));
      console.error('Missing required data:', data);
      throw new Error(error);
    }
    logs.push(createLog('data_validation', 'success'));
    console.log('Data validation successful');

    const systemPrompt = `You are an expert landing page designer. Create a landing page template that follows this exact JSON structure:
{
  "landingPage": {
    "sections": {
      "hero": {
        "headline": "Compelling headline here",
        "description": "Engaging description here"
      },
      "features": {
        "benefit1": {
          "title": "First benefit title",
          "description": "First benefit description"
        },
        "benefit2": {
          "title": "Second benefit title",
          "description": "Second benefit description"
        },
        "benefit3": {
          "title": "Third benefit title",
          "description": "Third benefit description"
        }
      }
    }
  }
}

Use this information to generate the content:
- Client Name: ${data.client_name}
- Company: ${data.company_name}
- Business Type: ${data.business_type}
- Main Objective: ${data.objective}
${data.offer_details ? `- Offer Details: ${data.offer_details}` : ''}
${data.company_history ? `- Company History: ${data.company_history}` : ''}

Make sure the content is compelling and focused on the main objective. The response MUST follow the exact JSON structure shown above.`;

    logs.push(createLog('prompt_preparation', 'success', { systemPrompt }));
    console.log('System prompt prepared:', systemPrompt);

    const requestBody = {
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a complete landing page template structure optimized for conversion' }
      ],
      temperature: 0.7,
    };

    logs.push(createLog('openai_request', 'start', { requestBody }));
    console.log('Sending request to OpenAI:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text();
      logs.push(createLog('openai_response', 'error', { 
        status: response.status,
        error: errorData,
        statusText: response.statusText
      }));
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    logs.push(createLog('openai_response', 'success', { status: response.status }));
    console.log('OpenAI response status:', response.status);

    const result = await response.json()
    logs.push(createLog('response_parsing', 'success', { result }));
    console.log('OpenAI response received:', result);
    
    if (!result.choices || !result.choices[0]?.message?.content) {
      const error = 'Failed to generate template content: Invalid response structure';
      logs.push(createLog('content_validation', 'error', { result }));
      console.error('Invalid response structure from OpenAI:', result);
      throw new Error(error);
    }

    const template = result.choices[0].message.content
    logs.push(createLog('template_extraction', 'success', { template }));
    console.log('Generated template:', template);

    try {
      const parsedTemplate = JSON.parse(template);
      
      // Validate the template structure
      if (!parsedTemplate?.landingPage?.sections?.hero?.headline) {
        throw new Error('Generated template is missing required hero section structure');
      }
      
      logs.push(createLog('json_validation', 'success'));
      console.log('Template successfully parsed as JSON');

      logs.push(createLog('process_completion', 'success'));
      return new Response(
        JSON.stringify({ 
          template: parsedTemplate,
          logs: logs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (jsonError) {
      logs.push(createLog('json_validation', 'error', { error: jsonError.message }));
      console.error('Error parsing template JSON:', jsonError);
      throw new Error('Generated content is not valid JSON');
    }
  } catch (error) {
    logs.push(createLog('error_handling', 'error', { 
      error: error.message,
      stack: error.stack
    }));
    console.error('Error in generate-template function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate template',
        details: error.message,
        stack: error.stack,
        logs: logs
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
