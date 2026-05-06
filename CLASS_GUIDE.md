# CLASS_GUIDE.md — Every Class Documented

This document describes every component, service, guard, and interceptor in the Leave Management frontend.

---

## Core Services

### `AuthService` (`core/services/auth.service.ts`)

Handles all authentication logic. Stores the JWT in `sessionStorage`.

| Method | What It Does |
|---|---|
| `login(email, password)` | Sends `POST /api/auth/login`. On success, saves the returned JWT to `sessionStorage` using `tap()`. Returns an `Observable<AuthResponse>`. |
| `register(request)` | Sends `POST /api/auth/register` with the user's details. Returns `Observable<AuthResponse>`. Does not auto-login — the login page handles navigation after registration. |
| `logout()` | Removes the JWT from `sessionStorage` and navigates to `/login`. |
| `getCurrentUser()` | Reads the JWT from `sessionStorage`, decodes it using `jwt-decode`, and returns a `User` object with `id`, `email`, `firstName`, `lastName`, and `role`. Returns `null` if no token exists. |
| `isLoggedIn()` | Checks that a token exists and its `exp` (expiry) claim is in the future. Returns `true` or `false`. |
| `getRole()` | Calls `getCurrentUser()` and returns the user's `role` (`'EMPLOYEE'` or `'MANAGER'`). Returns `null` if not logged in. |
| `getToken()` | Returns the raw JWT string from `sessionStorage`, or `null`. Used by the JWT interceptor. |

---

### `LeaveService` (`core/services/leave.service.ts`)

All leave-related API calls. Never called directly from components — always injected.

| Method | Endpoint | Who Uses It |
|---|---|---|
| `getMyLeaveRequests()` | `GET /api/leave/my-requests` | Employee — My Leaves page, Dashboard |
| `getMyBalances()` | `GET /api/leave/balance` | Employee — Dashboard, Apply Leave |
| `getLeaveTypes()` | `GET /api/leave/types` | Employee — Apply Leave dropdown |
| `submitLeaveRequest(request)` | `POST /api/leave/submit` | Employee — Apply Leave form |
| `cancelLeaveRequest(id)` | `PUT /api/leave/{id}/cancel` | Employee — My Leaves cancel button |
| `getPendingRequests()` | `GET /api/leave/pending` | Manager — Dashboard, Pending Requests |
| `approveLeave(id)` | `PUT /api/leave/{id}/approve` | Manager — Pending Requests approve button |
| `rejectLeave(id, rejectionReason)` | `PUT /api/leave/{id}/reject` | Manager — Pending Requests reject button |
| `getUserLeaveBalances(userId)` | `GET /api/leave/balance/{userId}` | Manager — Team Balances lookup |

---

## Core Guards

### `authGuard` (`core/guards/auth.guard.ts`)

A functional guard (`CanActivateFn`) that protects all authenticated routes.

- **Calls:** `AuthService.isLoggedIn()`
- **If logged in:** Returns `true` — navigation proceeds.
- **If not logged in:** Returns a `UrlTree` redirecting to `/login`.

Applied to both `/employee/**` and `/manager/**` routes.

---

### `roleGuard` (`core/guards/role.guard.ts`)

A functional guard that checks whether the authenticated user has the correct role for the route they are trying to access.

- **Reads:** `route.data['role']` (set in the route definition as `data: { role: 'EMPLOYEE' }`)
- **Calls:** `AuthService.getRole()`
- **If roles match:** Returns `true` — navigation proceeds.
- **If user is EMPLOYEE visiting a MANAGER route:** Redirects to `/employee/dashboard`.
- **If user is MANAGER visiting an EMPLOYEE route:** Redirects to `/manager/dashboard`.
- **If no role:** Redirects to `/unauthorized`.

This guard always runs after `authGuard`, so by the time `roleGuard` runs, we know the user is already logged in.

---

## Core Interceptor

### `jwtInterceptor` (`core/interceptors/jwt.interceptor.ts`)

A functional HTTP interceptor (`HttpInterceptorFn`) that runs on every outgoing HTTP request.

**On every request:**
1. Reads the JWT from `AuthService.getToken()`.
2. If a token exists, clones the request and adds the header: `Authorization: Bearer <token>`.
3. Passes the (possibly modified) request to the next handler.

