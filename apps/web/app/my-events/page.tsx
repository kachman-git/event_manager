"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { eventApi, rsvpApi } from "@/lib/api";
import { Event, RSVPSummary } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpSummaries, setRsvpSummaries] = useState<{
    [key: string]: RSVPSummary[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventApi.getMyEvents();
        setEvents(fetchedEvents);

        const summaries: { [key: string]: RSVPSummary[] } = {};
        for (const event of fetchedEvents) {
          const summary = await rsvpApi.getSummary(event.id);
          summaries[event.id] = summary;
        }
        setRsvpSummaries(summaries);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch events. Please try again.",
        });
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleDelete = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await eventApi.delete(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event. Please try again.",
        });
        setError("Failed to delete event");
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

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Button onClick={() => router.push("/create-event")}>
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {format(new Date(event.date), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{event.description}</p>
              <p className="text-sm font-semibold">RSVPs:</p>
              <ul className="list-disc list-inside">
                {rsvpSummaries[event.id]?.map((summary) => (
                  <li key={summary.status} className="text-sm">
                    {summary.status}: {summary.count}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/edit-event/${event.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


