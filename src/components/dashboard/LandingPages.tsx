
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function LandingPages() {
  const [pages, setPages] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("landing_pages")
          .select("*")
          .eq("profile_id", user.id);

        if (error) throw error;
        setPages(data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load landing pages",
          variant: "destructive",
        });
      }
    };

    fetchPages();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landing Pages</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      <div className="grid gap-4">
        {pages.length === 0 ? (
          <p className="text-muted-foreground">No landing pages created yet.</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <h3 className="font-semibold">{page.title}</h3>
              <p className="text-sm text-muted-foreground">
                Status: {page.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
