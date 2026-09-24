# College Event Management System (MERN Stack)

A complete, full-stack **College Event Management System** built with MongoDB, Express.js, React.js, and Node.js (MERN Stack). It provides role-based access for **Students** and **Organizers**, JWT authentication, secure password hashing with bcryptjs, and a college-themed UI.

---

## 🌟 Key Features

1. **Role-Based Authentication (JWT & bcryptjs)**
   - Registration with automatic password hashing (salt rounds: 10).
   - Roles: `student` and `organizer`.
   - Never exposes plain-text passwords or hashed passwords in API responses.
   - Secure stateless authentication using JSON Web Tokens (`Authorization: Bearer <TOKEN>`).
   - Protected client and server routes.

2. **Landing Page (`/`)**
   - Modern college-themed hero section with live stats counter.
   - Comprehensive **About** section explaining the platform purpose for students & department organizers.
   - **6 Feature Cards**:
     1. Discover Events
     2. Register for Events
     3. Organize Events
     4. Manage Participants
     5. Event Notifications
     6. Track Participation
   - Interactive **Upcoming Events Preview** with category filters (Hackathon, Cultural, Technical, Workshop).
   - Responsive Footer with college contact info and social links.

3. **Sign Up Page (`/signup`)**
   - Registration form: Full Name, Email, Password, Confirm Password, Academic Department, and Role toggle (`Student` / `Organizer`).
   - Input validation: Email format, min 6 char password, matching confirm password, unique email verification.

4. **Login Page (`/login`)**
   - Email & Password with show/hide password toggle.
   - Loading indicator and user feedback error banners.
   - Quick Demo Fill buttons for quick testing.
   - Dynamic role-based redirection upon successful login:
     - `student` ➡️ `/student-dashboard`
     - `organizer` ➡️ `/organizer-dashboard`

5. **Student Dashboard (`/student-dashboard`)**
   - Welcome banner with student name, academic department, and student badge.
   - **3 Statistic Cards**:
     - *Upcoming Events*
     - *Registered Events*
     - *Completed Events*
   - Interactive events catalog with search, department filtering, and 1-click registration toggle.
   - Confirmed digital event pass preview.
   - Dedicated profile viewer.
   - Logout button that clears JWT and redirects to `/login`.

6. **Organizer Dashboard (`/organizer-dashboard`)**
   - Welcome banner with organizer name and department coordinator badge.
   - **3 Statistic Cards**:
     - *Total Events*
     - *Upcoming Events*
     - *Total Participants*
   - Event creation form to publish new events with dates, venue, capacity, and guidelines.
   - Event management table with real-time occupancy and deletion actions.
   - Registered participants roster with search & department filters.
   - Logout button.

7. **Route Protection (`ProtectedRoute.jsx`)**
   - Restricts dashboard access to authenticated users.
   - Prevents students from accessing `/organizer-dashboard`.
   - Prevents organizers from accessing `/student-dashboard`.
   - Unauthenticated access redirects immediately to `/login`.

---

## 📁 Project Directory Structure

```
college-event-management/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Dynamic navbar with role tabs & mobile menu
│   │   │   ├── Footer.jsx          # Comprehensive college footer
│   │   │   └── ProtectedRoute.jsx  # Role-based route guard
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing page with Hero, About, 6 Features, Events
│   │   │   ├── Login.jsx           # Login page with show/hide password & error handling
│   │   │   ├── Signup.jsx          # Registration with role selector & validation
│   │   │   ├── StudentDashboard.jsx    # Student dashboard with 3 cards & registrations
│   │   │   └── OrganizerDashboard.jsx  # Organizer dashboard with 3 cards & event publishing
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with Bearer token interceptor
│   │   │
│   │   ├── App.jsx                 # React Router Dom routing
│   │   ├── main.jsx                # React root render
│   │   └── index.css               # College-themed design system
│   │
│   ├── index.html                  # HTML entry point
│   └── package.json                # Frontend dependencies and dev scripts
│
├── server/
│   ├── config/
│   │   └── db.js                   # Mongoose MongoDB connection
│   │
│   ├── controllers/
│   │   └── authController.js       # Register, login, & me controller logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT header inspection & token verification
│   │
│   ├── models/
│   │   └── User.js                 # User Mongoose schema (email unique, password omitted)
│   │
│   ├── routes/
│   │   └── authRoutes.js           # /api/auth REST API routes
│   │
│   ├── .env                        # Environment variables (MongoDB URI & JWT Secret)
│   ├── .env.example                # Example environment file
│   ├── server.js                   # Express server entry point
│   └── package.json                # Backend dependencies and scripts
│
└── README.md
```

---

## ⚙️ Environment Variables & MongoDB Setup

### 1. Starting MongoDB
You have two options to connect to MongoDB:

#### Option A: MongoDB Atlas (Cloud Database - Configured)
Your MongoDB Atlas cluster connection is already pre-configured in `server/.env`:
```
MONGO_URI=mongodb+srv://kanagalarajesh88_db_user:VUWvKpM2MZYRTmXL@cluster0.vuesrzy.mongodb.net/college_event_management?retryWrites=true&w=majority&appName=Cluster0
```
> **Note**: In your MongoDB Atlas dashboard under **Network Access**, ensure your current IP address (or `0.0.0.0/0` for access from anywhere) is whitelisted.

