# HealthLab Frontend

A modern frontend for healthcare diagnostics lab services built with React, Vite, and TailwindCSS.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                  # Main application component with routes
│   ├── main.jsx                 # Application entry point
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Small, atomic components
│   │   ├── layout/              # Layout components
│   │   ├── admin-sidebar.jsx    # Admin sidebar navigation
│   │   ├── dashboard-sidebar.jsx # Customer dashboard sidebar
│   │   ├── footer.jsx           # Site footer component
│   │   └── navbar.jsx           # Main navigation component
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.jsx      # Authentication context
│   │   └── CartContext.jsx      # Shopping cart context
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication hook
│   │   └── useApi.js            # API interaction hook
│   ├── layout/                  # Layout wrapper components
│   │   ├── RootLayout.jsx       # Main layout with navbar/footer
│   │   ├── AdminLayout.jsx      # Admin dashboard layout
│   │   └── DashboardLayout.jsx  # Customer dashboard layout
│   ├── pages/                   # Page components
│   │   ├── HomePage.jsx         # Home page
│   │   ├── AboutPage.jsx        # About page
│   │   ├── ContactPage.jsx      # Contact page
│   │   ├── BookingPage.jsx      # Booking flow page
│   │   ├── TestCatalogPage.jsx  # Test catalog
│   │   ├── TestDetailsPage.jsx  # Test details
│   │   ├── auth/                # Authentication pages
│   │   ├── dashboard/           # Customer dashboard pages
│   │   └── admin/               # Admin pages
│   ├── providers/               # Provider components
│   │   └── theme-provider.jsx   # Theme provider for dark/light mode
│   └── utils/                   # Utility functions
│       ├── api.js               # API client
│       └── helpers.js           # Helper functions
├── styles/
│   └── globals.css              # Global styles with Tailwind
├── public/                      # Static assets
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Project dependencies
```

## Features

- Modern React application with React Router
- Responsive design for all screen sizes
- Dark/Light theme mode
- Patient & Admin dashboards
- Test booking system
- Diagnostic test catalog
- Patient test reporting

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Technologies

- React
- Vite
- TailwindCSS
- React Router
- Lucide React (icons)
- Radix UI (accessible components)
