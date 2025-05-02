import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Trek } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface UpcomingTreksProps {
  treks: Trek[];
}

export default function UpcomingTreks({ treks }: UpcomingTreksProps) {
  const [, setLocation] = useLocation();

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">Upcoming Treks</h2>
            <p className="text-lg text-gray-600">Join our scheduled adventures in the next 30 days</p>
          </div>
          <Button 
            className="hidden md:flex items-center text-black bg-white hover:bg-gray-100 font-heading font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-accent"
            onClick={() => setLocation("/treks")}
          >
            View all treks <ArrowRight className="ml-2 h-5 w-5 text-accent" />
          </Button>
        </div>
        
        {treks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treks.map((trek) => (
              <div 
                key={trek.id}
                className="flex flex-col md:flex-row bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setLocation(`/treks/${trek.id}`)}
              >
                <div className="md:w-2/5">
                  <img src={trek.imageUrl} alt={trek.name} className="h-full w-full object-cover" />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-semibold text-xl">{trek.name}</h3>
                    {trek.startDate && trek.endDate && (
                      <div className="bg-white text-black border border-primary text-sm px-3 py-1 rounded-full font-medium flex items-center shadow-sm">
                        <Calendar className="h-4 w-4 mr-1 text-primary" /> 
                        {formatDate(trek.startDate)}-{formatDate(trek.endDate)}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{trek.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-primary font-heading font-bold text-xl">₹{trek.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm"> / person</span>
                    </div>
                    <div className="flex items-center">
                      {trek.availableSeats && (
                        <span className="text-gray-600 text-sm mr-3">{trek.availableSeats} seats left</span>
                      )}
                      <Button className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-bold transition duration-300 shadow-md border-2 border-accent">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No upcoming treks scheduled.</p>
          </div>
        )}
        
        <div className="text-center mt-10 md:hidden">
          <Button 
            className="text-black bg-white hover:bg-gray-100 font-heading font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-accent inline-flex items-center"
            onClick={() => setLocation("/treks")}
          >
            View all upcoming treks <ArrowRight className="ml-2 h-5 w-5 text-accent" />
          </Button>
        </div>
      </div>
    </section>
  );
}
