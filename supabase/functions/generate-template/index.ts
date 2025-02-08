
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

    const systemPrompt = `Você é um copywriter especializado em criar landing pages para profissionais liberais (médicos, advogados, nutricionistas, etc). Com base nas informações fornecidas sobre o negócio, crie um conteúdo envolvente para uma landing page seguindo EXATAMENTE esta estrutura JSON:

{
  "landingPage": {
    "sections": {
      "hero": {
        "headline": "Um título principal impactante que transmita a principal proposta de valor (máximo 10 palavras)",
        "subheadline": "Um subtítulo que expanda a proposta de valor principal (máximo 15 palavras)",
        "description": "2-3 frases explicando os serviços oferecidos e seus benefícios"
      },
      "services": {
        "title": "Um título atraente para a seção de serviços",
        "description": "Uma breve introdução aos serviços oferecidos",
        "items": [
          {
            "title": "Nome do serviço principal",
            "description": "Descrição detalhada deste serviço"
          },
          {
            "title": "Nome do segundo serviço mais importante",
            "description": "Descrição detalhada deste serviço"
          },
          {
            "title": "Nome do terceiro serviço mais importante",
            "description": "Descrição detalhada deste serviço"
          }
        ]
      },
      "benefits": {
        "title": "Um título persuasivo para a seção de benefícios",
        "items": [
          {
            "title": "Primeiro benefício/diferencial importante",
            "description": "Explicação do benefício focada em resultados"
          },
          {
            "title": "Segundo benefício/diferencial importante",
            "description": "Explicação do benefício focada em resultados"
          },
          {
            "title": "Terceiro benefício/diferencial importante",
            "description": "Explicação do benefício focada em resultados"
          }
        ]
      },
      "testimonials": {
        "title": "Um título envolvente para a seção de depoimentos",
        "items": [
          {
            "quote": "Um depoimento real e impactante",
            "author": "Nome do cliente",
            "role": "Descrição relevante do cliente"
          },
          {
            "quote": "Outro depoimento convincente",
            "author": "Nome do cliente",
            "role": "Descrição relevante do cliente"
          }
        ]
      },
      "cta": {
        "headline": "Uma chamada para ação persuasiva",
        "description": "Uma descrição que incentive a ação imediata",
        "buttonText": "Texto do botão de ação principal",
        "contactInfo": {
          "address": "Endereço profissional completo",
          "phone": "Número de telefone profissional",
          "email": "Email profissional",
          "socialMedia": {
            "instagram": "Handle do Instagram",
            "linkedin": "URL do perfil do LinkedIn"
          }
        }
      }
    }
  }
}

Informações do Profissional:
- Nome: ${data.client_name}
- Nome da Empresa: ${data.company_name}
- Área de Atuação: ${data.business_type}
- Objetivo Principal: ${data.objective}
${data.offer_details ? `- Detalhes dos Serviços: ${data.offer_details}` : ''}
${data.company_history ? `- Histórico Profissional: ${data.company_history}` : ''}

Instruções Importantes:
1. Crie conteúdo profissional e que transmita confiança
2. Enfatize a expertise e credibilidade do profissional
3. Use linguagem clara e direta que construa confiança
4. Certifique-se de que todo o conteúdo esteja alinhado com padrões profissionais
5. NÃO use textos genéricos - escreva conteúdo específico e relevante
6. Retorne APENAS o JSON - sem texto ou explicações adicionais

A resposta deve seguir ESTRITAMENTE esta estrutura JSON - não são permitidos campos adicionais ou modificações na estrutura.`;

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
      
      // Validação rigorosa da estrutura do template
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
