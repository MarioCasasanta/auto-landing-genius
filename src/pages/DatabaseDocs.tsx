
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatabaseDocs() {
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
              <CardTitle>Notas Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Todas as tabelas incluem campos de auditoria (created_at, updated_at)</li>
                <li>A maioria das tabelas usa UUID como chave primária</li>
                <li>O campo profile_id é usado como chave estrangeira para relacionar entidades com usuários</li>
                <li>Alguns relacionamentos são feitos através de campos de texto (ex: plan_type) em vez de chaves estrangeiras diretas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
