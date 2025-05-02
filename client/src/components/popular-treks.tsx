import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Trek } from "@shared/schema";
import TrekCard from "./trek-card";

interface PopularTreksProps {
  treks: Trek[];
}

export default function PopularTreks({ treks }: PopularTreksProps) {
  const [, setLocation] = useLocation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">Popular Treks</h2>
            <p className="text-lg text-gray-600">Discover our most sought-after adventures</p>
          </div>
          <Button 
            className="hidden md:flex items-center text-black bg-white hover:bg-gray-100 font-heading font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-accent"
            onClick={() => setLocation("/treks")}
          >
            View all treks <ArrowRight className="ml-2 h-5 w-5 text-accent" />
          </Button>
        </div>
        
        {treks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No popular treks found.</p>
          </div>
        )}
        
        <div className="text-center mt-10 md:hidden">
          <Button 
            className="text-black bg-white hover:bg-gray-100 font-heading font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-accent inline-flex items-center"
            onClick={() => setLocation("/treks")}
          >
            View all treks <ArrowRight className="ml-2 h-5 w-5 text-accent" />
          </Button>
        </div>
      </div>
    </section>
  );
}
