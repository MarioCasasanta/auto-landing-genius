
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

    const systemPrompt = `You are an expert landing page copywriter. Based on the business information provided, create compelling content for a landing page. Follow this EXACT structure in your JSON response:

{
  "landingPage": {
    "sections": {
      "hero": {
        "headline": "Write a short, impactful headline that addresses the main pain point or value proposition",
        "description": "Write 1-2 sentences expanding on the headline and main benefit"
      },
      "features": {
        "benefit1": {
          "title": "Write a short benefit title focused on value to customer",
          "description": "Write 1-2 sentences explaining this benefit"
        },
        "benefit2": {
          "title": "Write a short benefit title focused on value to customer",
          "description": "Write 1-2 sentences explaining this benefit"
        },
        "benefit3": {
          "title": "Write a short benefit title focused on value to customer",
          "description": "Write 1-2 sentences explaining this benefit"
        }
      }
    }
  }
}

Business Information:
- Company Name: ${data.company_name}
- Business Type: ${data.business_type}
- Main Goal: ${data.objective}
${data.offer_details ? `- Special Offer/Details: ${data.offer_details}` : ''}
${data.company_history ? `- About the Company: ${data.company_history}` : ''}

Important Instructions:
1. Focus the content on the main goal: ${data.objective}
2. Use clear, direct language
3. Each section should build on the previous one
4. Keep the hero section focused on the main value proposition
5. Benefits should be specific and solution-oriented
6. DO NOT use placeholder text - write real, specific content
7. Return ONLY the JSON - no additional text or explanations

The response must strictly follow this JSON structure - no additional fields or modifications to the structure are allowed.`;

    logs.push(createLog('prompt_preparation', 'success', { systemPrompt }));
    console.log('System prompt prepared:', systemPrompt);

    const requestBody = {
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the landing page content following the exact structure provided.' }
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

    const result = await response.json()
    logs.push(createLog('openai_response', 'success', { result }));
    console.log('Raw OpenAI response:', result);

    if (!result.choices || !result.choices[0]?.message?.content) {
      const error = 'Failed to generate template content: Invalid response structure';
      logs.push(createLog('content_validation', 'error', { result }));
      console.error('Invalid response structure from OpenAI:', result);
      throw new Error(error);
    }

    let template = result.choices[0].message.content;
    
    // Remove any markdown code block markers if present
    template = template.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    logs.push(createLog('template_extraction', 'success', { template }));
    console.log('Cleaned template:', template);

    try {
      const parsedTemplate = JSON.parse(template);
      
      // Validate the template structure
      if (!parsedTemplate?.landingPage?.sections?.hero?.headline) {
        const error = 'Generated template is missing required hero section structure';
        logs.push(createLog('template_validation', 'error', { 
          error,
          template: parsedTemplate
        }));
        throw new Error(error);
      }
      
      if (!parsedTemplate?.landingPage?.sections?.features) {
        const error = 'Generated template is missing required features section';
        logs.push(createLog('template_validation', 'error', { 
          error,
          template: parsedTemplate
        }));
        throw new Error(error);
      }
      
      logs.push(createLog('json_validation', 'success'));
      console.log('Template successfully parsed and validated:', parsedTemplate);

      logs.push(createLog('process_completion', 'success'));
      return new Response(
        JSON.stringify({ 
          template: parsedTemplate,
          logs: logs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (jsonError) {
      logs.push(createLog('json_validation', 'error', { 
        error: jsonError.message,
        template
      }));
      console.error('Error parsing or validating template JSON:', jsonError);
      console.error('Problem template:', template);
      throw new Error('Generated content is not valid JSON or missing required structure');
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

