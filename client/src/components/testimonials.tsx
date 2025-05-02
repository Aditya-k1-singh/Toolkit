import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@shared/schema";
import { ChevronLeft, ChevronRight, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = Math.ceil(testimonials.length / 3);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get current visible testimonials
  const getVisibleTestimonials = () => {
    const itemsPerPage = 3;
    const startIndex = activeSlide * itemsPerPage;
    return testimonials.slice(startIndex, startIndex + itemsPerPage);
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary bg-opacity-10" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6 underline decoration-accent decoration-4 underline-offset-8">What Our Trekkers Say</h2>
          <p className="text-xl text-gray-800 font-semibold max-w-3xl mx-auto">Real experiences from fellow adventurers who've explored with us</p>
        </div>
        
        <div className="relative testimonial-carousel">
          {/* Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full focus:outline-none ${
                  index === activeSlide ? "bg-primary" : "bg-gray-300 hover:bg-primary"
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial) => (
              <Card key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                        <User className="h-6 w-6 text-gray-600" />
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
                  <p className="text-gray-600 italic">{testimonial.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 bg-white rounded-full p-2 shadow-md focus:outline-none transform -translate-y-1/2 hidden md:flex"
                onClick={prevSlide}
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5 text-primary" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-4 bg-white rounded-full p-2 shadow-md focus:outline-none transform -translate-y-1/2 hidden md:flex"
                onClick={nextSlide}
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5 text-primary" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
