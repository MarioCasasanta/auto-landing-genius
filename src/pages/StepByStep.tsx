
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StepByStep() {
  const steps = [
    {
      title: "1. Autenticação",
      tasks: [
        "Criar uma conta ou fazer login",
        "Verificar email (se necessário)",
        "Acessar a área do cliente"
      ]
    },
    {
      title: "2. Dashboard Principal",
      tasks: [
        "Visualizar landing pages criadas",
        "Verificar status das páginas",
        "Gerenciar assinatura atual",
        "Acessar informações do perfil"
      ]
    },
    {
      title: "3. Gerenciamento de Landing Pages",
      tasks: [
        "Criar nova landing page",
        "Editar landing pages existentes",
        "Visualizar landing pages publicadas",
        "Configurar domínio personalizado",
        "Gerenciar status (publicar/despublicar)"
      ]
    },
    {
      title: "4. Configurações de Domínio",
      tasks: [
        "Escolher subdomínio gratuito",
        "Configurar domínio próprio (opcional)",
        "Verificar status do SSL",
        "Gerenciar DNS (se necessário)"
      ]
    },
    {
      title: "5. Suporte",
      tasks: [
        "Acessar base de conhecimento",
        "Criar tickets de suporte",
        "Acompanhar status dos tickets",
        "Visualizar histórico de atendimentos"
      ]
    },
    {
      title: "6. Configurações da Conta",
      tasks: [
        "Atualizar informações do perfil",
        "Gerenciar método de pagamento",
        "Configurar preferências de notificação",
        "Revisar termos e políticas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Guia de Implementação - Área do Cliente
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Siga este guia passo a passo para implementar todas as funcionalidades da sua área do cliente.
        </p>
        
        <div className="grid gap-6">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {step.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-3">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-600">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Para qualquer dúvida durante a implementação, não hesite em entrar em contato com nossa equipe de suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
