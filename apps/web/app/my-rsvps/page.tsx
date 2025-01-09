"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { rsvpApi, eventApi } from "@/lib/api";
import { RSVP, Event } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export default function MyRSVPsPage() {
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [events, setEvents] = useState<{ [key: string]: Event }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const fetchedRSVPs = await rsvpApi.getUserRSVPs();
        setRSVPs(fetchedRSVPs);

        const eventDetails: { [key: string]: Event } = {};
        for (const rsvp of fetchedRSVPs) {
          const event = await eventApi.getById(rsvp.eventId);
          eventDetails[rsvp.eventId] = event;
        }
        setEvents(eventDetails);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch RSVPs. Please try again.",
        });
        setError("Failed to fetch RSVPs");
      } finally {
        setLoading(false);
      }
    };

    fetchRSVPs();
  }, [toast]);

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
      <h1 className="text-3xl font-bold mb-6">My RSVPs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rsvps.map((rsvp) => {
          const event = events[rsvp.eventId];
          if (!event) return null;

          return (
            <Card key={rsvp.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>
                  {format(new Date(event.date), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">
                  {event.description}
                </p>
                <p className="text-sm font-semibold">
                  Your RSVP:{" "}
                  <span className="capitalize">
                    {rsvp.status.toLowerCase()}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline">View Event</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
