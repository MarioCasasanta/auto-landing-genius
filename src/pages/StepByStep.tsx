
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  name: string;
  status: 'not_started' | 'in_progress' | 'completed';
  id?: string;
}

interface Step {
  title: string;
  tasks: Task[];
}

export default function StepByStep() {
  const [steps, setSteps] = useState<Step[]>([
    {
      title: "1. Autenticação",
      tasks: [
        { name: "Criar uma conta ou fazer login", status: "not_started" },
        { name: "Verificar email (se necessário)", status: "not_started" },
        { name: "Acessar a área do cliente", status: "not_started" }
      ]
    },
    {
      title: "2. Dashboard Principal",
      tasks: [
        { name: "Visualizar landing pages criadas", status: "not_started" },
        { name: "Verificar status das páginas", status: "not_started" },
        { name: "Gerenciar assinatura atual", status: "not_started" },
        { name: "Acessar informações do perfil", status: "not_started" }
      ]
    },
    {
      title: "3. Gerenciamento de Landing Pages",
      tasks: [
        { name: "Criar nova landing page", status: "not_started" },
        { name: "Editar landing pages existentes", status: "not_started" },
        { name: "Visualizar landing pages publicadas", status: "not_started" },
        { name: "Configurar domínio personalizado", status: "not_started" },
        { name: "Gerenciar status (publicar/despublicar)", status: "not_started" }
      ]
    },
    {
      title: "4. Configurações de Domínio",
      tasks: [
        { name: "Escolher subdomínio gratuito", status: "not_started" },
        { name: "Configurar domínio próprio (opcional)", status: "not_started" },
        { name: "Verificar status do SSL", status: "not_started" },
        { name: "Gerenciar DNS (se necessário)", status: "not_started" }
      ]
    },
    {
      title: "5. Suporte",
      tasks: [
        { name: "Acessar base de conhecimento", status: "not_started" },
        { name: "Criar tickets de suporte", status: "not_started" },
        { name: "Acompanhar status dos tickets", status: "not_started" },
        { name: "Visualizar histórico de atendimentos", status: "not_started" }
      ]
    },
    {
      title: "6. Configurações da Conta",
      tasks: [
        { name: "Atualizar informações do perfil", status: "not_started" },
        { name: "Gerenciar método de pagamento", status: "not_started" },
        { name: "Configurar preferências de notificação", status: "not_started" },
        { name: "Revisar termos e políticas", status: "not_started" }
      ]
    }
  ]);
  const { toast } = useToast();

  const updateTaskStatus = async (stepIndex: number, taskIndex: number) => {
    const newSteps = [...steps];
    const currentStatus = newSteps[stepIndex].tasks[taskIndex].status;
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    
    newSteps[stepIndex].tasks[taskIndex].status = newStatus;
    setSteps(newSteps);
    
    toast({
      title: "Status atualizado",
      description: newStatus === 'completed' ? "Tarefa marcada como concluída!" : "Tarefa desmarcada.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Guia de Implementação - Área do Cliente
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Siga este guia passo a passo para implementar todas as funcionalidades da sua área do cliente.
          Clique nas tarefas para marcá-las como concluídas.
        </p>
        
        <div className="grid gap-6">
          {steps.map((step, stepIndex) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {step.tasks.map((task, taskIndex) => (
                    <li 
                      key={`${stepIndex}-${taskIndex}`}
                      className="flex items-start gap-3"
                    >
                      <button
                        onClick={() => updateTaskStatus(stepIndex, taskIndex)}
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          task.status === 'completed' 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-primary/10 hover:bg-primary/20'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <span className={`text-gray-600 ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {task.name}
                      </span>
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
