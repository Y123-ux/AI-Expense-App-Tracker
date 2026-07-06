# AI Expense Tracker

A full-stack, AI-powered expense tracking application with OCR receipt scanning, intelligent categorization using Claude LLM, and comprehensive spending analytics. Built with a modern microservices architecture spanning web, mobile, and a dedicated OCR service.

## Features

- **Receipt Scanning & OCR** - Upload receipt images and automatically extract merchant, amount, date, and line items using Tesseract OCR
- **AI-Powered Categorization** - Expenses are automatically categorized using Anthropic's Claude LLM based on merchant and description
- **Spending Analytics** - Interactive dashboard with monthly trends, category breakdowns, and AI-generated spending insights
- **Multi-Platform** - Vue 3 web app + React Native (Expo) mobile app
- **Multi-Currency Support** - 10 currencies including USD, EUR, GBP, PKR, INR, and more
- **User Authentication** - JWT-based auth with secure password hashing (bcrypt)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | SQLite (better-sqlite3) |
| **Web Frontend** | Vue 3, Vite, Tailwind CSS, Pinia, Chart.js |
| **Mobile App** | React Native, Expo, React Navigation |
| **OCR Service** | Python, FastAPI, pytesseract, Pillow |
| **AI/LLM** | Anthropic Claude API (@anthropic-ai/sdk) |
| **Auth** | JWT (jsonwebtoken), bcryptjs |

## Project Structure

```
AI Expense App Tracker/
├── backend/             # Express.js REST API
│   └── src/
│       ├── controllers/     # Request handlers
│       ├── services/        # Business logic
│       ├── repositories/    # Data access layer
│       ├── database/        # SQLite schema, migrations, seeds
│       ├── middleware/       # Auth, validation, error handling
│       ├── strategies/      # OCR & LLM strategy pattern implementations
│       ├── observers/       # Event-driven observers (auto-categorization)
│       ├── models/          # TypeScript interfaces & DTOs
│       └── routes/          # API route definitions
├── web/                 # Vue 3 SPA
│   └── src/
│       ├── views/           # Page components (Dashboard, Expenses, Scan, Analytics, Profile)
│       ├── components/      # Reusable UI components (charts, forms, layout)
│       ├── stores/          # Pinia state management
│       ├── services/        # Axios API client
│       └── router/          # Vue Router configuration
├── mobile/              # React Native (Expo) app
│   └── src/
│       ├── screens/         # App screens (Home, Expenses, Camera, Analytics)
│       ├── components/      # Reusable mobile components
│       ├── contexts/        # React Context (Auth, Expenses)
│       └── services/        # API client
└── ocr-service/         # Python FastAPI microservice
    ├── main.py              # FastAPI server entry
    ├── ocr_processor.py     # Image preprocessing & Tesseract OCR
    └── receipt_parser.py    # Receipt text parsing (merchant, amount, date, items)
```

## Design Patterns

- **Repository Pattern** - Abstract base repository with CRUD operations for each entity
- **Strategy Pattern** - Pluggable OCR providers (Tesseract.js / Python) and LLM providers (Claude / Mock)
- **Observer Pattern** - EventBus for auto-categorization on expense creation and receipt scanning
- **Singleton Pattern** - Database connection and configuration management
- **MVC** - Controllers, Services, and Repository layers with clear separation of concerns

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for OCR service, optional)
- Tesseract OCR installed on system (for Python OCR service)

### Installation

```bash
# Install backend dependencies
cd backend && npm install

# Install web dependencies
cd ../web && npm install

# Install mobile dependencies (optional)
cd ../mobile && npm install

# Install OCR service dependencies (optional)
cd ../ocr-service && pip install -r requirements.txt
```

### Environment Setup

Create `backend/.env`:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
DB_PATH=./expense_tracker.db
UPLOAD_DIR=./uploads
ANTHROPIC_API_KEY=your-anthropic-api-key
OCR_PROVIDER=tesseract
LLM_PROVIDER=claude
PYTHON_OCR_URL=http://localhost:8000
```

### Running the App

```bash
# From project root:

# Start the backend API server
npm run backend

# Start the web frontend (in a new terminal)
npm run web

# Start the Python OCR service (optional, in a new terminal)
npm run ocr

# Start the mobile app (in a new terminal)
cd mobile && npm start
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

### Demo Setup

To populate the app with sample data for a quick preview:

```bash
cd backend && npm run seed:demo
```

Then login with the demo account:
- **Email:** `yusra@demo.com`
- **Password:** `demo123456`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |
| POST | `/api/auth/avatar` | Upload avatar |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (supports filters: startDate, endDate, categoryId, search, limit, offset) |
| GET | `/api/expenses/:id` | Get expense by ID |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Receipts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/receipts/scan` | Upload & scan receipt image |
| GET | `/api/receipts` | List all receipts |
| GET | `/api/receipts/:id` | Get receipt details |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create custom category |
| DELETE | `/api/categories/:id` | Delete category |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard stats (totals, trends, category breakdown) |
| GET | `/api/analytics/summary` | AI-generated monthly spending summary |
| GET | `/api/analytics/patterns` | AI-detected spending patterns |

## Database Schema

```
users          - id, email, password_hash, name, currency, avatar_url, created_at
categories     - id, name, icon, color, user_id, is_default
expenses       - id, amount, merchant, description, date, category_id, user_id, receipt_id, created_at
receipts       - id, image_path, raw_text, parsed_data, user_id, created_at
```

## Default Categories

| Category | Icon | Color |
|----------|------|-------|
| Food & Dining | :hamburger: | #AA1C41 |
| Groceries | :shopping_cart: | #E68457 |
| Transportation | :car: | #5E244E |
| Shopping | :shopping_bags: | #C98AB7 |
| Entertainment | :clapper: | #8E3D6E |
| Healthcare | :hospital: | #D4713E |
| Utilities | :bulb: | #E68457 |
| Education | :books: | #4A1C3E |
| Travel | :airplane: | #D44B6A |
| Other | :package: | #6B7280 |

## How It Works

### Receipt Scanning Flow
1. User uploads a receipt image via web or mobile
2. Image is processed through OCR (Tesseract.js or Python microservice)
3. Receipt text is parsed to extract merchant, amount, date, and items
4. An expense is auto-created from the parsed data
5. Claude LLM categorizes the expense based on merchant name

### AI Categorization Flow
1. When an expense is created, the EventBus emits a creation event
2. The ExpenseObserver picks up the event
3. If no category is assigned, the LLM Strategy suggests a category based on the merchant
4. The expense is automatically updated with the suggested category

## License

MIT
