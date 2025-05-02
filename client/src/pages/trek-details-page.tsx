import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, User, Map, DollarSign, Star, ArrowLeft, Activity } from "lucide-react";
import { Trek, Testimonial } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function TrekDetailsPage() {
  const [, setLocation] = useLocation();
  const [matched, params] = useRoute("/treks/:id");
  const { user } = useAuth();
  
  const trekId = matched ? parseInt(params.id) : 0;
  
  const { data: trek, isLoading: isTrekLoading } = useQuery<Trek>({
    queryKey: [`/api/treks/${trekId}`],
    enabled: !!trekId,
  });
  
  const { data: testimonials, isLoading: isTestimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: [`/api/testimonials?trekId=${trekId}`],
    enabled: !!trekId,
  });
  
  if (isTrekLoading) {
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
  
  if (!trek) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-heading font-bold mb-4">Trek Not Found</h1>
          <p className="text-gray-600 mb-6">The trek you are looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/treks")}>Browse All Treks</Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        {/* Hero image section */}
        <div
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${trek.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10 relative z-10">
            <Button
              variant="outline"
              className="bg-white text-gray-800 mb-4 self-start"
              onClick={() => setLocation("/treks")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Treks
            </Button>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-white text-black border-2 border-primary font-bold">{trek.difficulty}</Badge>
              <Badge className="bg-white text-black border-2 border-secondary font-bold">{trek.duration} Days</Badge>
              {trek.availableSeats && trek.availableSeats < 5 && (
                <Badge className="bg-white text-black border-2 border-red-500 font-bold">{trek.availableSeats} seats left</Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
              {trek.name}
            </h1>
            <div className="flex items-center text-white">
              <Map className="h-5 w-5 mr-1" />
              <span>{trek.location}</span>
              {trek.rating && (
                <div className="flex items-center ml-4">
                  <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
                  <span>{trek.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4 bg-white border-2 border-gray-200 p-1">
                  <TabsTrigger value="overview" className="text-black font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-black">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary" className="text-black font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-black">Itinerary</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-black font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-black">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">About This Trek</h2>
                      <p className="text-gray-700 mb-6">{trek.description}</p>
                      
                      <h3 className="text-xl font-heading font-semibold mb-3">Activities</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {Array.isArray(trek.activities) && trek.activities.map((activity, index) => (
                          <div 
                            key={index}
                            className="flex items-center bg-white text-black border-2 border-primary rounded-full px-4 py-2 text-sm font-bold shadow-md"
                          >
                            <Activity className="h-4 w-4 mr-2 text-primary" />
                            {activity}
                          </div>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-heading font-semibold mb-3">What to Expect</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                        <li>Professional trekking guides with extensive local knowledge</li>
                        <li>All meals during the trek (vegetarian options available)</li>
                        <li>Camping equipment including tents and sleeping bags</li>
                        <li>First aid kit and oxygen cylinder for emergencies</li>
                        <li>Transportation from the nearest major city to the trek starting point</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">Trek Itinerary</h2>
                      <div className="space-y-6">
                        {Array.from({ length: trek.duration }).map((_, index) => (
                          <div key={index} className="border-l-2 border-primary pl-4 relative">
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                            <h3 className="text-lg font-heading font-semibold">Day {index + 1}</h3>
                            <p className="text-gray-700">
                              {index === 0 
                                ? "Arrival at base camp, orientation, and equipment check. Meet your fellow trekkers and guides."
                                : index === trek.duration - 1
                                ? "Final ascent to the peak, celebration, and return journey to base camp."
                                : `Trek from Camp ${index} to Camp ${index + 1} through scenic trails and breathtaking viewpoints.`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-heading font-semibold mb-4">Trekker Reviews</h2>
                      
                      {isTestimonialsLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : testimonials && testimonials.length > 0 ? (
                        <div className="space-y-6">
                          {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="border-b border-gray-200 pb-6 last:border-0">
                              <div className="flex justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-heading font-semibold">Trekker</h4>
                                    <p className="text-gray-500 text-sm">
                                      {new Date(testimonial.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex">
                                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 italic">{testimonial.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">No reviews yet for this trek.</p>
                          <p className="text-sm text-gray-500">Be the first to share your experience!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Sidebar */}
            <div>
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="text-3xl font-heading font-bold text-primary">
                      ₹{trek.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">per person</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
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
                      <User className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Group Size</p>
                        <p className="font-medium">Max 15 people</p>
                      </div>
                    </div>
                    
                    {trek.availableSeats && (
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Availability</p>
                          <p className="font-medium">{trek.availableSeats} seats left</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {user ? (
                    <Button 
                      className="w-full bg-white hover:bg-gray-100 text-black font-heading font-bold text-lg py-6 shadow-lg border-2 border-accent" 
                      onClick={() => setLocation(`/booking/${trek.id}`)}
                    >
                      Book Now
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-white hover:bg-gray-100 text-black font-heading font-bold text-lg py-6 shadow-lg border-2 border-accent"
                        onClick={() => setLocation("/auth")}
                      >
                        Sign In to Book
                      </Button>
                      <p className="text-sm text-gray-700 font-medium text-center">
                        You need to be logged in to book this trek.
                      </p>
                    </div>
                  )}
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
