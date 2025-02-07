
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalPages: 0,
    activePages: 0,
    supportTickets: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: pages, error: pagesError } = await supabase
          .from("landing_pages")
          .select("id, status");

        if (pagesError) throw pagesError;

        const { data: tickets, error: ticketsError } = await supabase
          .from("support_tickets")
          .select("id")
          .eq("status", "open");

        if (ticketsError) throw ticketsError;

        setStats({
          totalPages: pages?.length || 0,
          activePages: pages?.filter((p) => p.status === "published").length || 0,
          supportTickets: tickets?.length || 0,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Landing Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalPages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activePages}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.supportTickets}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
