
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainManagementProps {
  landingPageId: string;
  subdomain: string | null;
  onClose: () => void;
}

export default function DomainManagement({ landingPageId, subdomain: initialSubdomain, onClose }: DomainManagementProps) {
  const [subdomain, setSubdomain] = useState(initialSubdomain || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("landing_pages")
        .update({ subdomain })
        .eq("id", landingPageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subdomain updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subdomain",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Domain Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subdomain">Subdomain</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="subdomain"
              placeholder="your-site"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">.yourdomain.com</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
