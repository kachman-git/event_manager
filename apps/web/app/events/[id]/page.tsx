"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event, Tag } from "@/types";
import { eventApi, tagsApi } from "@/lib/api";
import { UserNav } from "@/components/user-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { BackButton } from "@/components/back-button";
import { Countdown } from "@/components/countdown";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEventAndTags = async () => {
    try {
      const fetchedEvent = await eventApi.getById(id as string);
      setEvent(fetchedEvent);
      const fetchedTags = await tagsApi.getByEventId(id as string);
      setTags(fetchedTags);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch event details. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndTags();
  }, [id, toast]);

  if (loading) {
    return <LoadingSpinner />;
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <header className="flex justify-between items-center mb-8">
              <BackButton />
              <UserNav />
            </header>
            <Card className="mb-8 bg-card text-card-foreground">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Location:</strong> {event.location}
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">Date:</strong> {new Date(event.date).toLocaleString()}
                </p>
                <div className="mb-6">
                  <Countdown targetDate={new Date(event.date)} />
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-primary/20 text-primary text-xs font-semibold px-2.5 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

