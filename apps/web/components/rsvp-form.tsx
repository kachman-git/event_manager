import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { rsvpApi } from '@/lib/api'
import { RSVPDto } from '@/types'

const rsvpSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  status: z.enum(['GOING', 'MAYBE', 'NOT_GOING']),
})

interface RSVPFormProps {
  rsvp?: RSVPDto & { id?: string }
  onSubmit: (data: RSVPDto) => void
}

export function RSVPForm({ rsvp, onSubmit }: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof rsvpSchema>>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: rsvp || {
      eventId: '',
      status: 'MAYBE',
    },
  })

  const handleSubmit = async (data: z.infer<typeof rsvpSchema>) => {
    setIsSubmitting(true)
    try {
      await rsvpApi.createOrUpdate(data)
      onSubmit(data)
    } catch (error) {
      console.error('Failed to submit RSVP:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter event ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RSVP Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your RSVP status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GOING">Going</SelectItem>
                  <SelectItem value="MAYBE">Maybe</SelectItem>
                  <SelectItem value="NOT_GOING">Not Going</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </Button>
      </form>
    </Form>
  )
}

