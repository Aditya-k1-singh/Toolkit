import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Trek, insertBookingSchema } from "@shared/schema";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import BookingForm from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute("/booking/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const trekId = matched ? parseInt(params.id) : 0;
  
  const { data: trek, isLoading } = useQuery<Trek>({
    queryKey: [`/api/treks/${trekId}`],
    enabled: !!trekId,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest("POST", "/api/bookings", bookingData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setBookingConfirmed(true);
      toast({
        title: "Booking Confirmed!",
        description: "Your trek has been booked successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleBookingSubmit = (formData: any) => {
    if (!trek) return;
    
    const bookingData = {
      trekId: trek.id,
      totalAmount: trek.price * formData.participantsCount,
      participantsCount: formData.participantsCount,
      specialRequirements: formData.specialRequirements,
      status: "confirmed",
    };
    
    createBookingMutation.mutate(bookingData);
  };
  
  if (!user) {
    setLocation("/auth");
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!trek) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Trek Not Found</h1>
            <p className="text-gray-600 mb-6">The trek you are trying to book doesn't exist.</p>
            <Button onClick={() => setLocation("/treks")}>Browse All Treks</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (bookingConfirmed) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card>
              <CardContent className="pt-10 pb-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <h1 className="text-3xl font-heading font-bold text-gray-800 mb-4">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your booking for {trek.name} has been confirmed. You can view your booking details in your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    className="bg-white text-black hover:bg-gray-100 border-2 border-gray-300"
                    onClick={() => setLocation(`/treks/${trek.id}`)}
                  >
                    Back to Trek
                  </Button>
                  <Button
                    className="bg-white text-black hover:bg-gray-100 font-bold border-2 border-primary"
                    onClick={() => setLocation("/dashboard")}
                  >
                    View My Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button
            className="mb-6 bg-white text-black hover:bg-gray-100 border-2 border-gray-300"
            onClick={() => setLocation(`/treks/${trek.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Trek
          </Button>
          
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-6">
            Book Your Trek
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <BookingForm onSubmit={handleBookingSubmit} isLoading={createBookingMutation.isPending} />
            </div>
            
            <div>
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-heading font-semibold mb-4">Booking Summary</h2>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={trek.imageUrl} 
                      alt={trek.name} 
                      className="w-20 h-20 object-cover rounded-md mr-4" 
                    />
                    <div>
                      <h3 className="font-heading font-semibold">{trek.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-white text-black border-2 border-primary font-bold">{trek.difficulty}</Badge>
                        <Badge className="bg-white text-black border-2 border-secondary font-bold">{trek.duration} Days</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 border-t border-b py-4 my-4">
                    {trek.startDate && trek.endDate && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Dates</p>
                          <p className="font-medium">
                            {new Date(trek.startDate).toLocaleDateString()} - {new Date(trek.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{trek.duration} Days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">{trek.availableSeats} seats left</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center font-heading text-lg mb-1">
                    <span>Price per person:</span>
                    <span className="font-semibold">₹{trek.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-heading text-xl">
                      <span className="font-bold">Total Price:</span>
                      <span className="font-bold text-primary">₹{trek.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      * Final price will depend on the number of participants
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
