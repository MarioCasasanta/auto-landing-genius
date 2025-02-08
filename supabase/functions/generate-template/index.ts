
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
      logs.push(createLog('data_validation', 'error', { error }));
      console.error('Missing data:', data);
      throw new Error(error);
    }
    logs.push(createLog('data_validation', 'success'));
    console.log('Data validation successful');

    const systemPrompt = `You are an expert landing page designer. Create a complete landing page template based on the following information:
    - Client Name: ${data.client_name}
    - Company: ${data.company_name}
    - Business Type: ${data.business_type}
    - Main Objective: ${data.objective}
    ${data.offer_details ? `- Offer Details: ${data.offer_details}` : ''}
    ${data.company_history ? `- Company History: ${data.company_history}` : ''}
    
    Generate a JSON structure that includes:
    1. Hero section with compelling headline and description
    2. Features section highlighting main benefits
    3. About section using company history if available
    4. Call-to-action sections optimized for the main objective
    5. Testimonials section structure
    6. Contact/Form section based on the objective
    
    Return ONLY a valid JSON object with these sections and nothing else. Do not include any explanations or comments outside the JSON.`;

    logs.push(createLog('prompt_preparation', 'success', { systemPrompt }));
    console.log('System prompt prepared');

    const requestBody = {
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a complete landing page template structure optimized for conversion' }
      ],
      temperature: 0.7,
    };

    logs.push(createLog('openai_request', 'start'));
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
        error: errorData 
      }));
      console.error('OpenAI API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json()
    logs.push(createLog('openai_response', 'success', { result }));
    console.log('OpenAI response received:', result);

    if (!result.choices || !result.choices[0]?.message?.content) {
      const error = 'Invalid response structure from OpenAI';
      logs.push(createLog('content_validation', 'error', { result }));
      console.error(error, result);
      throw new Error(error);
    }

    const template = result.choices[0].message.content
    logs.push(createLog('template_extraction', 'success'));
    console.log('Generated template:', template);

    try {
      const parsedTemplate = JSON.parse(template);
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
      console.error('JSON parsing error:', jsonError);
      throw new Error('Generated content is not valid JSON');
    }
  } catch (error) {
    logs.push(createLog('error_handling', 'error', { 
      error: error.message,
      stack: error.stack
    }));
    console.error('Error in generate-template function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate template',
        details: error.message,
        logs: logs
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
