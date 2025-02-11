
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface ImageGeneratorDialogProps {
  onImageGenerated: (url: string) => void;
}

export default function ImageGeneratorDialog({ onImageGenerated }: ImageGeneratorDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma descrição para a imagem",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao gerar imagem");
      }

      onImageGenerated(data.url);
      setIsOpen(false);
      toast({
        title: "Sucesso",
        description: "Imagem gerada com sucesso!",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Imagem com IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Imagem com IA</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Descreva a imagem que você quer gerar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <Button
            onClick={generateImage}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Gerar Imagem
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