**On every response:**
- Uses `catchError` to intercept HTTP errors.
- If the error status is `401 (Unauthorized)` — typically meaning the token has expired — it calls `AuthService.logout()`, which clears the token and redirects to `/login`.
- Re-throws the error using `throwError()` so individual components/services can also handle it if needed.

---

## Feature Components

### Auth — `LoginComponent` (`features/auth/login/`)

Displays the login form.

- **Form fields:** Email (required, email format), Password (required)
- **On submit:** Calls `AuthService.login()`. Shows a spinner on the button while pending.
- **On success:** Reads the user's role and navigates to `/employee/dashboard` or `/manager/dashboard`.
- **On failure:** Displays the error message from the backend response.
- **Link:** "Don't have an account? Register" navigates to `/register`.

---

### Auth — `RegisterComponent` (`features/auth/register/`)

Displays the user registration form.

- **Form fields:** First name, Last name, Email, Password (min 8 chars), Department (optional), Role (EMPLOYEE or MANAGER dropdown)
- **On submit:** Calls `AuthService.register()`. Shows loading state on the button.
- **On success:** Navigates to `/login` with a success message.
- **On failure:** Shows the error message returned by the backend (e.g. "Email already exists").

---

### Employee — `EmployeeDashboardComponent` (`features/employee/dashboard/`)

The employee's home screen after login.

- **On load:** Calls `LeaveService.getMyBalances()` and `LeaveService.getMyLeaveRequests()` in parallel using `forkJoin`.
- **Displays:** One balance card per leave type (Annual, Sick, Family Responsibility) showing total, used, and remaining days. Remaining days are colour-coded: green (>5), amber (3–5), red (<3).
- **Displays:** The 5 most recent leave requests in a table with their status chips.
- **Handles:** Loading spinner while data loads, error message if either call fails.

---

### Employee — `MyLeavesComponent` (`features/employee/my-leaves/`)

Shows all the employee's leave requests in a full table.

- **Columns:** Leave Type, Start Date, End Date, Days, Status, Actions
- **Status:** Shown via `StatusChipComponent` (coloured chip — amber for PENDING, green for APPROVED, red for REJECTED, grey for CANCELLED).
- **Cancel button:** Only visible on PENDING requests. Opens `ConfirmDialogComponent` before calling `LeaveService.cancelLeaveRequest()`.
- **On cancel success:** Reloads the full list.
- **Handles:** Loading spinner and empty state.

---

### Employee — `ApplyLeaveComponent` (`features/employee/apply-leave/`)

Form for submitting a new leave request.

- **On load:** Fetches leave types and the employee's current balances in parallel.
- **Leave type dropdown:** Populated from `LeaveService.getLeaveTypes()`. Stores the `leaveTypeId` (number) as the form control value.
- **Balance display:** When a leave type is selected, shows the remaining balance. Colour-coded by `getBalanceClass()`.
- **Days calculation:** Automatically computed from start and end date selection.
- **Balance validation:** Submit button is disabled and a warning is shown if requested days exceed remaining balance.
- **On submit:** Calls `LeaveService.submitLeaveRequest()` with `{ leaveTypeId, startDate, endDate, reason }`. Navigates to `/employee/my-leaves` on success.

---

### Manager — `ManagerDashboardComponent` (`features/manager/dashboard/`)

The manager's home screen after login.

- **On load:** Calls `LeaveService.getPendingRequests()`.
- **Summary cards:** Shows count of pending requests, approved this month, and rejected this month (computed from the returned data).
- **Pending table:** Preview of pending requests with employee name, leave type, dates, days, and status.
- **Link:** "View All & Take Action" navigates to the full Pending Requests page.

---

### Manager — `PendingRequestsComponent` (`features/manager/pending-requests/`)

Full management page for approving and rejecting pending leave requests.

- **On load:** Calls `LeaveService.getPendingRequests()`.
- **Columns:** Employee Name, Leave Type, Start Date, End Date, Days, Reason (truncated to 50 chars with tooltip), Actions.
- **Approve button:** Opens `ConfirmDialogComponent`. On confirm, calls `LeaveService.approveLeave(id)`. The approved row is immediately removed from the table. Shows a snackbar confirmation.
- **Reject button:** Opens `RejectDialogComponent` which requires the manager to enter a rejection reason. On confirm, calls `LeaveService.rejectLeave(id, rejectionReason)`. The rejected row is removed from the table. Shows a snackbar confirmation.
- **Handles:** Loading spinner and empty state.

