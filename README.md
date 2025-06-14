# Savoria Restaurant Website - Full-Stack Production Application

A modern, responsive restaurant website built with Next.js 13+, TypeScript, and a complete backend API. This application follows microservices architecture principles and industry best practices for production deployment.

## 🚀 Features

### Frontend (Next.js 13.5.1)
- **Homepage**: Full-width hero section with dynamic content and real-time menu availability
- **Menu System**: Dynamic filtering, search, and dietary preference indicators
- **Ordering Flow**: Persistent cart, real-time calculations, and payment integration
- **Reservation System**: Interactive calendar with time slot management
- **User Authentication**: Secure login/register with JWT tokens
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for menu, orders, and reservations
- **PostgreSQL Database**: Robust relational database with proper schema
- **Redis Caching**: Performance optimization for frequently accessed data
- **JWT Authentication**: Secure user authentication and authorization
- **Input Validation**: Comprehensive request validation with Joi
- **Error Handling**: Centralized error management with proper HTTP status codes

### DevOps & Deployment
- **Docker**: Multi-stage builds for optimized production images
- **Kubernetes**: Complete K8s manifests for scalable deployment
- **CI/CD**: GitHub Actions pipeline with automated testing and deployment
- **Monitoring**: Health checks and logging for production monitoring

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3, Radix UI components
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18 with Express.js
- **Database**: PostgreSQL 15 with connection pooling
- **Caching**: Redis 7 for session and data caching
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi for request validation
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Morgan for request logging

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with Helm charts
- **CI/CD**: GitHub Actions
- **Monitoring**: Health checks and metrics
- **Security**: Secrets management, HTTPS, security headers

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+ (for local development)
- Redis 7+ (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restaurant-website
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   
   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379
   - pgAdmin: http://localhost:5050

4. **Or run locally**
   ```bash
   # Install dependencies
   npm install
   cd backend && npm install && cd ..
   
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d postgres redis
   
   # Start backend
   cd backend && npm run dev &
   
   # Start frontend
   npm run dev
   ```

### Database Setup

The database will be automatically initialized with the schema and sample data when using Docker Compose. For manual setup:

```bash
# Connect to PostgreSQL
psql -h localhost -U restaurant_user -d restaurant_db

# Run the initialization script
\i database/init.sql
```

## 🏗 Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── menu/              # Menu pages
│   ├── reservations/      # Reservation pages
│   ├── checkout/          # Checkout flow
│   ├── about/             # About page
│   └── contact/           # Contact page
├── backend/               # Node.js API server
│   ├── server.js          # Main server file
│   ├── config/            # Database and Redis config
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── package.json       # Backend dependencies
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── layout/           # Layout components
│   ├── navigation/       # Navigation components
│   ├── sections/         # Page sections
│   └── ui/               # shadcn/ui components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API client
├── types/                # TypeScript type definitions
├── database/             # Database schema and migrations
├── k8s/                  # Kubernetes manifests
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Frontend Docker image
└── README.md             # This file
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Menu Endpoints
- `GET /api/menu` - Get all menu items (with filtering)
- `GET /api/menu/:id` - Get specific menu item
- `GET /api/menu/categories/all` - Get all categories

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Reservation Endpoints
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/:id` - Get reservation details
- `GET /api/reservations/availability` - Check availability
- `PATCH /api/reservations/:id/cancel` - Cancel reservation

### Example API Usage

```javascript
// Create a new order
const orderData = {
  items: [
    { id: "menu-item-id", quantity: 2 }
  ],
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890"
  },
  deliveryAddress: {
    street: "123 Main St",
    city: "City",
    state: "State",
    zipCode: "12345"
  },
  paymentMethod: {
    type: "card",
    last4: "1234"
  }
};

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(orderData)
});
```

## 🐳 Docker Deployment

### Development Environment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build
```bash
# Build production images
docker build -t restaurant-frontend .
docker build -t restaurant-api ./backend

# Run production containers
docker run -p 3000:3000 restaurant-frontend
docker run -p 3001:3001 restaurant-api
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy services
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Configure ingress
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get pods -n restaurant
kubectl get services -n restaurant
```

### Scaling
```bash
# Scale frontend
kubectl scale deployment restaurant-frontend --replicas=5 -n restaurant

# Scale API
kubectl scale deployment restaurant-api --replicas=3 -n restaurant
```

## 🔒 Security Features

- **Input Sanitization**: XSS protection on all user inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API request rate limiting
- **Secure Headers**: Security headers configuration
- **JWT Security**: Secure token storage and transmission
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Parameterized queries
- **HTTPS Enforcement**: SSL/TLS encryption

## 📊 Performance Optimization

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Redis for API responses and session data
- **Database Optimization**: Indexes and query optimization
- **CDN**: Static asset delivery via CDN
- **Compression**: Gzip compression for API responses

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:coverage
```

### Backend Tests
```bash
cd backend
npm run test
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

### Load Testing
```bash
# Using Artillery
npm install -g artillery
artillery run load-test.yml
```

## 📈 Monitoring & Logging

### Health Checks
- Frontend: `GET /`
- Backend: `GET /health`

### Logging
- Request logging with Morgan
- Error logging with Winston
- Application metrics with Prometheus

### Monitoring
```bash
# Check application health
curl http://localhost:3001/health

# Monitor logs
docker-compose logs -f restaurant-api
kubectl logs -f deployment/restaurant-api -n restaurant
```

## 🚀 CI/CD Pipeline

The project includes a complete CI/CD pipeline with GitHub Actions:

1. **Continuous Integration**
   - Automated testing on pull requests
   - Code quality checks (ESLint, TypeScript)
   - Security scanning
   - Build verification

2. **Continuous Deployment**
   - Automated Docker image building
   - Push to container registry
   - Deploy to Kubernetes cluster
   - Health check verification

### Setting up CI/CD
1. Configure secrets in GitHub repository:
   - `KUBE_CONFIG`: Kubernetes configuration
   - `DOCKER_REGISTRY_TOKEN`: Container registry token

2. Push to main branch triggers deployment

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (.env)
```env
NODE_ENV=development
API_PORT=3001
DATABASE_URL=postgresql://restaurant_user:restaurant_pass@localhost:5432/restaurant_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

### Database Configuration
- Connection pooling with max 20 connections
- Automatic reconnection on connection loss
- Query timeout: 2 seconds
- Idle timeout: 30 seconds

### Redis Configuration
- Connection retry on failure
- Automatic failover
- TTL for cached data: 5 minutes (menu), 1 hour (categories)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation
- Contact the development team

## 🗺 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Voice ordering integration
- [ ] AI-powered menu recommendations
- [ ] Loyalty program integration
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Social media integration
- [ ] Advanced reporting and analytics

---

**Built with ❤️ by the Savoria Team**