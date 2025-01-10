"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { eventApi, rsvpApi, tagsApi } from "@/lib/api";
import { Event, RSVPSummary, Tag } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2, TagIcon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TagManagement } from "@/components/tag-management";

function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvpSummaries, setRsvpSummaries] = useState<{
    [key: string]: RSVPSummary[];
  }>({});
  const [tags, setTags] = useState<{ [key: string]: Tag[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    try {
      const fetchedEvents = await eventApi.getMyEvents();
      setEvents(fetchedEvents);

      const summaries: { [key: string]: RSVPSummary[] } = {};
      const eventTags: { [key: string]: Tag[] } = {};
      for (const event of fetchedEvents) {
        const summary = await rsvpApi.getSummary(event.id);
        summaries[event.id] = summary;
        const fetchedTags = await tagsApi.getByEvent(event.id);
        eventTags[event.id] = fetchedTags;
      }
      setRsvpSummaries(summaries);
      setTags(eventTags);
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
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const handleTagsUpdated = async (eventId: string) => {
    const updatedTags = await tagsApi.getByEvent(eventId);
    setTags((prevTags) => ({
      ...prevTags,
      [eventId]: updatedTags,
    }));
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
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {tags[event.id]?.map((tag) => (
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
            <CardFooter className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <TagIcon className="mr-2 h-4 w-4" /> Manage Tags
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Manage Tags</DialogTitle>
                  </DialogHeader>
                  <TagManagement
                    eventId={event.id}
                    tags={tags[event.id] || []}
                    onTagsUpdated={() => handleTagsUpdated(event.id)}
                  />
                </DialogContent>
              </Dialog>
              <div className="flex space-x-2">
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
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyEventsPage;
