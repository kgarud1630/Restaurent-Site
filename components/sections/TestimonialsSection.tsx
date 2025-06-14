'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Critic',
    company: 'Culinary Weekly',
    rating: 5,
    content: 'Savoria delivers an extraordinary dining experience that transcends expectations. Every dish is a masterpiece, and the service is impeccable. This is what fine dining should be.',
    avatar: 'SJ',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Restaurant Reviewer',
    company: 'Gourmet Guide',
    rating: 5,
    content: 'The attention to detail at Savoria is remarkable. From the carefully curated menu to the elegant ambiance, every element contributes to an unforgettable culinary journey.',
    avatar: 'MC',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Travel Blogger',
    company: 'Wanderlust Eats',
    rating: 5,
    content: 'I\'ve dined at restaurants around the world, but Savoria stands out for its perfect balance of innovation and tradition. The flavors are bold yet refined, and the presentation is stunning.',
    avatar: 'ER',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Chef',
    company: 'Culinary Institute',
    rating: 5,
    content: 'As a chef myself, I appreciate the technical skill and creativity displayed in every dish at Savoria. The team\'s dedication to excellence is evident in every bite.',
    avatar: 'DT',
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Food Enthusiast',
    company: 'Local Resident',
    rating: 5,
    content: 'Savoria has become our go-to place for special celebrations. The consistency in quality and service makes every visit special. We always leave with beautiful memories.',
    avatar: 'LP',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          What Our Guests Say
        </Badge>
        <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
          Testimonials & Reviews
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Hear from food critics, chefs, and guests who have experienced 
          the exceptional dining journey at Savoria.
        </p>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <Card className="mx-auto max-w-4xl border-0 shadow-lg">
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                      {/* Quote Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Quote className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center lg:text-left">
                        {/* Rating */}
                        <div className="flex justify-center lg:justify-start mb-4">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-xl lg:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Author Info */}
                        <div className="flex items-center justify-center lg:justify-start">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {testimonial.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-foreground">
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {testimonial.role} • {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary scale-110' 
                : 'bg-muted hover:bg-muted-foreground/30'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}