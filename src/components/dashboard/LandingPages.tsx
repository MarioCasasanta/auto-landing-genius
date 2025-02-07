import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Eye, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LandingPage {
  id: string;
  title: string;
  status: string;
  created_at: string;
  company_name: string;
  business_type: string;
}

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
          .from("landing_pages")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false });

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("landing_pages")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setPages(pages.map(page => 
        page.id === id ? { ...page, status: newStatus } : page
      ));

      toast({
        title: "Success",
        description: `Landing page ${newStatus === "published" ? "published" : "unpublished"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update landing page status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landing Pages</h1>
        <Button onClick={() => navigate("/")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      <div className="grid gap-4">
        {pages.length === 0 ? (
          <p className="text-muted-foreground">No landing pages created yet.</p>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{page.title}</CardTitle>
                <Badge className={getStatusColor(page.status)}>
                  {page.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {page.company_name} - {page.business_type}
                </CardDescription>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/landing-pages/${page.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/landing-pages/${page.id}/preview`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(
                      page.id,
                      page.status === "published" ? "draft" : "published"
                    )}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    {page.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}