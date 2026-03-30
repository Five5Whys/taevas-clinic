# Nexus EHR Frontend - Setup & Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /sessions/eager-jolly-pascal/nexus-ehr/frontend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` (optional, defaults are already set):

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development

### Project Structure Overview

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── LoadingSkeleton.tsx
│   │   └── ProtectedRoute.tsx
│   └── layout/           # Layout wrapper components
│       ├── BottomNav.tsx
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       └── TopBar.tsx
├── hooks/
│   └── useAuth.ts        # Authentication hook
├── pages/
│   ├── auth/             # Login & OTP verification
│   ├── superadmin/       # Super Admin dashboard
│   ├── clinicadmin/      # Clinic Admin dashboard
│   ├── doctor/           # Doctor dashboard
│   ├── patient/          # Patient dashboard
│   └── shared/           # Shared pages
├── services/
│   ├── api.ts            # Axios instance with interceptors
│   └── authService.ts    # Authentication API methods
├── stores/
│   └── authStore.ts      # Zustand auth store
├── theme/
│   ├── taevasTheme.ts    # MUI theme with Taevas colors
│   └── ThemeProvider.tsx # Theme context provider
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── constants.ts      # App constants & navigation config
│   └── helpers.ts        # Utility functions
├── App.tsx               # Main app component with routing
├── main.tsx              # App entry point
└── sw.ts                 # Service Worker for PWA
```

## Key Features & Implementation

### 1. Authentication

**File**: `src/services/authService.ts`, `src/stores/authStore.ts`

The authentication flow:
- User enters phone number
- OTP sent to phone
- OTP verified, JWT token received
- Token stored in localStorage
- Automatic token refresh on 401

Usage in components:
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, logout } = useAuth();
```

### 2. State Management

**File**: `src/stores/authStore.ts`

Uses Zustand for lightweight state management:

```typescript
import { useAuthStore } from '@/stores/authStore';

const { user, token, login, logout } = useAuthStore();
```

### 3. API Integration

**File**: `src/services/api.ts`

Features:
- Automatic JWT token attachment to headers
- Automatic token refresh on 401
- Error handling and logging
- Base URL configuration

```typescript
import api from '@/services/api';

// API calls automatically include auth token
const response = await api.get('/doctor/appointments');
```

### 4. Routing

**File**: `src/App.tsx`

- Public routes: `/login`, `/verify-otp`
- Protected routes by role:
  - SuperAdmin: `/superadmin/*`
  - ClinicAdmin: `/admin/*`
  - Doctor: `/doctor/*`
  - Patient: `/patient/*`

### 5. Theme

**Files**: `src/theme/taevasTheme.ts`, `src/theme/ThemeProvider.tsx`

