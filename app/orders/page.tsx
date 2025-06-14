'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, MapPin, Phone, Package, CheckCircle, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2025-01-15',
    status: 'delivered',
    total: 67.50,
    items: [
      { name: 'Grilled Atlantic Salmon', quantity: 1, price: 32.00 },
      { name: 'Truffle Risotto', quantity: 1, price: 28.00 },
    ],
    deliveryAddress: '123 Main St, City, State 12345',
    estimatedDelivery: '7:30 PM',
  },
  {
    id: 'ORD-002',
    date: '2025-01-14',
    status: 'preparing',
    total: 45.20,
    items: [
      { name: 'Caesar Salad', quantity: 1, price: 16.00 },
      { name: 'Chocolate Lava Cake', quantity: 2, price: 12.00 },
    ],
    deliveryAddress: '456 Oak Ave, City, State 12345',
    estimatedDelivery: '8:15 PM',
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
  preparing: { color: 'bg-orange-100 text-orange-800', icon: Package, label: 'Preparing' },
  ready: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Ready' },
  delivered: { color: 'bg-green-100 text-green-800', icon: Truck, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: Clock, label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const { state: authState } = useAuth();

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to view your orders.
          </p>
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-playfair">
            Your Orders
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your current orders and view your order history
          </p>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                When you place your first order, it will appear here.
              </p>
              <Button asChild>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <Card key={order.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Placed on {new Date(order.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Total: ${order.total.toFixed(2)}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-2">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Delivery Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Delivery Address</p>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {order.status === 'delivered' ? 'Delivered at' : 'Estimated Delivery'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.estimatedDelivery}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Button variant="outline" size="sm">
                            <Phone className="mr-1 h-3 w-3" />
                            Contact Restaurant
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}