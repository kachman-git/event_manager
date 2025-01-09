"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Event, UpdateEventDto } from "@/types";
import { eventApi } from "@/lib/api";
import { EventForm } from "@/components/event-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { useToast } from "@/hooks/use-toast";

function EventPage() {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
          description: "Failed to fetch event details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleUpdate = async (data: UpdateEventDto) => {
    try {
      const updatedEvent = await eventApi.update(id as string, data);
      setEvent(updatedEvent);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event",
      });
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this event? This will also delete all associated tags."
      )
    ) {
      try {
        await eventApi.delete(id as string);
        toast({
          title: "Success",
          description: "Event and associated tags deleted successfully",
        });
        router.push("/events");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event and tags",
        });
      }
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
          <CardTitle>{isEditing ? "Edit Event" : event.title}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of your event."
              : `Event on ${new Date(event.date).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <EventForm event={event} onSubmit={handleUpdate} />
          ) : (
            <div className="space-y-4">
              <p>
                <strong>Description:</strong> {event.description}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Date:</strong> {new Date(event.date).toLocaleString()}
              </p>
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {event.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Event
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EventPage;
