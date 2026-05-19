# Online Learning SaaS Platform

A subscription-based online learning platform built with FastAPI and React.
Students can browse and enroll in courses, while admins manage content and users.
Stripe handles subscription billing with Free and Pro plans.

## Live Demo

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Tech Stack

### Backend
- **FastAPI** — Modern Python web framework
- **SQLAlchemy** — ORM for database operations
- **MySQL 8** — Primary database
- **Alembic** — Database migrations
- **JWT** — Authentication tokens
- **Stripe** — Payment processing
- **bcrypt** — Password hashing
- **pytest** — Backend testing

### Frontend
- **React + Vite** — Frontend framework
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **Axios** — HTTP client
- **Stripe.js** — Payment integration

## Project Structure

online_learning/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # Authentication routes
│   │   │   ├── courses.py       # Course routes
│   │   │   ├── enrollments.py   # Enrollment routes
│   │   │   ├── billing.py       # Stripe billing routes
│   │   │   └── admin.py         # Admin routes
│   │   ├── core/
│   │   │   ├── config.py        # App configuration
│   │   │   ├── database.py      # Database connection
│   │   │   ├── security.py      # JWT and password hashing
│   │   │   └── deps.py          # FastAPI dependencies
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   ├── course.py        # Course model
│   │   │   ├── enrollment.py    # Enrollment model
│   │   │   └── subscription.py  # Subscription model
│   │   ├── schemas/
│   │   │   ├── user.py          # User Pydantic schemas
│   │   │   ├── course.py        # Course Pydantic schemas
│   │   │   ├── enrollment.py    # Enrollment Pydantic schemas
│   │   │   └── subscription.py  # Subscription Pydantic schemas
│   │   └── services/
│   │       ├── auth_service.py       # Authentication logic
│   │       ├── course_service.py     # Course business logic
│   │       ├── enrollment_service.py # Enrollment logic + limits
│   │       └── billing_service.py    # Stripe integration
│   ├── migrations/              # Alembic migration files
│   ├── tests/
│   │   ├── conftest.py          # Test configuration
│   │   ├── test_auth.py         # Auth tests (8 tests)
│   │   ├── test_courses.py      # Course tests (6 tests)
│   │   ├── test_enrollments.py  # Enrollment tests (5 tests)
│   │   └── test_webhooks.py     # Webhook tests (4 tests)
│   ├── main.py                  # FastAPI application entry point
│   └── requirements.txt
└── frontend/
└── src/
├── pages/
│   ├── Landing.jsx      # Landing page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Register page
│   ├── app/             # Student panel
│   │   ├── Courses.jsx      # Browse courses
│   │   ├── MyCourses.jsx    # Enrolled courses
│   │   ├── Profile.jsx      # User profile
│   │   └── Billing.jsx      # Subscription management
│   └── admin/           # Admin panel
│       ├── Dashboard.jsx    # Stats overview
│       ├── ManageCourses.jsx # Course CRUD
│       ├── Users.jsx        # All users
│       ├── Enrollments.jsx  # All enrollments
│       └── Subscriptions.jsx # All subscriptions
├── layouts/
│   ├── UserLayout.jsx   # Student navigation
│   └── AdminLayout.jsx  # Admin navigation
├── components/
│   └── ProtectedRoute.jsx # Route guard
├── store/
│   └── AuthContext.jsx  # Auth state management
└── services/
└── api.js           # Axios configuration

## Setup Instructions

### Prerequisites
- Python 3.12+
- Node.js 18+
- MySQL 8+
- Stripe account (test mode)

### Step 1 — Clone Repository

```bash
git clone https://github.com/tanithagit/online_learning.git
cd online_learning
```

### Step 2 — Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3 — Environment Variables

```bash
copy .env.example .env
```

Update `backend\.env`:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/online_learning
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
FRONTEND_URL=http://localhost:5173
```

### Step 4 — Database Setup

```sql
CREATE DATABASE online_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
alembic upgrade head
```

### Step 5 — Start Backend

```bash
uvicorn main:app --reload
```

### Step 6 — Frontend Setup

```bash
cd frontend
npm install
```

Update `frontend\.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 7 — Start Frontend

```bash
npm run dev
```

