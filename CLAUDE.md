# TaevasClinic — Project Guide

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2.4, PostgreSQL 17.6, Flyway migrations, JWT auth
- **Frontend**: React 18, TypeScript, Vite, MUI 5, React Query, React Router 6

## Database
- Host: `localhost:5432`
- Database: `taevas_clinic`
- User: `postgres` / Password: `Login@123`

## Start Backend
```bash
cd backend
# Rebuild (if needed):
./mvnw package -DskipTests -q
# Run:
java -Djdk.net.unixdomain.tmpdir=C:/tmp -jar target/clinic-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```
Backend runs on `http://localhost:8080`

## Start Frontend
```bash
cd frontend
npm install
npm run dev -- --host
```
Frontend runs on `http://localhost:5173`. Vite proxies `/api` → `localhost:8080`.

## Login Credentials
- Phone: `9876543210` / Password: `wecandonow` → SUPERADMIN role

## Roles
SUPERADMIN, CLINIC_ADMIN, DOCTOR, PATIENT

## External Access (Tunnel)
```bash
cloudflared tunnel --url http://localhost:5173
```
CORS is configured with wildcard `*.trycloudflare.com` — no backend changes needed on URL change.

## Key Directories
- `frontend/src/pages/superadmin/` — Super Admin pages (Dashboard, Countries, Clinics, Equidor, FeatureFlags, etc.)
- `frontend/src/hooks/superadmin/` — React Query hooks
- `frontend/src/services/superadmin/` — API service functions
- `frontend/src/types/superadmin.ts` — TypeScript types
- `frontend/src/components/layout/` — DashboardLayout, Sidebar
- `frontend/src/utils/constants.ts` — Nav config, roles, API endpoints
- `backend/src/main/java/com/taevas/clinic/` — Java source
- `backend/src/main/resources/` — application.yml, Flyway migrations

## Windows Notes
- JVM flag required: `-Djdk.net.unixdomain.tmpdir=C:/tmp`
- Maven wrapper: may need `-Dmaven.multiModuleProjectDirectory=.`

## Repo
`https://github.com/Five5Whys/taevas-clinic` (private)
