# HealthLab - Pathology Lab Website

A comprehensive pathology lab website with test booking, customer portal, and admin panel built with React, TypeScript, and Supabase.

## Features

### Customer Features
- **Homepage**: Professional landing page with lab information, services, and testimonials
- **Test Catalog**: Browse tests by category with search and filtering
- **User Registration & Login**: Secure authentication system
- **Online Booking**: Book tests with date/time selection and prescription upload
- **Customer Dashboard**: View bookings, download reports, manage profile
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Admin Dashboard**: Overview of bookings, revenue, and statistics
- **Booking Management**: View, update status, and manage all bookings
- **Customer Management**: View and manage customer information
- **Test Management**: Add, edit, and manage test catalog
- **Report Upload**: Upload and assign PDF reports to bookings

### Technical Features
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Real-time Updates**: Live status updates and notifications
- **File Upload**: Prescription and report file handling
- **Data Export**: Export booking and customer data
- **Security**: Row-level security with Supabase
- **Performance**: Optimized loading and caching

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pathology-lab-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy the project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Add your Supabase credentials

4. **Set up the database**
   - Run the SQL migrations in your Supabase dashboard
   - Enable Row Level Security (RLS)
   - Set up the required tables and policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Tables
- `users` - Customer and admin user profiles
- `categories` - Test categories (Blood Tests, Urine Tests, etc.)
- `tests` - Individual test information with pricing
- `bookings` - Test bookings with customer details
- `reports` - Test reports linked to bookings

### Key Features
- Row Level Security (RLS) enabled on all tables
- Proper foreign key relationships
- Optimized indexes for performance
- Secure file storage for prescriptions and reports

## Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Backend (Supabase)
- Database and authentication are handled by Supabase
- File storage for prescriptions and reports
- Real-time subscriptions for live updates

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
│   └── useAuth.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── Home.tsx
│   ├── Tests.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── BookTest.tsx
│   ├── Admin.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── App.tsx
└── main.tsx
```

## Key Components

### Authentication
- JWT-based authentication with Supabase
- Role-based access control (customer/admin)
- Protected routes and components

### Booking System
- Multi-step booking process
- Date/time selection with availability
- Prescription upload functionality
- Email/SMS notifications

### Admin Panel
- Comprehensive dashboard with analytics
- Booking status management
- Customer and test management
- Data export capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@healthlab.com
- Phone: +91 9876543210
- Documentation: [Link to docs]

## Roadmap

- [ ] WhatsApp integration for notifications
- [ ] Payment gateway integration
- [ ] Mobile app development
- [ ] AI-powered test recommendations
- [ ] Telemedicine integration
- [ ] Multi-language support