
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: tickets, refetch } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase.from("support_tickets").insert({
        subject,
        description,
        status: "open",
        priority: "medium",
        profile_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Ticket criado com sucesso!",
        description: "Nossa equipe responderá em breve.",
      });

      setSubject("");
      setDescription("");
      refetch();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Erro ao criar ticket",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suporte</h1>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Novo Ticket"}
          </Button>
        </form>
      </Card>

      <div className="grid gap-4">
        {tickets?.length === 0 ? (
          <p className="text-muted-foreground">Nenhum ticket de suporte ainda.</p>
        ) : (
          tickets?.map((ticket) => (
            <Card key={ticket.id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {ticket.status}
                  </span>
                  <span className="text-sm px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    {ticket.priority}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
