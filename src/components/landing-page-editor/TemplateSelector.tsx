import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Template {
  id: string;
  name: string;
  category: string;
  preview_image_url: string | null;
  color_schemes: any[];
  tags: string[];
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

export default function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data as Template[];
    },
  });

  const filteredTemplates = templates?.filter((template) => {
    const categoryMatch =
      selectedCategory === "all" || template.category === selectedCategory;
    const colorMatch =
      selectedColor === "all" ||
      template.color_schemes.some((scheme) =>
        Object.values(scheme).includes(selectedColor)
      );
    return categoryMatch && colorMatch;
  });

  const categories = templates
    ? ["all", ...new Set(templates.map((t) => t.category))]
    : ["all"];

  const colors = [
    { label: "All Colors", value: "all" },
    { label: "Purple", value: "#8B5CF6" },
    { label: "Pink", value: "#D946EF" },
    { label: "Orange", value: "#F97316" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedColor}
          onValueChange={setSelectedColor}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                  {color.value !== "all" && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                  )}
                  {color.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates?.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedTemplateId === template.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardContent className="p-4">
              {template.preview_image_url && (
                <img
                  src={template.preview_image_url}
                  alt={template.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.category}
                  </p>
                </div>
                {selectedTemplateId === template.id && (
                  <Check className="text-primary h-5 w-5" />
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
