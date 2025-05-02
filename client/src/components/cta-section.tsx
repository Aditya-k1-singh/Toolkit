import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CTASection() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <section className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=600&q=80')" }}>
      <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join our community of explorers and discover the natural wonders of India. 
            Your next adventure is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary border-4 border-primary font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transition duration-300 shadow-xl"
              onClick={() => setLocation("/treks")}
            >
              Explore Treks
            </Button>
            
            {!user ? (
              <Button
                size="lg"
                className="bg-white text-black font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transition duration-300 border-4 border-accent shadow-xl"
                onClick={() => setLocation("/auth")}
              >
                Sign Up Now
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-white text-black font-heading font-bold px-10 py-6 rounded-lg text-xl hover:bg-gray-100 transition duration-300 border-4 border-accent shadow-xl"
                onClick={() => setLocation("/dashboard")}
              >
                View Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
