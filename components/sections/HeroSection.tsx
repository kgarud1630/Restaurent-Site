'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Star, ChefHat } from 'lucide-react';
import Link from 'next/link';

const heroImages = [
  'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
];

const features = [
  { icon: ChefHat, text: 'Award-winning cuisine' },
  { icon: Star, text: '5-star dining experience' },
  { icon: Users, text: 'Perfect for special occasions' },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt="Restaurant ambiance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <Badge 
              variant="secondary" 
              className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm"
            >
              Now Open for Reservations
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 font-playfair leading-tight">
              Experience
              <span className="block text-amber-400">Fine Dining</span>
              Redefined
            </h1>

            {/* Description */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              Indulge in an extraordinary culinary journey where every dish tells a story 
              of passion, creativity, and the finest ingredients from around the world.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Enhanced CTA Buttons with Performance Optimizations */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 will-change-transform"
              >
                <Link 
                  href="/reservations" 
                  className="inline-flex items-center justify-center"
                  aria-label="Make a reservation at Savoria Restaurant"
                  role="button"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reserve Your Table
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg font-semibold backdrop-blur-sm transition-all duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 will-change-transform"
              >
                <Link 
                  href="/menu"
                  className="inline-flex items-center justify-center"
                  aria-label="View our restaurant menu"
                  role="button"
                >
                  View Our Menu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              index === currentImageIndex 
                ? 'bg-amber-400 scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-px h-8 bg-white/50" />
          <span className="text-xs uppercase tracking-wide">Scroll</span>
        </div>
      </div>
    </div>
  );
}