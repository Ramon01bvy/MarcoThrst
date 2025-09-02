# Overview

This is a fitness and wellness application called "Marco Donato" built with a modern full-stack architecture. The application provides comprehensive fitness tracking, nutrition management, workout planning, and progress monitoring capabilities. It features user authentication, subscription management, and a responsive design optimized for both desktop and mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation schemas
- **Charts**: Recharts for data visualization and progress tracking

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Authentication**: Replit Auth with OpenID Connect (OIDC) integration
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM for type-safe database operations

## Database Design
- **Database**: PostgreSQL hosted on Neon serverless platform
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**:
  - Users with subscription management
  - Workouts and exercises with many-to-many relationships
  - User workout logs and exercise tracking
  - Meals and nutrition plans
  - User meal logs for calorie tracking
  - Session storage for authentication

## Authentication & Authorization
- **Provider**: Replit Auth with OIDC flow
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation/update on login
- **Route Protection**: Middleware-based authentication checks
- **Frontend Auth**: React hooks for authentication state management

## Development & Build Setup
- **Bundler**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement with error overlay
- **Production Build**: Static assets served by Express with fallback routing
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer

# External Dependencies

## Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication
- **Replit Auth**: OIDC-based authentication system
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **openid-client**: OIDC client library for authentication flows

## Frontend Libraries
- **shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for complex components
- **TanStack Query**: Server state management and caching
- **Recharts**: Charting library for progress visualization
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form management with validation

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with plugins

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class utilities
- **zod**: Runtime type validation for forms and API
- **memoizee**: Function memoization for performance optimization