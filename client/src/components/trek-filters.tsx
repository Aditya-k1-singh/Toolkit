import { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Filter, Search } from "lucide-react";

interface TrekFiltersProps {
  onFiltersApplied: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
}

const filtersSchema = z.object({
  location: z.string().optional(),
  difficulty: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  activities: z.string().optional(),
});

type FiltersFormValues = z.infer<typeof filtersSchema>;

export default function TrekFilters({ onFiltersApplied, initialFilters = {} }: TrekFiltersProps) {
  // Price range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      location: initialFilters.location || "",
      difficulty: initialFilters.difficulty || "",
      minPrice: initialFilters.minPrice || String(priceRange[0]),
      maxPrice: initialFilters.maxPrice || String(priceRange[1]),
      activities: initialFilters.activities || "",
    },
  });
  
  // Set form values when initialFilters change
  useEffect(() => {
    if (initialFilters.location) {
      form.setValue("location", initialFilters.location);
    }
    
    if (initialFilters.difficulty) {
      form.setValue("difficulty", initialFilters.difficulty);
    }
    
    if (initialFilters.minPrice && initialFilters.maxPrice) {
      const min = parseInt(initialFilters.minPrice);
      const max = parseInt(initialFilters.maxPrice);
      setPriceRange([min, max]);
      form.setValue("minPrice", initialFilters.minPrice);
      form.setValue("maxPrice", initialFilters.maxPrice);
    }
    
    if (initialFilters.activities) {
      const activities = initialFilters.activities.split(',');
      setSelectedActivities(activities);
      form.setValue("activities", initialFilters.activities);
    }
  }, [initialFilters, form]);
  
  // Update price range in form when slider changes
  useEffect(() => {
    form.setValue("minPrice", String(priceRange[0]));
    form.setValue("maxPrice", String(priceRange[1]));
  }, [priceRange, form]);
  
  const onSubmit = (data: FiltersFormValues) => {
    // Combine activities into comma-separated string
    if (selectedActivities.length > 0) {
      data.activities = selectedActivities.join(',');
    }
    
    onFiltersApplied(data);
  };
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activity)) {
        return prev.filter(a => a !== activity);
      } else {
        return [...prev, activity];
      }
    });
  };
  
  const activities = [
    "Hiking", "Camping", "Photography", "Wildlife", "Cultural", "Snow Activities", "Waterfall", "River Crossing"
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="Ladakh">Ladakh</SelectItem>
                  <SelectItem value="Sikkim">Sikkim</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Difficult">Difficult</SelectItem>
                  <SelectItem value="Extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Price Range</FormLabel>
          <div className="space-y-4">
            <Slider
              value={priceRange}
              min={0}
              max={30000}
              step={1000}
              onValueChange={handlePriceChange}
              className="mt-6"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <FormLabel>Activities</FormLabel>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {activities.map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={`activity-${activity}`}
                  checked={selectedActivities.includes(activity)}
                  onCheckedChange={() => handleActivityToggle(activity)}
                />
                <label
                  htmlFor={`activity-${activity}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {activity}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          <Filter className="h-4 w-4 mr-2" /> Apply Filters
        </Button>
      </form>
    </Form>
  );
}
