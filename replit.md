# Overview

This is a full-stack trading platform application called "TradePro" built with React, Express, and PostgreSQL. The application provides users with trading capabilities, real-time analytics, portfolio management, and authentication features. It follows a modern web architecture with a React frontend, Express backend, and uses Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for development and bundling
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting dark mode
- **UI Components**: Comprehensive component library using Radix UI primitives with shadcn/ui design system
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Recharts for financial data visualization and analytics
- **Animations**: Framer Motion for smooth page transitions and micro-interactions

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Session Storage**: In-memory storage for development (MemStorage class) with interface for easy database migration
- **API Design**: RESTful API structure with standardized error handling and logging middleware
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage
- **Database**: PostgreSQL with Neon serverless database connection
- **ORM**: Drizzle ORM with TypeScript-first approach for type-safe database operations
- **Schema**: Centralized schema definition in shared directory with Zod validation integration
- **Migrations**: Drizzle Kit for database schema migrations and management

## Authentication & Authorization
- **Strategy**: JWT tokens stored in localStorage with Bearer token authentication
- **Password Security**: bcryptjs for secure password hashing with salt rounds
- **Route Protection**: Middleware-based authentication for protected API endpoints
- **Session Management**: Token-based sessions with configurable expiration (24 hours default)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Modern TypeScript ORM for database operations and migrations

## UI/UX Libraries
- **Radix UI**: Headless UI primitives for accessible component foundation
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for UI elements
- **Framer Motion**: Animation library for enhanced user experience

## Development Tools
- **Vite**: Fast build tool with hot module replacement and React plugin support
- **TypeScript**: Type-safe development with strict configuration
- **ESBuild**: Fast JavaScript bundler for production builds

## Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

## Charts & Analytics
- **Recharts**: React charting library built on D3 for financial data visualization
- **Date-fns**: Modern date utility library for time-based calculations

## Authentication & Security
- **JSON Web Tokens**: Stateless authentication token standard
- **bcryptjs**: Password hashing library with configurable salt rounds

## Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins