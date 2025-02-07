import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import ImageUploader from "./ImageUploader";
import TemplatePreview from "./TemplatePreview";
import { generateTemplate } from "@/services/templateGeneration";

interface QuestionnaireData {
  client_name: string;
  company_name: string;
  business_type: string;
  objective: "leads" | "appointment" | "sales" | "event" | "branding" | "other";
  objective_other?: string;
  offer_details?: string;
  has_photos: boolean;
  uploaded_images?: string[];
  additional_comments?: string;
  company_history?: string;
  show_pricing: boolean;
  pricing_details?: string;
}

export default function LandingPageQuestionnaire() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    client_name: "",
    company_name: "",
    business_type: "",
    objective: "leads",
    has_photos: false,
    show_pricing: false,
  });
  const [generatedTemplate, setGeneratedTemplate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleObjectiveChange = (value: QuestionnaireData["objective"]) => {
    setFormData((prev) => ({
      ...prev,
      objective: value,
    }));
  };

  const handlePhotoChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      has_photos: value,
    }));
  };

  const handlePricingChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      show_pricing: value,
    }));
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      uploaded_images: urls,
    }));
  };

  const handleGenerateTemplate = async () => {
    try {
      setIsGenerating(true);
      const template = await generateTemplate({
        client_name: formData.client_name,
        company_name: formData.company_name,
        business_type: formData.business_type,
        objective: formData.objective,
        offer_details: formData.offer_details,
        company_history: formData.company_history,
      });
      setGeneratedTemplate(template);
      toast({
        title: "Success!",
        description: "Template generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate template.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const title = `${formData.company_name} - ${formData.business_type} Landing Page`;

      const { error } = await supabase.from("landing_pages").insert({
        ...formData,
        profile_id: user.id,
        status: "draft",
        title,
        content: {
          template: generatedTemplate,
          images: formData.uploaded_images || [],
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your landing page is being generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create landing page.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Informações Iniciais</h2>
            <p className="text-muted-foreground">
              Nesta primeira etapa, precisamos de algumas informações básicas para começarmos a criar sua landing page.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client_name">Seu Nome</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company_name">Nome da Empresa/Marca</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Digite o nome da sua empresa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_type">Ramo de Atuação</Label>
                <Input
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  placeholder="Ex: Marketing Digital, Consultoria, etc."
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Objetivo da Landing Page</h2>
            <p className="text-muted-foreground">
              Defina o principal objetivo da sua landing page para direcionarmos a criação da melhor estrutura para você.
            </p>
            <RadioGroup
              value={formData.objective}
              onValueChange={handleObjectiveChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="leads" id="leads" />
                <Label htmlFor="leads">Captar Leads/Contatos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="appointment" id="appointment" />
                <Label htmlFor="appointment">Agendar Sessão Estratégica/Consulta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sales" id="sales" />
                <Label htmlFor="sales">Vender Produto/Infoproduto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="event" id="event" />
                <Label htmlFor="event">Promover um Evento/Webinar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="branding" id="branding" />
                <Label htmlFor="branding">Divulgar minha Marca/Empresa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Outro</Label>
              </div>
            </RadioGroup>
            {formData.objective === "other" && (
              <div>
                <Label htmlFor="objective_other">Especifique outro objetivo</Label>
                <Input
                  id="objective_other"
                  name="objective_other"
                  value={formData.objective_other}
                  onChange={handleInputChange}
                  placeholder="Digite seu objetivo"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Detalhes da sua Oferta</h2>
            <p className="text-muted-foreground">
              Conte-nos mais sobre o que você oferece e o que torna sua oferta única.
            </p>
            <div>
              <Label htmlFor="offer_details">Detalhes da Oferta</Label>
              <Textarea
                id="offer_details"
                name="offer_details"
                value={formData.offer_details}
                onChange={handleInputChange}
                placeholder="Descreva seus diferenciais competitivos e como sua oferta transforma a vida do cliente"
                className="h-32"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Materiais Visuais</h2>
            <p className="text-muted-foreground">
              Você possui fotos que acredita serem úteis para a sua landing page?
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_photos"
                  checked={formData.has_photos}
                  onCheckedChange={handlePhotoChange}
                />
                <Label htmlFor="has_photos">Sim, possuo fotos</Label>
              </div>
              {formData.has_photos && (
                <ImageUploader onUploadComplete={handleImageUpload} />
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Comentários Adicionais</h2>
            <p className="text-muted-foreground">
              Há mais algum detalhe importante que você gostaria de adicionar?
            </p>
            <div>
              <Label htmlFor="additional_comments">Comentários (Opcional)</Label>
              <Textarea
                id="additional_comments"
                name="additional_comments"
                value={formData.additional_comments}
                onChange={handleInputChange}
                placeholder="Adicione informações extras que possam ser relevantes"
                className="h-32"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Sua História</h2>
            <p className="text-muted-foreground">
              Compartilhe sua história para conectar-se ainda mais com seus clientes.
            </p>
            <div>
              <Label htmlFor="company_history">História (Opcional)</Label>
              <Textarea
                id="company_history"
                name="company_history"
                value={formData.company_history}
                onChange={handleInputChange}
                placeholder="Conte um pouco sobre sua trajetória e o que te motiva"
                className="h-32"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Template Preview</h2>
            <p className="text-muted-foreground">
              Review and select the AI-generated template for your landing page.
            </p>
            
            <Button
              onClick={handleGenerateTemplate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Template"}
            </Button>

            {generatedTemplate && (
              <div className="mt-6">
                <TemplatePreview
                  template={generatedTemplate}
                  isSelected={true}
                  onSelect={() => {}}
                />
              </div>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-2xl font-bold">Preço e Contato</h2>
            <p className="text-muted-foreground">
              Sua landing page terá informações de preço ou o foco será em gerar contato?
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_pricing"
                  checked={formData.show_pricing}
                  onCheckedChange={handlePricingChange}
                />
                <Label htmlFor="show_pricing">Exibir preços na landing page</Label>
              </div>
              {formData.show_pricing && (
                <div>
                  <Label htmlFor="pricing_details">Informações de Preço</Label>
                  <Textarea
                    id="pricing_details"
                    name="pricing_details"
                    value={formData.pricing_details}
                    onChange={handleInputChange}
                    placeholder="Detalhe as informações de preço que deseja exibir"
                    className="h-32"
                  />
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
          >
            <ChevronLeft className="mr-2" />
            Anterior
          </Button>
        )}
        {step < 8 ? (
          <Button
            className="ml-auto"
            onClick={() => setStep((prev) => prev + 1)}
          >
            Próximo
            <ChevronRight className="ml-2" />
          </Button>
        ) : (
          <Button
            className="ml-auto"
            onClick={handleSubmit}
            disabled={!generatedTemplate}
          >
            Gerar Landing Page
            <Check className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
