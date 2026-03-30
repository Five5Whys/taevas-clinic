# Nexus EHR Frontend

A production-ready React + Material-UI + TypeScript frontend for Nexus EHR - a comprehensive healthcare platform by Taevas Life Sciences.

## Features

- **Role-based UI**: Separate dashboards for SuperAdmin, ClinicAdmin, Doctor, and Patient
- **Authentication**: Phone-based OTP login with JWT token management
- **Responsive Design**: Mobile-first approach with Material-UI components
- **Theme Support**: Light and dark mode with Taevas brand colors
- **Progressive Web App**: Offline support with Service Workers
- **State Management**: Zustand for lightweight state management
- **API Integration**: Axios with automatic token refresh and interceptors
- **TypeScript**: Fully typed codebase for better development experience

## Tech Stack

- **React 18**: Latest React with hooks
- **Material-UI (MUI) 5**: Comprehensive component library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router v6**: Client-side routing
- **Zustand**: Lightweight state management
- **React Query**: Data fetching and caching
- **Axios**: HTTP client with interceptors
- **date-fns**: Date utilities
- **Recharts**: Data visualization
- **Emotion**: CSS-in-JS styling (via MUI)

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets and PWA manifest
├── src/
│   ├── components/      # Reusable React components
│   │   ├── common/      # Common UI components (ProtectedRoute, LoadingSkeleton)
│   │   └── layout/      # Layout components (Sidebar, TopBar, DashboardLayout)
│   ├── pages/           # Page components organized by role
│   │   ├── auth/        # Authentication pages (Login, OTP verification)
│   │   ├── superadmin/  # Super Admin dashboard
│   │   ├── clinicadmin/ # Clinic Admin dashboard
│   │   ├── doctor/      # Doctor dashboard
│   │   ├── patient/     # Patient dashboard
│   │   └── shared/      # Shared pages (if any)
│   ├── services/        # API services and HTTP client
│   ├── stores/          # Zustand stores for state management
│   ├── hooks/           # Custom React hooks
│   ├── theme/           # MUI theme configuration
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and constants
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Entry point
│   └── sw.ts            # Service Worker
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Integration

The frontend communicates with the Spring Boot backend via:

- Base URL: `/api` (proxied to `http://localhost:8080` in development)
- Authentication: Bearer token in `Authorization` header
- Token Management: Automatic refresh on 401 response

### Key Endpoints

- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP and get token
- `POST /auth/refresh-token` - Refresh JWT token
- `GET /superadmin/*` - Super Admin endpoints
- `GET /clinicadmin/*` - Clinic Admin endpoints
- `GET /doctor/*` - Doctor endpoints
- `GET /patient/*` - Patient endpoints

## Authentication Flow

1. User enters phone number
2. System sends 6-digit OTP via SMS
3. User enters OTP
4. System validates and returns JWT token + user data
5. Token stored in localStorage
6. Automatic token refresh on expiry
7. Redirect to role-based dashboard

## Theme & Branding

The application uses Taevas brand colors and typography:

- **Primary**: #5519E6 (Taevas Blue)
- **Secondary**: #A046F0 (Taevas Purple)
- **Success**: #CDDC50 (Lime green)
- **Warning**: #FF8232 (Orange)
- **Danger**: #F43F5E (Red)
- **Fonts**: Clash Display (headings), Archivo (body)

Dark mode is supported with automatic theme switching based on system preference.

## Development

### Code Style

- ESLint for linting
- Prettier for code formatting
- TypeScript strict mode enabled

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Debugging

Use React DevTools and Redux DevTools browser extensions for debugging.

## Build & Deployment

### Production Build

```bash
npm run build
```

Outputs to `dist/` directory.

### PWA Support

- Service Worker caches static assets
- Works offline with cached data
- Installable as native-like app

### Performance Optimizations

- Code splitting via Vite
- Lazy loading routes
- Image optimization
- Tree-shaking unused code

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Security

- JWT-based authentication
- Secure token storage (localStorage)
- HTTPS in production
- CORS configuration
- XSS protection via React
- CSRF token handling (if required by backend)

## Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3001
```

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### API Connection Issues
- Ensure backend is running on `localhost:8080`
- Check CORS configuration on backend
- Verify proxy configuration in `vite.config.ts`

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open Pull Request

## License

Copyright © 2024 Taevas Life Sciences. All rights reserved.

## Support

For issues and questions, contact the development team or create an issue in the repository.
