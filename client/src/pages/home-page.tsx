import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import HeroSection from "@/components/hero-section";
import SearchBar from "@/components/search-bar";
import FeatureSection from "@/components/feature-section";
import PopularTreks from "@/components/popular-treks";
import UpcomingTreks from "@/components/upcoming-treks";
import Testimonials from "@/components/testimonials";
import PhotoGallery from "@/components/photo-gallery";
import CTASection from "@/components/cta-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { Loader2 } from "lucide-react";
import { Trek, Testimonial } from "@shared/schema";

export default function HomePage() {
  const { data: popularTreks, isLoading: isLoadingPopular } = useQuery<Trek[]>({
    queryKey: ["/api/treks/popular"],
  });

  const { data: upcomingTreks, isLoading: isLoadingUpcoming } = useQuery<Trek[]>({
    queryKey: ["/api/treks/upcoming"],
  });

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoadingPopular || isLoadingUpcoming || isLoadingTestimonials) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <SearchBar />
        <FeatureSection />
        <PopularTreks treks={popularTreks || []} />
        <UpcomingTreks treks={upcomingTreks || []} />
        <Testimonials testimonials={testimonials || []} />
        <PhotoGallery />
        <AboutSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
