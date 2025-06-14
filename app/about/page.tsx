'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat as Chef, Award, Users2, Clock, Star, Heart, Utensils } from 'lucide-react';
import Link from 'next/link';

const achievements = [
  {
    icon: Award,
    title: '3 Michelin Stars',
    description: 'Recognized for exceptional cuisine and service excellence',
    year: '2020',
  },
  {
    icon: Chef,
    title: 'James Beard Award',
    description: 'Outstanding Chef recognition for culinary innovation',
    year: '2019',
  },
  {
    icon: Users2,
    title: '500k+ Guests',
    description: 'Served with passion and dedication since 1998',
    year: 'Since 1998',
  },
  {
    icon: Star,
    title: 'AAA Five Diamond',
    description: 'Highest rating for luxury dining experience',
    year: '2021',
  },
];

const chefs = [
  {
    name: 'Alessandro Moretti',
    role: 'Executive Chef & Founder',
    image: 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg',
    description: 'With over 25 years of culinary experience, Chef Alessandro brings passion and innovation to every dish.',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Pastry Chef',
    image: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg',
    description: 'Award-winning pastry chef specializing in contemporary desserts with classical techniques.',
  },
  {
    name: 'James Thompson',
    role: 'Sous Chef',
    image: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg',
    description: 'Expert in modern European cuisine with a focus on seasonal and locally-sourced ingredients.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Every dish is crafted with love and dedication to culinary excellence.',
  },
  {
    icon: Utensils,
    title: 'Quality',
    description: 'We source only the finest ingredients from trusted local and international suppliers.',
  },
  {
    icon: Users2,
    title: 'Service',
    description: 'Our team is committed to providing exceptional hospitality and memorable experiences.',
  },
  {
    icon: Star,
    title: 'Innovation',
    description: 'We continuously evolve our menu while respecting traditional culinary techniques.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-6 font-playfair">
            Our Story
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            A journey of culinary excellence that began with a simple dream: 
            to create extraordinary dining experiences that celebrate the art of fine cuisine.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Since 1998
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
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg"
                alt="Chef preparing a dish"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-playfair">
              Awards & Recognition
            </h2>
            <p className="text-lg text-muted-foreground">
              Our commitment to excellence has been recognized by culinary institutions worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <Badge variant="secondary">{achievement.year}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chef Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-playfair">
              Meet Our Culinary Team
            </h2>
            <p className="text-lg text-muted-foreground">
              The talented chefs behind our exceptional cuisine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chefs.map((chef, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-xl mb-1">{chef.name}</h3>
                  <p className="text-primary font-medium mb-3">{chef.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {chef.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-playfair">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 font-playfair">
            Experience Savoria
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join us for an unforgettable culinary journey that celebrates the finest in gastronomy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/reservations">Make a Reservation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">View Our Menu</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}