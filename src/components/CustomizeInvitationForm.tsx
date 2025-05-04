
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the form validation schema
const formSchema = z.object({
  brideFirstName: z.string().min(2, "Bride first name must be at least 2 characters"),
  brideLastName: z.string().min(2, "Bride last name must be at least 2 characters"),
  groomFirstName: z.string().min(2, "Groom first name must be at least 2 characters"),
  groomLastName: z.string().min(2, "Groom last name must be at least 2 characters"),
  weddingDate: z.date({ required_error: "Wedding date is required" }),
  weddingTime: z.string().min(1, "Wedding time is required"),
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  venueAddress: z.string().min(5, "Venue address must be at least 5 characters"),
  venueMapLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const CustomizeInvitationForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brideFirstName: "",
      brideLastName: "",
      groomFirstName: "",
      groomLastName: "",
      weddingTime: "18:00",
      venueName: "",
      venueAddress: "",
      venueMapLink: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Insert the new invitation data
      const { data: invitationData, error: invitationError } = await supabase
        .from("invitations")
        .insert({
          bride_first_name: values.brideFirstName,
          bride_last_name: values.brideLastName,
          groom_first_name: values.groomFirstName,
          groom_last_name: values.groomLastName,
          wedding_date: format(values.weddingDate, "yyyy-MM-dd"),
          wedding_time: values.weddingTime,
          venue_name: values.venueName,
          venue_address: values.venueAddress,
          venue_map_link: values.venueMapLink || null,
          email: values.email,
          phone_number: values.phoneNumber,
        })
        .select();

      if (invitationError) {
        throw new Error(invitationError.message);
      }

      if (invitationData && invitationData.length > 0) {
        const invitationId = invitationData[0].id;
        toast({
          title: "Invitation created!",
          description: "Your wedding invitation has been created successfully.",
        });
        // Navigate to the dashboard page with the invitation ID
        navigate(`/dashboard/${invitationId}`);
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast({
        title: "Error",
        description: "Failed to create invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-playfair text-wedding-maroon text-center mb-6">Create Your Wedding Invitation</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-wedding-gold">Bride Details</h3>
              <FormField
                control={form.control}
                name="brideFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bride's first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brideLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bride's last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-wedding-gold">Groom Details</h3>
              <FormField
                control={form.control}
                name="groomFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Groom's first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groomLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Groom's last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-wedding-gold">Wedding Details</h3>
              <FormField
                control={form.control}
                name="weddingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Wedding Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weddingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-wedding-gold">Contact Information</h3>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-wedding-gold">Venue Information</h3>
            <FormField
              control={form.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Wedding venue name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Complete venue address" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueMapLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps Link (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-wedding-gold hover:bg-wedding-deep-gold text-white"
          >
            {isSubmitting ? "Creating Invitation..." : "Create Wedding Invitation"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CustomizeInvitationForm;
