import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import TrekCard from "@/components/trek-card";
import TrekFilters from "@/components/trek-filters";
import { Trek } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function TreksPage() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse search params for filter values
  const params = new URLSearchParams(search);
  const locationParam = params.get("location") || "";
  const difficultyParam = params.get("difficulty") || "";
  const minPriceParam = params.get("minPrice") || "";
  const maxPriceParam = params.get("maxPrice") || "";
  const activitiesParam = params.get("activities") || "";
  
  // Handle API request to search/filter treks
  const apiUrl = `/api/search?${search.slice(1)}`;
  
  const { data: treks, isLoading } = useQuery<Trek[]>({
    queryKey: [apiUrl],
  });
  
  // Handle when filters are applied
  const handleFiltersApplied = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setLocation(`/treks?${params.toString()}`);
    setShowFilters(false);
  };
  
  // Handle clearing all filters
  const clearFilters = () => {
    setLocation("/treks");
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-2">
                Explore Our Treks
              </h1>
              <p className="text-gray-600">
                Discover adventures perfectly suited to your preferences
              </p>
            </div>
            
            <div className="flex mt-4 md:mt-0">
              {(locationParam || difficultyParam || minPriceParam || maxPriceParam || activitiesParam) && (
                <Button 
                  variant="outline" 
                  className="mr-2 text-sm" 
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-1" /> Clear Filters
                </Button>
              )}
              
              {/* Mobile filters button */}
              <div className="md:hidden">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button>
                      <Filter className="h-4 w-4 mr-2" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle>Trek Filters</SheetTitle>
                      <SheetDescription>
                        Narrow down your trek options
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <TrekFilters
                        onFiltersApplied={handleFiltersApplied}
                        initialFilters={{
                          location: locationParam,
                          difficulty: difficultyParam,
                          minPrice: minPriceParam,
                          maxPrice: maxPriceParam,
                          activities: activitiesParam,
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop filters sidebar */}
            <div className="hidden md:block w-64 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-heading font-semibold mb-4">Filters</h2>
              <TrekFilters
                onFiltersApplied={handleFiltersApplied}
                initialFilters={{
                  location: locationParam,
                  difficulty: difficultyParam,
                  minPrice: minPriceParam,
                  maxPrice: maxPriceParam,
                  activities: activitiesParam,
                }}
              />
            </div>
            
            {/* Trek listings */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : treks && treks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {treks.map((trek) => (
                    <TrekCard key={trek.id} trek={trek} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <h3 className="text-xl font-heading font-semibold mb-2">No Treks Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any treks matching your filters. Try adjusting your search criteria.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
