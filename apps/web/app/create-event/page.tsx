"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { eventApi } from "@/lib/api";
import { CreateEventDto, UpdateEventDto } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BackButton } from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: CreateEventDto | UpdateEventDto) => {
    try {
      const newEvent = await eventApi.create(data as CreateEventDto);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
      router.push(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create event. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
