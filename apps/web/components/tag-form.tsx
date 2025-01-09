import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { tagApi } from "@/lib/api";
import { CreateTagDto, UpdateTagDto } from "@/types";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  eventId: z.string().min(1, "Event ID is required"),
});

interface TagFormProps {
  tag?: CreateTagDto & { id?: string };
  onSubmit: (data: CreateTagDto | UpdateTagDto) => void;
}

export function TagForm({ tag, onSubmit }: TagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag || {
      name: "",
      eventId: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof tagSchema>) => {
    setIsSubmitting(true);
    try {
      if (tag?.id) {
        await tagApi.update(tag.id, data);
      } else {
        await tagApi.create(data);
      }
      onSubmit(data);
    } catch (error) {
      console.error("Failed to submit tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tag name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter event ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Submitting..."
            : tag?.id
              ? "Update Tag"
              : "Create Tag"}
        </Button>
      </form>
    </Form>
  );
}
