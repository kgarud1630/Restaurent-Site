'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const footerLinks = {
  restaurant: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/story' },
    { name: 'Chef Team', href: '/chefs' },
    { name: 'Careers', href: '/careers' },
  ],
  menu: [
    { name: 'Appetizers', href: '/menu?category=appetizer' },
    { name: 'Main Courses', href: '/menu?category=main' },
    { name: 'Desserts', href: '/menu?category=dessert' },
    { name: 'Wine List', href: '/wine' },
  ],
  services: [
    { name: 'Reservations', href: '/reservations' },
    { name: 'Private Dining', href: '/private-dining' },
    { name: 'Catering', href: '/catering' },
    { name: 'Events', href: '/events' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Utensils className="h-8 w-8 text-amber-400" />
              <span className="font-bold text-xl font-playfair">Savoria</span>
            </Link>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Experience exceptional cuisine crafted with passion and the finest ingredients. 
              Join us for an unforgettable dining experience that celebrates the art of food.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">
                  123 Culinary Street, Foodie District, FC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">hello@savoria.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">
                  Mon-Sun: 5:00 PM - 11:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Restaurant</h3>
            <ul className="space-y-2">
              {footerLinks.restaurant.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:mx-0">
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <p className="text-sm text-slate-300 mb-4">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <Separator className="my-8 bg-slate-700" />
        
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <p className="text-sm text-slate-400 mb-4 lg:mb-0">
            © 2025 Savoria Restaurant. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                  aria-label={social.name}
                >
                  <IconComponent className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}