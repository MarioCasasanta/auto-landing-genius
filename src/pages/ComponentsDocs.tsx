
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const ComponentsDocs = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Documentação dos Componentes</h1>
      
      <Tabs defaultValue="landing-page">
        <TabsList className="mb-4">
          <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="auth">Autenticação</TabsTrigger>
          <TabsTrigger value="questionnaire">Questionário</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <TabsContent value="landing-page">
            <ComponentSection
              title="Hero"
              description="Componente principal da landing page que exibe a mensagem principal e call-to-action."
              props={[
                {
                  name: "children",
                  type: "React.ReactNode",
                  description: "Conteúdo do componente",
                },
              ]}
              stateDescription="Não possui estado interno"
              usage={`
import Hero from '@/components/Hero';

const LandingPage = () => {
  return (
    <Hero>
      <h1>Título Principal</h1>
      <p>Descrição</p>
    </Hero>
  );
};
              `}
              notes="Utiliza Tailwind CSS para estilização responsiva"
            />

            <ComponentSection
              title="Features"
              description="Seção que exibe os recursos principais do produto em um grid responsivo."
              props={[]}
              stateDescription="Não possui estado interno"
              usage={`
import Features from '@/components/Features';

const LandingPage = () => {
  return <Features />;
};
              `}
              notes="Os recursos são definidos estaticamente no componente"
            />

            <ComponentSection
              title="Pricing"
              description="Exibe os planos de preço disponíveis em um layout de cards."
              props={[]}
              stateDescription="Não possui estado interno"
              usage={`
import Pricing from '@/components/Pricing';

const LandingPage = () => {
  return <Pricing />;
};
              `}
              notes="Os planos são definidos estaticamente no componente"
            />
          </TabsContent>

          <TabsContent value="dashboard">
            <ComponentSection
              title="DashboardLayout"
              description="Layout principal do dashboard com navegação lateral e área de conteúdo."
              props={[
                {
                  name: "children",
                  type: "React.ReactNode",
                  description: "Conteúdo do dashboard",
                },
              ]}
              stateDescription="Não possui estado interno"
              usage={`
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1>Conteúdo do Dashboard</h1>
    </DashboardLayout>
  );
};
              `}
              notes="Utiliza react-router-dom para navegação"
            />

            <ComponentSection
              title="SwipeFileCard"
              description="Card que exibe informações de um swipe file com opções de visualização e exclusão."
              props={[
                {
                  name: "id",
                  type: "string",
                  description: "ID único do swipe file",
                },
                {
                  name: "title",
                  type: "string",
                  description: "Título do swipe file",
                },
                {
                  name: "description",
                  type: "string",
                  description: "Descrição do swipe file",
                },
                {
                  name: "category",
                  type: "string",
                  description: "Categoria do swipe file",
                },
                {
                  name: "file_url",
                  type: "string",
                  description: "URL do arquivo",
                },
                {
                  name: "deleteSwipeFile",
                  type: "UseMutationResult",
                  description: "Função de exclusão do swipe file",
                },
              ]}
              stateDescription="Não possui estado interno"
              usage={`
import { SwipeFileCard } from '@/components/dashboard/swipe-files/SwipeFileCard';

const SwipeFiles = () => {
  const deleteSwipeFile = useMutation({
    mutationFn: (id: string) => deleteFile(id),
  });

  return (
    <SwipeFileCard
      id="123"
      title="Exemplo"
      description="Descrição"
      category="Marketing"
      file_url="https://exemplo.com/arquivo.pdf"
      deleteSwipeFile={deleteSwipeFile}
    />
  );
};
              `}
              notes="Utiliza react-query para gerenciamento de estado"
            />
          </TabsContent>

          <TabsContent value="auth">
            <ComponentSection
              title="Auth"
              description="Página de autenticação com opções de login e registro."
              props={[]}
              stateDescription={`
- email: string - Email do usuário
- password: string - Senha do usuário
- isLoading: boolean - Estado de carregamento
              `}
              usage={`
import Auth from '@/pages/Auth';

const App = () => {
  return <Auth />;
};
              `}
              notes="Integração com Supabase para autenticação"
            />
          </TabsContent>

          <TabsContent value="questionnaire">
            <ComponentSection
              title="LandingPageQuestionnaire"
              description="Questionário em etapas para criação de landing page."
              props={[]}
              stateDescription={`
- step: number - Etapa atual do questionário
- formData: object - Dados do formulário
- isGenerating: boolean - Estado de geração do template
              `}
              usage={`
import LandingPageQuestionnaire from '@/components/LandingPageQuestionnaire';

const Questionnaire = () => {
  return <LandingPageQuestionnaire />;
};
              `}
              notes="Utiliza hooks personalizados para gerenciamento de estado"
            />
          </TabsContent>

          <TabsContent value="admin">
            <ComponentSection
              title="AdminLayout"
              description="Layout principal da área administrativa."
              props={[
                {
                  name: "children",
                  type: "React.ReactNode",
                  description: "Conteúdo da área administrativa",
                },
              ]}
              stateDescription="Não possui estado interno"
              usage={`
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  return (
    <AdminLayout>
      <h1>Área Administrativa</h1>
    </AdminLayout>
  );
};
              `}
              notes="Utiliza react-router-dom para navegação"
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

interface ComponentSectionProps {
  title: string;
  description: string;
  props: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  stateDescription: string;
  usage: string;
  notes: string;
}

const ComponentSection = ({
  title,
  description,
  props,
  stateDescription,
  usage,
  notes,
}: ComponentSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Descrição</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {props.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Props</h3>
            <div className="space-y-2">
              {props.map((prop) => (
                <div key={prop.name} className="text-sm">
                  <span className="font-mono text-primary">{prop.name}</span>:{" "}
                  <span className="text-muted-foreground">{prop.type}</span>
                  <p className="text-sm text-muted-foreground ml-4">
                    {prop.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-2">Estado Interno</h3>
          <pre className="text-sm bg-muted p-2 rounded-md">
            {stateDescription}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Exemplo de Uso</h3>
          <pre className="text-sm bg-muted p-2 rounded-md overflow-x-auto">
            {usage}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Notas Adicionais</h3>
          <p className="text-muted-foreground">{notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentsDocs;
