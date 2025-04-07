
import React from "react";
import { StarIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  comment: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "CrossFit Athlete",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=300&auto=format&fit=crop",
    rating: 5,
    comment: "The Olympic barbell from FlexFitness has transformed my training. The quality is exceptional, providing the perfect balance of durability and performance."
  },
  {
    id: 2,
    name: "James Wilson",
    role: "Personal Trainer",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format&fit=crop",
    rating: 5,
    comment: "As a personal trainer, I recommend FlexFitness equipment to all my clients. The adjustable dumbbell set is a game-changer for home workouts - versatile and space-saving."
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Fitness Enthusiast",
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=300&auto=format&fit=crop",
    rating: 4,
    comment: "I love the resistance bands set! Perfect for my home workouts and travel. The quality is excellent, and they've held up well over months of regular use."
  },
  {
    id: 4,
    name: "Michael Johnson",
    role: "Powerlifter",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop",
    rating: 5,
    comment: "The leather weightlifting belt provides exceptional support during heavy lifts. The quality of materials and craftsmanship is unmatched. Worth every penny."
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-card rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      
      <blockquote className="text-sm sm:text-base flex-1">
        "{testimonial.comment}"
      </blockquote>
    </div>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what fitness enthusiasts have to say about our products.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="basis-full sm:basis-1/2 lg:basis-1/3 p-1">
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative inset-0 translate-y-0 -left-4" />
            <CarouselNext className="relative inset-0 translate-y-0 -right-4" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
