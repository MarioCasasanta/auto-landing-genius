
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

export default function Support() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support</h1>
        <Button>
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      
      <div className="grid gap-4">
        <p className="text-muted-foreground">No support tickets yet.</p>
      </div>
    </div>
  );
}
