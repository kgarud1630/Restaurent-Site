'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat as Chef, Award, Users2, Clock } from 'lucide-react';
import Link from 'next/link';

const achievements = [
  {
    icon: Award,
    title: '3 Michelin Stars',
    description: 'Recognized for exceptional cuisine and service excellence',
  },
  {
    icon: Chef,
    title: 'Master Chefs',
    description: 'Led by internationally acclaimed culinary experts',
  },
  {
    icon: Users2,
    title: '500k+ Guests',
    description: 'Served with passion and dedication since 1998',
  },
  {
    icon: Clock,
    title: '25 Years',
    description: 'A quarter-century of culinary innovation',
  },
];

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div>
          <Badge variant="outline" className="mb-4">
            Our Story
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6 font-playfair">
            A Legacy of Culinary Excellence
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in 1998 by Chef Alessandro Moretti, Savoria began as a dream to create 
              an extraordinary dining destination that would celebrate the art of fine cuisine. 
              What started as a small family restaurant has evolved into a world-renowned 
              culinary institution.
            </p>
            <p>
              Our philosophy centers on the belief that exceptional food is born from passion, 
              premium ingredients, and meticulous attention to detail. Every dish tells a story 
              of tradition, innovation, and the relentless pursuit of perfection.
            </p>
            <p>
              Today, our award-winning team continues to push the boundaries of gastronomy, 
              creating memorable experiences that engage all the senses and leave lasting impressions 
              on our guests from around the globe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="/about">Learn More About Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/chefs">Meet Our Chefs</Link>
            </Button>
          </div>
        </div>

        {/* Image & Achievements */}
        <div className="space-y-8">
          {/* Featured Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg"
              alt="Chef preparing a dish"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}