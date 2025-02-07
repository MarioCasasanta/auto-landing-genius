
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("pages");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Auto Landing Genius - Documentação Técnica
      </h1>

      <Tabs defaultValue="pages" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="backend">Backend</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Página Inicial (/)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Função Principal</h3>
                  <p>Apresentar o Auto Landing Genius para novos usuários e converter visitantes em clientes.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Elementos de UI</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Hero Section</span>
                      <ul className="pl-4 mt-1">
                        <li>Título principal com value proposition</li>
                        <li>Subtítulo explicativo</li>
                        <li>CTA principal para iniciar questionário</li>
                        <li>CTA secundário para ver planos</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Features Section</span>
                      <ul className="pl-4 mt-1">
                        <li>Grid com principais funcionalidades</li>
                        <li>Ícones ilustrativos</li>
                        <li>Descrições sucintas</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Pricing Section</span>
                      <ul className="pl-4 mt-1">
                        <li>Cards de planos</li>
                        <li>Toggle mensal/anual</li>
                        <li>Botões de assinatura</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Interações</h3>
                  <ul className="list-disc pl-6">
                    <li>Navegação para o questionário inicial</li>
                    <li>Visualização e seleção de planos</li>
                    <li>Acesso à área de login/registro</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Dashboard (/dashboard)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Função Principal</h3>
                  <p>Central de controle para usuários gerenciarem suas landing pages e recursos.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Elementos de UI</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Sidebar Navigation</span>
                      <ul className="pl-4 mt-1">
                        <li>Links para todas as seções</li>
                        <li>Indicador de seção atual</li>
                        <li>Perfil do usuário</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Landing Pages Overview</span>
                      <ul className="pl-4 mt-1">
                        <li>Lista de landing pages</li>
                        <li>Status e métricas</li>
                        <li>Ações rápidas</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Editor (/dashboard/editor)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Função Principal</h3>
                  <p>Interface para criação e edição de landing pages.</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Elementos de UI</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <span className="font-medium">Barra de Ferramentas</span>
                      <ul className="pl-4 mt-1">
                        <li>Salvar/Publicar</li>
                        <li>Desfazer/Refazer</li>
                        <li>Visualização</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Painel de Elementos</span>
                      <ul className="pl-4 mt-1">
                        <li>Elementos arrastáveis</li>
                        <li>Categorias de elementos</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium">Área de Edição</span>
                      <ul className="pl-4 mt-1">
                        <li>Preview em tempo real</li>
                        <li>Grid de alinhamento</li>
                        <li>Indicadores de posição</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Estrutura do Banco de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Relacionamentos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">profiles</TableCell>
                      <TableCell>Armazena informações do perfil do usuário</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4">
                          <li>1:N com landing_pages</li>
                          <li>1:N com subscriptions</li>
                          <li>1:1 com admin_users</li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">landing_pages</TableCell>
                      <TableCell>Landing pages criadas pelos usuários</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4">
                          <li>N:1 com profiles</li>
                          <li>1:N com landing_page_elements</li>
                          <li>N:1 com templates (opcional)</li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">templates</TableCell>
                      <TableCell>Modelos predefinidos de landing pages</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4">
                          <li>1:N com landing_pages</li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend">
            <Card>
              <CardHeader>
                <CardTitle>Funcionalidades Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Autenticação</h3>
                  <p>Implementada usando Supabase Auth, com suporte para:</p>
                  <ul className="list-disc pl-6">
                    <li>Login com email/senha</li>
                    <li>Registro de novos usuários</li>
                    <li>Recuperação de senha</li>
                    <li>Controle de sessão</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Gerenciamento de Assinaturas</h3>
                  <p>Integração com Stripe para:</p>
                  <ul className="list-disc pl-6">
                    <li>Processamento de pagamentos</li>
                    <li>Gerenciamento de planos</li>
                    <li>Webhooks para atualizações de status</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Edge Functions</h3>
                  <p>Funções serverless para:</p>
                  <ul className="list-disc pl-6">
                    <li>Geração de conteúdo com IA</li>
                    <li>Processamento de templates</li>
                    <li>Integração com serviços externos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
