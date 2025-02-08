
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
    const { prompt } = await req.json()
    console.log('Received prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em landing pages. 
            Gere conteúdo otimizado para landing pages com base nas solicitações do usuário.
            O retorno DEVE sempre seguir exatamente esta estrutura JSON:
            {
              "hero": {
                "title": "Título principal",
                "description": "Descrição principal",
                "cta": "Texto do botão"
              },
              "features": [
                {
                  "title": "Título do recurso",
                  "description": "Descrição do recurso",
                  "icon": "nome-do-icone"
                }
              ],
              "testimonials": [
                {
                  "name": "Nome",
                  "role": "Cargo",
                  "content": "Depoimento"
                }
              ],
              "faq": {
                "questions": [
                  {
                    "question": "Pergunta",
                    "answer": "Resposta"
                  }
                ]
              }
            }`
          },
          { role: 'user', content: prompt }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error
      });
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const result = await response.json()
    console.log('OpenAI response:', result);

    const content = JSON.parse(result.choices[0].message.content)
    console.log('Parsed content:', content);

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
