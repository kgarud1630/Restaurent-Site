'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Plus, Leaf, TentTree as GlutenFree } from 'lucide-react';
import Link from 'next/link';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'appetizer', name: 'Appetizers' },
  { id: 'main', name: 'Main Courses' },
  { id: 'dessert', name: 'Desserts' },
];

const dietaryIcons = {
  'vegetarian': { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
  'vegan': { icon: Leaf, color: 'text-green-700', bg: 'bg-green-100' },
  'gluten-free': { icon: GlutenFree, color: 'text-blue-600', bg: 'bg-blue-50' },
};

export default function MenuPreview() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { state } = useRestaurant();
  const { addItem } = useCart();

  const filteredItems = state.menuItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  ).slice(0, 6); // Show only 6 items in preview

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    toast.success(`${item.name} added to cart`);
  };

  const getDietaryIcon = (dietary: string) => {
    const config = dietaryIcons[dietary as keyof typeof dietaryIcons];
    if (!config) return null;
    
    const IconComponent = config.icon;
    return (
      <div className={`inline-flex p-1 rounded ${config.bg}`}>
        <IconComponent className={`h-3 w-3 ${config.color}`} />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          Our Menu
        </Badge>
        <h2 className="text-4xl font-bold text-foreground mb-4 font-playfair">
          Signature Dishes & Favorites
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover our carefully curated selection of dishes, each crafted with passion 
          and the finest ingredients to create unforgettable flavors.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Quick Add Button */}
              <Button
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleAddToCart(item)}
              >
                <Plus className="h-4 w-4" />
              </Button>

              {/* Dietary Badges */}
              {item.dietary.length > 0 && (
                <div className="absolute top-4 left-4 flex gap-1">
                  {item.dietary.slice(0, 2).map((diet) => getDietaryIcon(diet))}
                </div>
              )}

              {/* Price */}
              <div className="absolute bottom-4 right-4">
                <Badge className="bg-white/90 text-slate-900 font-semibold">
                  ${item.price.toFixed(2)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center text-amber-500 ml-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium ml-1">
                    {(item.popularity / 20).toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{item.preparationTime} min</span>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item)}
                  className="rounded-full"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Full Menu CTA */}
      <div className="text-center">
        <Button 
          asChild 
          size="lg" 
          className="rounded-full px-8"
        >
          <Link href="/menu">
            View Full Menu
          </Link>
        </Button>
      </div>
    </div>
  );
}