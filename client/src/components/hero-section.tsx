import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <div className="relative h-[80vh] overflow-hidden bg-cover bg-center" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight">
            Discover India's <span className="text-accent">Majestic Trails</span>
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Experience breathtaking adventures, connect with nature, and create lasting memories with TrekIndia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <Button
              size="lg"
              className="bg-white text-black font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 border-4 border-accent shadow-xl"
              onClick={() => setLocation("/treks")}
            >
              Explore Treks
            </Button>
            {!user ? (
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-black font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 border-4 border-primary shadow-xl"
                onClick={() => setLocation("/auth")}
              >
                Sign Up
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-black font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 border-4 border-primary shadow-xl"
                onClick={() => setLocation("/dashboard")}
              >
                My Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