### Step 8 — Create Admin User

Register a user then run in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Stripe Configuration

### Step 1 — Create Stripe Account
Go to https://stripe.com and create account.

### Step 2 — Get API Keys
Go to Developers → API Keys and copy:
- Publishable key → `pk_test_...`
- Secret key → `sk_test_...`

### Step 3 — Create Pro Plan Product
Go to Product catalog → Add product:
- Name: Pro Plan
- Price: $9.99
- Billing: Monthly recurring
- Copy Price ID → `price_...`

### Step 4 — Setup Webhook (Local Testing)
Download Stripe CLI from https://github.com/stripe/stripe-cli/releases

```bash
stripe login
stripe listen --forward-to localhost:8000/billing/webhook
```

Copy webhook secret → `whsec_...`

### Step 5 — Test Payment
Use Stripe test card:

Card: 4242 4242 4242 4242
Expiry: 12/29
CVC: 123

## Running Tests

```bash
cd backend
pytest tests/ -v
```

### Test Results

## API Documentation

Visit http://localhost:8000/docs for full Swagger documentation.

### Key Endpoints

#### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |

#### Courses
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | /courses/ | List all courses | All users |
| POST | /courses/ | Create course | Admin only |
| PUT | /courses/{id} | Update course | Admin only |
| DELETE | /courses/{id} | Delete course | Admin only |

#### Enrollments
| Method | Endpoint | Description |
|---|---|---|
| GET | /enrollments/my | Get my enrollments |
| POST | /enrollments/ | Enroll in course |
| DELETE | /enrollments/{id} | Unenroll |

#### Billing
| Method | Endpoint | Description |
|---|---|---|
| GET | /billing/subscription | Get subscription |
| POST | /billing/create-checkout-session | Start Stripe checkout |
| POST | /billing/cancel | Cancel subscription |
| POST | /billing/webhook | Stripe webhook handler |

#### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/users | All users |
| GET | /admin/enrollments | All enrollments |
| GET | /admin/subscriptions | All subscriptions |

## Key Design Decisions

### 1. Service Layer Pattern
Business logic is separated into services keeping routes clean and testable. Routes only handle HTTP concerns while services handle business logic.

### 2. Enrollment Limit Enforcement on Backend
Free plan limit of 2 enrollments is enforced strictly on the backend in `enrollment_service.py`. Frontend shows errors but cannot bypass backend validation.

### 3. Webhook-First Subscription Sync
Subscription state is updated via Stripe webhooks not just API responses. This ensures data consistency even if user closes browser during payment.

### 4. Role-Based Access Control
Admin and user roles enforced via FastAPI dependencies on every protected route. Users cannot access admin endpoints even with valid tokens.

### 5. JWT Stateless Authentication
Stateless JWT tokens include user email and role. No session storage needed making the API horizontally scalable.

### 6. SQLite for Testing
Tests use SQLite in-memory database instead of MySQL. This makes tests fast and isolated without affecting production data.

## Subscription Plans

| Feature | Free Plan | Pro Plan |
|---|---|---|
| Browse courses | ✅ | ✅ |
| Max enrollments | 2 | Unlimited |
| Price | $0/month | $9.99/month |
| Cancel anytime | — | ✅ |

## User Roles

| Feature | Student | Admin |
|---|---|---|
| Browse courses | ✅ | ✅ |
| Enroll in courses | ✅ | ❌ |
| Manage subscription | ✅ | ❌ |
| Create courses | ❌ | ✅ |
| Delete courses | ❌ | ✅ |
| View all users | ❌ | ✅ |
| View all enrollments | ❌ | ✅ |
| View all subscriptions | ❌ | ✅ |

## Trade-offs

### bcrypt vs passlib
Switched from passlib to direct bcrypt library due to compatibility issues with Python 3.12. Direct bcrypt is more stable.

### SQLite for tests vs MySQL
Using SQLite for tests instead of MySQL test database. Trade-off is slight SQL dialect differences but much faster test execution.

### Stripe Checkout vs Custom Payment Form
Used Stripe hosted Checkout page instead of custom payment form. Trade-off is less UI control but much better security and PCI compliance.

## GitHub Repository

https://github.com/tanithagit/online_learning