import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { Booking, Trek } from "@shared/schema";
import { Loader2, Calendar, MapPin, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: bookings, isLoading: isBookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  const { data: recommendations, isLoading: isRecommendationsLoading } = useQuery<Trek[]>({
    queryKey: ["/api/recommendations"],
  });
  
  // Function to get trek details for each booking
  const useTreks = (trekIds: number[]) => {
    return useQuery<Record<number, Trek>>({
      queryKey: ["treks_details", trekIds],
      queryFn: async () => {
        const promises = trekIds.map((id) => 
          fetch(`/api/treks/${id}`).then(res => res.json())
        );
        const treks = await Promise.all(promises);
        return treks.reduce((acc, trek, i) => {
          acc[trekIds[i]] = trek;
          return acc;
        }, {} as Record<number, Trek>);
      },
      enabled: trekIds.length > 0,
    });
  };
  
  // Extract trek IDs from bookings
  const trekIds = bookings ? [...new Set(bookings.map(b => b.trekId))] : [];
  const { data: treksData, isLoading: isTreksLoading } = useTreks(trekIds);
  
  if (isBookingsLoading || isRecommendationsLoading || isTreksLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">
              Your Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || user?.username}! Manage your treks and bookings here.
            </p>
          </div>
          
          <Tabs defaultValue="bookings">
            <TabsList className="mb-8">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="recommendations">Recommended Treks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <div className="grid grid-cols-1 gap-6">
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const trek = treksData ? treksData[booking.trekId] : undefined;
                    return (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="grid md:grid-cols-4 gap-4">
                          {trek && (
                            <div className="md:col-span-1">
                              <img 
                                src={trek.imageUrl} 
                                alt={trek.name} 
                                className="w-full h-48 md:h-full object-cover" 
                              />
                            </div>
                          )}
                          <div className="p-6 md:col-span-3">
                            <div className="flex flex-wrap justify-between items-start mb-4">
                              <div>
                                <h2 className="text-xl font-heading font-semibold">
                                  {trek ? trek.name : `Booking #${booking.id}`}
                                </h2>
                                {trek && (
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{trek.location}</span>
                                  </div>
                                )}
                              </div>
                              <Badge className={
                                booking.status === 'confirmed' ? 'bg-green-500' : 
                                booking.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                              }>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                              <div>
                                <p className="text-sm text-gray-600">Booking Date</p>
                                <p className="font-medium flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                                  {new Date(booking.bookingDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Participants</p>
                                <p className="font-medium">{booking.participantsCount} people</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="font-medium">₹{booking.totalAmount.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            {trek && trek.startDate && trek.endDate && (
                              <div className="bg-primary bg-opacity-10 rounded-lg p-4 mb-6 flex items-center">
                                <Clock className="h-5 w-5 text-primary mr-3" />
                                <div>
                                  <p className="text-sm font-medium text-primary">Trek Dates</p>
                                  <p>{new Date(trek.startDate).toLocaleDateString()} - {new Date(trek.endDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <Button 
                                variant="outline" 
                                className="mr-3"
                                onClick={() => trek && setLocation(`/treks/${trek.id}`)}
                              >
                                View Trek Details
                              </Button>
                              {booking.status === 'confirmed' && (
                                <Button className="bg-primary">
                                  Download Itinerary
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-primary bg-opacity-10 p-3">
                          <Calendar className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-2">No Bookings Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't booked any treks yet. Explore our collection of adventures and start your journey!
                      </p>
                      <Button 
                        className="bg-primary"
                        onClick={() => setLocation("/treks")}
                      >
                        Explore Treks
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended For You</CardTitle>
                  <CardDescription>
                    Based on your preferences and past bookings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recommendations && recommendations.length > 0 ? (
                    <div className="space-y-6">
                      {recommendations.map((trek, index) => (
                        <div key={trek.id}>
                          {index > 0 && <Separator className="my-6" />}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-1/4">
                              <img 
                                src={trek.imageUrl} 
                                alt={trek.name} 
                                className="w-full h-32 object-cover rounded-lg" 
                              />
                            </div>
                            <div className="sm:w-3/4">
                              <h3 className="font-heading font-semibold text-lg mb-2">{trek.name}</h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className="text-primary border-primary">
                                  {trek.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-secondary border-secondary">
                                  {trek.duration} Days
                                </Badge>
                                {trek.rating && (
                                  <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                    ★ {trek.rating.toFixed(1)}
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trek.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="text-primary font-heading font-semibold text-lg">
                                  ₹{trek.price.toLocaleString()}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-primary border-primary"
                                  onClick={() => setLocation(`/treks/${trek.id}`)}
                                >
                                  View Trek <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-2">No personalized recommendations yet.</p>
                      <p className="text-sm text-gray-500">Book more treks to get personalized recommendations!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
