import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/custom-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateEventDto, UpdateEventDto } from '@/types'
import { useToast } from "@/hooks/use-toast"

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/, 'Invalid datetime format'),
})

interface EventFormProps {
  event?: CreateEventDto & { id?: string }
  onSubmit: (data: CreateEventDto | UpdateEventDto) => void
}

export function EventForm({ event, onSubmit }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const ensureFullISOString = (dateString: string): string => {
    // If the dateString is already in the correct format, return it
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(dateString)) {
      return dateString;
    }
    
    // If the dateString is in YYYY-MM-DDTHH:mm format, append ":00.000Z"
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return `${dateString}:00.000Z`;
    }
    
    // For any other case, parse the date and format it correctly
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
  };

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      ...event,
      date: ensureFullISOString(event.date),
    } : {
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString(),
    },
  })

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    setIsSubmitting(true)
    try {
      const formattedData = {
        ...data,
        date: ensureFullISOString(data.date),
      }
      await onSubmit(formattedData)
      toast({
        title: "Success",
        description: event?.id ? "Event updated successfully" : "Event created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: event?.id ? "Failed to update event" : "Failed to create event",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  value={field.value.slice(0, 16)} // Show only YYYY-MM-DDTHH:mm in the input
                  onChange={(e) => {
                    const fullISOString = ensureFullISOString(e.target.value);
                    field.onChange(fullISOString);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={isSubmitting}>
          {event?.id ? 'Update Event' : 'Create Event'}
        </Button>
      </form>
    </Form>
  )
}

