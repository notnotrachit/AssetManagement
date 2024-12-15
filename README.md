# Asset Management System

A modern asset management system built with Django REST Framework and Next.js, featuring role-based access control, dynamic form fields, and a responsive UI.

## Features

- 🔐 Role-based access control (Admin, Vendor, User)
- 📝 Dynamic form fields for different asset categories
- 🎨 Modern, responsive UI with dark/light mode
- 🔍 Asset filtering and search capabilities
- 📱 Mobile-friendly design

## Tech Stack

### Backend
- Python 
- Django 
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- DaisyUI
- Framer Motion

## Prerequisites

- Python 3.8 or higher
- Node.js 16.x or higher
- PostgreSQL
- pip (Python package manager)
- npm (Node package manager)

## Setup Instructions

### Backend Setup

1. Create and activate a virtual environment:
```bash
cd assetmanagementbackend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create .env file in assetmanagementbackend directory
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PASSWORD=""
POSTGRES_HOST=""
POSTGRES_PORT=""

SECRET_KEY=""
# DEBUG="True"

CORS_ALLOWED_ORIGINS=""

ALLOWED_HOST=""
CSRF_TRUSTED_ORIGINS=""
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file in frontend directory
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
hyathi/
├── assetmanagementbackend/    # Django backend
│   ├── assets/               # Assets app
│   ├── users/               # Users app
│   └── manage.py
│
└── frontend/                # Next.js frontend
    ├── app/                # App router pages
    ├── components/         # React components
    └── public/            # Static files
```

## API Endpoints

All the API Docs will be available at `localhost:8000/api/schema/swagger-ui/`
