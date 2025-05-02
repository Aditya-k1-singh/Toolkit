import { useLocation } from "wouter";
import { Trek } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";

interface TrekCardProps {
  trek: Trek;
}

export default function TrekCard({ trek }: TrekCardProps) {
  const [, setLocation] = useLocation();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-600';
      case 'moderate':
        return 'bg-accent';
      case 'difficult':
        return 'bg-orange-600';
      case 'extreme':
        return 'bg-red-600';
      default:
        return 'bg-accent';
    }
  };

  const handleClick = () => {
    setLocation(`/treks/${trek.id}`);
  };

  return (
    <Card 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={trek.imageUrl} 
          alt={trek.name} 
          className="w-full h-64 object-cover"
        />
        {trek.rating && (
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            {trek.rating.toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <Badge className="bg-white text-black border-2 border-primary text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
            {trek.difficulty}
          </Badge>
          <Badge className="bg-white text-black border-2 border-accent text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
            {trek.duration} Days
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading font-semibold text-xl mb-2">{trek.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {trek.location}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {trek.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-primary font-heading font-bold text-xl">₹{trek.price.toLocaleString()}</span>
            <span className="text-gray-500 text-sm"> / person</span>
          </div>
          <button className="bg-white text-black hover:bg-gray-100 font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-md border-2 border-accent">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
}
