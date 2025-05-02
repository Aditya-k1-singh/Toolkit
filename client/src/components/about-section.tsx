import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function AboutSection() {
  const [, setLocation] = useLocation();
  
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">About TrekIndia</h2>
            <p className="text-xl text-gray-600">Your gateway to India's most breathtaking adventures</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <h3 className="text-2xl font-heading font-bold text-gray-800 mb-4">Our Story</h3>
                <p className="text-gray-600 mb-6">
                  Founded in 2015 by a group of passionate mountaineers, TrekIndia was born from a desire to share the incredible 
                  landscapes of India with adventure enthusiasts from around the world. What began as a small operation in Himachal 
                  Pradesh has grown into the country's premier trekking company.
                </p>
                <p className="text-gray-600 mb-6">
                  Over the years, we've guided thousands of trekkers through snow-capped Himalayan peaks, lush Western Ghats, 
                  and everything in between. Our commitment to safety, environmental sustainability, and authentic experiences 
                  has earned us the trust of adventurers worldwide.
                </p>
                <Button 
                  className="bg-white text-black hover:bg-gray-100 font-bold border-2 border-accent shadow-md"
                  onClick={() => setLocation("/treks")}
                >
                  Explore our treks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-cover bg-center h-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544198365-28d93c66dd42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}></div>
            </div>
            
            <div className="border-t border-gray-200"></div>
            
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">What Sets Us Apart</h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Expert Guides</h4>
                  <p className="text-gray-600">
                    All our treks are led by certified guides with years of experience and intimate knowledge of local terrain.
                  </p>
                </div>
                
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Responsible Tourism</h4>
                  <p className="text-gray-600">
                    We're committed to minimizing our environmental impact and supporting local communities through sustainable practices.
                  </p>
                </div>
                
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Customized Experiences</h4>
                  <p className="text-gray-600">
                    From challenging expeditions to family-friendly trails, we tailor each trek to match your experience level and interests.
                  </p>
                </div>
                
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Small Groups</h4>
                  <p className="text-gray-600">
                    We limit our group sizes to ensure personalized attention and minimize our impact on fragile ecosystems.
                  </p>
                </div>
                
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Quality Equipment</h4>
                  <p className="text-gray-600">
                    We provide top-of-the-line trekking gear and emergency supplies to ensure your comfort and safety.
                  </p>
                </div>
                
                <div>
                  <div className="bg-primary bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-semibold text-gray-800 mb-2">Comprehensive Planning</h4>
                  <p className="text-gray-600">
                    From permits to accommodations, we handle all the logistics so you can focus on enjoying your adventure.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200"></div>
            
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-heading font-bold text-gray-800 mb-6">Our Commitment to Sustainability</h3>
              <p className="text-gray-600 mb-6">
                At TrekIndia, we believe that responsible tourism is the only way forward. We're dedicated to preserving the natural 
                beauty of India's landscapes for future generations through our sustainability initiatives:
              </p>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-600 mb-6">
                <li>Strict "Leave No Trace" policies on all our treks</li>
                <li>Regular trail clean-up expeditions in popular trekking areas</li>
                <li>Partnerships with local conservation organizations</li>
                <li>Use of eco-friendly accommodations and suppliers</li>
                <li>Support for local economies by hiring guides from nearby communities</li>
                <li>Environmental education programs for trekkers and local communities</li>
              </ul>
              
              <p className="text-gray-600">
                Join us in our mission to explore responsibly and protect India's natural treasures for generations to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}