#### Option B: Local MongoDB
If you prefer running MongoDB locally on your machine:
1. Start the MongoDB service via terminal or Windows Services:
   ```powershell
   net start MongoDB
   # Or run: mongod --dbpath <path_to_data_folder>
   ```
2. In `server/.env`, set:
   ```env
   MONGO_URI=mongodb://localhost:27017/college_event_management
   ```

### 2. Creating the `server/.env` File
Create a file named `.env` inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://kanagalarajesh88_db_user:VUWvKpM2MZYRTmXL@cluster0.vuesrzy.mongodb.net/college_event_management?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=college_event_mgmt_super_secret_jwt_key_2026
NODE_ENV=development
```

---

## 🚀 Installation & Running the Project

The application runs using two separate terminals.

### Terminal 1: Backend Server

```bash
# Navigate to the server directory
cd college-event-management/server

# Install backend dependencies
npm install

# Start the development server with nodemon
npm run dev
```

* Backend runs at: **`http://localhost:5000`**
* Console will output:
  ```
  College Event Management Server running on port 5000
  MongoDB Connected Successfully
  ```

---

### Terminal 2: Frontend Client

```bash
# Open a new terminal and navigate to client
cd college-event-management/client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

* Frontend runs at: **`http://localhost:5173`** (or `http://127.0.0.1:5173`)

---

## 🧪 Step-by-Step Testing Guide

Follow these steps to test all functionality:

### Step 1: Create an Account
1. Open your browser and go to `http://localhost:5173/`.
2. Click **"Sign Up"** in the top navigation bar or **"Get Started"** in the Hero section.
3. Select your role: Click **"Student"** (or **"Organizer"**).
4. Fill in:
   - **Full Name**: e.g., `Alex Rivera`
   - **Email**: `alex.rivera@college.edu`
   - **Department**: Choose `Computer Science & Engineering`
   - **Password**: `password123`
   - **Confirm Password**: `password123`
5. Click **"Create Account"**.
6. The backend verifies the unique email, hashes the password using bcryptjs, inserts the record into MongoDB, and returns HTTP 201. You will see a success notification and be guided to `/login`.

### Step 2: Login & Receive JWT
1. On `http://localhost:5173/login`, enter:
   - **Email**: `alex.rivera@college.edu`
   - **Password**: `password123`
2. Test the **Eye icon** to toggle password visibility.
3. Click **"Sign In"**.
4. The server validates the credentials and returns a signed JWT token containing `{ userId, email, role }`.
5. The frontend stores the token in `localStorage` under `token` and sets the `Authorization: Bearer <TOKEN>` header for subsequent requests.

### Step 3: Access Protected Student Dashboard
1. Because the role was `student`, the application immediately redirects you to:
   `http://localhost:5173/student-dashboard`.
2. You will see:
   - Header: **"Welcome, Alex Rivera"** with department and student badge.
   - The 3 Cards:
     - **Upcoming Events**
     - **Registered Events**
     - **Completed Events**
   - Click the **"Events"** tab to browse available events and click **"Register for Event"** to see live registration and instant toast feedback.

### Step 4: Logout
1. In the navigation bar or profile section, click the **"Logout"** button.
2. The frontend clears `token` and `user` from `localStorage` and resets the auth state.
3. You are redirected back to `http://localhost:5173/login`.

### Step 5: Test Route Protection (Try Accessing Without Login)
1. In your browser's address bar, manually type:
   `http://localhost:5173/student-dashboard` and press Enter.
2. `ProtectedRoute.jsx` intercepts the request, detects that there is no valid JWT token, and immediately denies access, redirecting you straight to `http://localhost:5173/login`.

### Step 6: Test Organizer Role
1. On the login page, you can click the quick **"Organizer Demo"** button (or sign in with `david.vance@college.edu` / `password123`).
2. Click **"Sign In"**.
3. You are redirected to `http://localhost:5173/organizer-dashboard`.
4. You will see:
   - Header: **"Welcome, Prof. David Vance"**.
   - The 3 Cards:
     - **Total Events**
     - **Upcoming Events**
     - **Total Participants**
   - Click **"Create Event"** to publish a new campus event with venue and capacity.
   - Click **"Participants"** to view registered student rosters with search filters.
5. If an organizer attempts to navigate to `/student-dashboard`, `ProtectedRoute.jsx` automatically redirects them back to their organizer dashboard.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (student or organizer) | No |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token | No |
| `GET` | `/api/auth/me` | Fetch profile of authenticated user | **Yes (Bearer JWT)** |
| `GET` | `/api/health` | Backend health check | No |

---

## 🔒 Security Best Practices Implemented

- **Password Hashing**: Passwords hashed with `bcryptjs` using 10 salt rounds before saving.
- **No Plain-Text Storage**: Passwords are never saved in clear text.
- **Omission from Responses**: Mongoose schema uses `toJSON` projection and `.select("-password")` so passwords are never transmitted in JSON responses.
- **JWT Protection**: Secure signed tokens verified with `process.env.JWT_SECRET`.
- **CORS Protection**: Configured for local client origins.
- **Input Validation**: Strict regex email validation, password length checks, and role enforcement.
