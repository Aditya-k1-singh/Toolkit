import { Route, Mountain, Leaf } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Route className="h-10 w-10" />,
    title: "Expert-Guided Journeys",
    description: "Our experienced guides know every trail and ensure your safety while sharing deep cultural knowledge."
  },
  {
    icon: <Mountain className="h-10 w-10" />,
    title: "Diverse Destinations",
    description: "From Himalayan peaks to coastal trails, we offer 100+ unique routes across India's varied landscapes."
  },
  {
    icon: <Leaf className="h-10 w-10" />,
    title: "Sustainable Travel",
    description: "Our eco-friendly practices protect the environments we explore and support local communities."
  }
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-800 mb-4">Why Trek With Us?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the perfect blend of adventure, safety, and cultural immersion with India's premier trekking company.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm transition duration-300 hover:shadow-md">
              <div className="text-primary text-4xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
