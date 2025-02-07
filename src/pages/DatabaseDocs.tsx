
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableRelation {
  table: string;
  pages: string[];
  description: string;
  operations: string[];
}

export default function DatabaseDocs() {
  const tableRelations: TableRelation[] = [
    {
      table: "profiles",
      pages: ["/auth", "/dashboard", "/dashboard/settings"],
      description: "Armazena informações do perfil do usuário",
      operations: ["Criado após autenticação", "Leitura no dashboard", "Atualização nas configurações"]
    },
    {
      table: "landing_pages",
      pages: ["/dashboard/editor", "/questionnaire", "/dashboard"],
      description: "Armazena as landing pages criadas pelos usuários",
      operations: ["Criação via questionário", "Edição no editor", "Listagem no dashboard"]
    },
    {
      table: "landing_page_elements",
      pages: ["/dashboard/editor"],
      description: "Armazena os elementos individuais de cada landing page",
      operations: ["Criação/edição no editor", "Leitura durante preview"]
    },
    {
      table: "templates",
      pages: ["/templates", "/dashboard/editor", "/admin/templates"],
      description: "Modelos de landing pages disponíveis",
      operations: ["Listagem na galeria", "Seleção no editor", "Gerenciamento no admin"]
    },
    {
      table: "implementation_progress",
      pages: ["/step-by-step"],
      description: "Acompanhamento do progresso de implementação",
      operations: ["Leitura e atualização na página de progresso"]
    },
    {
      table: "admin_users",
      pages: ["/admin/*"],
      description: "Usuários com privilégios administrativos",
      operations: ["Verificação de permissões em áreas admin"]
    },
    {
      table: "payment_plans",
      pages: ["/pricing", "/dashboard/settings/billing", "/admin/plans"],
      description: "Planos de pagamento disponíveis",
      operations: ["Exibição na página de preços", "Seleção nas configurações", "Gerenciamento no admin"]
    },
    {
      table: "subscriptions",
      pages: ["/dashboard/settings/billing", "/admin/subscriptions"],
      description: "Assinaturas dos usuários",
      operations: ["Criação/atualização nas configurações", "Gerenciamento no admin"]
    },
    {
      table: "support_tickets",
      pages: ["/dashboard/support", "/admin/support"],
      description: "Tickets de suporte",
      operations: ["Criação/visualização pelo usuário", "Gerenciamento no admin"]
    },
    {
      table: "swipe_files",
      pages: ["/dashboard/swipe-files", "/admin/swipe-files"],
      description: "Arquivos de swipe (exemplos e inspirações)",
      operations: ["Visualização no dashboard", "Gerenciamento no admin"]
    }
  ];

  const tables = [
    {
      name: "profiles",
      description: "Armazena informações do perfil do usuário",
      relationships: [
        "Referenciado por admin_users.profile_id",
        "Referenciado por implementation_progress.profile_id",
        "Referenciado por landing_pages.profile_id",
        "Referenciado por subscriptions.profile_id",
        "Referenciado por support_tickets.profile_id",
        "Referenciado por swipe_files.profile_id"
      ]
    },
    {
      name: "landing_pages",
      description: "Armazena as landing pages criadas pelos usuários",
      relationships: [
        "Relacionado com profiles através de profile_id",
        "Relacionado com templates através de template_id (opcional)",
        "Referenciado por landing_page_elements.landing_page_id"
      ]
    },
    {
      name: "landing_page_elements",
      description: "Armazena os elementos individuais de cada landing page",
      relationships: [
        "Relacionado com landing_pages através de landing_page_id"
      ]
    },
    {
      name: "templates",
      description: "Modelos de landing pages disponíveis",
      relationships: [
        "Referenciado por landing_pages.template_id"
      ]
    },
    {
      name: "implementation_progress",
      description: "Acompanhamento do progresso de implementação",
      relationships: [
        "Relacionado com profiles através de profile_id"
      ]
    },
    {
      name: "admin_users",
      description: "Usuários com privilégios administrativos",
      relationships: [
        "Relacionado com profiles através de profile_id"
      ]
    },
    {
      name: "payment_plans",
      description: "Planos de pagamento disponíveis",
      relationships: [
        "Referenciado indiretamente por subscriptions através do plan_type"
      ]
    },
    {
      name: "subscriptions",
      description: "Assinaturas dos usuários",
      relationships: [
        "Relacionado com profiles através de profile_id",
        "Relacionado com payment_plans através do plan_type"
      ]
    },
    {
      name: "support_tickets",
      description: "Tickets de suporte",
      relationships: [
        "Relacionado com profiles através de profile_id"
      ]
    },
    {
      name: "swipe_files",
      description: "Arquivos de swipe (exemplos e inspirações)",
      relationships: [
        "Relacionado com profiles através de profile_id"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Documentação do Banco de Dados
        </h1>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                O banco de dados é estruturado em torno da tabela principal "profiles", que mantém as informações básicas dos usuários. 
                Cada perfil pode ter múltiplas landing pages, tickets de suporte, e outras entidades relacionadas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mapeamento Tabelas x Páginas</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Páginas</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Operações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableRelations.map((relation) => (
                      <TableRow key={relation.table}>
                        <TableCell className="font-medium">{relation.table}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside">
                            {relation.pages.map((page, index) => (
                              <li key={index} className="text-sm text-gray-600">{page}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>{relation.description}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside">
                            {relation.operations.map((op, index) => (
                              <li key={index} className="text-sm text-gray-600">{op}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabelas e Relacionamentos</CardTitle>
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
                  {tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.description}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {table.relationships.map((rel, index) => (
                            <li key={index} className="text-sm text-gray-600">{rel}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Boas Práticas de Desenvolvimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Todas as tabelas incluem campos de auditoria (created_at, updated_at)</li>
                <li>A maioria das tabelas usa UUID como chave primária</li>
                <li>O campo profile_id é usado como chave estrangeira para relacionar entidades com usuários</li>
                <li>Alguns relacionamentos são feitos através de campos de texto (ex: plan_type) em vez de chaves estrangeiras diretas</li>
                <li>Manter a documentação atualizada quando houver mudanças no schema</li>
                <li>Seguir o padrão de nomenclatura estabelecido para novas tabelas e colunas</li>
                <li>Implementar políticas RLS (Row Level Security) para todas as tabelas que contêm dados sensíveis</li>
                <li>Usar migrations para todas as alterações no banco de dados</li>
                <li>Testar queries complexas no ambiente de desenvolvimento antes de aplicar em produção</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
