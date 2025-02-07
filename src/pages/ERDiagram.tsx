
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ERDiagram() {
  const tableRelationships = [
    {
      table: "profiles",
      primaryKey: "id (UUID)",
      description: "Armazena informações do perfil do usuário",
      relationships: [
        "1:N com landing_pages (um perfil pode ter várias landing pages)",
        "1:N com support_tickets (um perfil pode ter vários tickets)",
        "1:N com swipe_files (um perfil pode ter vários swipe files)",
        "1:1 com admin_users (um perfil pode ser um admin)",
        "1:N com subscriptions (um perfil pode ter várias assinaturas)",
        "1:N com implementation_progress (um perfil pode ter vários registros de progresso)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "company_name", type: "TEXT", description: "Nome da empresa" },
        { name: "plan_type", type: "TEXT", description: "Tipo do plano atual" },
        { name: "subscription_status", type: "TEXT", description: "Status da assinatura" }
      ]
    },
    {
      table: "landing_pages",
      primaryKey: "id (UUID)",
      description: "Armazena as landing pages criadas pelos usuários",
      relationships: [
        "N:1 com profiles (cada landing page pertence a um perfil)",
        "1:N com landing_page_elements (uma landing page tem vários elementos)",
        "N:1 com templates (opcional - uma landing page pode ser baseada em um template)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "profile_id", type: "UUID", description: "ID do perfil do proprietário" },
        { name: "template_id", type: "UUID", description: "ID do template (opcional)" },
        { name: "title", type: "TEXT", description: "Título da landing page" }
      ]
    },
    {
      table: "templates",
      primaryKey: "id (UUID)",
      description: "Modelos de landing pages disponíveis",
      relationships: [
        "1:N com landing_pages (um template pode ser usado por várias landing pages)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "name", type: "TEXT", description: "Nome do template" },
        { name: "category", type: "TEXT", description: "Categoria do template" },
        { name: "content", type: "JSONB", description: "Conteúdo do template" }
      ]
    },
    {
      table: "payment_plans",
      primaryKey: "id (UUID)",
      description: "Planos de pagamento disponíveis",
      relationships: [
        "1:N com subscriptions (um plano pode ter várias assinaturas)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "name", type: "TEXT", description: "Nome do plano" },
        { name: "price_monthly", type: "NUMERIC", description: "Preço mensal" },
        { name: "price_yearly", type: "NUMERIC", description: "Preço anual" }
      ]
    },
    {
      table: "subscriptions",
      primaryKey: "id (UUID)",
      description: "Assinaturas dos usuários",
      relationships: [
        "N:1 com profiles (cada assinatura pertence a um perfil)",
        "N:1 com payment_plans (cada assinatura está associada a um plano)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "profile_id", type: "UUID", description: "ID do perfil" },
        { name: "plan_type", type: "TEXT", description: "Tipo do plano" },
        { name: "status", type: "TEXT", description: "Status da assinatura" }
      ]
    },
    {
      table: "swipe_files",
      primaryKey: "id (UUID)",
      description: "Arquivos de exemplo e inspiração",
      relationships: [
        "N:1 com profiles (cada swipe file pertence a um perfil)"
      ],
      mainColumns: [
        { name: "id", type: "UUID", description: "Chave primária" },
        { name: "profile_id", type: "UUID", description: "ID do perfil" },
        { name: "title", type: "TEXT", description: "Título do arquivo" },
        { name: "file_url", type: "TEXT", description: "URL do arquivo" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Diagrama de Entidade-Relacionamento
        </h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Visão Geral do Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              O banco de dados é estruturado em torno da tabela principal "profiles", que mantém as informações dos usuários.
              Cada perfil pode ter múltiplas landing pages, assinaturas, e outros recursos relacionados.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {tableRelationships.map((table) => (
            <Card key={table.table}>
              <CardHeader>
                <CardTitle className="text-xl">
                  Tabela: {table.table}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Chave Primária: {table.primaryKey}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-600">{table.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Relacionamentos</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {table.relationships.map((rel, index) => (
                        <li key={index}>{rel}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Principais Colunas</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.mainColumns.map((column) => (
                          <TableRow key={column.name}>
                            <TableCell className="font-medium">{column.name}</TableCell>
                            <TableCell>{column.type}</TableCell>
                            <TableCell>{column.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Observações Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Todas as tabelas incluem campos de auditoria (created_at, updated_at)</li>
              <li>Todas as tabelas usam UUID como chave primária</li>
              <li>O campo profile_id é usado como chave estrangeira para relacionar entidades com usuários</li>
              <li>As políticas RLS (Row Level Security) são implementadas em todas as tabelas para garantir a segurança dos dados</li>
              <li>Os campos JSON/JSONB são usados para armazenar dados estruturados flexíveis</li>
              <li>Relacionamentos são mantidos através de chaves estrangeiras com integridade referencial</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
