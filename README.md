# Leave Management Frontend

A professional Angular 17+ web application for managing employee leave requests. Employees can apply for leave, track their balances, and view request history. Managers can review, approve, and reject leave requests for their team.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17+ | Frontend framework |
| TypeScript | 5.x (strict mode) | Language |
| Angular Material | 17+ | UI component library |
| RxJS | 7.x | Reactive data handling |
| Angular Router | Built-in | Page navigation and guards |
| HttpClient + Interceptors | Built-in | API communication + JWT injection |
| jwt-decode | Latest | Decoding JWT tokens client-side |

---

## How to Run Locally

**Prerequisites:** Node.js 18+ and the [leave-management-service](https://github.com/PreciousMotloung/leave-management-service) backend running on port 8080.

```bash
# 1. Clone the repository
git clone https://github.com/PreciousMotloung/Leave-Management-Frontend.git
cd Leave-Management-Frontend/leave-management-web

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Open your browser at **http://localhost:4200**

---

## Connecting to the Backend

This frontend connects to the [leave-management-service](https://github.com/PreciousMotloung/leave-management-service) Spring Boot backend.

1. Clone and run the backend: follow the instructions in its README to start it on `http://localhost:8080`
2. The proxy is already configured in `proxy.conf.json` — no CORS issues during development
3. The API base URL is set in `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080'
   };
   ```

---

## Pages

| Route | Role | What It Shows |
|---|---|---|
| `/login` | Public | Email/password login form. Redirects to the correct dashboard based on role after login. |
| `/register` | Public | Registration form for new employees and managers. Fields: first name, last name, email, password, department, role. |
| `/employee/dashboard` | EMPLOYEE | Welcome header, leave balance cards (colour-coded), 5 most recent leave requests, quick Apply button. |
| `/employee/my-leaves` | EMPLOYEE | Full table of all leave requests with status chips. Cancel button available for PENDING requests. |
| `/employee/apply-leave` | EMPLOYEE | Leave request form with leave type dropdown, date pickers, auto-calculated days, remaining balance display, and reason textarea. |
| `/manager/dashboard` | MANAGER | Summary cards (pending count, approved/rejected this month), preview table of pending requests. |
| `/manager/pending-requests` | MANAGER | Full table of all pending requests. Approve button (opens confirm dialog) and Reject button (opens dialog requiring a reason). Approved/rejected rows disappear immediately from the table. |
| `/manager/team-balances` | MANAGER | User-ID lookup form to view any employee's leave balances. Results shown in a colour-coded table. |
| `/unauthorized` | Any | Shown when a user navigates to a route their role does not permit. Smart button redirects to their correct dashboard. |
| `/404` | Any | Shown for unknown URLs. |

---

## Screenshots

> _Add screenshots here after the app is running_

| Page | Screenshot |
|---|---|
| Login | _(placeholder)_ |
| Employee Dashboard | _(placeholder)_ |
| Apply for Leave | _(placeholder)_ |
| Manager Pending Requests | _(placeholder)_ |

---

## How to Run Tests

```bash
# Run all unit tests once (headless Chrome)
npx ng test --watch=false --browsers=ChromeHeadless

# Run tests in watch mode during development
npx ng test
```

---

## CI/CD

A GitHub Actions pipeline runs automatically on every push and pull request to `main`.

**Pipeline steps:**
1. Install Node.js 20
2. `npm ci` — clean install
3. `ng build --configuration production` — production build must pass
4. `ng test --watch=false --browsers=ChromeHeadless` — all unit tests must pass

See `.github/workflows/ci.yml` for the full configuration.

---

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # authGuard, roleGuard
│   ├── interceptors/    # jwtInterceptor
│   ├── models/          # TypeScript interfaces (User, LeaveRequest, LeaveBalance, etc.)
│   └── services/        # AuthService, LeaveService
├── features/
│   ├── auth/            # Login, Register
│   ├── employee/        # Dashboard, My Leaves, Apply Leave, Shell
│   └── manager/         # Dashboard, Pending Requests, Team Balances, Shell
└── shared/
    ├── components/      # ConfirmDialog, RejectDialog, StatusChip, LoadingSpinner, EmptyState
    └── material.module.ts
```

---

## Related Repository

- **Backend:** [leave-management-service](https://github.com/PreciousMotloung/leave-management-service) — Spring Boot REST API with JWT authentication
