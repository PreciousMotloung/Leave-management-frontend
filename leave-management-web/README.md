# Leave Management Web

An Angular frontend for the Leave Management System that allows employees to apply for leave and managers to approve or reject requests. It connects to a Spring Boot backend REST API.

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 20.x |
| Angular Material | 20.x |
| TypeScript | 5.9.x (strict mode) |
| RxJS | 7.8.x |
| jwt-decode | 4.x |
| Node.js | 20+ |

## Run Locally

```bash
git clone <your-repo-url>
cd leave-management-web
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Connect to the Backend

Make sure the Spring Boot backend is running on `http://localhost:8080`.  
The API URL is configured in `src/environments/environment.ts`:

```ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};
```

## Pages

| Route | Who Sees It | What It Shows |
|---|---|---|
| `/login` | Everyone | Email + password login form |
| `/register` | Everyone | Account creation form with role selector |
| `/employee/dashboard` | Employees | Leave balance summary and quick actions |
| `/employee/my-leaves` | Employees | Table of all submitted leave requests |
| `/employee/apply-leave` | Employees | Form to submit a new leave request |
| `/manager/dashboard` | Managers | Team leave overview and stats |
| `/manager/pending-requests` | Managers | Table of leaves awaiting approval |
| `/manager/team-balances` | Managers | Remaining leave days per team member |
| `/unauthorized` | Everyone | Shown when role does not match route |
| `/404` | Everyone | Shown for unknown URLs |

## Run Tests

```bash
ng test --watch=false --browsers=ChromeHeadless
```