- Taevas brand colors (Primary: #5519E6, Secondary: #A046F0, etc.)
- Clash Display font for headings
- Archivo font for body
- Light & dark mode support
- MUI component customization

Toggle theme:
```typescript
import { useTheme } from '@/theme/ThemeProvider';

const { isDarkMode, toggleTheme } = useTheme();
```

### 6. Responsive Design

All components are mobile-first with MUI breakpoints:
- `xs`: 0px (mobile)
- `sm`: 600px (tablet)
- `md`: 960px (desktop)
- `lg`: 1280px (large desktop)
- `xl`: 1920px (extra large)

Mobile-specific components:
- Drawer sidebar (temporary on mobile)
- Bottom navigation (mobile only, hidden on desktop)
- Search bar (hidden on mobile)

## Backend Integration

### Expected Backend API Endpoints

**Authentication**:
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/refresh-token` - Refresh JWT

**SuperAdmin**:
- `GET /api/superadmin/clinics`
- `GET /api/superadmin/doctors`
- `GET /api/superadmin/patients`
- `GET /api/superadmin/stats`
- `GET /api/superadmin/activity`

**ClinicAdmin**:
- `GET /api/clinicadmin/appointments`
- `GET /api/clinicadmin/doctors`
- `GET /api/clinicadmin/patients`
- `GET /api/clinicadmin/stats`
- `GET /api/clinicadmin/revenue`

**Doctor**:
- `GET /api/doctor/appointments`
- `GET /api/doctor/queue`
- `GET /api/doctor/patients`
- `GET /api/doctor/prescriptions`

**Patient**:
- `GET /api/patient/appointments`
- `GET /api/patient/prescriptions`
- `GET /api/patient/health-records`
- `GET /api/patient/profile`

Response format expected:
```json
{
  "data": {},
  "message": "Success",
  "success": true,
  "timestamp": "2024-03-26T10:00:00Z"
}
```

## Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Adding New Features

### Add a New Page

1. Create page file: `src/pages/doctor/Appointments.tsx`
2. Import in `src/App.tsx`
3. Add route in appropriate Routes section
4. Add navigation in `src/utils/constants.ts`

### Add a New API Service

1. Create file: `src/services/appointmentService.ts`
2. Import api instance: `import api from './api'`
3. Define methods using api client
4. Export service object

### Add a New Component

1. Create in `src/components/`
2. Use MUI components
3. Apply theme colors using `useTheme()`
4. Export as default

### Add a New Custom Hook

1. Create in `src/hooks/useYourHook.ts`
2. Use existing hooks inside
3. Return typed object
4. Export and use in components

## Troubleshooting

### Module Not Found
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check import paths use `@/` alias

### Type Errors
- Run `npm run build` to see all type errors
- Check `tsconfig.json` is correct
- Ensure all imports have types

### API Not Connecting
- Verify backend is running on `localhost:8080`
- Check proxy config in `vite.config.ts`
- Open DevTools Network tab to see requests
- Check CORS headers from backend

### Build Errors
- Clear dist folder: `rm -rf dist`
- Check for syntax errors: `npm run lint`
- Verify all dependencies installed: `npm list`

## Performance Tips

1. **Code Splitting**: Routes automatically code-split by Vite
2. **Image Optimization**: Compress images before adding to public/
3. **Lazy Loading**: Use React.lazy() for component routes
4. **Query Caching**: React Query caches API responses
5. **Tree Shaking**: Unused code is removed in production build

## Browser DevTools

Install these extensions for better debugging:

1. **React Developer Tools**
   - Chrome: https://chrome.google.com/webstore/...
   - Firefox: https://addons.mozilla.org/...

2. **Redux DevTools** (works with Zustand via middleware)
   - Chrome: https://chrome.google.com/webstore/...

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized build in `dist/` folder.

### Deploy to Server

The `dist/` folder contains static files ready for deployment:

```bash
# Copy dist folder to server
scp -r dist/* user@server:/var/www/nexus-ehr/

# Or with Docker, Vercel, Netlify, etc.
```

### Environment Variables for Production

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.nexus-ehr.com/api
```

## Security Checklist

- ✅ JWT tokens stored in localStorage (consider sessionStorage for higher security)
- ✅ Automatic token refresh on expiry
- ✅ Route protection with ProtectedRoute component
- ✅ HTTPS enforced in production
- ✅ CORS configured on backend
- ✅ No sensitive data in environment variables
- ✅ XSS protection via React
- ✅ CSRF tokens (configure if backend uses them)

## Support & Resources

- **React**: https://react.dev
- **MUI**: https://mui.com/material-ui/
- **TypeScript**: https://www.typescriptlang.org/
- **Vite**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Query**: https://tanstack.com/query/

## Common Git Commands

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git commit -m "Add my feature"

# Push to remote
git push origin feature/my-feature

# Create Pull Request on GitHub
# Then merge after review
```

## Next Steps

1. ✅ Frontend scaffold created
2. ⏳ Backend API implementation
3. ⏳ Database setup
4. ⏳ Testing (unit & integration)
5. ⏳ E2E testing
6. ⏳ Deployment pipeline
7. ⏳ Production launch

---

**Last Updated**: March 26, 2024
**Maintained by**: Taevas Life Sciences Development Team
