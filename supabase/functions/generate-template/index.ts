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

    // Generate a system prompt based on the data
    const systemPrompt = `You are an expert landing page designer. Create a landing page template based on the following information:
    - Company: ${data.company_name}
    - Business Type: ${data.business_type}
    - Main Objective: ${data.objective}
    ${data.offer_details ? `- Offer Details: ${data.offer_details}` : ''}
    ${data.company_history ? `- Company History: ${data.company_history}` : ''}
    
    Generate a JSON structure that includes sections for hero, features, testimonials, and call-to-action.`

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
          { role: 'user', content: 'Generate a landing page template structure' }
        ],
      }),
    })

    const result = await response.json()
    const template = result.choices[0].message.content

    return new Response(
      JSON.stringify({ template: JSON.parse(template) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate template' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})