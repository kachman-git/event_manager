import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { tagsApi } from "@/lib/api";
import { Tag, CreateTagDto, UpdateTagDto } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { X, Edit, Check } from "lucide-react";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

interface TagManagementProps {
  eventId: string;
  tags: Tag[];
  onTagsUpdated: () => void;
}

export function TagManagement({
  eventId,
  tags,
  onTagsUpdated,
}: TagManagementProps) {
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof tagSchema>) => {
    try {
      if (editingTagId) {
        await tagsApi.update(editingTagId, data as UpdateTagDto);
        toast({
          title: "Success",
          description: "Tag updated successfully",
        });
        setEditingTagId(null);
      } else {
        await tagsApi.create({ ...data, eventId } as CreateTagDto);
        toast({
          title: "Success",
          description: "Tag added successfully",
        });
      }
      form.reset();
      onTagsUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to manage tag. Please try again.",
      });
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTagId(tag.id);
    form.setValue("name", tag.name);
  };

  const handleDelete = async (tagId: string) => {
    try {
      await tagsApi.delete(tagId);
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
      onTagsUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tag. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    placeholder="Enter tag name"
                    {...field}
                    className="bg-background text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary text-primary-foreground">
            {editingTagId ? "Update" : "Add"} Tag
          </Button>
        </form>
      </Form>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center bg-primary/20 text-primary text-sm font-semibold px-2.5 py-0.5 rounded"
          >
            {editingTagId === tag.id ? (
              <Input
                value={form.watch("name")}
                onChange={(e) => form.setValue("name", e.target.value)}
                className="w-24 h-6 p-1 text-xs"
              />
            ) : (
              <span>{tag.name}</span>
            )}
            <div className="ml-2 flex items-center space-x-1">
              {editingTagId === tag.id ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={form.handleSubmit(onSubmit)}
                  className="h-4 w-4 p-0"
                >
                  <Check className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(tag)}
                  className="h-4 w-4 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(tag.id)}
                className="h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
