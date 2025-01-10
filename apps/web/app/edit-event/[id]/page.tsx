"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { EventForm } from "@/components/event-form";
import { eventApi } from "@/lib/api";
import { UpdateEventDto, Event } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

export default function EditEventPage() {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await eventApi.getById(id as string);
        setEvent(fetchedEvent);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch event",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleSubmit = async (data: UpdateEventDto) => {
    try {
      await eventApi.update(id as string, data);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      router.push("/my-events");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Event not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>Update the details of your event.</CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm event={event} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
