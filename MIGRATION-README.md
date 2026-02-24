# CustomEMR — Next.js (Migrated from React Vite)

## Migration Status: COMPLETE

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project scaffolding + dependencies | DONE |
| 1 | CSS & Styling (globals.css, Tailwind v4, fonts) | DONE |
| 2 | Shared assets (data files, common components) | DONE |
| 3 | Layout system (root layout, protected layout, Sidebar, Navbar) | DONE |
| 4 | Auth system (AuthContext, login page) | DONE |
| 5 | AppContext and data provider | DONE |
| 6 | Migrate all 11 page components | DONE |
| 7 | API routes for backend readiness | DONE |
| 8 | Build verification (0 errors, 23 routes) | DONE |

---

## Quick Start

```bash
cd custom-emr-next
npm install
npm run dev      # → http://localhost:3000
```

**Demo login:** `demo` / `demo@123`

---

## Project Structure

```
src/
├── app/
│   ├── layout.js                          # Root layout (Inter font, providers)
│   ├── globals.css                        # Tailwind v4 + custom CSS (from index.css)
│   ├── login/page.jsx                     # Login page
│   ├── (protected)/                       # Auth-guarded route group
│   │   ├── layout.jsx                     # Sidebar + Navbar + auth check
│   │   ├── page.jsx                       # Dashboard (/, Provider/Admin/Staff)
│   │   ├── scheduling/page.jsx            # Appointments
│   │   ├── scheduling/unsigned/page.jsx   # Unsigned visits
│   │   ├── patients/page.jsx              # Patient management
│   │   ├── communications/[section]/page.jsx  # Tasks, Fax, Chat, Email, etc.
│   │   ├── cpoe/page.jsx                  # E-Prescriptions, Lab, Imaging
│   │   ├── billing/page.jsx               # Encounters & Claims
│   │   ├── billing/[section]/page.jsx     # AR, Payments
│   │   ├── referral/page.jsx              # Referral In/Out
│   │   ├── reports/page.jsx               # Clinical & Financial reports
│   │   ├── settings/page.jsx              # System configuration
│   │   └── ai-agents/page.jsx             # AI monitoring (recharts)
│   └── api/                               # Backend API routes (NEW)
│       ├── auth/login/route.js
│       ├── auth/logout/route.js
│       ├── auth/me/route.js
│       ├── patients/route.js
│       ├── appointments/route.js
│       ├── prescriptions/route.js
│       ├── billing/route.js
│       ├── referrals/route.js
│       └── reports/route.js
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx                    # Navigation (Link + usePathname)
│   │   └── Navbar.jsx                     # Header (usePathname)
│   └── common/                            # 14 reusable components
│       ├── Modal.jsx, DataTable.jsx, SearchBar.jsx
│       ├── InputField.jsx, SelectField.jsx, FormField.jsx
│       ├── StatusBadge.jsx, Badge.jsx, Avatar.jsx
│       ├── StatCard.jsx, Pagination.jsx, TabGroup.jsx
│       ├── DropdownMenu.jsx, FilterButton.jsx
├── context/
│   ├── AuthContext.jsx                    # Auth state (localStorage)
│   └── AppContext.jsx                     # Global state (useReducer)
└── data/                                  # Mock data (9 files)
    ├── dashboardData.js, schedulingData.js
    ├── patientsData.js, cpoeData.js
    ├── billingData.js, referralData.js
    ├── reportsData.js, aiAgentsData.js
    └── settingsData.js
```

**Total:** 52 source files | 23 routes | 9 API endpoints

---

## What Changed from Vite Version

| Area | Vite (Before) | Next.js (After) |
|------|---------------|-----------------|
| Routing | React Router DOM v7 | File-based App Router |
| Navigation | `NavLink` + `isActive` | `Link` + `usePathname()` |
| Layout | `<Outlet />` | `{children}` in layout.jsx |
| Dynamic routes | `useParams()` from react-router | `useParams()` from next/navigation |
| CSS build | `@tailwindcss/vite` plugin | `@tailwindcss/postcss` |
| Fonts | Google Fonts CDN `<link>` | `next/font/google` (self-hosted) |
| Backend | None | 9 API route handlers |
| Auth guard | `<Navigate>` wrapper | Layout-level `useEffect` redirect |
| Redirects | `<Navigate to="/login">` | `router.replace('/login')` |

## What Did NOT Change

- Every Tailwind utility class — identical
- All custom CSS (.card, .btn-primary, .enterprise-table, etc.) — identical
- All 14 common components — identical JSX
- All mock data files — copied as-is
- All page layouts and content — pixel-perfect match
- Icons (lucide-react) — no changes
- Charts (recharts) — no changes
- Color theme (@theme block) — identical
- Animations (keyframes) — identical

---

## API Routes (Backend Ready)

All API routes currently return mock data. To add a real database:

1. Install Prisma or Drizzle: `npm install prisma @prisma/client`
2. Replace mock imports in `src/app/api/*/route.js` with DB queries
3. Frontend code doesn't change — it already uses the same data patterns

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/logout` | POST | End session |
| `/api/auth/me` | GET | Get current user |
| `/api/patients` | GET, POST | Patient CRUD |
| `/api/appointments` | GET, POST | Scheduling CRUD |
| `/api/prescriptions` | GET, POST | CPOE CRUD |
| `/api/billing` | GET, POST | Billing CRUD |
| `/api/referrals` | GET, POST | Referral CRUD |
| `/api/reports` | GET, POST | Reports CRUD |

---

## Next Steps (Post-Migration)

1. **Database** — Add Prisma/Drizzle + PostgreSQL/MySQL, replace mock data in API routes
2. **Real Auth** — NextAuth.js or custom JWT with httpOnly cookies + middleware.js
3. **Server Components** — Move data-only pages (Settings, static parts) to server components for performance
4. **Image Optimization** — Use `next/image` for any healthcare images/logos
5. **Middleware** — Add `middleware.js` for edge-level auth guards
6. **Environment Variables** — Add `.env.local` for `DATABASE_URL`, `AUTH_SECRET`, etc.
7. **Testing** — Add Jest + React Testing Library or Vitest
8. **Deployment** — Deploy to Vercel, Docker, or self-hosted with `next start`
