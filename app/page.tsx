'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import MenuPreview from '@/components/sections/MenuPreview';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ReservationSection from '@/components/sections/ReservationSection';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { useRestaurant } from '@/hooks/useRestaurant';

export default function HomePage() {
  const { loadMenuItems, loadReservationSlots } = useRestaurant();
  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Preload essential data
    loadMenuItems();
    loadReservationSlots();
  }, [loadMenuItems, loadReservationSlots]);

  return (
    <div className="w-full">
      {/* Enhanced Navigation for Hero Section */}
      <NavigationMenu variant="hero" className="absolute top-0 left-0 right-0 z-50" />
      
      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className={`py-16 transition-opacity duration-700 ${
          featuresInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <FeaturesSection />
      </section>

      {/* Menu Preview */}
      <section className="py-16 bg-muted/30">
        <MenuPreview />
      </section>

      {/* About Section */}
      <section className="py-16">
        <AboutSection />
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <TestimonialsSection />
      </section>

      {/* Reservation Section */}
      <section className="py-16">
        <ReservationSection />
      </section>
    </div>
  );
}