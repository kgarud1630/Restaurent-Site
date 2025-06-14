'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Utensils, 
  Clock, 
  Award, 
  Heart, 
  Leaf, 
  ShieldCheck,
  Users,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Utensils,
    title: 'Artisan Cuisine',
    description: 'Every dish is carefully crafted by our world-class culinary team using traditional techniques and modern innovation.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Clock,
    title: 'Fresh Daily',
    description: 'Our ingredients are sourced fresh daily from local farms and premium suppliers to ensure peak quality.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized by culinary critics and awarded multiple Michelin stars for our exceptional dining experience.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each recipe reflects our passion for food and commitment to creating memorable dining experiences.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description: 'We prioritize environmental responsibility with locally-sourced, sustainable ingredients and eco-friendly practices.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assured',
    description: 'Rigorous quality standards ensure every meal meets our exacting requirements for taste, presentation, and safety.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const stats = [
  { number: '25+', label: 'Years of Excellence', icon: Star },
  { number: '500+', label: 'Happy Customers Daily', icon: Users },
  { number: '50+', label: 'Signature Dishes', icon: Utensils },
  { number: '3', label: 'Michelin Stars', icon: Award },
];

export default function FeaturesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          Why Choose Savoria
        </Badge>
        <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
          Culinary Excellence in Every Detail
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From our carefully selected ingredients to our innovative cooking techniques, 
          we're committed to delivering an exceptional dining experience that exceeds expectations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2 font-playfair">
            Our Story in Numbers
          </h3>
          <p className="text-muted-foreground">
            A legacy of culinary excellence and customer satisfaction
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}