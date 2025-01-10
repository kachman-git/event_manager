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
import { CreateTagDto } from "@/types";
import { useToast } from "@/hooks/use-toast";

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  eventId: z.string().min(1, "Event ID is required"),
});

interface TagFormProps {
  eventId: string;
  onTagAdded: () => void;
}

export function TagForm({ eventId, onTagAdded }: TagFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof tagSchema>>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      eventId: eventId,
    },
  });

  const onSubmit = async (data: z.infer<typeof tagSchema>) => {
    setIsSubmitting(true);
    try {
      await tagsApi.create(data as CreateTagDto);
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
      form.reset({ name: "", eventId: eventId });
      onTagAdded();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tag. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground"
        >
          {isSubmitting ? "Adding..." : "Add Tag"}
        </Button>
      </form>
    </Form>
  );
}
