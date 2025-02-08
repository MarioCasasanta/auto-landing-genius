
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
    
    const { data } = await req.json()
    logs.push(createLog('request_parsing', 'success', { data }));

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
      throw new Error(error);
    }
    logs.push(createLog('data_validation', 'success'));

    const systemPrompt = `You are an expert landing page copywriter focused on creating content for professional service providers (doctors, lawyers, nutritionists, etc). Based on the business information provided, create compelling content for a landing page. Follow this EXACT structure in your JSON response:

{
  "landingPage": {
    "sections": {
      "hero": {
        "headline": "Write a clear and impactful headline that highlights the main value proposition",
        "subheadline": "Write a supporting statement that expands on the main value proposition",
        "description": "Write 2-3 sentences explaining the services offered and their benefits"
      },
      "services": {
        "title": "Write a title for the services section",
        "description": "Write a brief introduction to the services",
        "items": [
          {
            "title": "Write a service title",
            "description": "Write a brief description of this service"
          },
          {
            "title": "Write a service title",
            "description": "Write a brief description of this service"
          },
          {
            "title": "Write a service title",
            "description": "Write a brief description of this service"
          }
        ]
      },
      "benefits": {
        "title": "Write a title for the benefits section",
        "items": [
          {
            "title": "Write a benefit title",
            "description": "Write a brief description of this benefit"
          },
          {
            "title": "Write a benefit title",
            "description": "Write a brief description of this benefit"
          },
          {
            "title": "Write a benefit title",
            "description": "Write a brief description of this benefit"
          }
        ]
      },
      "testimonials": {
        "title": "Write a title for the testimonials section",
        "items": [
          {
            "quote": "Write a compelling testimonial quote",
            "author": "Write a client name",
            "role": "Write the client's role or description"
          },
          {
            "quote": "Write a compelling testimonial quote",
            "author": "Write a client name",
            "role": "Write the client's role or description"
          }
        ]
      },
      "cta": {
        "headline": "Write a compelling call-to-action headline",
        "description": "Write a brief description encouraging action",
        "buttonText": "Write the button text",
        "contactInfo": {
          "address": "Write a professional address format",
          "phone": "Write a phone number format",
          "email": "Write a professional email format",
          "socialMedia": {
            "instagram": "Write an Instagram handle",
            "linkedin": "Write a LinkedIn profile URL format"
          }
        }
      }
    }
  }
}

Business Information:
- Professional Name: ${data.client_name}
- Business Name: ${data.company_name}
- Professional Area: ${data.business_type}
- Main Goal: ${data.objective}
${data.offer_details ? `- Service Details: ${data.offer_details}` : ''}
${data.company_history ? `- Professional Background: ${data.company_history}` : ''}

Important Instructions:
1. Focus on creating professional, trustworthy content
2. Emphasize expertise and credibility
3. Use clear, direct language that builds trust
4. Ensure all content aligns with professional service standards
5. DO NOT use placeholder text - write real, specific content
6. Return ONLY the JSON - no additional text or explanations

The response must strictly follow this JSON structure - no additional fields or modifications to the structure are allowed.`;

    logs.push(createLog('prompt_preparation', 'success', { systemPrompt }));

    const requestBody = {
      model: "gpt-4",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the landing page content following the exact structure provided.' }
      ],
      temperature: 0.7,
    };

    logs.push(createLog('openai_request', 'start', { requestBody }));

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
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json()
    logs.push(createLog('openai_response', 'success', { result }));

    if (!result.choices || !result.choices[0]?.message?.content) {
      const error = 'Failed to generate template content: Invalid response structure';
      logs.push(createLog('content_validation', 'error', { result }));
      throw new Error(error);
    }

    let template = result.choices[0].message.content;
    template = template.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    logs.push(createLog('template_extraction', 'success', { template }));

    try {
      const parsedTemplate = JSON.parse(template);
      
      // Validate the template structure
      if (!parsedTemplate?.landingPage?.sections?.hero) {
        throw new Error('Generated template is missing required hero section');
      }
      
      if (!parsedTemplate?.landingPage?.sections?.services) {
        throw new Error('Generated template is missing required services section');
      }

      if (!parsedTemplate?.landingPage?.sections?.benefits) {
        throw new Error('Generated template is missing required benefits section');
      }

      if (!parsedTemplate?.landingPage?.sections?.testimonials) {
        throw new Error('Generated template is missing required testimonials section');
      }

      if (!parsedTemplate?.landingPage?.sections?.cta) {
        throw new Error('Generated template is missing required CTA section');
      }
      
      logs.push(createLog('json_validation', 'success'));
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
      throw new Error('Generated content is not valid JSON or missing required structure');
    }
  } catch (error) {
    logs.push(createLog('error_handling', 'error', { 
      error: error.message,
      stack: error.stack
    }));
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
