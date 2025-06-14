# Savoria Restaurant Website

A modern, responsive restaurant website built with Next.js 13+, TypeScript, and Tailwind CSS. This application follows microservices architecture principles and industry best practices for production deployment.

## 🚀 Features

### Core Functionality
- **Homepage**: Full-width hero section with dynamic content and real-time menu availability
- **Navigation**: Responsive header with JWT authentication and protected routes
- **Menu System**: Dynamic filtering, search, and dietary preference indicators
- **Ordering Flow**: Persistent cart, real-time calculations, and payment integration
- **Reservation System**: Interactive calendar with time slot management
- **User Authentication**: Secure login/register with JWT tokens

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: React Context with useReducer for complex state
- **API Integration**: Axios with interceptors for error handling and token refresh
- **Performance**: Code splitting, lazy loading, and optimized images
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠 Tech Stack

- **Frontend**: Next.js 13+, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT tokens with refresh mechanism
- **Icons**: Lucide React
- **Animations**: Framer Motion, CSS animations
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Deployment

### Development with Docker Compose

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f restaurant-frontend
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Production Deployment

1. **Build the production image**
   ```bash
   docker build -t restaurant-website .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 restaurant-website
   ```

## 🏗 Architecture

### Project Structure
```
├── app/                    # Next.js 13 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   └── ui/               # shadcn/ui components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API client
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

### State Management
- **AuthContext**: User authentication and profile management
- **RestaurantContext**: Menu items, reservations, and restaurant data
- **CartContext**: Shopping cart state with persistence

### API Integration
- **Axios Client**: Configured with interceptors for authentication
- **Error Handling**: Centralized error management with user feedback
- **Token Refresh**: Automatic JWT token refresh on expiration
- **Request Caching**: Intelligent caching for improved performance

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Database (for backend services)
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

### Tailwind CSS Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette for restaurant branding
- Extended font families (Inter + Playfair Display)
- Custom animations and transitions
- Responsive breakpoints

## 🚀 Deployment

### Kubernetes Deployment

1. **Create namespace**
   ```bash
   kubectl create namespace restaurant
   ```

2. **Apply configurations**
   ```bash
   kubectl apply -f k8s/ -n restaurant
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods -n restaurant
   ```

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=out
   ```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Testing
```bash
npm run lighthouse
```

## 📊 Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Service worker for offline functionality
- **CDN**: Static asset delivery via CDN

## 🔒 Security Features

- **Input Sanitization**: XSS protection on all user inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request rate limiting
- **Secure Headers**: Security headers configuration
- **JWT Security**: Secure token storage and transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🗺 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice ordering integration
- [ ] AI-powered menu recommendations
- [ ] Loyalty program integration