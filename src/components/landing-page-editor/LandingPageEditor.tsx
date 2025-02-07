
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelector from "./TemplateSelector";
import AssetManager from "./AssetManager";
import TemplateAIPrompt from "./TemplateAIPrompt";

export default function LandingPageEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setContent(template.content);
  };

  const handleImageSelect = (imageUrl: string) => {
    setContent((prev: any) => ({
      ...prev,
      images: [...(prev?.images || []), imageUrl],
    }));
  };

  const handleAIUpdate = (newContent: any) => {
    setContent((prev: any) => ({
      ...prev,
      ...newContent,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editor de Landing Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="template" className="space-y-4">
            <TabsList>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="assets">Imagens</TabsTrigger>
              <TabsTrigger value="ai">Editor IA</TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <TemplateSelector onSelectTemplate={handleTemplateSelect} selectedTemplateId={selectedTemplate?.id} />
            </TabsContent>

            <TabsContent value="assets">
              <AssetManager onSelectImage={handleImageSelect} />
            </TabsContent>

            <TabsContent value="ai">
              <TemplateAIPrompt onUpdateContent={handleAIUpdate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

