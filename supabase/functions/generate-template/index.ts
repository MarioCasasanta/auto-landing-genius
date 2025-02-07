
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
    const { data } = await req.json()

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

    console.log('Generating template with data:', data);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate a complete landing page template structure optimized for conversion' }
        ],
        temperature: 0.7,
      }),
    })

    const result = await response.json()
    
    if (!result.choices || !result.choices[0]?.message?.content) {
      console.error('Invalid response from OpenAI:', result);
      throw new Error('Failed to generate template content');
    }

    const template = result.choices[0].message.content

    // Log the generated template for debugging
    console.log('Generated template:', template)

    return new Response(
      JSON.stringify({ template: JSON.parse(template) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate template: ' + error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
