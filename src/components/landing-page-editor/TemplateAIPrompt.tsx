
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";

interface TemplateAIPromptProps {
  onUpdateContent: (content: any) => void;
}

export default function TemplateAIPrompt({ onUpdateContent }: TemplateAIPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma descrição das alterações desejadas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Falha ao gerar conteúdo");

      const data = await response.json();
      onUpdateContent(data.content);
      
      toast({
        title: "Sucesso",
        description: "Conteúdo gerado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar conteúdo com IA",
        variant: "destructive",
      });
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Descreva as alterações que você deseja fazer na sua landing page..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleGenerateContent} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando conteúdo...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Gerar com IA
          </>
        )}
      </Button>
    </div>
  );
}
