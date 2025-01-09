"use client";

import { useEffect, useState, useCallback } from "react";
import { Event } from "@/types";
import { eventApi } from "@/lib/api";
import { EventsTable } from "@/components/events-table";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/custom-button";
import { ArrowUpDown, Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";

function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedEvents = await eventApi.getAll();
      setEvents(fetchedEvents);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const sortEvents = () => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setEvents(sortedEvents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This will also delete all associated tags."
      )
    ) {
      try {
        await eventApi.delete(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event and associated tags deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event and tags. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
                Events
              </h1>
              <div className="flex items-center space-x-4">
                <Link href="/my-events">
                  <Button variant="outline" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" /> My Events
                  </Button>
                </Link>
                <Button
                  onClick={() => router.push("/create-event")}
                  className="flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Event
                </Button>
                <UserNav />
              </div>
            </header>
            <div className="mb-6">
              <Button
                onClick={sortEvents}
                variant="outline"
                className="flex items-center text-gray-700 dark:text-gray-300"
              >
                Sort by Date{" "}
                {sortOrder === "asc" ? "(Ascending)" : "(Descending)"}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-hide">
                        <EventsTable
                          events={events}
                          onDeleteEvent={handleDeleteEvent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
