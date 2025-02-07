
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const initialSteps = [
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

  useEffect(() => {
    const initializeProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: existingProgress, error: fetchError } = await supabase
          .from('implementation_progress')
          .select('*')
          .eq('profile_id', user.id);

        if (fetchError) throw fetchError;

        if (!existingProgress?.length) {
          // Initialize progress for all tasks with proper typing
          const progressData = initialSteps.flatMap((step, stepIndex) =>
            step.tasks.map(task => ({
              profile_id: user.id,
              step_number: stepIndex + 1,
              step_title: step.title,
              task_name: task,
              status: 'not_started' as const
            }))
          );

          const { error: insertError } = await supabase
            .from('implementation_progress')
            .insert(progressData);

          if (insertError) throw insertError;

          // Fetch the newly created progress
          const { data: newProgress, error: newFetchError } = await supabase
            .from('implementation_progress')
            .select('*')
            .eq('profile_id', user.id);

          if (newFetchError) throw newFetchError;
          
          mapProgressToSteps(newProgress || []);
        } else {
          mapProgressToSteps(existingProgress);
        }
      } catch (error) {
        console.error('Error initializing progress:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o progresso da implementação.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [toast]);

  const mapProgressToSteps = (progress: any[]) => {
    const mappedSteps = initialSteps.map((step, stepIndex) => ({
      title: step.title,
      tasks: step.tasks.map(taskName => {
        const progressEntry = progress.find(
          p => p.step_number === stepIndex + 1 && p.task_name === taskName
        );
        return {
          name: taskName,
          status: progressEntry?.status || 'not_started',
          id: progressEntry?.id
        };
      })
    }));
    setSteps(mappedSteps);
  };

  const updateTaskStatus = async (taskId: string, currentStatus: 'not_started' | 'in_progress' | 'completed') => {
    try {
      const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
      
      const { error } = await supabase
        .from('implementation_progress')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', taskId);

      if (error) throw error;

      setSteps(currentSteps =>
        currentSteps.map(step => ({
          ...step,
          tasks: step.tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        }))
      );

      toast({
        title: "Sucesso",
        description: newStatus === 'completed' ? "Tarefa marcada como concluída!" : "Tarefa desmarcada.",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da tarefa.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-2/3 mx-auto" />
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-6 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {step.tasks.map((task) => (
                    <li 
                      key={task.id} 
                      className="flex items-start gap-3"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 rounded-full ${
                          task.status === 'completed' 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'bg-primary/10 hover:bg-primary/20'
                        }`}
                        onClick={() => task.id && updateTaskStatus(task.id, task.status)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
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
