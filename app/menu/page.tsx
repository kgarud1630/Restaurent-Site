'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Clock, Plus, Leaf, TentTree as GlutenFree, Search, Filter } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'appetizer', name: 'Appetizers' },
  { id: 'main', name: 'Main Courses' },
  { id: 'dessert', name: 'Desserts' },
  { id: 'beverage', name: 'Beverages' },
];

const dietaryFilters = [
  { id: 'all', name: 'All Dietary' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'gluten-free', name: 'Gluten-Free' },
];

const sortOptions = [
  { id: 'popularity', name: 'Most Popular' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'name', name: 'Alphabetical' },
];

const dietaryIcons = {
  'vegetarian': { icon: Leaf, color: 'text-green-600', bg: 'bg-green-50' },
  'vegan': { icon: Leaf, color: 'text-green-700', bg: 'bg-green-100' },
  'gluten-free': { icon: GlutenFree, color: 'text-blue-600', bg: 'bg-blue-50' },
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { state, loadMenuItems } = useRestaurant();
  const { addItem } = useCart();

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

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

  // Filter and sort menu items
  const filteredItems = state.menuItems
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDietary = selectedDietary === 'all' || item.dietary.includes(selectedDietary);
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesDietary && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

  if (state.loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            Our Menu
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted dishes, made with the finest ingredients 
            and prepared with passion by our expert chefs.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDietary} onValueChange={setSelectedDietary}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietaryFilters.map((filter) => (
                    <SelectItem key={filter.id} value={filter.id}>
                      {filter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No items found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDietary('all');
                  setSearchQuery('');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          )}
        </div>
      </section>
    </div>
  );
}