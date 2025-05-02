import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  onSubmit: (data: BookingFormValues) => void;
  isLoading?: boolean;
}

const bookingSchema = z.object({
  participantsCount: z
    .number()
    .min(1, "Must have at least 1 participant")
    .max(15, "Maximum 15 participants allowed"),
  specialRequirements: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingForm({ onSubmit, isLoading = false }: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      participantsCount: 1,
      specialRequirements: "",
    },
  });

  const handleSubmit = (data: BookingFormValues) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="participantsCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={15}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the total number of people joining this trek (including yourself).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements or Requests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any dietary restrictions, medical conditions, or special requests we should know about?"
                      className="resize-none h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Help us prepare better for your trek.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-heading font-semibold mb-4">Booking Agreement</h3>
              <p className="text-sm text-gray-600 mb-6">
                By proceeding with this booking, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 mb-6">
                <li>You have read and agree to our Terms & Conditions and Cancellation Policy.</li>
                <li>You understand that trekking involves physical activities and potential risks.</li>
                <li>You are responsible for having appropriate travel insurance.</li>
                <li>A 25% deposit is non-refundable if you cancel within 14 days of the trek date.</li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-gray-100 text-black font-heading font-bold py-3 shadow-lg border-2 border-accent"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" /> Processing
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
