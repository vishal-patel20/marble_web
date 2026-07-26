# 💎 Aurelia Marbles — Premium Stone Showroom

A full-stack, production-ready **Premium Marble Company Website** built with the MERN Stack (PostgreSQL variant). Features a luxury dark-themed UI, full CRUD product management, JWT authentication with refresh tokens, and Docker-ready deployment.

---

## 🏗️ Architecture Overview

```
marble_web/
├── client/               # React 19 + Vite frontend (SPA)
│   ├── src/
│   │   ├── api/          # Axios instance with JWT interceptor
│   │   ├── components/   # Reusable UI (Button, Card, Skeleton, Navbar, Footer)
│   │   ├── pages/        # All page components (lazy-loaded)
│   │   ├── store/        # Zustand state (auth, theme, wishlist)
│   │   └── styles/       # Global CSS with Tailwind + custom design tokens
│   ├── Dockerfile        # Multi-stage: Node build → nginx serve
│   └── nginx.conf        # SPA routing + API proxy + compression
│
├── server/               # Express.js + PostgreSQL backend (MVC)
│   ├── src/
│   │   ├── config/       # DB, logger, cloudinary
│   │   ├── controllers/  # MVC controllers per domain
│   │   ├── database/     # Sequelize connection + seed data
│   │   ├── docs/         # Swagger/OpenAPI spec
│   │   ├── middlewares/  # Auth, error, upload
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # Express routers
│   │   ├── services/     # Cloudinary, email services
│   │   ├── utils/        # API response, JWT token utils
│   │   └── validators/   # express-validator + Zod schemas
│   ├── tests/
│   │   └── integration/  # Jest + Supertest tests
│   └── Dockerfile        # Multi-stage: Node build → production runtime
│
└── docker-compose.yml    # Full orchestration: postgres + backend + frontend
```

---

## 🚀 Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 5 | Dev server & bundler |
| React Router DOM | 6 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations |
| React Query | 5 | Server state management |
| Zustand | 4 | Client state management |
| React Hook Form + Zod | 7 + 3 | Form validation |
| Swiper.js | 11 | Hero carousel |
| Axios | 1 | HTTP client with interceptors |

### Backend
| Package | Purpose |
|---|---|
| Express.js | Web framework |
| Sequelize | ORM for PostgreSQL |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT access + refresh tokens |
| Helmet | HTTP security headers |
| express-rate-limit | Brute-force protection |
| xss-clean | XSS input sanitization |
| hpp | HTTP parameter pollution protection |
| multer | File uploads |
| cloudinary | Cloud media storage |
| winston | Structured logging |
| morgan | HTTP request logging |
| swagger-jsdoc | API documentation |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js ≥ 20
- PostgreSQL ≥ 14 running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd marble_web

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
# Copy the example and fill in your values
cd server
cp .env.example .env
```

**Key environment variables:**
```env
DB_HOST=localhost
DB_USER=marble_user
DB_PASSWORD=marble_secure_password
DB_NAME=marble_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Create PostgreSQL database

```sql
CREATE USER marble_user WITH PASSWORD 'marble_secure_password';
CREATE DATABASE marble_db OWNER marble_user;
GRANT ALL PRIVILEGES ON DATABASE marble_db TO marble_user;
```

### 4. Start development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Starts at http://localhost:5000
# API docs at http://localhost:5000/api-docs
# DB auto-migrates and seeds on first run
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Starts at http://localhost:5173
# API requests auto-proxied to backend
```

---

## 🐳 Docker Deployment

Spin up the full stack with a single command:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend (nginx) | http://localhost:80 |
| Backend API | http://localhost:5000 |
| API Docs (Swagger) | http://localhost:5000/api-docs |
| PostgreSQL | localhost:5432 |

---

## 🧪 Running Tests

```bash
cd server
npm test
# Runs Jest + Supertest integration tests
# Requires a running PostgreSQL instance
```

---

## 🔐 Authentication Flow

1. **Register/Login** → Receives `accessToken` (15min) in response body + `refreshToken` (7d) in `HttpOnly` cookie
2. **Every API request** → Axios interceptor attaches `Bearer <accessToken>` header
3. **On 401 response** → Interceptor automatically calls `/auth/refresh-token`, gets new `accessToken`, replays failed request
4. **Role-based access** → `Admin` role required for all write operations

### Default Seed Admin
```
Email: admin@premiummarbles.com
Password: Admin@Marbles2024
```

---

## 📦 API Endpoints Summary

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register new account |
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/logout` | Public | Logout (clear cookie) |
| POST | `/api/v1/auth/refresh-token` | Cookie | Refresh access token |
| GET | `/api/v1/auth/me` | JWT | Get own profile |
| GET | `/api/v1/inventory/categories` | Public | List categories |
| GET | `/api/v1/inventory/products` | Public | List products (search, filter, paginate) |
| GET | `/api/v1/inventory/products/:slug` | Public | Get product detail |
| POST | `/api/v1/inventory/products` | Admin | Create product |
| PUT | `/api/v1/inventory/products/:id` | Admin | Update product |
| DELETE | `/api/v1/inventory/products/:id` | Admin | Delete product |
| POST | `/api/v1/leads/inquiry` | Public | Submit inquiry |
| POST | `/api/v1/leads/brochure/download` | Public | Request brochure |
| GET | `/api/v1/misc/gallery` | Public | Get gallery items |
| GET | `/api/v1/misc/projects` | Public | Get portfolio projects |
| GET | `/api/v1/misc/blogs` | Public | Get blog posts |
| GET | `/api/v1/misc/testimonials` | Public | Get testimonials |
| GET | `/api/v1/misc/faqs` | Public | Get FAQs |
| GET | `/api/v1/misc/wishlist` | Customer | Get user wishlist |
| POST | `/api/v1/misc/wishlist` | Customer | Add to wishlist |
| DELETE | `/api/v1/misc/wishlist/:productId` | Customer | Remove from wishlist |

Full interactive docs available at: `http://localhost:5000/api-docs`

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `gold-400` | `#d4af37` | Primary accent, CTAs |
| `luxury-950` | `#0a0a0c` | Dark background |
| Font Serif | Playfair Display | Headings |
| Font Sans | Outfit / Inter | Body text |

---

## 📁 Key Frontend Pages

| Route | Component | Description |
|---|---|---|
| `/` | Home.jsx | Hero slider, featured products, categories |
| `/products` | Products.jsx | Search, filter, sort, paginate |
| `/products/:slug` | ProductDetail.jsx | Full product view, inquiry, wishlist |
| `/gallery` | Gallery.jsx | Visual stone showroom |
| `/projects` | Projects.jsx | Completed projects portfolio |
| `/blogs` | Blogs.jsx | Stone care & design articles |
| `/about` | About.jsx | Company story |
| `/contact` | Contact.jsx | Inquiry form with WhatsApp widget |
| `/login` | Login.jsx | JWT authentication |
| `/register` | Register.jsx | New account creation |
| `/wishlist` | Wishlist.jsx | Saved products (protected) |
| `/admin` | AdminDashboard.jsx | Full management panel (admin only) |

---

## 📝 License

MIT — Aurelia Marbles Premium Stone Showroom
