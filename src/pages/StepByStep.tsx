
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
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
      title: "I. Site Público",
      tasks: [
        { name: "Página Inicial - Banner Principal", status: "completed" },
        { name: "Seção 'Como Funciona' (3 Passos)", status: "completed" },
        { name: "Seção 'Templates'", status: "completed" },
        { name: "Seção 'Planos e Preços' (4 Planos)", status: "completed" },
        { name: "Seção 'Depoimentos'", status: "completed" },
        { name: "Seção 'FAQ'", status: "completed" },
        { name: "Rodapé", status: "completed" },
        { name: "Página de Funcionalidades", status: "not_started" },
        { name: "Página de Templates - Galeria", status: "completed" },
        { name: "Página de Questionário (8 páginas)", status: "completed" },
        { name: "Página de Escolha de Domínio", status: "not_started" },
        { name: "Página de Planos e Preços Detalhada", status: "completed" },
        { name: "Termos de Uso e Política de Privacidade", status: "not_started" }
      ]
    },
    {
      title: "II. Área do Cliente",
      tasks: [
        { name: "Dashboard Principal", status: "completed" },
        { name: "Editor de Landing Page (Templates e Assets)", status: "completed" },
        { name: "Editor de Landing Page (IA)", status: "completed" },
        { name: "Configurações de Domínio", status: "not_started" },
        { name: "Configurações de E-mail (Futuro)", status: "not_started" },
        { name: "Área de Suporte", status: "not_started" }
      ]
    },
    {
      title: "III. Backend e Funcionalidades Internas",
      tasks: [
        { name: "IA Engine para Geração de Landing Pages", status: "completed" },
        { name: "Biblioteca de Swiper Files", status: "completed" },
        { name: "Lógica do Questionário", status: "completed" },
        { name: "Sistema de Templates", status: "completed" },
        { name: "Autenticação e Gerenciamento de Usuários", status: "completed" },
        { name: "Processamento de Pagamentos e Assinaturas", status: "not_started" },
        { name: "Sistema de Gerenciamento de Domínios", status: "not_started" },
        { name: "Infraestrutura de Hospedagem", status: "completed" },
        { name: "Sistema de Análise e Relatórios (Futuro)", status: "not_started" }
      ]
    },
    {
      title: "IV. Dashboard Administrativo",
      tasks: [
        { name: "Gerenciamento de Usuários", status: "not_started" },
        { name: "Gerenciamento de Landing Pages", status: "not_started" },
        { name: "Gerenciamento de Templates", status: "completed" },
        { name: "Gerenciamento de Swiper Files", status: "completed" },
        { name: "Gerenciamento de Depoimentos", status: "completed" },
        { name: "Gerenciamento de FAQs", status: "completed" },
        { name: "Gerenciamento de Planos de Assinatura", status: "not_started" },
        { name: "Gerenciamento de Assinaturas e Pagamentos", status: "not_started" },
        { name: "Configurações Gerais da Plataforma", status: "not_started" }
      ]
    },
    {
      title: "V. Sistema de Criação de Landing Pages",
      tasks: [
        { name: "Questionário de Coleta de Informações", status: "completed" },
        { name: "Geração de Template com IA", status: "completed" },
        { name: "Editor Visual de Landing Pages", status: "completed" },
        { name: "Sistema de Preview em Tempo Real", status: "completed" },
        { name: "Gerenciamento de Assets e Mídia", status: "completed" },
        { name: "Sistema de Publicação", status: "completed" },
        { name: "Personalização de Domínio", status: "not_started" },
        { name: "Analytics e Métricas (Futuro)", status: "not_started" }
      ]
    }
  ]);

  const { toast } = useToast();

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('implementationProgress');
    if (savedProgress) {
      setSteps(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('implementationProgress', JSON.stringify(steps));
  }, [steps]);

  const updateTaskStatus = (stepIndex: number, taskIndex: number) => {
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

  // Calculate progress statistics
  const totalTasks = steps.reduce((acc, step) => acc + step.tasks.length, 0);
  const completedTasks = steps.reduce((acc, step) => 
    acc + step.tasks.filter(task => task.status === 'completed').length, 0
  );
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">
          Progresso de Implementação - Auto Landing Genius
        </h1>
        
        <div className="bg-white rounded-lg p-4 mb-8 shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium">Progresso Geral</span>
            <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 text-center">
            {completedTasks} de {totalTasks} tarefas concluídas
          </div>
        </div>
        
        <div className="grid gap-6">
          {steps.map((step, stepIndex) => {
            const stepCompletedTasks = step.tasks.filter(task => task.status === 'completed').length;
            const stepProgress = Math.round((stepCompletedTasks / step.tasks.length) * 100);
            
            return (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <span className="text-sm font-medium text-primary">
                      {stepProgress}% ({stepCompletedTasks}/{step.tasks.length})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stepProgress}%` }}
                    ></div>
                  </div>
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
                              : task.status === 'in_progress'
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
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
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Clique nas tarefas para marcar/desmarcar como concluídas. O progresso é salvo automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
