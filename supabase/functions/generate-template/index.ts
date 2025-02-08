
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting template generation...');
    
    const { data } = await req.json()
    console.log('Received data:', data);

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
    
    The response should be a valid JSON object with these sections.`

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',  // Corrigido o nome do modelo
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a complete landing page template structure optimized for conversion' }
        ],
        temperature: 0.7,
      }),
    })

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json()
    console.log('OpenAI response received:', result);
    
    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error('Invalid response structure from OpenAI:', result);
      throw new Error('Failed to generate template content: Invalid response structure');
    }

    const template = result.choices[0].message.content
    console.log('Generated template:', template);

    // Validate JSON before sending response
    const parsedTemplate = JSON.parse(template);
    console.log('Template successfully parsed as JSON');

    return new Response(
      JSON.stringify({ template: parsedTemplate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-template function:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate template',
        details: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