---

### Manager — `TeamBalancesComponent` (`features/manager/team-balances/`)

Allows a manager to look up any employee's leave balance by their user ID.

- **Search field:** Manager enters an employee user ID and clicks "Look Up Balances" (or presses Enter).
- **On search:** Calls `LeaveService.getUserLeaveBalances(userId)` → `GET /api/leave/balance/{userId}`.
- **Results table:** Shows Leave Type, Total Days, Used Days, and Remaining Days (colour-coded).
- **Error handling:** Shows "No user found with that ID" on 404. Shows a generic error message on other failures.

> **Note:** The backend does not expose a "list all users" endpoint. To view the full team, managers can look up employees by their known user IDs. A future enhancement would be to add a `GET /api/users` endpoint to the backend.

---

## Shared Components

### `ConfirmDialogComponent` (`shared/components/confirm-dialog/`)

A reusable confirmation modal dialog.

- **Inputs (via `MAT_DIALOG_DATA`):** `title`, `message`, `confirmText`, `cancelText`
- **Returns:** `true` when the confirm button is clicked, `false` when cancel is clicked.
- **Used by:** MyLeavesComponent (cancel leave), PendingRequestsComponent (approve leave).

---

### `RejectDialogComponent` (`shared/components/reject-dialog/`)

A reusable rejection dialog that requires the manager to provide a reason.

- **Inputs (via `MAT_DIALOG_DATA`):** `employeeName`, `leaveType`
- **Contains:** A required textarea for the rejection reason (max 500 characters). The confirm button is disabled until a reason is entered.
- **Returns:** The rejection reason string, or `undefined` if cancelled.
- **Used by:** PendingRequestsComponent (reject leave).

---

### `StatusChipComponent` (`shared/components/status-chip/`)

Displays a coloured Material chip for a leave request status.

- **Input:** `status` (type `LeaveStatus`: `'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'`)
- **CSS classes applied:** `chip-pending` (amber), `chip-approved` (green), `chip-rejected` (red), `chip-cancelled` (grey)

---

### `LoadingSpinnerComponent` (`shared/components/loading-spinner/`)

A full-page loading overlay shown while HTTP calls are pending.

- **No inputs.**
- **Displays:** A centred `mat-spinner` on a semi-transparent white overlay with `z-index: 9999`.
- **Usage:** Added to a component's template with `@if (isLoading) { <app-loading-spinner> }`.

---

### `EmptyStateComponent` (`shared/components/empty-state/`)

Displayed when a table or list has no data to show.

- **Inputs:** `message` (string), `icon` (Material icon name string)
- **Displays:** A centred icon and message in muted grey.
- **Usage:** Prevents blank white areas in tables — always shown when data length is 0.

---

## Shell Components

### `EmployeeShellComponent` (`features/employee/shell/`)

The persistent layout wrapper for all employee pages. Contains the sidebar navigation and `<router-outlet>` where child pages render.

- **Sidebar links:** Dashboard, My Leaves, Apply for Leave
- **Footer:** Logout button showing the employee's full name
- **Calls:** `AuthService.getCurrentUser()` to get the name to display

---

### `ManagerShellComponent` (`features/manager/shell/`)

The persistent layout wrapper for all manager pages. Contains the sidebar navigation and `<router-outlet>`.

- **Sidebar links:** Dashboard, Pending Requests (with badge showing count), Team Balances
- **Footer:** Logout button showing the manager's full name
- **On load:** Calls `LeaveService.getPendingRequests()` to populate the pending count badge on the sidebar

---

## Error / Utility Pages

### `UnauthorizedComponent` (`features/unauthorized/`)

Shown when a user navigates to a route their role does not permit.

- **"Go to My Dashboard" button:** Reads the user's role and navigates to the correct dashboard (`/employee/dashboard` or `/manager/dashboard`). Falls back to `/login` if no role is found.

---

### `NotFoundComponent` (`features/not-found/`)

Shown for any URL that does not match a known route (`**` wildcard in routing).

- **"Go to Login" link:** Returns the user to the login page.

